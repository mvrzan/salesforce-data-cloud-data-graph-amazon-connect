/* global fetch */

import { getSfToken } from "./src/utils/getSfToken.mjs";
import { parseDataGraph } from "./src/utils/parseDataGraph.mjs";

export const handler = async (event) => {
  try {
    console.log("Lambda Function handler called");
    const { token, salesforceInstanceUrl } = await getSfToken();
    const callerPhoneNumber = event.Details?.ContactData.CustomerEndpoint.Address;

    // Data Cloud Data Graph lookup
    const dataCloudDataGraphLookupUrl = `${salesforceInstanceUrl}/services/data/v61.0/ssot/data-graphs/data/UC_phone_number_lookup?lookupKeys=ssot__FormattedE164PhoneNumber__c=${callerPhoneNumber}`;

    // Send data to Data Cloud Data Graph lookup API
    const dataCloudDataGraphLookupResponse = await fetch(dataCloudDataGraphLookupUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Check if the response is not successful
    if (!dataCloudDataGraphLookupResponse.ok) {
      const status = dataCloudDataGraphLookupResponse.status;
      const errorText = dataCloudDataGraphLookupResponse.statusText;
      console.error("Data Cloud Data Graph error:", errorText);
      throw new Error(`HTTP error when fetching data from the Data Cloud Data Graph, status = ${status}`);
    }

    const dataCloudDataGraphLookupResponseData = await dataCloudDataGraphLookupResponse.json();

    const formattedDataGraphObject = parseDataGraph(dataCloudDataGraphLookupResponseData);

    console.log("Formatted response object:", formattedDataGraphObject);

    return formattedDataGraphObject;
  } catch (error) {
    console.error("Error has occurred:", error);
    const errorResponse = {
      statusCode: 500,
      body: JSON.stringify(`There was an issue with the Lambda function: ${error}`),
    };

    return errorResponse;
  }
};
