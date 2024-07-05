Here's the translation with Japanese parts translated to English while preserving other content and format:

> [!IMPORTANT]
> This repository is currently developed for Japanese users. If you wish for multilingual support, please react to [this issue](https://github.com/aws-samples/generative-ai-use-cases-jp/issues/151).

# Generative AI Use Cases JP (Abbreviation: GenU)

Generative AI brings revolutionary possibilities for business transformation. GenU is an application implementation with a collection of business use cases for safely utilizing generative AI in business operations.

![sc_lp.png](/imgs/sc_lp.png)

This repository also provides a browser extension, allowing you to use generative AI more conveniently. For more details, please see [this page](/browser-extension/README.md).

> **As generative AI evolves, we often make disruptive changes. If you encounter errors, first check if there are any updates to the main branch.**

## List of Use Cases

> Use cases will be added regularly. If you have any requests, please create an [Issue](https://github.com/aws-samples/generative-ai-use-cases-jp/issues).

<details>
  <summary>Chat</summary>

  You can have a conversation with a large language model (LLM) in chat format. Thanks to platforms that allow direct interaction with LLMs, we can quickly respond to specific use cases and new use cases. It's also effective as a testing environment for prompt engineering.

  <img src="/imgs/usecase_chat.gif"/>
</details>

<details>
   <summary>RAG Chat</summary>

  RAG is a method that allows LLMs to answer questions they normally couldn't by providing external up-to-date information and domain knowledge that LLMs typically struggle with. At the same time, it has the effect of preventing LLMs from giving "plausible but incorrect information" by only allowing answers based on evidence. For example, if you provide internal documents to an LLM, you can automate internal inquiry responses. This repository retrieves information from either Amazon Kendra or Knowledge Base.

  <img src="/imgs/usecase_rag.gif"/>
</details>

<details>
   <summary>Agent Chat</summary>

  Agent is a method that enables LLMs to perform various tasks by integrating with APIs. In this solution, we have implemented an Agent as a sample implementation that uses a search engine to research necessary information and provide answers.

  <img src="/imgs/usecase_agent.gif"/>
</details>

<details>
   <summary>Text Generation</summary>

   Generating text in any context is one of the tasks that LLMs excel at. It can handle various contexts such as articles, reports, emails, and more.

  <img src="/imgs/usecase_generate_text.gif"/>
</details>

<details>
  <summary>Summarization</summary>

  LLMs are good at summarizing large amounts of text. Not only can they summarize, but they can also extract necessary information in a conversational format after being given the text as context. For example, it's possible to read a contract and retrieve information like "What are the conditions for XXX?" or "What's the amount for YYY?".

  <img src="/imgs/usecase_summarize.gif"/>
</details>

<details>
  <summary>Proofreading</summary>

  LLMs can not only check for typos and omissions but also suggest improvements from a more objective perspective, considering the flow and content of the text. You can expect to improve quality by having the LLM objectively check for points you might not have noticed yourself before showing it to others.

  <img src="/imgs/usecase_editorial.gif"/>
</details>

<details>
  <summary>Translation</summary>

  LLMs trained in multiple languages can also perform translation. Moreover, it's possible to reflect various specified context information such as casualness and target audience in the translation, not just simple translation.

  <img src="/imgs/usecase_translate.gif"/>
</details>

<details>
  <summary>Web Content Extraction</summary>

  Extracts web content such as blogs and documents. The LLM trims unnecessary information and formats it as a coherent text. The extracted content can be used in other use cases such as summarization and translation.

  <img src="/imgs/usecase_web_content.gif"/>
</details>


<details>
  <summary>Image Generation</summary>

  Image generation AI can create new images based on text or existing images. It allows for instant visualization of ideas and can be expected to streamline design work. In this feature, you can get assistance from the LLM in creating prompts.

  <img src="/imgs/usecase_generate_image.gif"/>
</details>


<details>
  <summary>Video Analysis</summary>

  With multimodal models, it's now possible to input not only text but also images. In this feature, we ask the LLM to analyze using video image frames and text as input.

  <img src="/imgs/usecase_video_analyzer.gif"/>
</details>


## Architecture

This implementation uses React for the frontend, with static files delivered by Amazon CloudFront + Amazon S3. The backend uses Amazon API Gateway + AWS Lambda, and authentication uses Amazon Cognito. Also, Amazon Bedrock is used for the LLM. Amazon Kendra is used as the data source for RAG.

![arch.drawio.png](/imgs/arch.drawio.png)

## Deployment

> [!IMPORTANT]
> In this repository, the default model settings use Anthropic Claude 3 Sonnet (for text generation) and Stability AI's SDXL 1.0 (for image generation) in the Northern Virginia region (us-east-1). Open the [Model access screen (us-east-1)](https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess), check Anthropic Claude 3 Sonnet, and click Save changes. For instructions on how to change settings to use other models (such as Anthropic Claude 3 Haiku, Meta Llama3, Cohere Command-R, etc.), please refer to [Changing Amazon Bedrock Models](/docs/DEPLOY_OPTION.md#changing-amazon-bedrock-models).

GenU deployment uses [AWS Cloud Development Kit](https://aws.amazon.com/jp/cdk/) (hereafter CDK). For step-by-step explanations or if you want to use other deployment methods, please refer to the following:
- [Workshop](https://catalog.workshops.aws/generative-ai-use-cases-jp)
- [Video introduction of deployment procedure](https://www.youtube.com/watch?v=9sMA17OKP1k)

First, run the following command. All commands should be executed at the root of the repository.

```bash
npm ci
```

If you've never used CDK before, you need to perform a [Bootstrap](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/bootstrapping.html) operation for the first time only. The following command is not necessary if you're in an environment that has already been bootstrapped.

```bash
npx -w packages/cdk cdk bootstrap
```

Next, deploy AWS resources with the following command. Please wait for the deployment to complete (it may take about 20 minutes).

```bash
npm run cdk:deploy
```

## [Deployment Options](/docs/DEPLOY_OPTION.md)
- [Configuration Method](/docs/DEPLOY_OPTION.md#configuration-method)
  - [How to change values in cdk.json](/docs/DEPLOY_OPTION.md#how-to-change-values-in-cdkjson)
- [Use Case Settings](/docs/DEPLOY_OPTION.md#use-case-settings)
  - [Enabling RAG Chat (Amazon Kendra) Use Case](/docs/DEPLOY_OPTION.md#enabling-rag-chat-amazon-kendra-use-case)
    - [If you want to use an existing Amazon Kendra Index](/docs/DEPLOY_OPTION.md#if-you-want-to-use-an-existing-amazon-kendra-index)
  - [Enabling RAG Chat (Knowledge Base) Use Case](/docs/DEPLOY_OPTION.md#enabling-rag-chat-knowledge-base-use-case)
    - [How to make changes to the OpenSearch Service Index, such as changing the embeddingModelId](/docs/DEPLOY_OPTION.md#how-to-make-changes-to-the-opensearch-service-index-such-as-changing-the-embeddingmodelid)
    - [How to check the OpenSearch Service Index in the management console](/docs/DEPLOY_OPTION.md#how-to-check-the-opensearch-service-index-in-the-management-console)
  - [Enabling Agent Chat Use Case](/docs/DEPLOY_OPTION.md#enabling-agent-chat-use-case)
    - [Deploying the Search Agent](/docs/DEPLOY_OPTION.md#deploying-the-search-agent)
    - [Deploying the Knowledge Base Agent](/docs/DEPLOY_OPTION.md#deploying-the-knowledge-base-agent)
  - [Enabling Video Analysis Use Case](/docs/DEPLOY_OPTION.md#enabling-video-analysis-use-case)
- [Changing Amazon Bedrock Models](/docs/DEPLOY_OPTION.md#changing-amazon-bedrock-models)
  - [Example of using Amazon Bedrock models in us-east-1 (Virginia)](/docs/DEPLOY_OPTION.md#example-of-using-amazon-bedrock-models-in-us-east-1-virginia)
  - [Example of using Amazon Bedrock models in ap-northeast-1 (Tokyo)](/docs/DEPLOY_OPTION.md#example-of-using-amazon-bedrock-models-in-ap-northeast-1-tokyo)
- [If you want to use Amazon SageMaker custom models](/docs/DEPLOY_OPTION.md#if-you-want-to-use-amazon-sagemaker-custom-models)
  - [Example of using Rinna 3.6B and Bilingual Rinna 4B](/docs/DEPLOY_OPTION.md#example-of-using-rinna-36b-and-bilingual-rinna-4b)
  - [Example of using ELYZA-japanese-Llama-2-7b-instruct](/docs/DEPLOY_OPTION.md#example-of-using-elyza-japanese-llama-2-7b-instruct)
- [Security-related Settings](/docs/DEPLOY_OPTION.md#security-related-settings)
  - [Disabling Self-signup](/docs/DEPLOY_OPTION.md#disabling-self-signup)
  - [Restricting Email Domains for Signup](/docs/DEPLOY_OPTION.md#restricting-email-domains-for-signup)
  - [Enabling Restrictions with AWS WAF](/docs/DEPLOY_OPTION.md#enabling-restrictions-with-aws-waf)
    - [IP Restrictions](/docs/DEPLOY_OPTION.md#ip-restrictions)
    - [Geographic Restrictions](/docs/DEPLOY_OPTION.md#geographic-restrictions)
  - [SAML Authentication](/docs/DEPLOY_OPTION.md#saml-authentication)
- [Enabling Monitoring Dashboard](/docs/DEPLOY_OPTION.md#enabling-monitoring-dashboard)
- [Enabling File Upload Feature](/docs/DEPLOY_OPTION.md#enabling-file-upload-feature)
- [If you want to use Bedrock from a different AWS account](/docs/DEPLOY_OPTION.md#if-you-want-to-use-bedrock-from-a-different-aws-account)

## Other
 - [How to Update](/docs/UPDATE.md)
 - [Local Development Environment Setup Procedure](/docs/DEVELOPMENT.md)
 - [How to Delete Resources](/docs/DESTROY.md)
 - [Deployment Method Entirely on AWS (for cases where it's difficult to prepare an environment locally)](/docs/DEPLOY_ON_AWS.md)
 - [How to Use as a Native App](/docs/PWA.md)
 - [Using the Browser Extension](/browser-extension/README.md)

## Cost Estimation
We have published [a configuration and cost estimation example for using GenU](https://aws.amazon.com/jp/cdp/ai-chatapp/).  
This cost estimation example assumes that the RAG chat feature using Amazon Kendra is enabled.
Please note that it does not include optional features such as AWS WAF for enhanced security, file upload functionality, or options using Knowledge Base.
It is based on a pay-as-you-go model, and actual costs will vary depending on your usage.

## References
 - [Blog: How to Customize Generative AI Use Cases JP](https://aws.amazon.com/jp/blogs/news/how-to-generative-ai-use-cases-jp/)
 - [Blog: Developing an Interpreter with Amazon Bedrock!](https://aws.amazon.com/jp/builders-flash/202311/bedrock-interpreter/)
 - [Blog: Let's Have Generative AI Refuse Unreasonable Requests ~ Integrating Generative AI into the Browser ~](https://aws.amazon.com/jp/builders-flash/202405/genai-sorry-message/)
 - [Video: The Appeal and Usage of Generative AI Use Cases JP (GenU) for Thoroughly Considering Generative AI Use Cases](https://www.youtube.com/live/s1P5A2SIWgc?si=PBQ4ZHQXU4pDhL8A)

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.