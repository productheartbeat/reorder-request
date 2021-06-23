import React, { useContext } from "react";
import { withRouter } from 'next/router'
import StepHeading from "./stepHeading"
import Layout from "./layout"
import Button from "./button"
import SvgIcon from "./icons"
import useSWR from 'swr';
import OrderContext from '../components/OrderContext';

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

const ReorderDetailsStolen = (props) => {

	const { orderInfo } = useContext(OrderContext);
  const { data: variantData, error: variantError } = useSWR(VARIANT_QUERY, FetchVariants);
  const { data: orderData, error: orderError } = useSWR(orderInfo, orderInfo);
  
  if (variantError || orderError) return <div>Failed to load</div>
  if (!variantData || !orderData ) return <div>Loading...</div>

  const { StoreOrder } = orderData;
  const { Order } = variantData;

  const variantLineItems = Order[0].Variants;

  const times = 1; //TO DO - make this an actual value

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
              <div>
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
