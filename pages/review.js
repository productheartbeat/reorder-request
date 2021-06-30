import React, {useState, useContext} from "react";
import StepHeading from "../components/stepHeading"
import Button from "../components/button"
import Router from 'next/router';
import { withRouter } from 'next/router'
import List from "../components/list"
import ListItem from "../components/listItem"
import Dl from "../components/dl"
import DlItem from "../components/dlItem"
import useSWR from 'swr';
import { gql } from 'graphql-request'
import { CorsoGraphQLClient } from '../queries/graphqlClient';
import OrderContext from '../components/OrderContext';

const GET_SELECTED_PRODUCTS_QUERY = gql`
  query GET_VARIANT_DATA($storeOrderLineItemId_in: [Int!], $idFromPlatform_eq: String = "") {
    SelectedProduct: StoreOrderLineItem(where: {storeOrderLineItemId: {_in: $storeOrderLineItemId_in}, storeOrder: {idFromPlatform: {_eq: $idFromPlatform_eq}}}) {
      name
      price
      quantity
      sku
      storeOrderLineItem: storeOrderLineItemId
    }
    StoreOrderLineItem_aggregate(where: {storeOrderLineItemId: {_in: $storeOrderLineItemId_in}, storeOrder: {idFromPlatform: {_eq: $idFromPlatform_eq}}}) {
      aggregate {
        count
        sum {
          price
        }
      }
    }
  }
`

const INSERT_CLAIM_QUERY = gql`
  mutation MyMutation(
    $noteFromCustomer: String!, 
    $claimReason: String!, 
    $shipProtectClaimLineItem_insert_input: [ShippingProtectionClaimLineItem_insert_input!] = {quantity: 10, storeOrderLineItem: 10}, $originalStoreOrderId: Int!) {
      insertClaim: insert_ShippingProtectionClaim_one(
        object: {claimReason: $claimReason, noteFromCustomer: $noteFromCustomer, OriginalStoreOrderLineItems: {data: $shipProtectClaimLineItem_insert_input}, originalStoreOrderId: $originalStoreOrderId}
      ) {
        claimReason
        noteFromCustomer
        reorderStoreOrderId
        statusChangedOn
        shippingProtectionClaimId
        OriginalStoreOrder {
          Customer {
            email
          }
          Store {
            url
            name
          }
        }
      }
   }
`

const THIS_ORDER_CLAIMS_COUNT_QUERY = gql`
  query MyQuery($idFromPlatform_eq: String = "") {
    Claim: StoreOrder(where: {idFromPlatform: {_eq: $idFromPlatform_eq}}) {
      ShippingProtectionClaims_aggregate {
        aggregate {
          count
        }
      }
      ShippingProtectionClaims {
        shippingProtectionClaimId
      }
    }
  }
`

