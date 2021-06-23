const GRAPHQL_ENDPOINT = 'https://corso-dev.thewarrickfamily.com/v1/graphql/';

const headers = {
  'Content-Type': 'application/json',
  "x-hasura-admin-secret": "ZwRp8xr6gs"
};

const DataFetcher = async() => {

  const options = {
    headers : headers,
    method: 'POST',
    body: JSON.stringify(args)
  };
  const res = await fetch(GRAPHQL_ENDPOINT, options)
  const res_json = await res.json();
  if(res_json.errors) {
  	throw(JSON.stringify(res_json.errors));
  }
  return res_json.data;
}

export default DataFetcher;