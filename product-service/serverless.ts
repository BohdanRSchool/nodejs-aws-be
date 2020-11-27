import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: [
    'serverless-webpack',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_ARN: {
        Ref: 'CreateProductTopic',
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: {
          Ref: 'CreateProductTopic',
        }
      }
    ]
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: '/products',
            cors: true,
          }
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: '/products/{productId}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  productId: true
                }
              }
            }
          }
        }
      ]
    },
    createProducts: {
      handler: 'handler.createProducts',
      events: [
        {
          http: {
            method: 'post',
            path: '/products',
            cors: true,
            request: {
              schema: {
                'application/json': '${file(product_payload.json)}'
              }
            }
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            arn: {
              'Fn::GetAtt': [
                'CatalogItemsQueue',
                'Arn'
              ]
            },
            batchSize: 5
          }
        }
      ]
    }
  },
  resources: {
    Outputs: {
      SQSQueueUrl: {
        Value: {
          Ref: 'CatalogItemsQueue'
        },
        Export: {
          Name: 'SQSQueueUrl'
        }
      },
      SQSQueueArn: {
        Value: {
          'Fn::GetAtt': [
            'CatalogItemsQueue',
            'Arn'
          ]
        },
        Export: {
          Name: 'SQSQueueArn'
        }
      }
    },
    Resources: {
      CatalogItemsQueue: {
        Properties: {
          QueueName: 'product-items-sqs'
        },
        Type: 'AWS::SQS::Queue'
      },
      CreateProductTopic: {
        Properties: {
          TopicName: 'product-items-topic'
        },
        Type: 'AWS::SNS::Topic'
      },
      SNSSubscriptionSuccess: {
        Properties: {
          Endpoint: 'vinn.andrew@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductTopic'
          },
          FilterPolicy: {
            Status: [
              'Success',
            ]
          }
        },
        Type: 'AWS::SNS::Subscription'
      },
      SNSSubscriptionFail: {
        Properties: {
          Endpoint: 'vinn.bohdan.z@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductTopic'
          },
          FilterPolicy: {
            Status: [
              'Fail',
            ]
          }
        },
        Type: 'AWS::SNS::Subscription'
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        }
      },
      GatewayResponseDefault5XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        }
      }
    }
  }
}

module.exports = serverlessConfiguration;
