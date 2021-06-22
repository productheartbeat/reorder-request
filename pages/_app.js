import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import OrderContext from '../components/OrderContext';
import '../styles/global.css';
import orderQuery from '../queries/orderQuery';

export default class MyApp extends App {
  state = {
    orderNumber: null,
    order: null
  };

  componentDidMount = () => {
    const orderNumber = localStorage.getItem('order_number');
    if (orderNumber) {

      this.setState({
        orderNumber
      });

      let url = "https://corso-dev.thewarrickfamily.com/v1/graphql/";

      const orderInfo = (query) =>
      
        fetch(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": "ZwRp8xr6gs",
            },
            body: JSON.stringify({
              query: orderQuery,
              variables: {
                "idFromPlatform_like": orderNumber
              },
            }),
          }
        )
        .then((res) => res.json())
        .then((json) => json.data)

      this.setState({
        data: orderInfo
      });


    } else {
      Router.push('/');
    }
  };

  orderIdLookup = (idFromPlatform) => {

    let url = "https://corso-dev.thewarrickfamily.com/v1/graphql/";

    const orderInfo = (query) =>
      fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": "ZwRp8xr6gs",
          },
          body: JSON.stringify({
            query: orderQuery,
            variables: {
              "idFromPlatform_like": idFromPlatform
            },
          }),
        }
      )
      .then((res) => res.json())
      .then((json) => json.data)

    localStorage.setItem('order_number', idFromPlatform);

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

  startOver = () => {
    localStorage.clear();
    this.setState({
      orderNumber: null,
      order: null
    });
    Router.push('/');
  };

  render() {
    const { Component, pageProps } = this.props;
    
    return (
      <OrderContext.Provider 
        value={{ 
          orderNumber: this.state.orderNumber, 
          orderInfo: this.state.data, 
          orderIdLookup: this.orderIdLookup, 
          startOver: this.startOver,
        }}
      >
        
        <Component {...pageProps} />
        
      </OrderContext.Provider>
    );
  }
}