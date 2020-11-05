import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import 'source-map-support/register';

import { Product } from '../models';
import { getProductById } from '../services/product.service'

const CORSHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET',
  }
}

export const getProductsById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { productId } = event.pathParameters

  // emulate async call
  const product: Product = await getProductById(productId);

  if (!product) {
    return {
      ...CORSHeaders,
      statusCode: 404,
      body: 'Product not found',
    }
  }

  return {
    ...CORSHeaders,
    statusCode: 200,
    body: JSON.stringify(product),
  }
}
