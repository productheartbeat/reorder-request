import React from "react";
import { withRouter } from 'next/router'
import Layout from "./layout"
import StepHeading from "./stepHeading"
import Button from "./button"
import SvgIcon from "./icons"
import useSWR from 'swr';
import { useContext, useEffect, useState } from 'react';
import OrderContext from '../components/OrderContext';
import variantIdsQuery from "../queries/variantIds";

const VARIANT_QUERY = `
  query VARIANT_QUERY($idFromPlatform_like: String = "0") {
    Order: StoreOrder(where: {idFromPlatform: {_like: $idFromPlatform_like}}) {
      Variants: StoreOrderLineItems(where: {vendor: {_nilike: "Corso, LLC"}}) {
        variantId
      }
    }
  }
`;

const FetchVariants = async () => {

  const orderNumber = localStorage.getItem("order_number");

  const GRAPHQL_ENDPOINT = 'https://corso-dev.thewarrickfamily.com/v1/graphql/';

  const headers = {
    'Content-Type': 'application/json',
    "x-hasura-admin-secret": "ZwRp8xr6gs"
  };

  const options = {
    headers : headers,
    method: 'POST',
    body: JSON.stringify(
      {
        query: VARIANT_QUERY,
        variables: {
          "idFromPlatform_like": orderNumber
        }
      }
    )
  };
  const res = await fetch(GRAPHQL_ENDPOINT, options)
  const res_json = await res.json();
  if(res_json.errors) {
  	throw(JSON.stringify(res_json.errors));
  }
  return res_json.data;
}

const ReorderDetailsLost = () => {

  const { orderInfo } = useContext(OrderContext);
  const { data: variantData, error: variantError } = useSWR(VARIANT_QUERY, FetchVariants);
  const { data: orderData, error: orderError } = useSWR(orderInfo, orderInfo);
  
  if (variantError || orderError) return <div>Failed to load</div>
  if (!variantData || !orderData ) return <div>Loading...</div>

  const { StoreOrder } = orderData;
  const { Order } = variantData;

  const variantLineItems = Order[0].Variants;

	const daysSinceOrder = Math.ceil(((new Date().getTime()) - (new Date(StoreOrder[0].createdOn).getTime()))/1000/60/60/24);

  if (variantData) {

    const buildObject = variantLineItems => {
      const obj = {};
      for(let i = 0; i < variantLineItems.length; i++){
         const { variantId, score } = variantLineItems[i];
         obj[variantId] = score;
      };
      return Object.keys(obj);
   };

   localStorage.setItem("reorder_ids", JSON.stringify(buildObject(variantLineItems)));

    return (
      <>
        <div>
          <StepHeading number="4" title="Lost Package" subtitle="Almost there. One last step." />
          { daysSinceOrder < 5
            ?
            <div>
              <p className="mb-8">It's been {daysSinceOrder} days since you ordered your package. Sometimes shipping goes slower than expected. We like to wait at least 5 days before it is considered lost. You can view your tracking information below.</p>
              <p className="mb-8">If you still haven't recieved your package after 5 days, please check back.</p>
              <Button type="button" label="View Tracking Info" outline path="">
                <SvgIcon role="truck" />
              </Button>
            </div>
            :
            <div>
              <p className="mb-8">Millions of packages get delivered each day. It's rare, but sometimes they get lost. Since we have your tracking information here, let's review it real quick just to make sure your package absolutely, 100%, for sure isn't going to make it.</p>
              <div>
                <div>
                  <Button type="button" label="View Tracking Info" outline path="">
                    <SvgIcon role="truck" />
                  </Button>
                </div>
              </div>
            </div>
          }
        </div>
      </>
    )
  } else {
    return null;
  } 
}

export default withRouter(ReorderDetailsLost);
