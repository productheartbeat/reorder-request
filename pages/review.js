import React, {useState, useContext} from "react";
import Layout from "../components/layout"
import StepHeading from "../components/stepHeading"
import Button from "../components/button"
import Router from 'next/router';
import { withRouter } from 'next/router'
import useSWR from 'swr';
import OrderContext from '../components/OrderContext';

const Review = (props) => {

  /*const getSkuData = (query) =>
      
    fetch(
      "https://corso-dev.thewarrickfamily.com/v1/graphql/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "ZwRp8xr6gs",
        },
        body: JSON.stringify({
          query: `
              query GET_SKU_DATA($sku_in: [String!] = [""], $idFromPlatform_eq: String = "") {
                StoreOrder(where: {idFromPlatform: {_eq: $idFromPlatform_eq}}) {
                  StoreOrderLineItems_aggregate(where: {sku: {_in: $sku_in}}) {
                    aggregate {
                      sum {
                        price
                      }
                    }
                  }
                  StoreOrderLineItems(where: {vendor: {_nlike: "Corso, LLC"}}) {
                    name
                    sku
                    price
                  }
                }
              }
            `,
          variables: {
            "idFromPlatform_like": lsOrderNumber,
            "sku_in": ["BS-CARD-999"]
          },
        }),
      }
    )
    .then((res) => res.json())
    .then((json) => json.data)

  const { skuData, skuError } = useSWR(getSkuData, getSkuData)
  const { Sku } = skuData  

  console.log(Sku);*/

  const serviceProfileUrl = "https://images.unsplash.com/profile-1489175036767-c3b81d0e32d7?dpr=1&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff";
  
  const serviceName = "Melissa";

  const { orderInfo } = useContext(OrderContext);
  const { data, error } = useSWR(orderInfo, orderInfo)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const { StoreOrder } = data  

  const lsReason = localStorage.getItem("claim_reason");
  const lsType = localStorage.getItem("claim_type");
  const lsOrderNumber = localStorage.getItem("order_number");
  const lsClaimMessage = localStorage.getItem("claim_message");
  const lsStoreOrderId = localStorage.getItem("store_order_id");

  const lsReorderSkusJson = JSON.parse(localStorage.getItem("reorder_ids"))

  console.log("==========================")
  console.log("Data to be sent to Corso DB")
  console.log("==========================")
  console.log("Claim Reason: ", lsReason)
  console.log("Claim Type: ", lsType)
  console.log("OrderNumber: ", lsOrderNumber)
  console.log("Claim Message: ", lsClaimMessage)
  console.log("Claim Skus: ", lsReorderSkusJson)
  console.log("Store Order ID: ", lsStoreOrderId)
  console.log("==========================")

  const goToOptions=()=>{
    Router.push({
      pathname: '/options',
      query: {reason: props.router.query.reason, type: props.router.query.type}
    });
  }

  return (
    <Layout>
      <StepHeading number="5" title="Reorder Request Review" subtitle="Meet your Corso concierge" />
      {
        StoreOrder.map((order, index) => (
          <div key={index}>
            <div className="flex items-center flex-col">
              <div className="mb-4" style={{width: "80px"}}>
                <img className="rounded-full" src={serviceProfileUrl} />
              </div>
              <div className="w-full space-y-4 text-sm">
                <p>Hi, I'm {serviceName}. Thanks for getting this started. I'll be helping you from here on out, and I want to make sure we got this right.</p>
                <p>Looks like you placed an order on {new Date(order.createdOn).getMonth() + 1 + "/" + new Date(order.createdOn).getDate() + "/" + new Date(order.createdOn).getFullYear()}, but your package for order #{lsOrderNumber} was {lsReason}.</p>
                {lsClaimMessage != ""
                ?
                  <div>
                    <p>I also got this message from you:</p>
                    <p className="italic ml-8 mt-4">"{lsClaimMessage}"</p>
                  </div>
                :
                  ""
                }
                {lsReason == "damaged"
                ?
                  <div>
                    <p>I will be {lsType == "reorder" ? "reordering" : "refunding" } the following sku(s) for you:</p>
                    <ul className="list list-inside ml-8">
                      {
                        lsReorderSkusJson.map((sku, index) => (
                          <li className="list-item list-disc" key={index}>
                            {sku}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                :
                  ""
                }
                <p>Please confirm that you would you like me to {lsType == "reorder" ? "reorder your products to the same shipping address at zip code " + order.ShippingAddress.postalCode + "?" : "refund the amount you paid for the shipped products?"}</p>
              </div>
            </div>
            <div className="mt-16 space-y-6 self-start">
              <Button label="Yes, Please Submit" path="/confirmation" />
              <Button label="View Options" link onClick={goToOptions} />
            </div>
          </div>
        ))
      }
    </Layout>
  )
}

export default withRouter(Review);
