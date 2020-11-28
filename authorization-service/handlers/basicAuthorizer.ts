import 'source-map-support/register';
import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewayAuthorizerHandler, Callback } from "aws-lambda";

export const basicAuthorizer: APIGatewayAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent, ctx, cb: Callback<APIGatewayAuthorizerResult>): Promise<any> => {
    console.log("Event: ", JSON.stringify(event));
    if (event.type !== 'TOKEN') {
        cb('Unauthorized');
    }
    try {
        const encodedCreds: string = event.authorizationToken.split(' ')[1]
        const buff: Buffer = Buffer.from(encodedCreds, 'base64');
        const creds: string[] = buff.toString('utf-8').split(':');
        const user: string = creds[0];
        const password: string = creds[1];
        console.log(`User: ${user} Password: ${password}`);
        const effect: string = !process.env[user] || process.env[user] !== password ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCreds, event.methodArn, effect);
        cb(null, policy);
    } catch (error) {
        cb(`Unauthorized: ${error.message}`);
    }
}

const generatePolicy = (principalId, resource, effect = 'Allow'): APIGatewayAuthorizerResult => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
}
