/* global fetch */

import { getSfToken } from "./utils/getSfToken.mjs";

export const handler = async (event) => {
  try {
    console.log("Lambda Function handler called");
    const { token, salesforceInstanceUrl } = await getSfToken();

    console.log("Event:", event);

    // Data Cloud Data Graph lookup
    const dataCloudDataGraphLookupUrl = `${salesforceInstanceUrl}/services/data/v61.0/ssot/data-graphs/data/UC_phone_number_lookup?lookupKeys=ssot__FormattedE164PhoneNumber__c=241.572.2605`;

    console.log(
      "Data Cloud Data Graph lookup URL:",
      dataCloudDataGraphLookupUrl
    );

    // Send data to Data Cloud Data Graph lookup API
    const dataCloudDataGraphLookupResponse = await fetch(
      dataCloudDataGraphLookupUrl,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is not successful
    if (!dataCloudDataGraphLookupResponse.ok) {
      const status = dataCloudDataGraphLookupResponse.status;
      const errorText = dataCloudDataGraphLookupResponse.statusText;
      console.error("Data Cloud Ingestion API Error:", errorText);
      throw new Error(
        `HTTP error when sending data to Data Cloud Ingestion API, status = ${status}`
      );
    }

    console.log(
      "Data Cloud Data Graph lookup response:",
      dataCloudDataGraphLookupResponse
    );

    return {
      test1: "test1",
      test2: "test2",
      test3: "test3",
    };
  } catch (error) {
    console.error("Error has occurred:", error);
    const errorResponse = {
      statusCode: 500,
      body: JSON.stringify(
        `There was an issue with the Lambda function: ${error}`
      ),
    };

    return errorResponse;
  }
};
