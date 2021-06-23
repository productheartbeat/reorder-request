import React, {useState, useContext, useEffect} from "react";
import Layout from "../components/layout"
import StepHeading from "../components/stepHeading"
import Button from "../components/button"
import { withRouter } from 'next/router'
import useSWR from 'swr';
import OrderContext from '../components/OrderContext';
import insertClaim from "../queries/insertClaim";

const Confirmation = (props) => {

  const { orderInfo, startOver } = useContext(OrderContext);
  const { data, error } = useSWR(orderInfo, orderInfo)
  const [sentData, setSentData] = useState(null);

  const serviceProfileUrl = "https://images.unsplash.com/profile-1489175036767-c3b81d0e32d7?dpr=1&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff";
  
  const serviceName = "Melissa";

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const { StoreOrder } = data

  const lsReason = localStorage.getItem("claim_reason");
  const lsType = localStorage.getItem("claim_type");
  const lsOrderNumber = localStorage.getItem("order_number");
  const lsClaimMessage = localStorage.getItem("claim_message");
  const lsStoreOrderId = localStorage.getItem("store_order_id");
  const lsReorderSkusJson = JSON.parse(localStorage.getItem("reorder_ids"))

  const thisOrderClaimsCount = StoreOrder[0].ShippingProtectionClaims_aggregate.aggregate.count;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://corso-dev.thewarrickfamily.com/v1/graphql/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "ZwRp8xr6gs",
        },
        body: JSON.stringify({
          query: insertClaim,
          variables: {
            "originalStoreOrderId": lsStoreOrderId,
            "claimReason": lsReason,
            "noteFromPassenger": lsClaimMessage
          },
        }),
      })
      const sentData = await response.json();
      setSentData(sentData);
    };
    console.log("claims count", thisOrderClaimsCount)
    if (thisOrderClaimsCount < 1) { 
      fetchData();
    }
  }, [lsOrderNumber]);

  if (sentData) {

    const returnedClaimsData = [sentData.data.insertClaim];

    console.log("Returned Claim Data: ", returnedClaimsData);

    return (
      <Layout>
        {
          returnedClaimsData.map((claim,index) => (
            <div key={index}>
              <StepHeading number="6" title="Request Received Perfectly" subtitle={"I got your info. Here is your claim#: "+claim.shippingProtectionClaimId} />
              <div>
                <div className="space-y-4 text-sm">
                  <p>Here's what happens next. I just sent you an email to {claim.OriginalStoreOrder.customerEmail} with this confirmation.</p>
                  <p>We have a quick turnaround on requests, so you should from me within 24 hours. We know shipping issues are frustrating, so I'm on this. I'll be in touch.</p>
                  <div className="flex items-center flex-row pt-4">
                    <div className="mr-4" style={{width: "80px"}}>
                      <img className="rounded-full" src={serviceProfileUrl} />
                    </div>
                    <div className="w-full text-sm">
                      <p>{serviceName}</p>
                      <p>Your Corso Concierge</p>
                    </div>
                  </div>
                </div>
                <div className="mt-16 space-y-6 self-start">
                  <a target="_blank" href={"https://"+claim.OriginalStoreOrder.Store.url} className="bg-green-600 border text-white hover:bg-green-700 hover:text-white rounded-md px-4 py-2 w-full justify-center flex tems-center disabled:opacity-50 relative">
                    {claim.OriginalStoreOrder.Store.name+" Website"}
                  </a>
                </div>
              </div>
            </div>
          ))
        }
      </Layout>
    )
  } else {
    return (
      <Layout>
        <StepHeading title="Not sure what happened there" subtitle="I encountered an error while submitting your claim. Could you please try again?" />
        <Button label="Start Over" onClick={startOver} />
      </Layout>
      
    );
  }
}

export default withRouter(Confirmation);
