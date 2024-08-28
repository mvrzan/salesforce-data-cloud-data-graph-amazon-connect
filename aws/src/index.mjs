/* global fetch */

import { getSfToken } from "./utils/getSfToken.mjs";

export const handler = async (event) => {
  try {
    console.log("Lambda Function handler called");
    const { token, salesforceInstanceUrl } = await getSfToken();

    console.log("Event:", event);

    // Data Cloud Data Graph lookup
    const dataCloudDataGraphLookupUrl = `${salesforceInstanceUrl}/services/data/v61.0/ssot/data-graphs/data/UC_phone_number_lookup?lookupKeys=ssot__FormattedE164PhoneNumber__c=241.572.2605`;

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
      console.error("Data Cloud Data Graph error:", errorText);
      throw new Error(
        `HTTP error when fetching data from the Data Cloud Data Graph, status = ${status}`
      );
    }

    const dataCloudDataGraphLookupResponseData =
      await dataCloudDataGraphLookupResponse.json();

    const decodeJson = (str) =>
      str
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'");

    const decodedJson = decodeJson(
      dataCloudDataGraphLookupResponseData.data[0].json_blob__c
    );
    const parsedJson = JSON.parse(decodedJson);

    const formattedResponseObject = {
      firstName: parsedJson.UnifiedssotIndividualPat__dlm[0].ssot__FirstName__c,
      lastName: parsedJson.UnifiedssotIndividualPat__dlm[0].ssot__LastName__c,
      yearlyIncome:
        parsedJson.UnifiedssotIndividualPat__dlm[0]
          .ssot__YearlyIncomeRangeId__c,
      phoneNumber: parsedJson.ssot__FormattedE164PhoneNumber__c,
      emailAddress:
        parsedJson.UnifiedssotIndividualPat__dlm[0]
          .UnifiedssotContactPointEmailPat__dlm[0].ssot__EmailAddress__c,
      address:
        parsedJson.UnifiedssotIndividualPat__dlm[0]
          .UnifiedssotContactPointAddressPat__dlm[0].ssot__AddressLine1__c,
      city: parsedJson.UnifiedssotIndividualPat__dlm[0]
        .UnifiedssotContactPointAddressPat__dlm[0].ssot__CityId__c,
      country:
        parsedJson.UnifiedssotIndividualPat__dlm[0]
          .UnifiedssotContactPointAddressPat__dlm[0].ssot__CountryId__c,
      postalCode:
        parsedJson.UnifiedssotIndividualPat__dlm[0]
          .UnifiedssotContactPointAddressPat__dlm[0].ssot__PostalCodeId__c,
      state:
        parsedJson.UnifiedssotIndividualPat__dlm[0]
          .UnifiedssotContactPointAddressPat__dlm[0].ssot__StateProvinceId__c,
      websiteEngagement: {
        engagementDate:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[0].ssot__Individual__dlm[0]
            .ssot__WebsiteEngagement__dlm[0].ssot__EngagementDateTm__c,
        webPageCategory:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[0].ssot__Individual__dlm[0]
            .ssot__WebsiteEngagement__dlm[0].Webpage_Category__c,
      },
      emailEngagement: {
        engagementDate:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__EmailEngagement__dlm[0].ssot__EngagementDateTm__c,
        emailSubject:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__EmailEngagement__dlm[0].ssot__SubjectLineTxt__c,
        emailName:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__EmailEngagement__dlm[0].ssot__EmailName__c,
        engagementType:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__EmailEngagement__dlm[0].ssot__EngagementTypeId__c,
        emailSentDate:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__EmailEngagement__dlm[0].ssot__SentDateTm__c,
      },
      smsEngagement: {
        engagementDate:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__MessageEngagement__dlm[0].ssot__EngagementDateTm__c,
        engagementType:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__MessageEngagement__dlm[0].ssot__EngagementTypeId__c,
        keywordText:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__MessageEngagement__dlm[0].ssot__KeywordText__c,
        smsName:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__MessageEngagement__dlm[0].ssot__Name__c,
        sendTimePhoneNumber:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__MessageEngagement__dlm[0].ssot__SendTimePhoneNumber__c,
        sentDate:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__MessageEngagement__dlm[0].ssot__SentDateTm__c,
        templateName:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[1].ssot__Individual__dlm[0]
            .ssot__MessageEngagement__dlm[0].Tempate_Name,
      },
      latestAppointment: {
        appointmentTime:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
            .Appointment__dlm[
            parsedJson.UnifiedssotIndividualPat__dlm[0]
              .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
              .Appointment__dlm.length - 1
          ].Appointment_Time_c__c,
        createdDate:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
            .Appointment__dlm[
            parsedJson.UnifiedssotIndividualPat__dlm[0]
              .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
              .Appointment__dlm.length - 1
          ].CreatedDate__c,
        name: parsedJson.UnifiedssotIndividualPat__dlm[0]
          .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
          .Appointment__dlm[
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
            .Appointment__dlm.length - 1
        ].Name__c,
        procedure:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
            .Appointment__dlm[
            parsedJson.UnifiedssotIndividualPat__dlm[0]
              .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
              .Appointment__dlm.length - 1
          ].Procedure_c__c,
        procedureId:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
            .Appointment__dlm[
            parsedJson.UnifiedssotIndividualPat__dlm[0]
              .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
              .Appointment__dlm.length - 1
          ].Procedure_Id__c,
        status:
          parsedJson.UnifiedssotIndividualPat__dlm[0]
            .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
            .Appointment__dlm[
            parsedJson.UnifiedssotIndividualPat__dlm[0]
              .UnifiedLinkssotIndividualPat__dlm[3].ssot__Individual__dlm[0]
              .Appointment__dlm.length - 1
          ].Status_c__c,
      },
    };

    console.log("Formatted response object:", formattedResponseObject);

    return formattedResponseObject;
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
