import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import OrderContext from '../components/OrderContext';
import Layout from '../components/layout';
import { gql } from 'graphql-request'
import { CorsoGraphQLClient } from '../queries/graphqlClient';
import '../styles/global.css';

const ORDER_QUERY = gql`
  query ORDER_QUERY($idFromPlatform_eq: String = "0") {
    StoreOrder(where: {idFromPlatform: {_eq: $idFromPlatform_eq}}) {
      idFromPlatform
      storeOrderId
      createdOn
      orderTotal
      customerEmail
      canceledOn
      cancelReason
      Customer {
        firstName
        customerId
      }
      Store {
        name
      }
      ShippingAddress {
        postalCode
      }
      StoreOrderLineItems(where: {vendor: {_nilike: "Corso, LLC"}}) {
        name
        sku
        price
        variantId
        quantity
        storeOrderLineItemId
      }
      ShippingProtectionClaims_aggregate {
        aggregate {
          count
        }
      }
    }
    StoreOrderLineItem_aggregate(where: {storeOrder: {idFromPlatform: {_like: $idFromPlatform_eq}}}) {
      aggregate {
        count
      }
    }
  }
`

export default class MyApp extends App {
  state = {
    orderNumber: null,
    fetchedOrderData: null,
    orderQuery: null,
    orderInfoFetcher: null
  };

  componentDidMount = () => {
    const lsOrderNumber = localStorage.getItem('order_number');
    
    if (lsOrderNumber) {

      /*const orderInfoFetcher = async () => {

        const ORDER_VARIABLES = {
          "idFromPlatform_like": orderIdFromUser
        }

        return CorsoGraphQLClient.request(ORDER_QUERY, ORDER_VARIABLES)

      }
      this.setState(
        {
          orderNumber: lsOrderNumber,
          orderData: orderInfoFetcher,
          //orderHasRequests: orderHasRequests
        }
      );*/ 

      localStorage.clear();
      Router.push('/');

    } else {
      localStorage.clear();
      Router.push('/');
    }
  };

  orderIdLookup = (orderIdFromUser) => {

    const orderDataFetcher = async () => {

      const ORDER_VARIABLES = {
        "idFromPlatform_eq": orderIdFromUser
      }

      return CorsoGraphQLClient.request(ORDER_QUERY, ORDER_VARIABLES)

    }

    localStorage.setItem('order_number', orderIdFromUser);

    this.setState(
      {
        orderNumber: orderIdFromUser,
        fetchedOrderData: orderDataFetcher,
        orderQuery: ORDER_QUERY,
      },
      () => {
        Router.push('/store-message');
      }
    );

  };

  startOver = () => {
    localStorage.clear();
    this.setState({
      orderNumber: null,
      order: null,
      orderQuery: null,
    });
    Router.push('/');
  };

  render() {

    const { Component, pageProps } = this.props;
    
    return (
      <OrderContext.Provider 
        value={{ 
          orderNumber: this.state.orderNumber, 
          fetchedOrderData: this.state.fetchedOrderData,
          orderQuery: this.state.orderQuery,
          orderIdLookup: this.orderIdLookup, 
          startOver: this.startOver,
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
        
      </OrderContext.Provider>
    );
  }
}