const Review = (props) => {

  const [ claimsData, setClaimsData] = useState('');
  const [ selectedProductsData, setSelectedProductsData] = useState('');

  const { fetchedOrderData, startOver, orderQuery } = useContext(OrderContext);
  const { data: orderDataSwr, error: orderErrorSwr } = useSWR(orderQuery, fetchedOrderData)

  
  
  
  /* FIND OUT IF THERE IS ALREADY A CLAIM ON THIS ORDER BEFORE ALLOWING USER TO SUBMIT ANOTHER CLAIM */

  const ThisOrderClaimsCountFetcher = async () => {

    // Get data from local storage
    const orderNumber = localStorage.getItem("order_number");


    const THIS_ORDER_CLAIMS_COUNT_VARIABLES = {
      "idFromPlatform_eq": orderNumber
    }

    return CorsoGraphQLClient.request(THIS_ORDER_CLAIMS_COUNT_QUERY, THIS_ORDER_CLAIMS_COUNT_VARIABLES)

  }

  const { data: thisOrderClaimsCountDataSwr, error: thisOrderClaimsCountErrorSwr } = useSWR(THIS_ORDER_CLAIMS_COUNT_QUERY, ThisOrderClaimsCountFetcher); 
  
  
  /* GET THE PRODUCTS ASSOCIATED TO THE STORE LINE ITEM IDS FOR THIS ORDER */

  const selectedReorderProductsFetcher = async () => {

    // Get data from local storage
    const selectedReorderIds = JSON.parse(localStorage.getItem("reorder_ids"));
    const orderNumber = localStorage.getItem("order_number");

    const GET_SELECTED_PRODUCTS_VARIABLES = {
      "storeOrderLineItemId_in": selectedReorderIds,
      "idFromPlatform_eq": orderNumber
    }

    return CorsoGraphQLClient.request(GET_SELECTED_PRODUCTS_QUERY, GET_SELECTED_PRODUCTS_VARIABLES)

  }

  const { data: selectedReorderProductsDataSwr, error: selectedReorderProductsErrorSwr } = useSWR(GET_SELECTED_PRODUCTS_QUERY, selectedReorderProductsFetcher)

  
  /* INSERT THE NEW CLAIM */

  const insertClaimFetcher = async () => {

    const lsStoreOrderId = localStorage.getItem("store_order_id");
    const lsClaimMessage = localStorage.getItem("claim_message");
    const lsClaimReason = localStorage.getItem("claim_reason");

    const lsSelectedProducts = JSON.parse(localStorage.getItem("selected_products"));

    const lsSelectedProductsReduced = lsSelectedProducts.map(({name, price, sku, ...keepAttrs}) => keepAttrs)

    const INSERT_CLAIM_QUERY_VARIABLES = {
      "noteFromCustomer": lsClaimMessage,
      "claimReason": lsClaimReason,
      "shipProtectClaimLineItem_insert_input": lsSelectedProductsReduced,
      "originalStoreOrderId": lsStoreOrderId
    }

    const insertClaimData = await CorsoGraphQLClient.request(INSERT_CLAIM_QUERY, INSERT_CLAIM_QUERY_VARIABLES)
    const claimId = insertClaimData.insertClaim.shippingProtectionClaimId;
    
    localStorage.setItem("claim_id", claimId);

    Router.push({
      pathname: '/confirmation',
      query: {reason: props.router.query.reason, type: props.router.query.type, claimId: claimId}
    });
  }

  if (orderErrorSwr || selectedReorderProductsErrorSwr || thisOrderClaimsCountErrorSwr ) return <div>Failed to load</div>
  if (!orderDataSwr || !selectedReorderProductsDataSwr || !thisOrderClaimsCountDataSwr ) return <div>Loading...</div>
  
  const { StoreOrder } = orderDataSwr

  const ThisOrderClaims = [thisOrderClaimsCountDataSwr.Claim[0].ShippingProtectionClaims[0]];

  localStorage.setItem("selected_products", JSON.stringify(selectedReorderProductsDataSwr.SelectedProduct));

  const lsSelectedProducts = JSON.parse(localStorage.getItem("selected_products"));

  const lsSelectedProductsReduced = lsSelectedProducts.map(({name, price, sku, ...keepAttrs}) => keepAttrs)

  const goToOptions=()=>{
    Router.push({
      pathname: '/options',
      query: {reason: props.router.query.reason, type: props.router.query.type}
    });
  }

  const goToConfirmation=()=>{
    insertClaimFetcher();
  }

  const lsClaimMessage = localStorage.getItem("claim_message");
  const lsOrderNumber = localStorage.getItem("order_number");
  const lsClaimReason = localStorage.getItem("claim_reason");
  const lsType = localStorage.getItem("claim_type");

  const serviceProfileUrl = "https://images.unsplash.com/profile-1489175036767-c3b81d0e32d7?dpr=1&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff";
  
  const serviceName = "Melissa";

  if (thisOrderClaimsCountDataSwr.Claim[0].ShippingProtectionClaims_aggregate.aggregate.count < 1) {

    return (
      <div>
        <StepHeading number="5" title="Reorder Request Review" subtitle="Please review your reorder request before submitting" />
        {
          StoreOrder.map((order, index) => (
            <div key={index}>
              <Dl>
                <DlItem 
                  label="Customer Name" 
                  desc={order.Customer.firstName + " " + order.Customer.lastName} 
                />
                <DlItem 
                  label="Store" 
                  desc={order.Store.name} 
                />
                <DlItem 
                  label="Original Order Number" 
                  desc={order.idFromPlatform} 
                />
                <DlItem 
                  label="Original Order Date" 
                  desc={
                    new Date(order.createdOn).getMonth() + 1 
                    + "/" +
                    new Date(order.createdOn).getDate() 
                    + "/" +
                    new Date(order.createdOn).getFullYear()
                  } 
                />
                <DlItem 
                  label="Shipping Postal Code" 
                  desc={order.ShippingAddress.postalCode} 
                />
              </Dl>
              <div className="flex items-center flex-col">
                <div className="w-full space-y-4 text-sm">
                  <div>
                    <List>
                      {
                        selectedReorderProductsDataSwr.SelectedProduct.map((selectedProduct, index) => (
                          <div key={"product_"+index}>
                            <ListItem 
                              title={selectedProduct.name} 
                              subtitle={selectedProduct.sku}
                              desc={"Qty. "+selectedProduct.quantity}
                              end={
                                new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                }).format(selectedProduct.price)
                              } 
                            />
                          </div>                        
                        ))
                      }
                    </List>
                  </div>
                </div>
              </div>
              <div className="mt-16 space-y-6 self-start">
                <Button label="Yes, Please Submit" onClick={goToConfirmation} />
                <Button label="View Options" link onClick={goToOptions} />
              </div>
            </div>
          ))
        }
      </div>
    )
  } else {
    return (
      <div>
        {
          ThisOrderClaims.map((claim, index) => (
            <div key={index}>
              <StepHeading number="4" title="Request Already Exists" subtitle={"A request already exists for this order with Claim# "+claim.shippingProtectionClaimId }/>
            </div>
          ))
        }

      </div>
    )
  }
}

export default withRouter(Review);
