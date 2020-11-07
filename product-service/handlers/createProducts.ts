import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import 'source-map-support/register';

import { Product } from '../models';
import { createProduct } from '../services/product.service';
const CORSHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET',
  }
}

export const createProducts = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const product: Product = JSON.parse(event.body);
  try {
    await createProduct(product);
    console.log('productBody', product);
    console.log('product created');
  } catch (error) {
    console.log('error', error);
    return {
      ...CORSHeaders,
      statusCode: 500,
      body: error.message,
    }
  }

  return {
    ...CORSHeaders,
    statusCode: 201,
    body: 'Created',
  }
}
