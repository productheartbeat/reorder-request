import React, {useState, useContext, useEffect} from "react";
import insertClaim from "../queries/insertClaim";
import useSWR from 'swr';
import OrderContext from '../components/OrderContext';

const InsertClaimData = (props) => {

  const { orderInfo } = useContext(OrderContext);
  const { data, error } = useSWR(orderInfo, orderInfo)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const { StoreOrder } = data
  const thisOrderClaimsCount = StoreOrder[0].ShippingProtectionClaims_aggregate.aggregate.count;

  const lsReason = localStorage.getItem("claim_reason");
  const lsType = localStorage.getItem("claim_type");
  const lsOrderNumber = localStorage.getItem("order_number");
  const lsClaimMessage = localStorage.getItem("claim_message");
  const lsStoreOrderId = localStorage.getItem("store_order_id");
  const lsReorderSkusJson = JSON.parse(localStorage.getItem("reorder_ids"))

  console.log("claims count: ", thisOrderClaimsCount);

  if (thisOrderClaimsCount < 1) {

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
      fetchData();
    }, [lsOrderNumber]);

    console.log(sentData);

  }
}

export default InsertClaimData;