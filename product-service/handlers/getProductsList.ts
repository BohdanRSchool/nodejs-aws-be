import { APIGatewayProxyResult } from "aws-lambda";
import 'source-map-support/register';

import { Product } from '../models';
import { getProducts } from '../services/product.service'
const CORSHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET',
  }
}

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  // emulate async call
  const products: Array<Product> = await getProducts();

  if (!products.length) {
    return {
      ...CORSHeaders,
      statusCode: 404,
      body: 'Products not found',
    }
  }

  return {
    ...CORSHeaders,
    statusCode: 200,
    body: JSON.stringify(products),
  }
}
