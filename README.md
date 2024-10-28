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
  - [Feature demo](#feature-demo)
  - [Amazon Connect Workspace (custom view)](#amazon-connect-workspace-custom-view)
  - [Technologies used](#technologies-used)
- [Configuration](#configuration)
  - [Great, can I test this exact setup myself?](#great-can-i-test-this-exact-setup-myself)
  - [Ok, how do I re-create this myself, then?](#ok-how-do-i-re-create-this-myself-then)
  - [Deployment to AWS](#deployment-to-aws)
    - [Where to get the variables](#where-to-get-the-variables)
    - [YAML template updates](#yaml-template-updates)
    - [AWS SAM deployment](#aws-sam-deployment)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## What does it do?

Data Cloud has a feature called [Data Graphs](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm&language=en_US&type=5). These Data Graphs combine and transform normalized table data from data model objects (DMOs) into new, materialized views of your data. Because the data is precalculated, you can make fewer calls, and queries respond in near real time.

> The alternative to this is to use the [Data Cloud Query API](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query_v2_call_overview.htm) which comes with a significant longer response time

This capability opens up various use cases that can expose very specific dataset via a [REST API](https://developer.salesforce.com/docs/platform/connectapi/references/spec?meta=getDataGraphDataByLookup) and allow external applications outside of the Salesforce ecosystem to tap into that enriched data. In this particular scenario, this project demonstrates how the Amazon Connect contact center solution pulls the data from Data Cloud's Data Graph in order to enrich the Agent Workspace with caller-specific information in a [custom view](https://docs.aws.amazon.com/connect/latest/adminguide/view-resources-custom-view.html).

## How does it work?

### Architecture diagram

![](./screenshots/architecture-diagram.png)

The application flow is the following:

- A caller calls an Amazon Connect phone number
- The caller gets routed to a Contact Flow (IVR - Interactive Voice Response) system
- The IVR invokes a dedicated Lambda function
- The Lambda function reads from a DynamoDB for the token value and expiration
  - If the token has expired, it fetches sensitive environment variables from the Secrets Manager
- The Lambda function fetches the Salesforce Access Token
- The Lambda function caches the new token into DynamoDB
- The Lambda function parses incoming IVR event and extracts the callers phone number
- The Lambda function calls the Data Graph lookup endpoint by passing the parsed phone number
- The Lambda function parses the Data Graph response payload
- The Lambda function sends the parsed payload back to the IVR that invoked the Lambada
- The Contact Flow (IVR) parses the incoming JSON into contact attributes
- The Contact Flow (IVR) invokes a custom view and passes the parsed contact attributes
- Amazon Connect's Agent Workspace gets updated based on the incoming JSON payload

## Feature demo

## Amazon Connect Workspace (custom view)

![](./screenshots/agent-workspace-custom-view.png)

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

## Great, can I test this exact setup myself?

**No.** This project servers as an example of how Data Cloud Data Graphs can be used with Amazon Connect. The reason why this can't be just deployed and tested is due to the following:

- I would have to share the entire Data Cloud data model including data transformations and identity resolution rulesets
- The Data Graph would have to be recreated exactly according to the provided [schema](./data-graph-schema/dataGraphSchema.json)
- The parsing logic in the [Lambda function](./aws/src/utils/parseDataGraph.mjs) is create to parse for specific data points that are being returned by the Data Graph

## Ok, how do I re-create this myself, then?

In order to re-create this out, you will need the following:

- A valid [AWS account](https://aws.amazon.com/)
- A deployed [Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-get-started.html) instance
- A Salesforce account with [Data Cloud](https://www.salesforce.com/data/) deployed and all the data mapped
- A [Basic Connected App](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_basics.htm&type=5) within Salesforce
  - [Enabled Oauth settings for the API integration](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_api_integration.htm&type=5)
- Created [Data Cloud Data Graph](https://help.salesforce.com/s/articleView?id=sf.c360_a_data_graphs.htm&language=en_US&type=5) with the desired data (you can use the existing [schema](./data-graph-schema/dataGraphSchema.json) for guidance)
- Update the [Lambda function](./aws/src/utils/parseDataGraph.mjs) to parse the data based on your Data Graph
- An assigned Amazon Connect [phone number](https://docs.aws.amazon.com/connect/latest/adminguide/ag-overview-numbers.html)
- A custom Agent Workspace view ([example view](./amazon-connect/custom-view-schema.json))
- An [Amazon Connect Contact Flow](https://docs.aws.amazon.com/connect/latest/adminguide/connect-contact-flows.html) ([example Contact Flow](./amazon-connect/data-cloud-data-graph-lookup.json))
- Deployed [AWS resources](./aws/deploy.yaml)

## Deployment to AWS

This section does not cover the whole solution deployment, just a few AWS resources to get you started:

- Lambda Function
- Secrets Manager
- DynamoDB

The first step is to update the `template.yaml` file with your environment-specific secrets. The following values need to be updated in the `template.yaml` file:

```
        {
          "CLIENT_ID": "2MO_w2n1AqT7ItBzfdas342fdasf897fdas",
          "USERNAME": "john.doe@example.com",
          "LOGIN_URL": "login.salesforce.com",
          "RSA_PRIVATE_KEY": "V3Q2RQZm93eGFvZW13Vys5OGFnQ1dCQTErZGlNMTkrc...",
        }
```

### Where to get the variables

CLIENT_ID can be gathered from the Connect App within the Salesforce instance and it is labeled `Consumer Key` once the Connected App is created.
USERNAME is the email address of the user logging into Salesforce
LOGIN_URL is exactly as the variable states `login.salesforce.com` and you can leave that one as is.
RSA_PRIVATE_KEY is the private key generated by your certificate and it comes in the following format:

```
-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu
KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm
o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k
TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7
9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy
v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs
/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00
-----END RSA PRIVATE KEY-----
```

Make a copy of your key (yes, all of it) and encode it to a base64 format. This can be done by simply going to any base64 encode website (here's an example: https://www.base64encode.org/) and then take the note of the encoded string:

```
LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlCT2dJQkFBSkJBS2ozNEdreEZoRDkwdmNOTFlMSW5GRVg2UHB5MXRQZjlDbnpqNHA0V0dlS0xzMVB0OFF1CktVcFJLZkZMZlJZQzlBSUtqYkpUV2l0K0NxdmpXWXp2UXdFQ0F3RUFBUUpBSUpMaXhCeTJxcEZvUzREU21vRW0KbzNxR3kwdDZ6MDlBSUp0SCs1T2VSVjFiZStONGNEWUpLZmZHekRhODh2UUVOWmlSbTBHUnE2YStIUEdRTWQyawpUUUloQUtNU3Z6SUJubmk3b3QvT1NpZTJUbUpMWTRTd1RRQWV2WHlzRTJSYkZEWWRBaUVCQ1VFYVJRbk1uYnA3CjlteERYRGY2QVUwY04vUlBCamI5cVNIRGNXWkhHelVDSUcyRXM1OXo4dWdHckRZK3B4TFFud2ZvdGFkeGQrVXkKdi9PdzVUMHE1Z0lKQWlFQXlTNFJhSTlZRzhFV3gvMncwVDY3WlVWQXc4ZU9NQjZCSVVnMFhjdSszb2tDSUJPcwovNU9pUGdvVGRTeTdiY0Y5SUdwU0U4WmdHS3pnWVFWWmVOOTdZRTAwCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0t
```

This encoded string is going to be your `RSA_PRIVATE_KEY` variable.

**Note:** We have encoded the key because otherwise, the Secrets Manager would break the formatting casing issues with the authentication.

### YAML template updates

Once you have all the variables in your `deploy.yaml` file, save the file and proceed to the next step.

The next step is to zip the contents of the `aws/` folder. This means you will zip the following files and folders:

```
deploy.yaml
node_modules/
src/
 |-- utils
        |-- getSfToken.mjs
        |-- parseDataGraph.mjs
index.mjs
package.json
package-lock.json
```

> Does this structure matter? Yes, it does matter as a specific folder structure has to be followed when uploading a Lambda function.

**Note:** I don't see the `node_modules/` folder! In your terminal, navigate to the folder containing `package.json` file and run `npm install`.

### AWS SAM deployment

Log into the AWS Console and open the AWS CloudShell by clicking on the CloudShell icon in the bottom left of the AWS Console.

Once the CloudShell terminal opens, on the right-hand side, you will see a button labeled **Actions**. Click on it and select **Upload file** and select your the newly created `zip` file.

Run the following commands in the CloudShell:

```
unzip <name-of-your-zip-file>
sam build
```

Once the build step finishes, run the following command:

```
sam deploy --guided
```

This step will guide you through the deployment and ask the following questions:

```
 Stack Name [sam-app]: the name of the CloudFormation stack that will be deployed

 AWS Region [us-east-2]: default AWS region where this stack will be deployed

 Shows you resources changes to be deployed and require a 'Y' to initiate deploy: do you want an extra validation step before deploying the resources

 SAM needs permission to be able to create roles to connect to the resources in your template: allow SAM to create roles to connect the necessary resources

 preserves the state of previously provisioned resources when an operation fails: do you want to keep the deployed resources in case something fails

 Save arguments to configuration file [Y/n]: Do you want to save the arguments for future use?

```

That is it! You have successfully deployed the aforementioned resources into an AWS account using SAM. Once this is done, you will fined the appropriate resources created within your AWS account.

> Please note that this does not include the Amazon Connect deployment. Why? I was too lazy to include that.

# License

[MIT](http://www.opensource.org/licenses/mit-license.html)

# Disclaimer

This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Salesforce bears no responsibility to support the use or implementation of this software.
