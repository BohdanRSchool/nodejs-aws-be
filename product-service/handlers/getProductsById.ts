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
  let product: Product;
  try {
    product = await getProductById(productId);
    console.log('productId', productId);
    console.log('product', product);
  } catch (error) {
    console.log('error', error);
    return {
      ...CORSHeaders,
      statusCode: 500,
      body: error.message,
    }
  }

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
