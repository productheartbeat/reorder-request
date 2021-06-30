import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'https://corso-dev.thewarrickfamily.com/v1/graphql/';

export const CorsoGraphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
    "x-hasura-admin-secret": "ZwRp8xr6gs"
  },
  method: 'POST'
});
