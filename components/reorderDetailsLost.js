import React from "react";
import { withRouter } from 'next/router'
import StepHeading from "./stepHeading"
import Button from "./button"
import SvgIcon from "./icons"
import useSWR from 'swr';
import { useContext, useEffect, useState } from 'react';
import OrderContext from '../components/OrderContext';
import { gql } from 'graphql-request'
import { CorsoGraphQLClient } from '../queries/graphqlClient';

const LOST_PRODUCTS_QUERY = gql`
  query LOST_PRODUCTS_QUERY($idFromPlatform_like: String = "0") {
    Order: StoreOrder(where: {idFromPlatform: {_like: $idFromPlatform_like}}) {
      LostProducts: StoreOrderLineItems(where: {vendor: {_nilike: "Corso, LLC"}}) {
        storeOrderLineItemId
      }
    }
  }
`;

const ReorderDetailsLost = () => {

  const LostProductsFetcher = async () => {

    // Get data from local storage
    const orderNumber = localStorage.getItem("order_number");

    const LOST_PRODUCTS_VARIABLES = {
      "idFromPlatform_like": orderNumber
    }

    return CorsoGraphQLClient.request(LOST_PRODUCTS_QUERY, LOST_PRODUCTS_VARIABLES)

  }

  const { fetchedOrderData, startOver, orderQuery } = useContext(OrderContext);
  const { data: orderDataSwr, error: orderErrorSwr } = useSWR(orderQuery, fetchedOrderData)
  const { data: lostProductsDataSwr, error: lostProductsErrorSwr } = useSWR(LOST_PRODUCTS_QUERY, LostProductsFetcher);
  
  if (lostProductsErrorSwr || orderErrorSwr) return <div>Failed to load</div>
  if (!lostProductsDataSwr || !orderDataSwr ) return <div>Loading...</div>

  const { StoreOrder } = orderDataSwr;
  const { LostProducts } = lostProductsDataSwr;

  const lostProductsLineItems = lostProductsDataSwr.Order[0].LostProducts;

	const daysSinceOrder = Math.ceil(((new Date().getTime()) - (new Date(StoreOrder[0].createdOn).getTime()))/1000/60/60/24);

  if (lostProductsDataSwr) {

    const buildObject = lostProductsLineItems => {
      const obj = {};
      for(let i = 0; i < lostProductsLineItems.length; i++){
         const { storeOrderLineItemId, score } = lostProductsLineItems[i];
         obj[storeOrderLineItemId] = score;
      };
      return Object.keys(obj);
   };

   localStorage.setItem("reorder_ids", JSON.stringify(buildObject(lostProductsLineItems)));

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
