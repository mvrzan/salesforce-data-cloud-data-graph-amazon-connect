export const parseDataGraph = (dataGraph) => {
  const decodeJson = (str) =>
    str
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'");

  const decodedJson = decodeJson(dataGraph.data[0].json_blob__c);
  const parsedJson = JSON.parse(decodedJson);
  const individual = parsedJson.UnifiedssotIndividualPat__dlm[0];
  const linkIndividuals = individual.UnifiedLinkssotIndividualPat__dlm;

  // website engagement data
  const individualWebsiteEngagementData = linkIndividuals.find((link) =>
    link.ssot__Individual__dlm.some((item) => item.hasOwnProperty("ssot__WebsiteEngagement__dlm"))
  );

  const websiteEngagement = {
    engagementDate:
      individualWebsiteEngagementData.ssot__Individual__dlm[0].ssot__WebsiteEngagement__dlm[0]
        .ssot__EngagementDateTm__c,
    webPageCategory:
      individualWebsiteEngagementData.ssot__Individual__dlm[0].ssot__WebsiteEngagement__dlm[0].Webpage_Category__c,
  };

  // email engagement data
  const individualEmailEngagementData = linkIndividuals.find((link) =>
    link.ssot__Individual__dlm.some((item) => item.hasOwnProperty("ssot__EmailEngagement__dlm"))
  );

  const emailEngagement = {
    engagementDate:
      individualEmailEngagementData.ssot__Individual__dlm[0].ssot__EmailEngagement__dlm[0].ssot__EngagementDateTm__c,
    emailSubject:
      individualEmailEngagementData.ssot__Individual__dlm[0].ssot__EmailEngagement__dlm[0].ssot__SubjectLineTxt__c,
    emailName: individualEmailEngagementData.ssot__Individual__dlm[0].ssot__EmailEngagement__dlm[0].ssot__EmailName__c,
    engagementType:
      individualEmailEngagementData.ssot__Individual__dlm[0].ssot__EmailEngagement__dlm[0].ssot__EngagementTypeId__c,
    emailSentDate:
      individualEmailEngagementData.ssot__Individual__dlm[0].ssot__EmailEngagement__dlm[0].ssot__SentDateTm__c,
  };

  // SMS engagement data
  const individualSmsEngagementData = linkIndividuals.find((link) =>
    link.ssot__Individual__dlm.some((item) => item.hasOwnProperty("ssot__MessageEngagement__dlm"))
  );

  const smsEngagement = {
    engagementDate:
      individualSmsEngagementData.ssot__Individual__dlm[0].ssot__MessageEngagement__dlm[0].ssot__EngagementDateTm__c,
    engagementType:
      individualSmsEngagementData.ssot__Individual__dlm[0].ssot__MessageEngagement__dlm[0].ssot__EngagementTypeId__c,
    keywordText:
      individualSmsEngagementData.ssot__Individual__dlm[0].ssot__MessageEngagement__dlm[0].ssot__KeywordTxt__c,
    smsName: individualSmsEngagementData.ssot__Individual__dlm[0].ssot__MessageEngagement__dlm[0].ssot__Name__c,
    sendTimePhoneNumber:
      individualSmsEngagementData.ssot__Individual__dlm[0].ssot__MessageEngagement__dlm[0].ssot__SendTimePhoneNumber__c,
    sentDate: individualSmsEngagementData.ssot__Individual__dlm[0].ssot__MessageEngagement__dlm[0].ssot__SentDateTm__c,
    templateName: individualSmsEngagementData.ssot__Individual__dlm[0].ssot__MessageEngagement__dlm[0].Tempate_Name,
  };

  // latest appointment data
  const individualAppointmentData = linkIndividuals.find((link) =>
    link.ssot__Individual__dlm.some((item) => item.hasOwnProperty("Appointment__dlm"))
  );

  const latestAppointment = {
    appointmentTime: individualAppointmentData.ssot__Individual__dlm[0].Appointment__dlm[0].Appointment_Time_c__c,
    createdDate: individualAppointmentData.ssot__Individual__dlm[0].Appointment__dlm[0].CreatedDate__c,
    name: individualAppointmentData.ssot__Individual__dlm[0].Appointment__dlm[0].Name__c,
    procedure: individualAppointmentData.ssot__Individual__dlm[0].Appointment__dlm[0].Procedure_c__c,
    procedureId: individualAppointmentData.ssot__Individual__dlm[0].Appointment__dlm[0].Procedure_Id__c,
    status: individualAppointmentData.ssot__Individual__dlm[0].Appointment__dlm[0].Status_c__c,
  };

  const formattedDataGraphObject = {
    firstName: individual.ssot__FirstName__c,
    lastName: individual.ssot__LastName__c,
    yearlyIncome: individual.ssot__YearlyIncomeRangeId__c,
    phoneNumber: parsedJson.ssot__FormattedE164PhoneNumber__c,
    emailAddress: individual.UnifiedssotContactPointEmailPat__dlm[0].ssot__EmailAddress__c,
    address: individual.UnifiedssotContactPointAddressPat__dlm[0].ssot__AddressLine1__c,
    city: individual.UnifiedssotContactPointAddressPat__dlm[0].ssot__CityId__c,
    country: individual.UnifiedssotContactPointAddressPat__dlm[0].ssot__CountryId__c,
    postalCode: individual.UnifiedssotContactPointAddressPat__dlm[0].ssot__PostalCodeId__c,
    state: individual.UnifiedssotContactPointAddressPat__dlm[0].ssot__StateProvinceId__c,
    websiteEngagement,
    emailEngagement,
    smsEngagement,
    latestAppointment,
  };

  return formattedDataGraphObject;
};
