import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import 'source-map-support/register';

const BUCKET = 'rsschool';
const CORSHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
}

export const importProductsFile: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let url: string = '';
  const { name: fileName } = event.queryStringParameters;
  console.log('queryStringParameters', fileName);

  const s3 = new AWS.S3({ region: 'eu-west-1' });
  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: 'application/vnd.ms-excel'
  };

  try {
    url = await s3.getSignedUrlPromise('putObject', params);
    console.log('getSignedUrl', url);
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
    statusCode: 200,
    body: url,
  }
}
