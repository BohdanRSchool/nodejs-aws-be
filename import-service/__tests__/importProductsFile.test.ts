import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';

beforeAll(async (done) => {
    done();
});

describe('importProductsFile', () => {

    it('should mock getSignedUrlPromise from S3', async () => {
        const mockSignedUrl: string = 'https://aws.s3.com/uploaded/name.csv?AWSAccessKeyId=XXX&Signature=XXXX'
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrl', (action: string, params: any, callback) => {
            console.log('arguments: ', action, params)
            callback(null, mockSignedUrl)
        })

        const params = {
            Bucket: '',
            Key: {},
            Expires: 60,
            ContentType: 'application/vnd.ms-excel',
        };
        const s3 = new AWS.S3({ region: 'eu-west-1' });
        const url = await s3.getSignedUrlPromise('putObject', params);

        expect(url).toEqual(mockSignedUrl);

        AWSMock.restore('S3');
    });
});
