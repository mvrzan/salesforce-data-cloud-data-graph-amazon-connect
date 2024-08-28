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
      console.error("Data Cloud Ingestion API Error:", errorText);
      throw new Error(
        `HTTP error when sending data to Data Cloud Ingestion API, status = ${status}`
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

    // console.log("Data Cloud Data Graph lookup response data:", parsedJson);

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
              .Appointment__dlm - 1
          ].Appointment_Time_c__c,
      },
    };

    // "Appointment__dlm": [
    //     {
    //         "Appointment_Time_c__c": "2024-07-12T00:00:00.000Z",
    //         "Contact_c__c": "003ao000002TdD7AAK",
    //         "CreatedDate__c": "2024-03-14T18:21:06.000Z",
    //         "Id__c": "a1Lao000000Fg7IEAS",
    //         "Name__c": "Teeth Whitening for Robyn",
    //         "Procedure_c__c": "Teeth Whitening",
    //         "Procedure_Id__c": "TWHIT",
    //         "Status_c__c": "Confirmed"
    //     },
    //     {
    //         "Appointment_Time_c__c": "2024-07-29T00:00:00.000Z",
    //         "Contact_c__c": "003ao000002TdD7AAK",
    //         "CreatedDate__c": "2024-03-14T18:21:06.000Z",
    //         "Id__c": "a1Lao000000Fg7LEAS",
    //         "Name__c": "Teeth Whitening for Robyn",
    //         "Procedure_c__c": "Teeth Whitening",
    //         "Procedure_Id__c": "TWHIT",
    //         "Status_c__c": "Confirmed"
    //     },
    //     {
    //         "Appointment_Time_c__c": "2024-03-21T00:00:00.000Z",
    //         "Contact_c__c": "003ao000002TdD7AAK",
    //         "CreatedDate__c": "2024-03-14T18:21:06.000Z",
    //         "Id__c": "a1Lao000000Fg7KEAS",
    //         "Name__c": "Teeth Cleaning for Robyn",
    //         "Procedure_c__c": "Teeth Cleaning",
    //         "Procedure_Id__c": "TCLNG",
    //         "Status_c__c": "Confirmed"
    //     },
    //     {
    //         "Appointment_Time_c__c": "2023-11-22T00:00:00.000Z",
    //         "Contact_c__c": "003ao000002TdD7AAK",
    //         "CreatedDate__c": "2024-03-14T18:21:06.000Z",
    //         "Id__c": "a1Lao000000Fg7JEAS",
    //         "Name__c": "Periodontal Therapy for Robyn",
    //         "Procedure_c__c": "Periodontal Therapy",
    //         "Procedure_Id__c": "PRTAP",
    //         "Status_c__c": "Completed"
    //     }
    // ]

    console.log("Formatted response object:", formattedResponseObject);

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
