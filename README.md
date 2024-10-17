<p align="center">
<a  href="https://www.salesforce.com/"><img  src="https://a.sfdcstatic.com/shared/images/c360-nav/salesforce-with-type-logo.svg"  alt="Salesforce"  width="150" height="150" hspace="50" /></a>
<a  href="https://www.salesforce.com/data/"><img  src="https://cdn.vidyard.com/hubs/logos/60cb440e-ec9e-4786-9a95-85fdc45dcb89.png"  alt="Data Cloud"  width="150" height="150" hspace="50"/></a>
<a  href="https://aws.amazon.com/connect/"><img  src="https://dvsanalytics.com/wp-content/uploads/2021/09/amazon-connect-removebg-preview.png"  alt="Amazon Connect"  width="150" height="150"  hspace="50"/></a>
<p/>

# Data Cloud Data Graphs with Amazon Connect

In this project, you will find an example of how to utilize Salesforce Data Cloud, specifically the Data Cloud [Data Graphs](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm&type=5) to pull [Unified Profile information](https://help.salesforce.com/s/articleView?id=sf.c360_a_identity_resolution.htm&type=5) into the [Amazon Connect](https://aws.amazon.com/connect) [Agent Workspace](https://docs.aws.amazon.com/connect/latest/adminguide/agent-workspace.html).

# Table of Contents

- [Data Cloud Data Graphs with Amazon Connect](#data-cloud-data-graphs-with-amazon-connect)
- [Table of Contents](#table-of-contents)
  - [What does it do?](#what-does-it-do)
  - [How does it work?](#how-does-it-work)
    - [Architecture diagram](#architecture-diagram)
  - [Technologies used](#technologies-used)
- [Configuration](#configuration)
  - [Requirements](#requirements)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## What does it do?

Data Cloud has a feature called [Data Graphs](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm&language=en_US&type=5). These Data Graphs combine and transform normalized table data from data model objects (DMOs) into new, materialized views of your data. Because the data is precalculated, you can make fewer calls, and queries respond in near real time.

This capability opens up various use cases that can expose very specific dataset via a [REST API](https://developer.salesforce.com/docs/platform/connectapi/references/spec?meta=getDataGraphDataByLookup) and allow external applications outside of the Salesforce ecosystem to tap into that enriched data. In this particular scenario, this project demonstrates how the Amazon Contact center solution pulls the data from Data Cloud's Data Graph in order to enrich the Agents Contact Center Panel interface with caller-specific information.

## How does it work?

### Architecture diagram

![](./screenshots/architecture-diagram.png)

The application flow is the following:

- A caller calls an Amazon Connect phone number
- The caller gets routed to an IVR (Interactive Voice Response) system
- The IVR invokes a dedicated Lambda function
- The Lambda function reads from a DynamoDB for the token value and expiration
  - If the token has expired, it fetches sensitive environment variables from the Secrets Manager
- The Lambda function fetches the Salesforce Access Token
- The Lambda function caches the new token into DynamoDB
- The Lambda function parses incoming IVR event and extracts the callers phone number
- The Lambda function calls the Data Graph lookup endpoint by passing the parsed phone number
- The Lambda function parses the Data Graph response payload
- The Lambda function sends the parsed payload back to the IVR that invoked the Lambada
- Amazon Connect's Contact Center Panel gets updated based on the incoming JSON payload

## Technologies used

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js](https://nodejs.org/en)
- [Salesforce Data Cloud](https://www.salesforce.com/data/)
- [AWS](https://aws.amazon.com/)
- [Amazon Connect](https://aws.amazon.com/connect/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS DynamoDb](https://aws.amazon.com/dynamodb/)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)

For a more detailed overview of the development & production dependencies, please check `package.json`.

# Configuration

## Requirements

In order to test this out, you will need several things:

- A valid [AWS account](https://aws.amazon.com/)
- A deployed [Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-get-started.html) instance
- A Salesforce account with [Data Cloud](https://www.salesforce.com/data/) deployed
- A [Basic Connected App](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_basics.htm&type=5) within Salesforce
- [Enable Oauth settings for the API integration](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_api_integration.htm&type=5)
- Created [Data Cloud Data Graph](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm&language=en_US&type=5) with the desired data

# License

[MIT](http://www.opensource.org/licenses/mit-license.html)

# Disclaimer

This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Salesforce bears no responsibility to support the use or implementation of this software.
