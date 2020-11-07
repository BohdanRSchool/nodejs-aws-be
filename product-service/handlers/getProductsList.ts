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
  let products: Array<Product>;
  try {
    products = await getProducts();
    console.log('products', products);
  } catch (error) {
    console.log('error', error);
    return {
      ...CORSHeaders,
      statusCode: 500,
      body: error.message,
    }
  }

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
