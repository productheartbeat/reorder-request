import useSWR from 'swr';
import Layout from "../components/layout"
import StepHeading from "../components/stepHeading"
import Dl from "../components/dl"
import DlItem from "../components/dlItem"
import Button from "../components/button"
import SvgIcon from "../components/icons"
import Router from 'next/router';
import { useContext } from 'react';
import OrderContext from '../components/OrderContext';

export default function OrderOverview() {

  const { orderInfo } = useContext(OrderContext);
  const { data, error } = useSWR(orderInfo, orderInfo)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const { StoreOrder } = data

  const goToProductOverview=()=>{
		Router.push({
		pathname: '/product-overview'
		});
	}

  return (
    <Layout>
      <StepHeading number="1" title="Order Overview" subtitle="Does this look like the right order to you?" />
      <div>
        {
          StoreOrder.map((order, index) => (
            <div key={"order_"+index}>
              <Dl>
                <DlItem 
                  label="Store" 
                  desc={order.Store.name} 
                />
                <DlItem 
                  label="Order Number" 
                  desc={order.idFromPlatform} 
                />
                <DlItem 
                  label="Order Date" 
                  desc={
                    new Date(order.createdOn).getMonth() + 1 
                    + "/" +
                    new Date(order.createdOn).getDate() 
                    + "/" +
                    new Date(order.createdOn).getFullYear()
                  } 
                />
                <DlItem 
                  label="Price" 
                  desc={
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(order.orderTotal)
                  } 
                />
                <DlItem 
                  label="Shipping Postal Code" 
                  desc={order.ShippingAddress.postalCode} 
                />
                <DlItem 
                  label="Items" 
                  desc={order.StoreOrderLineItems.length} 
                />
              </Dl>
            </div>
          ))}
      </div>
      <div className="mt-12 self-start">
        <div className="space-y-6">
          <Button label="Next" onClick={goToProductOverview}>
            <SvgIcon role="arrow-right" />
          </Button>
        </div>
      </div>
    </Layout>
  )
}
