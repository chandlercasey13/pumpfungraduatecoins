"use client"

import { GraphiQL } from '@/lib/GraphiQL';

import 'graphiql/graphiql.css';

const fetcher = async (graphQLParams: any) => {
  const response = await fetch('https://go-graphql-pump-server-3c181cbb5d32.herokuapp.com/query', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphQLParams), // ✅ Directly send graphQLParams
  });

  return response.json();
};

export default function GraphQl() {
  return ( <GraphiQL className='graph' fetcher={fetcher} />)
}