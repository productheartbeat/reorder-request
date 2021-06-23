import Layout from "../components/layout";
import StepHeading from "../components/stepHeading";

//import { request } from 'graphql-request'

//import fetch from "../queries/fetch";
import useSWR from 'swr'

const VARIANT_QUERY = `
  query VARIANT_QUERY($idFromPlatform_like: String = "0") {
    Order: StoreOrder(where: {idFromPlatform: {_like: $idFromPlatform_like}}) {
      Variants: StoreOrderLineItems(where: {vendor: {_nilike: "Corso, LLC"}}) {
        variantId
      }
    }
  }
`;

const GRAPHQL_ENDPOINT = 'https://corso-dev.thewarrickfamily.com/v1/graphql/';

const headers = {
  'Content-Type': 'application/json',
  "x-hasura-admin-secret": "ZwRp8xr6gs"
};

const getVariants = async () => {
  return await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": "ZwRp8xr6gs",
    },
    body: JSON.stringify({
      
        query: VARIANT_QUERY,
        idFromPlatform_like: "3942735577287"
      
    })
  })
  .then((res) => res.json())
  .then((json) => json.data)
};

export default function Test() {

  const { data, error } = useSWR(VARIANT_QUERY, getVariants);

  console.log("data ", data)

  if(error) {
    return <div>Error...</div>
  }
  if(!data) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <StepHeading title="Test" />
    </Layout>
  )
}