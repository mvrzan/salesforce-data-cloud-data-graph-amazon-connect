/* global fetch */

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// create global variables for cache
let cachedJwt; // JWT token
let cachedJwtExpiresAt; // JWT token expiration time
let secret; // Secrets Manager object
let salesforceInstanceUrl; // Data Cloud instance URL
let fetchedSalesforceAccessToken; // Salesforce Access token

// initialize DynamoDB client
const dynamodbClient = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(dynamodbClient);
const tableName = process.env.DYNAMODB_TABLE_NAME;

// initialize AWS Secrets Manager client
const secret_name = process.env.SECRET_NAME;
const client = new SecretsManagerClient({
  region: process.env.SECRET_REGION,
});

export const getSfToken = async () => {
  try {
    // check if the secret is empty
    if (!secret) {
      console.log("No cached secrets found. Fetching new secrets!");

      // get the secrets from AWS Secrets Manager
      const secretResponse = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: "AWSCURRENT",
        })
      );

      // parse the secret string on a global variable
      secret = JSON.parse(secretResponse.SecretString);
    }

    // check if the JWT token is empty
    if (!cachedJwt) {
      console.log("No cached JWT token found. Fetching a new token!");

      // fetch the last JWT token from the DynamoDB table
      const { Items } = await dynamo.send(
        new ScanCommand({
          TableName: tableName,
        })
      );

      // check if there is a JWT token in the DynamoDB table
      if (Items.length >= 1) {
        const lastRecord = Items[Items.length - 1];
        cachedJwt = lastRecord.jwt;
        cachedJwtExpiresAt = lastRecord.expires_at;
        salesforceInstanceUrl = lastRecord.salesforceInstanceUrl;
      }
    }

    // check if the token is still valid
    if (!cachedJwtExpiresAt || cachedJwtExpiresAt - Math.round(Date.now() / 1000) < 5400) {
      console.log("Token is expired. Fetching a new token!");

      // Salesforce CRM Access Token Payload
      const salesforceCrmAccessTokenPayload = new URLSearchParams({
        grant_type: "password",
        client_id: secret.CLIENT_ID,
        client_secret: secret.CLIENT_SECRET,
        username: secret.USERNAME,
        password: secret.PASSWORD,
      });

      // Salesforce CRM Access Token Request
      const salesforceCrmResponse = await fetch(`https://${secret.CDP_INSTANCE_URL}/services/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: salesforceCrmAccessTokenPayload,
      });

      if (!salesforceCrmResponse.ok) {
        throw new Error("HTTP error, status = " + salesforceCrmResponse.status);
      }

      const salesforceCrmResponseData = await salesforceCrmResponse.json();
      const salesforceInstanceUrl = salesforceCrmResponseData.instance_url;

      // store the fetched JWT token and its expiration time
      fetchedSalesforceAccessToken = salesforceCrmResponseData.access_token;

      // save jwt token to dynamodb
      const tokenExpiration = +salesforceCrmResponseData.issued_at + 7200 * 1000;

      await dynamo.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            jwt: fetchedSalesforceAccessToken,
            expires_at: tokenExpiration,
            salesforceInstanceUrl,
          },
        })
      );

      return {
        token: fetchedSalesforceAccessToken,
        salesforceInstanceUrl,
      };
    }

    return {
      token: cachedJwt,
      salesforceInstanceUrl,
    };
  } catch (error) {
    console.error("Error has occurred:", error);
    const errorResponse = {
      statusCode: 500,
      body: JSON.stringify(`There was an issue with the Lambda helper function: ${error}`),
    };

    return errorResponse;
  }
};
