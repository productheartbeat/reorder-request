import useSWR from 'swr';
import StepHeading from "../components/stepHeading";
import Router from 'next/router';
import Button from "../components/button";
import SvgIcon from "../components/icons";
import { useContext } from 'react';
import OrderContext from '../components/OrderContext';

export default function StoreMessage() {

  const { fetchedOrderData, startOver, orderQuery } = useContext(OrderContext);
  const { data: orderDataSwr, error: orderErrorSwr } = useSWR(orderQuery, fetchedOrderData)

  if (orderErrorSwr) return <div>Failed to load</div>
  if (!orderDataSwr) return <div>Loading...</div>

  const { StoreOrder } = orderDataSwr;

  const goToOrderOverview=()=>{
    localStorage.setItem("customer_id", StoreOrder[0].Customer.customerId);
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

  if ( StoreOrder.length < 1 ) {
  
    return (
      <div>
        <StepHeading title={"We couldn't find your order"} subtitle={"You entered order number "+localStorage.getItem('order_number')+". Please check to make sure you entered the right number."} />
        <Button onClick={startOver} label="Go Back" />
      </div>
    )

  } else if ( StoreOrder[0].ShippingProtectionClaims_aggregate.aggregate.count > 0 ) {

    return (
      <div>
        <StepHeading title={"Reorder Request Already Submitted"} subtitle={"A Reorder Request has already been submitted on order #"+localStorage.getItem('order_number')+". Please check your Order ID to make sure you entered the right number. If you have any questions about this, please contact support."} />
        <div className="space-y-4">
          <Button onClick={startOver} label="Go Back" />
          <Button label="Contact Support" link onClick={goToHelp} />
        </div>
      </div>
    )
    
  } else if ( StoreOrder[0].canceledOn != null ) {

    return (
      <div>
        <StepHeading title={"Order has been canceled"} subtitle={"This order has been canceled and no longer has shipping protection: #"+localStorage.getItem('order_number')+". Please check your order ID to make sure you entered the right number. If you have any questions about this, please contact support."} />
        <div className="space-y-4">
          <Button onClick={startOver} label="Go Back" />
          <Button label="Contact Support" link onClick={goToHelp} />
        </div>
      </div>
    )
    
  } else {

    return (
      <div className="h-full">
        {
          StoreOrder.map((order, index) => (
            <div className="h-full" key={"order_"+index}>
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
            </div>
          ))
        } 
      </div>  
    )
  }
}
