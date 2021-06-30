import React, { useContext } from "react";
import { withRouter } from 'next/router'
import StepHeading from "./stepHeading"
import Button from "./button"
import SvgIcon from "./icons"
import useSWR from 'swr';
import OrderContext from '../components/OrderContext';
import { gql } from 'graphql-request'
import { CorsoGraphQLClient } from '../queries/graphqlClient';

const STOLEN_PRODUCTS_QUERY = gql`
  query STOLEN_PRODUCTS_QUERY($idFromPlatform_like: String = "0") {
    Order: StoreOrder(where: {idFromPlatform: {_like: $idFromPlatform_like}}) {
      StolenProducts: StoreOrderLineItems(where: {vendor: {_nilike: "Corso, LLC"}}) {
        storeOrderLineItemId
      }
    }
  }
`;

const CUSTOMER_CLAIMS_QUERY = gql`
  query CUSTOMER_CLAIMS_QUERY($customerId_eq: Int = 0) {
    CustomerClaims: ShippingProtectionClaim_aggregate(where: {OriginalStoreOrder: {Customer: {customerId: {_eq: $customerId_eq}}}}) {
      aggregate {
        count
      }
    }
  }
`;

const ReorderDetailsStolen = (props) => {

  const StolenProductsFetcher = async () => {

    // Get data from local storage
    const orderNumber = localStorage.getItem("order_number");

    const STOLEN_PRODUCTS_VARIABLES = {
      "idFromPlatform_like": orderNumber
    }

    return await CorsoGraphQLClient.request(STOLEN_PRODUCTS_QUERY, STOLEN_PRODUCTS_VARIABLES)

  }

  const CustomerClaimsFetcher = async () => {

    // Get data from local storage
    const customerId = localStorage.getItem("customer_id");

    const CUSTOMER_CLAIMS_VARIABLES = {
      "customerId_eq": customerId
    }

    return await CorsoGraphQLClient.request(CUSTOMER_CLAIMS_QUERY, CUSTOMER_CLAIMS_VARIABLES)

  }

	const { fetchedOrderData, startOver, orderQuery } = useContext(OrderContext);
  const { data: orderDataSwr, error: orderErrorSwr } = useSWR(orderQuery, fetchedOrderData)

  const { data: stolenProductsDataSwr, error: stolenProductsErrorSwr } = useSWR(STOLEN_PRODUCTS_QUERY, StolenProductsFetcher);
  const { data: totalCustomerClaimsDataSwr, error: totalCustomerClaimsErrorSwr } = useSWR(CUSTOMER_CLAIMS_QUERY, CustomerClaimsFetcher);
  
  
  if (stolenProductsErrorSwr || orderErrorSwr || totalCustomerClaimsErrorSwr) return <div>Failed to load</div>
  if (!stolenProductsDataSwr || !orderDataSwr || !totalCustomerClaimsDataSwr) return <div>Loading...</div>

  const { CustomerClaims } = totalCustomerClaimsDataSwr;

  const stolenProductsLineItems = stolenProductsDataSwr.Order[0].StolenProducts;

  const times = CustomerClaims.aggregate.count;

  if (stolenProductsDataSwr) {

    const buildObject = stolenProductsLineItems => {
      const obj = {};
      for(let i = 0; i < stolenProductsLineItems.length; i++){
         const { storeOrderLineItemId, score } = stolenProductsLineItems[i];
         obj[storeOrderLineItemId] = score;
      };
      return Object.keys(obj);
    };

    localStorage.setItem("reorder_ids", JSON.stringify(buildObject(stolenProductsLineItems)));

    return (
      <>
        <div>
          <StepHeading number="4" title="Stolen Package" subtitle="Almost there. One last step." />
          {times < 2
          ?
            <div>
              <p className="mb-8">Porch pirates are the worst. Since we have your tracking information here, let's review it real quick just to make sure your package actually got delivered.</p>
              <div>
                <Button type="button" label="View Tracking Info" outline path="">
                  <SvgIcon role="truck" />
                </Button>
              </div>
            </div>
          :
            <div>
              <p className="mb-8">Porch pirates are the worst. We want to make things right and we don't want to make you jump through more hoops, but we need a copy of a police report to file another reorder request.</p>
              <p className="mb-8">If you don't have that yet, you can check back and upload it here.</p>
              <div className="relative">
                <Button type="button" label="Police Report" outline path="">
                  <SvgIcon role="file" />
                </Button>
                <input className="cursor-pointer absolute block opacity-0 top-0 w-full h-full" type="file" name="theftPoliceReport" />
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

export default withRouter(ReorderDetailsStolen);
