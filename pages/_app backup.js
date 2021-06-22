import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import OrderContext from '../components/OrderContext';
import '../styles/global.css';

export default class MyApp extends App {
  state = {
    orderNumber: null
  };

  componentDidMount = () => {
    const orderNumber = localStorage.getItem('order_number');
    if (orderNumber) {
      this.setState({
        orderNumber
      });
    } else {
      Router.push('/');
    }
  };

  signIn = (idFromPlatform) => {

    const orderInfo = (query) =>
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
                query MyQuery($idFromPlatform_like: String = "0") {
                  StoreOrder(where: {idFromPlatform: {_like: $idFromPlatform_like}}) {
                    idFromPlatform
                    Customer {
                      firstName
                    }
                    Store {
                      name
                    }
                    orderTotal
                    ShippingAddress {
                      postalCode
                    }
                    createdOn
                  }
                  storeOrderLineItem_aggregate(where: {storeOrder: {idFromPlatform: {_like: $idFromPlatform_like}}}) {
                    aggregate {
                      count
                    }
                  }
                }
              `,
            variables: {
              "idFromPlatform_like": idFromPlatform
            },
          }),
        }
      )
      .then((res) => res.json())
      .then((json) => json.data)

    //localStorage.setItem('order_number', idFromPlatform);

    this.setState(
      {
        orderNumber: idFromPlatform,
        data: orderInfo
      },
      () => {
        Router.push('/store-message');
      }
    );
  };

  signOut = () => {
    localStorage.removeItem('order_number');
    this.setState({
      orderNumber: null
    });
    Router.push('/');
  };

  render() {
    const { Component, pageProps } = this.props;
    

    return (
      
      <OrderContext.Provider value={{ orderNumber: this.state.orderNumber, orderInfo: this.state.data, signIn: this.signIn, signOut: this.signOut }}>
        <Component {...pageProps} />
      </OrderContext.Provider>
    );
  }
}