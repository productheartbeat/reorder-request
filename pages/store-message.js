import useSWR from 'swr';
import Layout from "../components/layout";
import StepHeading from "../components/stepHeading";
import Router from 'next/router';
import Button from "../components/button";
import SvgIcon from "../components/icons";
import { useContext } from 'react';
import OrderContext from '../components/OrderContext';

export default function StoreMessage() {

  const { orderInfo, startOver } = useContext(OrderContext);
  const { data, error } = useSWR(orderInfo, orderInfo)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const { StoreOrder } = data

  const goToOrderOverview=()=>{
		Router.push({
		pathname: '/order-overview'
		});
	}

  const goToHelp=()=>{
		Router.push({
		pathname: '/help',
    query: { page: "help" }
		});
	}

  if ( data.StoreOrder.length < 1 ) {
  
    return (
      <Layout>
        <StepHeading title={"We couldn't find your order"} subtitle={"You entered order number "+localStorage.getItem('order_number')+". Please check to make sure you entered the right number."} />
        <Button onClick={startOver} label="Go Back" />
      </Layout>
    )

  } else if ( data.StoreOrder[0].ShippingProtectionClaims_aggregate.aggregate.count > 5 ) {

    return (
      <Layout>
        <StepHeading title={"Reorder Request Already Submitted"} subtitle={"A Reorder Request has already been submitted on order #"+localStorage.getItem('order_number')+". Please check your number to make sure you entered the right number. If you have any questions about this, please contact support."} />
        <div className="space-y-4">
          <Button onClick={startOver} label="Go Back" />
          <Button label="Contact Support" link onClick={goToHelp} />
        </div>
      </Layout>
    )
    
  } else {

    return (
      <div className="h-full">
        {
          StoreOrder.map((order, index) => (
            <div className="h-full" key={"order_"+index}>
              <Layout cardFooter="true" cardFooterContent={order.Store.name + " partners with Corso to provide Green Shipping Protection"}>
                <StepHeading title={"Hi " + order.Customer.firstName + "!"} subtitle={"We got your " + order.Store.name + " order: #" + order.idFromPlatform} />
                <div>
                  <div>
                    <p className="font-bold mb-2">A quick message from {order.Store.name}</p>
                    <p className="text-sm">[store message here]</p>
                  </div>
                  <div className="mt-12 self-start">
                    <div className="space-y-4">
                      <Button label="Get Started" onClick={goToOrderOverview}>
                        <SvgIcon role="arrow-right" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Layout>
            </div>
          ))
        } 
      </div>  
    )
  }
}
