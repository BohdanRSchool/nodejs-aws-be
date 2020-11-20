import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { S3Event, S3Handler } from 'aws-lambda';
import 'source-map-support/register';

const BUCKET = 'rsschool';

export const importFileParser: S3Handler = (event: S3Event): void => {
  const s3 = new AWS.S3({ region: 'eu-west-1' });

  for (const record of event.Records) {
    const copySource: string = `${BUCKET}/${record.s3.object.key}`;
    const keyTarget: string = record.s3.object.key.replace('uploaded', 'parsed');
    const params = {
      Bucket: BUCKET,
      Key: record.s3.object.key,
    };
    const copyParams = {
      Bucket: BUCKET,
      CopySource: copySource,
      Key: keyTarget,
    };

    s3.getObject(params)
      .createReadStream()
      .pipe(csv())
      .on('error', console.log)
      .on('data', console.log)
      .on('end', async () => {
        console.log(`Copy from ${copySource}`);
        try {
          await s3.copyObject(copyParams).promise();
        } catch (error) {
          console.log('Error during copying file', error);
        }
        console.log(`Copied into ${BUCKET}/${keyTarget}`);
        console.log(`Delete from ${copySource}`);
        try {
          await s3.deleteObject(params).promise();
        } catch (error) {
          console.log('Error during removing file', error);
        }
        console.log(`File ${copySource} was removed successfully`);
      });
  }
}
