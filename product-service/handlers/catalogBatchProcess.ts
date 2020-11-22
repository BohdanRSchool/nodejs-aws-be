import 'source-map-support/register';
import AWS from 'aws-sdk';

import { createProduct } from '../services/product.service';
import { Product } from '../models';
import { SQSEvent, SQSHandler } from 'aws-lambda';

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent): Promise<void> => {
  const sns = new AWS.SNS({ region: 'eu-west-1' });
  const messageSuccessful: Array<Product> = [];
  const messageFailed: Array<any> = [];
  for (const record of event.Records) {
    const product: Product = JSON.parse(record.body);
    if (product?.price) product.price = Number(product.price);
    if (product?.count) product.count = Number(product.count);
    try {
      await createProduct(product);
      console.log('productBody', product);
      console.log('product created');
      messageSuccessful.push(product);
    } catch (error) {
      console.log('DB error', error);
      messageFailed.push({ product, error: error.message });
    }
  }
  if (messageFailed.length) {
    await sns.publish({
      Subject: 'Product service: failed products',
      Message: JSON.stringify(messageFailed),
      MessageAttributes: {
        'Status': {
          DataType: 'String',
          StringValue: 'Fail'
        },
      },
      TopicArn: process.env.SNS_ARN,
    }).promise();
  }
  if (messageSuccessful.length) {
    await sns.publish({
      Subject: 'Product service: successful products',
      Message: JSON.stringify(messageSuccessful),
      MessageAttributes: {
        'Status': {
          DataType: 'String',
          StringValue: 'Success'
        },
      },
      TopicArn: process.env.SNS_ARN,
    }).promise();
  }
}
