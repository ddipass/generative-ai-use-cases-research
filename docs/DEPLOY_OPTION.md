Here's the translation with Japanese parts translated to English while preserving other content and format:

# Deployment Options

## Configuration Method

GenU changes settings using the AWS CDK context.

**Although CDK context can also be specified with '-c', in that case, changes won't be made to the codebase and the frontend build won't be executed. Therefore, for this asset, it's recommended to change all settings in cdk.json.**

### How to change values in cdk.json

Settings are configured by changing the values under context in [packages/cdk/cdk.json](/packages/cdk/cdk.json). For example, setting `"ragEnabled": true` enables the RAG chat use case. After setting the context value, you can reflect the settings by redeploying with the following command:

```bash
npm run cdk:deploy
```

## Use Case Settings

### Enabling RAG Chat (Amazon Kendra) Use Case

Specify `true` for `ragEnabled` in the context. (Default is `false`)

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**
```
{
  "context": {
    "ragEnabled": true
  }
}
```

After the change, redeploy with `npm run cdk:deploy` to reflect it. Also, the data stored in `/packages/cdk/rag-docs/docs` will be automatically uploaded to the S3 bucket for Kendra data source.

Next, perform the Sync of Kendra's Data source with the following steps:

1. Open the [Amazon Kendra console screen](https://console.aws.amazon.com/kendra/home)
2. Click on generative-ai-use-cases-index
3. Click on Data sources
4. Click on "s3-data-source"
5. Click on Sync now

When Completed is displayed in the Status / Summary of Sync run history, it's complete. The files stored in S3 are synchronized and can be searched from Kendra.

#### If you want to use an existing Amazon Kendra Index

Note that `ragEnabled` needs to be `true` as above even when using an existing Kendra Index.

Specify the ARN of the Index for `kendraIndexArn` in the context. If you're using an S3 data source with the existing Kendra Index, specify the bucket name for `kendraDataSourceBucketName`.

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**
```
{
  "context": {
    "kendraIndexArn": "<Kendra Index ARN>",
    "kendraDataSourceBucketName": "<Kendra S3 Data Source Bucket Name>"
  }
}
```

After the change, redeploy with `npm run cdk:deploy` to reflect it.

`<Kendra Index ARN>` is in the following format:

```
arn:aws:kendra:<Region>:<AWS Account ID>:index/<Index ID>
```

Specifically, it's a string like this:

```
arn:aws:kendra:ap-northeast-1:333333333333:index/77777777-3333-4444-aaaa-111111111111
```

### Enabling RAG Chat (Knowledge Base) Use Case

Specify `true` for `ragKnowledgeBaseEnabled` in the context. (Default is `false`)

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**
```
{
  "context": {
    "ragKnowledgeBaseEnabled": true,
    "embeddingModelId": "amazon.titan-embed-text-v2:0",
  }
}
```

`embeddingModelId` is the model used for embedding. Currently, the following models are supported:

```
"amazon.titan-embed-text-v1"
"amazon.titan-embed-text-v2:0"
"cohere.embed-multilingual-v3"
"cohere.embed-english-v3"
```

After the change, redeploy with `npm run cdk:deploy` to reflect it. At this time, Knowledge Base will be deployed to the region specified by `modelRegion` in `cdk.json`. Therefore, the model specified by `embeddingModelId` needs to be enabled in Bedrock in the region specified by `modelRegion`.

Also, the data stored in `/packages/cdk/rag-docs/docs` will be automatically uploaded to the S3 bucket for Knowledge Base data source.

After deployment is complete, follow these steps to Sync the Data source of Knowledge Base:

1. Open the [Knowledge Base console screen](https://console.aws.amazon.com/bedrock/home#/knowledge-bases)
2. Click on generative-ai-use-cases-jp
3. Select s3-data-source and click Sync

When the Status becomes Available, it's complete. The files stored in S3 have been ingested and can be searched from Knowledge Base.

#### How to make changes to the OpenSearch Service Index, such as changing the embeddingModelId

Changes such as `embeddingModelId` may be destructive to existing Indexes, so changes to Index settings are not reflected even if changed.
To make changes, follow these steps to delete the existing Index and regenerate it:

1. Make changes such as changing `embeddingModelId` in `cdk.json`
2. Open [CloudFormation](https://console.aws.amazon.com/cloudformation/home) (be careful of the region) and click on RagKnowledgeBaseStack
3. Click Delete in the upper right (**RAG chat will be temporarily unavailable from the moment of deletion**)
4. After deletion is complete, redeploy with `npm run cdk:deploy`

With the deletion of RagKnowledgeBaseStack, the S3 Bucket for RAG chat will also be deleted.
If there is manually uploaded data, please upload it again.
Also, follow the previously mentioned steps to Sync the Data source again.

#### How to check the OpenSearch Service Index in the management console

By default, when you open the Indexes tab of OpenSearch Service from the management console, you'll see an error saying `User does not have permissions for the requested resource`.
This is because the Data access policy does not allow the IAM user logged into the management console.
Follow these steps to manually add the necessary permissions:

1. Open [OpenSearch Service](https://console.aws.amazon.com/aos/home?#opensearch/collections) (be careful of the region) and click on generative-ai-use-cases-jp
2. Click on generative-ai-use-cases-jp, which is the Associated policy at the bottom of the page
3. Click Edit in the upper right
4. Click Add principals in Select principals in the middle of the page, and add IAM User/Role etc. (permissions logged into the management console)
5. Save

After saving, please wait a little while and access again.

### Enabling Agent Chat Use Case

In the Agent Chat use case, you can execute actions using Agent for Amazon Bedrock and refer to the vector database of Knowledge base for Amazon Bedrock.

#### Deploying the Search Agent

Create an Agent that refers to the latest information by cooperating with API and answers. You can customize the Agent to add other actions, and create and switch between multiple Agents.

The default search agent uses [Brave Search API's Data for AI](https://brave.com/search/api/) due to the size of the free usage tier, request number limitations, and cost considerations, but it can be customized to use other APIs. Obtaining an API key requires credit card registration even for the free plan.

> [!NOTE]
> When you enable the Agent Chat use case, it only sends data to external APIs in the Agent Chat use case. (By default, Brave Search API) Other use cases can continue to be used closed within AWS. Please check your internal policies and the terms of use of the API before enabling.

Specify `true` for `agentEnabled` and `searchAgentEnabled` in the context (default is `false`), specify `agentRegion` from [regions where Agent for Bedrock is available](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-supported.html), and specify the API key of the search engine for `searchApiKey`.

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**
```
{
  "context": {
    "agentEnabled": true,
    "agentRegion": "us-west-2",
    "searchAgentEnabled": true,
    "searchApiKey": "<Search Engine API Key>",
  }
}
```

After the change, redeploy with `npm run cdk:deploy` to reflect it. This will deploy the default search engine Agent.

If you want to register an Agent created manually other than the default Agent, add additional Agents to `agents` as follows:

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**
```
{
  "context": {
    "agents": [
      {
        "displayName": "SearchEngine",
        "agentId": "XXXXXXXXX",
        "aliasId": "YYYYYYYY"
      }
    ],
  }
}
```

It's also possible to modify `packages/cdk/lib/construct/agent.ts` to define a new Agent.

#### Deploying the Knowledge base Agent

It's also possible to manually create and register an agent that cooperates with Knowledge base for Amazon Bedrock.

First, create a knowledge base referring to the [Knowledge base for Amazon Bedrock documentation](https://docs.aws.amazon.com/ja_jp/bedrock/latest/userguide/knowledge-base-create.html) from the [Knowledge base AWS console screen](https://console.aws.amazon.com/bedrock/home#/knowledge-bases). Create it in the same region as `agentRegion` mentioned later.

Next, manually create an Agent from the [Agent AWS console screen](https://console.aws.amazon.com/bedrock/home#/agents). The settings are basically default, and for the Agent prompt, enter a prompt referring to the following example. For the model, `anthropic.claude-instant-v1` is recommended as it responds quickly. Proceed without setting an action group, and for the knowledge base, register the knowledge base created in the previous step and enter a prompt referring to the following example.

```
Agent Prompt Example: You are an assistant that responds to instructions. Please search for information according to the instructions and respond appropriately based on that content. Do not answer anything that is not mentioned in the information. You can search multiple times.
Knowledge base Prompt Example: Search for information using keywords. It can be used for tasks such as researching, investigating, teaching about X, or summarizing. Please infer search keywords from the conversation. The search results may include content with low relevance, so please answer based only on highly relevant content. It can be executed multiple times.
```

Create an Alias from the created Agent, copy the `agentId` and `aliasId`, and add them to the context in the following format. Set the name you want to display in the UI for `displayName`. Also, set `agentEnabled` in the context to True and specify the region where you created the Agent for `agentRegion`. Redeploy with `npm run cdk:deploy` to reflect the changes.

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**
```
{
  "context": {
    "agentEnabled": true,
    "agentRegion": "us-west-2",
    "agents": [
      {
        "displayName": "Knowledge base",
        "agentId": "XXXXXXXXX",
        "aliasId": "YYYYYYYY"
      }
    ],
  }
}
```

### Enabling Video Analysis Use Case

In the video analysis use case, the LLM analyzes the content of the image by inputting video image frames and text.
There is no option to directly enable the video analysis use case, but multimodal models need to be enabled in `cdk.json`.

As of 2024/06, the multimodal models are as follows:

```
"anthropic.claude-3-5-sonnet-20240620-v1:0",
"anthropic.claude-3-opus-20240229-v1:0",
"anthropic.claude-3-sonnet-20240229-v1:0",
"anthropic.claude-3-haiku-20240307-v1:0"
```

One of these needs to be defined in `modelIds` in `cdk.json`.

```json
  "modelIds": [
    "anthropic.claude-3-5-sonnet-20240620-v1:0",
    "anthropic.claude-3-opus-20240229-v1:0",
    "anthropic.claude-3-haiku-20240307-v1:0",
    "anthropic.claude-3-sonnet-20240229-v1:0"
  ]
```

> Information as of 2024/05: As mentioned above, you need to use Claude 3, so the video analysis use case cannot be used if modelRegion is ap-northeast-1. Please use a region where Claude 3 is available (such as us-east-1 or us-west-2).

## Changing Amazon Bedrock Models

Specify the model and the region of the model with `modelRegion`, `modelIds`, and `imageGenerationModelIds` in `cdk.json`. For `modelIds` and `imageGenerationModelIds`, specify a list of models you want to use from among the models available in the specified region. The AWS documentation has a [list of models](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html) and a [list of model support by region](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html).

The text generation models supported by this solution are as follows:

```
"anthropic.claude-3-5-sonnet-20240620-v1:0",
"anthropic.claude-3-opus-20240229-v1:0",
"anthropic.claude-3-sonnet-20240229-v1:0",
"anthropic.claude-3-haiku-20240307-v1:0",
"amazon.titan-text-premier-v1:0",
"meta.llama3-70b-instruct-v1:0",
"meta.llama3-8b-instruct-v1:0",
"cohere.command-r-plus-v1:0",
"cohere.command-r-v1:0",
"mistral.mistral-small-2402-v1:0",
"mistral.mistral-large-2402-v1:0",
"anthropic.claude-v2:1",
"anthropic.claude-v2",
"anthropic.claude-instant-v1",
"meta.llama2-70b-chat-v1",
"meta.llama2-13b-chat-v1",
"mistral.mixtral-8x7b-instruct-v0:1",
"mistral.mistral-7b-instruct-v0:2"
```

The image generation models supported by this solution are as follows:

```
"amazon.titan-image-generator-v1",
"stability.stable-diffusion-xl-v1"
```

**Please confirm that the specified models are enabled in the specified region.**

### Example of using Amazon Bedrock models in us-east-1 (Virginia)

```bash
  "modelRegion": "us-east-1",
  "modelIds": [
    "anthropic.claude-3-5-sonnet-20240620-v1:0",
    "anthropic.claude-3-sonnet-20240229-v1:0",
    "anthropic.claude-3-haiku-20240307-v1:0",
    "amazon.titan-text-premier-v1:0",
    "meta.llama3-70b-instruct-v1:0",
    "meta.llama3-8b-instruct-v1:0",
    "cohere.command-r-plus-v1:0",
    "cohere.command-r-v1:0",
    "mistral.mistral-large-2402-v1:0"
  ],
  "imageGenerationModelIds": [
    "amazon.titan-image-generator-v1",
    "stability.stable-diffusion-xl-v1"
  ],
```

### Example of using Amazon Bedrock models in ap-northeast-1 (Tokyo)

```bash
  "modelRegion": "ap-northeast-1",
  "modelIds": [
    "anthropic.claude-v2:1",
    "anthropic.claude-instant-v1"
  ],
  "imageGenerationModelIds": [],
```

**Note: Although it appears in the UI, image generation is currently not available in ap-northeast-1 as Stable Diffusion and Titan Image are not supported.**

## If you want to use Amazon SageMaker custom models

It's possible to use large language models deployed to Amazon SageMaker endpoints. We support SageMaker Endpoints using the Huggingface Container for Text Generation Inference (TGI). Ideally, the model should support chat-style prompts where the user and assistant alternate speaking. Note that the image generation use case currently doesn't support Amazon SageMaker endpoints.

**Examples of available models** (Models other than these can also be used if deployed to Text Generation Inference.)
 - [SageMaker JumpStart Rinna 3.6B](https://aws.amazon.com/jp/blogs/news/generative-ai-rinna-japanese-llm-on-amazon-sagemaker-jumpstart/)
 - [SageMaker JumpStart Bilingual Rinna 4B](https://aws.amazon.com/jp/blogs/news/generative-ai-rinna-japanese-llm-on-amazon-sagemaker-jumpstart/)
 - [elyza/ELYZA-japanese-Llama-2-7b-instruct](https://github.com/aws-samples/aws-ml-jp/blob/f57da0343d696d740bb980dc16ebf28b1221f90e/tasks/generative-ai/text-to-text/fine-tuning/instruction-tuning/Transformers/Elyza_Inference_TGI_ja.ipynb)

When deploying the target solution with a pre-deployed SageMaker endpoint, you can specify it in `cdk.json` as follows:

endpointNames is a list of SageMaker endpoint names. (e.g., `elyza-llama-2,rinna`)
To specify the template for constructing prompts in the backend, you need to include the type of prompt in the endpoint name. (e.g., `llama-2`, `rinna`, etc.) For details, refer to `packages/cdk/lambda/utils/promptTemplates.ts`.

```bash
  "modelRegion": "<SageMaker Endpoint Region>",
  "endpointNames": ["<SageMaker Endpoint Name>"],
```

### Example of using Rinna 3.6B and Bilingual Rinna 4B

```bash
  "modelRegion": "us-west-2",
  "endpointNames": ["jumpstart-dft-hf-llm-rinna-3-6b-instruction-ppo-bf16","jumpstart-dft-bilingual-rinna-4b-instruction-ppo-bf16"],
```

### Example of using ELYZA-japanese-Llama-2-7b-instruct

```bash
  "modelRegion": "us-west-2",
  "endpointNames": ["elyza-japanese-llama-2-7b-inference"],
```

## Security-related Settings

### Disabling Self-signup

Specify `false` for `selfSignUpEnabled` in the context. (Default is `true`)

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**
```
{
  "context": {
    "selfSignUpEnabled": false,
  }
}
```

### Restricting Email Domains for Signup
Specify a list of allowed domains for allowedSignUpEmailDomains in the context (default is `null`).

Specify the value as a list of strings, and do not include "@" in each string. If the domain of the email address is the same as any of the allowed domains, signup is permitted. Specifying `null` allows all domains without any restrictions. Specifying `[]` prohibits all domains, and no email address can be registered.

When set, users with non-allowed domains will receive an error when executing "Create an account" on the Web signup screen and will not be able to sign up for GenU. Also, an error will occur when trying to "Create a user" from the Cognito service screen in the AWS Management Console.

This does not affect users already created in Cognito. It only applies to users trying to sign up or create new accounts.

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**

Configuration examples

- Example of setting to allow signup if the email address domain is `amazon.com`

```json
{
  "context": {
    "allowedSignUpEmailDomains": ["amazon.com"], // Enable by specifying allowed domains instead of null
  }
}
```

- Example of setting to allow signup if the email address domain is either `amazon.com` or `amazon.jp`

```json
{
  "context": {
    "allowedSignUpEmailDomains": ["amazon.com", "amazon.jp"], // Enable by specifying allowed domains instead of null
  }
}
```

### Enabling Restrictions with AWS WAF

#### IP Restrictions

If you want to restrict access to the web application by IP, you can enable IP restrictions using AWS WAF. In [packages/cdk/cdk.json](/packages/cdk/cdk.json), you can specify allowed IPv4 CIDRs as an array in `allowedIpV4AddressRanges`, and allowed IPv6 CIDRs as an array in `allowedIpV6AddressRanges`.

```json
  "context": {
    "allowedIpV4AddressRanges": ["192.168.0.0/24"], // Enable by specifying a list of allowed CIDRs instead of null
    "allowedIpV6AddressRanges": ["2001:0db8::/32"], // Enable by specifying a list of allowed CIDRs instead of null
```

#### Geographic Restrictions

If you want to restrict access to the web application based on the country of origin, you can enable geographic restrictions using AWS WAF. In [packages/cdk/cdk.json](/packages/cdk/cdk.json), you can specify allowed countries as an array of Country Codes in `allowedCountryCodes`.
For the Country Codes of countries to specify, please refer to [ISO 3166-2 from wikipedia](https://en.wikipedia.org/wiki/ISO_3166-2).
```json
  "context": {
    "allowedCountryCodes": ["JP"], // Enable by specifying a list of allowed countries instead of null
```

If you specify either `allowedIpV4AddressRanges` or `allowedIpV6AddressRanges` or `allowedCountryCodes` and run `npm run cdk:deploy` again, a WAF stack will be deployed in us-east-1 (AWS WAF V2 currently only supports us-east-1 when used with CloudFront). If you've never used CDK in us-east-1 before, run the following command to Bootstrap before deployment:

```bash
npx -w packages/cdk cdk bootstrap --region us-east-1
```

### SAML Authentication

You can integrate with SAML authentication features provided by IdPs such as Google Workspace or Microsoft Entra ID (formerly Azure Active Directory). Here are detailed integration procedures. Please make use of these as well.  
- [SAML integration with Google Workspace](SAML_WITH_GOOGLE_WORKSPACE.md)
- [SAML integration with Microsoft Entra ID](SAML_WITH_ENTRA_ID.md)

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**

```json
  "samlAuthEnabled": true,
  "samlCognitoDomainName": "your-preferred-name.auth.ap-northeast-1.amazoncognito.com",
  "samlCognitoFederatedIdentityProviderName": "EntraID",
```
- samlAuthEnabled : Setting this to `true` switches to a SAML-specific authentication screen. The conventional authentication function using Cognito user pools will no longer be available.
- samlCognitoDomainName : Specify the Cognito Domain name to be set in App integration of Cognito.
- samlCognitoFederatedIdentityProviderName : Specify the name of the Identity Provider to be set in Sign-in experience of Cognito.

## Enabling Monitoring Dashboard

Creates a dashboard that aggregates input/output Token counts and recent prompts, among other things.
**The dashboard is not built into GenU, but is an Amazon CloudWatch dashboard.**
The Amazon CloudWatch dashboard can be viewed from the [management console](https://console.aws.amazon.com/cloudwatch/home#dashboards).
To view the dashboard, you need to create an IAM user who can log in to the management console and has permissions to view dashboards.

Set `dashboard` in the context to `true`. (Default is `false`)

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**
```
{
  "context": {
    "dashboard": true
  }
}
```

After the change, redeploy with `npm run cdk:deploy` to reflect it. A Stack named `GenerativeAiUseCasesDashboardStack` will be deployed in the region specified by `modelRegion` in the context. The output values will be used in the following steps.

Next, set up the output of Amazon Bedrock logs. Open [Amazon Bedrock Settings](https://console.aws.amazon.com/bedrock/home#settings) and enable Model invocation logging. For Select the logging destinations, choose CloudWatch Logs only. (If you want to output to S3 as well, you can choose Both S3 and CloudWatch Logs.) Also, for Log group name, specify `GenerativeAiUseCasesDashboardStack.BedrockLogGroup` output during `npm run cdk:deploy`. (e.g., `GenerativeAiUseCasesDashboardStack-LogGroupAAAAAAAA-BBBBBBBBBBBB`) Create a new Service role with any name. Note that the Model invocation logging setting should be done in the region specified as `modelRegion` in the context.

After the setup is complete, open the `GenerativeAiUseCasesDashboardStack.DashboardUrl` output during `npm run cdk:deploy`.

## Enabling File Upload Feature

You can use the file upload feature to extract text from files such as PDF and Excel. The supported file types are csv, doc, docx, md, pdf, ppt, pptx, tsv, xlsx.

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**
```json
{
  "context": {
    "recognizeFileEnabled": true,
    "vpcId": null
  }
}
```

The file upload feature runs on ECS (Fargate). If `vpcId` is not specified, a new VPC will be created. Also, to build the container running on Fargate, Docker must be installed on the deployment machine, and the Docker daemon must be running.

If you want to use an existing VPC, specify `vpcId`.

```json
{
  "context": {
    "recognizeFileEnabled": true,
    "vpcId": "vpc-xxxxxxxxxxxxxxxxx"
  }
}
```

## Using a Custom Domain

You can use a custom domain as the URL for the website. A public hosted zone must be created in Route53 in the same AWS account. For public hosted zones, please refer to: [Working with public hosted zones - Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/AboutHZWorkingWith.html)

If you don't have a public hosted zone in the same AWS account, there are methods such as manually adding DNS records during SSL certificate verification by AWS ACM, or performing email verification. If you want to use these methods, refer to the CDK documentation for customization: [aws-cdk-lib.aws_certificatemanager module · AWS CDK](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_certificatemanager-readme.html)

Set the following values in cdk.json:

- `hostName` ... The hostname of the website. The A record will be created by CDK. You don't need to create it in advance.
- `domainName` ... The domain name of the public hosted zone created in advance
- `hostedZoneId` ... The ID of the public hosted zone created in advance

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**

```json
{
  "context": {
    "hostName": "genai",
    "domainName": "example.com",
    "hostedZoneId": "XXXXXXXXXXXXXXXXXXXX"
  }
}
```

## If you want to use Bedrock from a different AWS account

You can use Bedrock from a different AWS account. As a prerequisite, the initial deployment of GenU should be completed.

To use Bedrock from a different AWS account, you need to create one IAM role in the different AWS account. The name of the IAM role to create is arbitrary, but specify the name of the IAM role that starts with the following, created during GenU deployment, as the Principal of the IAM role created in the different account.

- `GenerativeAiUseCasesStack-APIPredictTitleService`
- `GenerativeAiUseCasesStack-APIPredictService`
- `GenerativeAiUseCasesStack-APIPredictStreamService`
- `GenerativeAiUseCasesStack-APIGenerateImageService`

If you want to check the details on how to specify the Principal, please refer to this: [AWS JSON Policy Elements: Principal](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html)

Example of Principal setting (Set in the different account)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::111111111111:role/GenerativeAiUseCasesStack-APIPredictTitleServiceXXX-XXXXXXXXXXXX",
                    "arn:aws:iam::111111111111:role/GenerativeAiUseCasesStack-APIPredictServiceXXXXXXXX-XXXXXXXXXXXX",
                    "arn:aws:iam::111111111111:role/GenerativeAiUseCasesStack-APIPredictStreamServiceXX-XXXXXXXXXXXX",
                    "arn:aws:iam::111111111111:role/GenerativeAiUseCasesStack-APIGenerateImageServiceXX-XXXXXXXXXXXX"
                ]
            },
            "Action": "sts:AssumeRole",
            "Condition": {}
        }
    ]
}
```

Set the following values in cdk.json:

- `crossAccountBedrockRoleArn` ... The ARN of the IAM role created in advance in the different account

**Edit [packages/cdk/cdk.json](/packages/cdk/cdk.json)**

```json
{
  "context": {
    "crossAccountBedrockRoleArn": "arn:aws:iam::AccountID:role/PreCreatedRoleName"
  }
}
```

Example of cdk.json configuration

```json
{
  "context": {
    "crossAccountBedrockRoleArn": "arn:aws:iam::222222222222:role/YYYYYYYYYYYYYYYYYYYYY"
  }
}
```

After changing the settings, run `npm run cdk:deploy` to reflect the changes.