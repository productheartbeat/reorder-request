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


const ReorderDetailsLost = () => {

  const [variantData, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://corso-dev.thewarrickfamily.com/v1/graphql/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": "ZwRp8xr6gs",
        },
        body: JSON.stringify({
          query: variantIdsQuery,
          variables: {
            "idFromPlatform_like": orderNumber
          },
        }),
      })
      const newData = await response.json();
      setData(newData.data.Order[0].Variants);
    };
    fetchData();
  }, [orderNumber]);

  const { orderInfo, orderNumber } = useContext(OrderContext);
  const { data, error } = useSWR(orderInfo, orderInfo);
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const { StoreOrder } = data

	const daysSinceOrder = Math.ceil(((new Date().getTime()) - (new Date(StoreOrder[0].createdOn).getTime()))/1000/60/60/24);

  if (variantData) {

    console.log("Variant Data: ", variantData);

    const buildObject = variantData => {
      const obj = {};
      for(let i = 0; i < variantData.length; i++){
         const { variantId, score } = variantData[i];
         obj[variantId] = score;
      };
      return Object.keys(obj);
   };

   localStorage.setItem("reorder_ids", JSON.stringify(buildObject(variantData)));
   console.log(buildObject(variantData));

    return (
      <>
        <div>
          <StepHeading number="4" title="Lost Package" subtitle="Almost there. One last step." />
          { daysSinceOrder < 5
            ?
            <div>
              <p className="mb-8">It's been {days} days since you ordered your package. Sometimes shipping goes slower than expected. We like to wait at least 5 days before it is considered lost. You can view your tracking information below.</p>
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
