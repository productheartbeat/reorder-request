import Layout from "../components/layout"
import StepHeading from "../components/stepHeading"
import List from "../components/list"
import Router from 'next/router';
import ListItem from "../components/listItem"
import Button from "../components/button"
import SvgIcon from "../components/icons"
import useSWR from 'swr';
import { useContext } from 'react';
import OrderContext from '../components/OrderContext';

export default function ProductOverview() {

  const { fetchedOrderData, startOver, orderQuery } = useContext(OrderContext);
  const { data: orderDataSwr, error: orderErrorSwr } = useSWR(orderQuery, fetchedOrderData)

  if (orderErrorSwr) return <div>Failed to load</div>
  if (!orderDataSwr) return <div>Loading...</div>

  const { StoreOrder } = orderDataSwr

  const goToReorderReason=()=>{
    localStorage.setItem('store_order_id', StoreOrder[0].storeOrderId);
    Router.push({
      pathname: '/reorder-reason'
    });
  }

  return (
    <div>
      {
        StoreOrder.map((order, index) => (
          <div key={"order_"+index}>
            <StepHeading number="2" title="Product Review" subtitle={"Here are the products we have associated to order #" + order.idFromPlatform } />
            <List>
              {StoreOrder[index].StoreOrderLineItems.map((product, index) => (
                <div key={"product_"+index}>
                  <ListItem 
                    title={product.name} 
                    subtitle={product.sku}
                    desc={"Qty. "+product.quantity}
                    end={
                      new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(product.price)
                    } 
                  />
                </div>
              ))}
            </List>
            <div className="mt-12 self-start">
              <div className="space-y-4">
                <Button label="Next" onClick={goToReorderReason}>
                  <SvgIcon role="arrow-right" />
                </Button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
