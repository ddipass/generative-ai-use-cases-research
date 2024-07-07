import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardDemo from '../components/CardDemo';
import Button from '../components/Button';
import {
  PiChatCircleText,
  PiPencil,
  PiNote,
  PiChatsCircle,
  PiPenNib,
  PiTranslate,
  PiGlobe,
  PiImages,
  PiNotebook,
  PiPen,
  PiRobot,
  PiVideoCamera,
} from 'react-icons/pi';
import AwsIcon from '../assets/aws.svg?react';
import useInterUseCases from '../hooks/useInterUseCases';
import {
  AgentPageQueryParams,
  ChatPageQueryParams,
  EditorialPageQueryParams,
  GenerateImagePageQueryParams,
  GenerateTextPageQueryParams,
  InterUseCaseParams,
  RagPageQueryParams,
  SummarizePageQueryParams,
  TranslatePageQueryParams,
  WebContentPageQueryParams,
  VideoAnalyzerPageQueryParams,
} from '../@types/navigate';
import queryString from 'query-string';
import { MODELS } from '../hooks/useModel';

const ragEnabled: boolean = import.meta.env.VITE_APP_RAG_ENABLED === 'true';
const ragKnowledgeBaseEnabled: boolean =
  import.meta.env.VITE_APP_RAG_KNOWLEDGE_BASE_ENABLED === 'true';
const agentEnabled: boolean = import.meta.env.VITE_APP_AGENT_ENABLED === 'true';
const { multiModalModelIds } = MODELS;
const multiModalEnabled: boolean = multiModalModelIds.length > 0;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsShow, init } = useInterUseCases();

  const demoChat = () => {
    const params: ChatPageQueryParams = {
      content: `Please write a Python function that returns Fibonacci numbers. Also, explain the implementation.
The argument should be the term, and the processing should be written recursively. Please output in markdown.`,
      systemContext: '',
    };
    navigate(`/chat?${queryString.stringify(params)}`);
  };

  const demoRag = () => {
    const params: RagPageQueryParams = {
      content: `Please explain Claude's parameters and how to set them.`,
    };
    navigate(`/rag?${queryString.stringify(params)}`);
  };

  const demoRagKnowledgeBase = () => {
    const params: RagPageQueryParams = {
      content: `Please explain Claude's parameters and how to set them.`,
    };
    navigate(`/rag-knowledge-base?${queryString.stringify(params)}`);
  };

  const demoAgent = () => {
    const params: AgentPageQueryParams = {
      content: `What are typical generative ai use cases for researcher?`,
    };
    navigate(`/agent?${queryString.stringify(params)}`);
  };

  const demoGenerate = () => {
    const params: GenerateTextPageQueryParams = {
      information: `Amazon Bedrock is a fully managed service that offers a single API to choose from high-performance foundation models (FMs) provided by leading AI companies such as AI21 Labs, Anthropic, Cohere, Meta, Stability AI, and Amazon. It also features a wide range of functionalities necessary for building generative AI applications, allowing you to simplify development while maintaining privacy and security. Using Amazon Bedrock's comprehensive features, you can easily try various top FMs, privately customize them using your data with techniques such as fine-tuning and retrieval-augmented generation (RAG), and create managed agents to perform complex business tasks from booking travel and processing insurance claims to creating advertising campaigns and managing inventory. All of this can be done without writing code. Amazon Bedrock is serverless, so you don't need to manage infrastructure. You can also securely integrate and deploy generative AI capabilities into your applications using familiar AWS services.`,
      context:
        'For a presentation, please organize it into chapters in markdown format, with concise explanations for each',
    };
    navigate(`/generate?${queryString.stringify(params)}`);
  };

  const demoSummarize = () => {
    const params: SummarizePageQueryParams = {
      sentence:
        'Amazon Bedrock is a fully managed service that allows access to foundation models (FMs) provided by Amazon and major AI startup companies through an API. This enables you to choose from various FMs to find the model best suited for your use case. Amazon Bedrock serverless experience allows you to quickly start with FMs, easily try them out, privately customize FMs using your own data, and seamlessly integrate and deploy FMs into your applications using AWS tools and features. Amazon Bedrock agents are a fully managed capability that allows developers to easily create generative AI applications that can provide up-to-date answers based on their own knowledge sources and complete tasks for a wide range of use cases. Bedrock serverless experience allows you to start using it immediately, privately customize FMs using your own data, and easily integrate and deploy them into your applications using familiar AWS tools and features (including integration with Amazon SageMaker ML capabilities for experiments to test various models and pipelines to manage FMs at scale) without managing infrastructure.',
      additionalContext: '',
    };
    navigate(`/summarize?${queryString.stringify(params)}`);
  };

  const demoSummarize_scipaper = () => {
    const params: SummarizePageQueryParams = {
      sentence:
        'https://arxiv.org/html/2407.03311v1',
      additionalContext: `Your task is to generate a concise abstract for a scientific paper based on the provided detailed content of the paper. The paper content will be presented in a structured format, such as sections and paragraphs.
                          Please output the abstract in the format specified within the <output></output> XML tags, following the instructions in <instruction></instruction>.
                          When outputting the abstract, strictly adhere to the rules given within the <rule></rule> XML tags. There are no exceptions.

                          <rule>
                          * Output should be in the Markdown format 

                          <output>
                          ### Abstract

                          Brief summary...

                          </output> 
                          with a section for the Abstract.
                          * Generate a well-structured and concise abstract that captures the key points and contributions of the paper.
                          * Use proper Markdown syntax for formatting (e.g., headings, lists, bold).
                          * Avoid copying verbatim from the source material; rephrase and synthesize the information.
                          </rule>
                          <instruction>
                          Based on the provided content of the scientific paper titled "Value-Penalized Auxiliary Control from Examples for Learning without Rewards or Demonstrations", generate a concise abstract summarizing the key points, contributions, and findings of the paper.
                          </instruction>

                          <paper_content>
                          [Paste the paper content here]
                          </paper_content>`,
    };
    navigate(`/summarize?${queryString.stringify(params)}`);
  };

  const demoSummarize_chipset = () => {
    const params: SummarizePageQueryParams = {
      sentence:
        'https://www.ti.com/document-viewer/TMS320F28050/datasheet#GUID-727AB525-C803-4D7C-B916-2A6A2FF9A676/TITLE-SPRS797SPRS5843023',
      additionalContext: `Your task is to generate a concise product summary based on the provided detailed technical information about a chipset or device. The information will be presented in a structured format, such as a data sheet or technical specifications document.
                          Please output the summary in the format specified within the <output></output> XML tags, following the instructions in <instruction></instruction>.
                          When outputting the summary, strictly adhere to the rules given within the <rule></rule> XML tags. There are no exceptions.

                          <rule>
                          * Output should be in the Markdown format 

                          <output>
                          ## Product Overview

                          Brief description...

                          ## Key Features

                          - Feature 1
                          - Feature 2
                          - ...

                          ## Target Applications

                          - Application 1
                          - Application 2
                          - ...

                          </output> 

                          with sections for Product Overview, Key Features, and Target Applications.
                          * Generate a concise and well-structured summary that captures the essence of the provided technical information.
                          * Use proper Markdown syntax for formatting (e.g., headings, lists).
                          * Avoid copying verbatim from the source material; rephrase and synthesize the information.
                          </rule>

                          <instruction>
                          Based on the provided technical information, generate a concise product summary highlighting the key features and target applications of this chipset.
                          </instruction>

                          <technical_information>

                          [Paste the technical information from the data sheet here]

                          </technical_information>`,
    };
    navigate(`/summarize?${queryString.stringify(params)}`);
  };




  const demoEditorial = () => {
    const params: EditorialPageQueryParams = {
      sentence:
        'Hello. I am a perfect AI assistant to help with proofreading. Please enter any text you like.',
    };
    navigate(`/editorial?${queryString.stringify(params)}`);
  };

  const demoTranslate = () => {
    const params: TranslatePageQueryParams = {
      sentence:
        'Hello. 我是一名AI翻译助手, 请输入您要翻译的中文内容.',
      // additionalContext: '',
      // language: 'English',
    };
    navigate(`/translate?${queryString.stringify(params)}`);
  };

  const demoWebContent = () => {
    const params: WebContentPageQueryParams = {
      url: 'https://aws.amazon.com/bedrock/',
      context: '',
    };
    navigate(`/web-content?${queryString.stringify(params)}`);
  };

  const demoGenerateImage = () => {
    const params: GenerateImagePageQueryParams = {
      content: `Please output design ideas for smartphone advertisements.
Cute, stylish, user-friendly, pop culture, approachable, aimed at young people, music, photography, trendy smartphones, city background`,
    };
    navigate(`/image?${queryString.stringify(params)}`);
  };

  const demoGenerateImage_Echo1 = () => {
    const params: GenerateImagePageQueryParams = {
      content: `A modern Echo Studio speaker design with a sleek, curved form factor covered in a deep matte metallic finish, exuding a premium and sophisticated look. 
                The speaker grille features a honeycomb mesh pattern with an illuminated Echo logo in the center. 
                The overall design is minimalist and stylish, showcasing a technological aesthetic.`,
    };
    navigate(`/image?${queryString.stringify(params)}`);
  };

  const demoGenerateImage_Echo2 = () => {
    const params: GenerateImagePageQueryParams = {
      content: `An eco-friendly concept design for an Echo Dot speaker. The enclosure is made from recyclable wood material with a natural wood grain texture. 
                The speaker grille is woven from wicker, creating a visual harmony with the casing. The top has a leaf-shaped Echo logo, giving off a warm and natural vibe. 
                The design embodies environmental sustainability.
                Negative prompt: No humans or animals.`,
    };
    navigate(`/image?${queryString.stringify(params)}`);
  };

  const demoVideoAnalyzer = () => {
    const params: VideoAnalyzerPageQueryParams = {
      content:
        'Please describe what is shown in the image. If there are any words or text visible in the image, please read those as well.',
    };
    navigate(`/video?${queryString.stringify(params)}`);
  };

  const demoBlog = () => {
    setIsShow(true);
    init('Create Blog Post', [
      {
        title: 'Retrieve Reference Information',
        description: `Automatically retrieve information that will serve as a reference for the article by specifying a URL.
By setting additional context, you can extract only the information you want.`,
        path: 'web-content',
        params: {
          url: {
            value: 'https://aws.amazon.com/what-is/generative-ai/',
          },
          context: {
            value:
              'Please extract only the parts that explain the overview of generative AI, how it works, and the parts that describe AWS.',
          },
        } as InterUseCaseParams<WebContentPageQueryParams>,
      },
      {
        title: 'Generate Article',
        description:
          'Automatically generate a blog post based on the reference information. By setting the context in detail, you can make it easier to generate content that aligns with your intentions.',
        path: 'generate',
        params: {
          context: {
            value: `Please generate a blog post that explains the mechanism of generative AI and the benefits of using generative AI with AWS. When generating the article, please strictly follow the <rules></rules>.
                    <rules>
                    - Please write in markdown format with chapters.
                    - Make it an article targeted at beginners in generative AI and AWS.
                    - Don't use terms that IT beginners might not understand, or replace them with easy-to-understand words.
                    - Make it an article that shows what can be done with generative AI.
                    - Since readers won't be satisfied with too little content, please supplement with general information to increase the amount of text.
                    - Please make the text engaging for readers.
                    </rules>`,
          },
          information: {
            value: '{content}',
          },
        } as InterUseCaseParams<GenerateTextPageQueryParams>,
      },
      {
        title: 'Summarize Article',
        description:
          'Summarize the article for OGP (the article preview displayed when sharing the article link). By setting the OGP appropriately, you can correctly convey the overview of the article when it is shared.',
        path: 'summarize',
        params: {
          sentence: {
            value: '{text}',
          },
        } as InterUseCaseParams<SummarizePageQueryParams>,
      },
      {
        title: 'Generate Article Thumbnail',
        description:
          'Generate a thumbnail for OGP (the article preview displayed when sharing the article link). By setting a catchy thumbnail for OGP, you might be able to attract readers\' interest.',
        path: 'image',
        params: {
          content: {
            value: `Please generate a thumbnail image for the blog post's OGP. Make it an image that instantly conveys that it's an article about cloud or AI.
                    The summary of the blog post is set in <article></article>.
                    <article>
                    {summarizedSentence}
                    </article>`,
          },
        } as InterUseCaseParams<GenerateImagePageQueryParams>,
      },
    ]);
  };

  const demoMeetingReport = () => {
    setIsShow(true);
    init('Create Meeting Minutes', [
      {
        title: 'Transcription',
        description: `Using the "Speech Recognition" function, transcribe the conversation content from the recorded data. Please execute with any audio file of your choice.
After speech recognition is complete, press the "Format" button (the speech recognition result will be copied automatically).`,
        path: 'transcribe',
      },
      {
        title: 'Formatting',
        description:
          'Use the "Report Creator" function to format the transcribed file. It removes filler words and corrects parts where speech recognition may not have been accurate, making it easier for humans to understand.',
        path: 'generate',
        params: {
          context: {
            value: `The transcription result of the recorded data has been input, so please format it according to <rules></rules>.
                    <rules>
                    - Remove filler words.
                    - Rewrite content that appears to be misrecognized in the transcription to the correct content.
                    - If conjunctions and other words are omitted, please supplement them to make it more readable.
                    - Include the Q&A session without omission.
                    </rules>`,
          },
          information: {
            value: '{transcript}',
          },
        } as InterUseCaseParams<GenerateTextPageQueryParams>,
      },
      {
        title: 'Create Minutes',
        description:
          'Use the "Report Creator" function to generate meeting minutes. By specifying the context in detail, you can instruct the format of the minutes and the level of detail to be included.',
        path: 'generate',
        params: {
          context: {
            value: `Please create meeting minutes in markdown format based on the content of the meeting discussions.
Organize the content by chapters for each topic discussed in the meeting, summarizing the discussed content, decisions made, and action items.`,
          },
          information: {
            value: '{text}',
          },
        } as InterUseCaseParams<GenerateTextPageQueryParams>,
      },
    ]);
  };

  const demoDesigner = () => {
    setIsShow(true);
    init('Creative Industry Design', [
      {
        title: 'Retrieve Reference Information',
        description: `Automatically retrieve pertinent information to be used as a reference for industrial design by specifying a URL. By providing additional contextual parameters, you can extract only the required information.`,
        path: 'web-content',
        params: {
          url: {
            value: 'https://www.cnet.com/home/smart-home/amazon-echo-dot-5th-gen-review-the-best-echo-on-a-budget/',
          },
          context: {
            value:
              'Please extract only the sections that elucidate the features of products, their functionality, their appearance, and the descriptions pertaining to the customer experience.',
          },
        } as InterUseCaseParams<WebContentPageQueryParams>,
      },
      {
        title: 'Summarize Key Features',
        description:
          'Following the Minimalist Sophistication design principles, craft prompts to instruct the stable diffusion model to generate images that embody the same stylistic qualities.',
        path: 'summarize',
        params: {
          sentence: {
            value: '{content}',
          },
          additionalContext: {
            value: `Your output summarized text must be a "Minimalist Sophistication" style prompt to guide stable diffusion model for image generation. 
            The text enclosed in <example></example> XML tags is "Minimalist Sophistication" prompt example. 
            Please learn from <example></example> to understand how to write a "Minimalist Sophistication" style prompt. 
            <example>
            A modern Echo Studio speaker design with a sleek, curved form factor covered in a deep matte metallic finish, exuding a premium and sophisticated look. 
            The speaker grille features a honeycomb mesh pattern with an illuminated Echo logo in the center. 
            The overall design is minimalist and stylish, showcasing a technological aesthetic.
            </example>`,
          },
        } as InterUseCaseParams<SummarizePageQueryParams>,
      },
      {
        title: 'Create a Design',
        description:
          'Utilize the prompts you previously formulated, adhering to the Minimalist Sophistication design principles, to instruct the stable diffusion model in generating images that capture the same stylistic qualities.',
        path: 'image',
        params: {
          content: {
            value: `Generate images that instantly communicates the new features's central theme or perspective. 
                    Enclose the summary of the key points within <new features></new features> tags, as shown:
                    <new features>
                    {summarizedSentence}
                    </new features>`,
          },
        } as InterUseCaseParams<GenerateImagePageQueryParams>,
      },
      {
        title: 'Advertise this New Design',
        description:
          'Automatically create a blog post utilizing the referenced information as a basis. By providing detailed contextual parameters, you can facilitate the generation of content that closely aligns with your intended objectives.',
        path: 'generate',
        params: {
          context: {
            value: `Please generate an advertisement blog post that explains the selling points listed in the <new features></new features> XML tag for the new product, 
                    and highlights the key benefits of using the new product compared to the old product described in the <article></article> tag.
                    When generating the article, please strictly adhere to the following <rules></rules>:
                    <rules>
                    - Write the article in markdown format with chapters.
                    - Craft the content to persuade customers to purchase the new product.
                    - Avoid using technical jargon that customers without IT knowledge might not understand, or replace complex terms with easy-to-comprehend words.
                    - Showcase what can be accomplished with the new product in the article.
                    - Ensure the writing style is engaging and captivating for the readers.
                    </rules>`,
          },
          information: {
            value: `<new features>
                    {summarizedSentence}
                    </new features>
                    <article>
                    {content}
                    </article>`,
          },
        } as InterUseCaseParams<GenerateTextPageQueryParams>,
      },
    ]);
  };


  return (
   <div className="pb-24">
      <div className="bg-aws-squid-ink flex flex-col items-center justify-center px-3 py-5 text-xl font-semibold text-white lg:flex-row">
        <AwsIcon className="mr-5 size-20" />
        Getting Started with Generative AI
      </div>

      <div className="mx-3 mb-6 mt-5 flex flex-col items-center justify-center text-xs lg:flex-row">
        <Button className="mb-2 mr-0 lg:mb-0 lg:mr-2" onClick={() => {}}>
          Try
        </Button>
        You can experience each use case by clicking.
      </div>

      <h1 className="mb-6 flex justify-center text-2xl font-bold">
        List of Use Cases
      </h1>

      <div className="mx-20 grid gap-x-20 gap-y-5 md:grid-cols-1 xl:grid-cols-2">
        <CardDemo
          label="Chat"
          onClickDemo={demoChat}
          icon={<PiChatsCircle />}
          description="You can have a conversation with an LLM in chat format. It can quickly respond to specific use cases and new use cases. It's also effective as a testing environment for prompt engineering."
        />
        {ragEnabled && (
          <CardDemo
            label="RAG Chat"
            sub="Amazon Kendra"
            onClickDemo={demoRag}
            icon={<PiChatCircleText />}
            description="RAG (Retrieval Augmented Generation) is a technique that combines information retrieval and LLM text generation, enabling effective information access. Since the LLM generates answers based on reference documents retrieved from Amazon Kendra, it's easy to implement 'LLM chat that responds to internal information'."
          />
        )}
        {ragKnowledgeBaseEnabled && (
          <CardDemo
            label="RAG Chat"
            sub="Knowledge Base"
            onClickDemo={demoRagKnowledgeBase}
            icon={<PiChatCircleText />}
            description="RAG (Retrieval Augmented Generation) is a technique that combines information retrieval and LLM text generation, enabling effective information access. It retrieves reference documents using Knowledge Base's Hybrid Search, and the LLM generates answers."
          />
        )}
        {agentEnabled && (
          <CardDemo
            label="Agent Chat"
            onClickDemo={demoAgent}
            icon={<PiRobot />}
            description="In the Agent Chat use case, you can use Agent for Amazon Bedrock to execute actions and refer to the vector database of Knowledge base for Amazon Bedrock."
          />
        )}
        <CardDemo
          label="Report Creator"
          onClickDemo={demoGenerate}
          icon={<PiPencil />}
          description="Generating text in any context is one of the tasks that LLMs excel at. It can handle various contexts such as articles, reports, emails, and more."
        />
        <CardDemo
          label="Summarization"
          onClickDemo={demoSummarize}
          icon={<PiNote />}
          description="LLMs are good at summarizing large amounts of text. When summarizing, you can provide context such as 'in one line' or 'in words that even a child can understand'."
        />
        <CardDemo
          label="Summarization (Understand Chipset Usage)"
          onClickDemo={demoSummarize_chipset}
          icon={<PiNote />}
          description="LLMs can generate concise product summaries in easy-to-understand language by summarizing detailed technical specifications like datasheets, highlighting key features and target applications in a structured markdown output."
        />
        <CardDemo
          label="Summarization (Generate Sci-Paper Abstract)"
          onClickDemo={demoSummarize_scipaper}
          icon={<PiNote />}
          description="LLMs can generate concise paper abstracts that capture the key points and contributions in easy-to-understand language by summarizing the detailed content of scientific papers, including sections, equations, and figures."
        />
        <CardDemo
          label="Proofreading"
          onClickDemo={demoEditorial}
          icon={<PiPenNib />}
          description="LLMs can not only check for typos and omissions but also suggest improvements from a more objective perspective, considering the flow and content of the text. You can expect to improve quality by having the LLM objectively check for points you might not have noticed yourself before showing it to others."
        />
        <CardDemo
          label="Translation"
          onClickDemo={demoTranslate}
          icon={<PiTranslate />}
          description="LLMs trained in multiple languages can also perform translation. Moreover, it's possible to reflect various specified context information such as casualness and target audience in the translation, not just simple translation."
        />
        <CardDemo
          label="Web Content Extraction"
          onClickDemo={demoWebContent}
          icon={<PiGlobe />}
          description="Extracts web content such as blogs and documents. The LLM trims unnecessary information and formats it as a coherent text. The extracted content can be used in other use cases such as summarization and translation."
        />
        <CardDemo
          label="Image Generation"
          onClickDemo={demoGenerateImage}
          icon={<PiImages />}
          description="Image generation AI can create new images based on text or existing images. It allows for instant visualization of ideas and can be expected to streamline design work. In this feature, you can get assistance from the LLM in creating prompts."
        />
        <CardDemo
          label="Image Generation (New Echo: Minimalist Sophistication)"
          onClickDemo={demoGenerateImage_Echo1}
          icon={<PiImages />}
          description="Leverage image generation AI to visualize a new Echo product embodying the 'Minimalist Sophistication' design principles. The language model will assist in crafting prompts to guide the generation of conceptual visuals streamlining the design process."
        />
        <CardDemo
          label="Image Generation (New Echo: Eco-friendly Naturalism)"
          onClickDemo={demoGenerateImage_Echo2}
          icon={<PiImages />}
          description="Leverage image generation AI to visualize an eco-friendly and nature-inspired new Echo product design. The language model will assist in crafting prompts that capture organic forms, natural materials, and sustainable aesthetics, facilitating an efficient eco-conscious design process."
        />
        {multiModalEnabled && (
          <CardDemo
            label="Video Analysis"
            onClickDemo={demoVideoAnalyzer}
            icon={<PiVideoCamera />}
            description="With multimodal models, it's now possible to input not only text but also images. In this feature, we ask the LLM to analyze using video image frames and text as input."
          />
        )}
      </div>

      <h1 className="mb-6 mt-12 flex justify-center text-2xl font-bold">
        Use Case Integration
      </h1>

      <div className="mx-20 grid gap-x-20 gap-y-5 md:grid-cols-1 xl:grid-cols-2">
        <CardDemo
          label="Blog Post Creation"
          onClickDemo={demoBlog}
          icon={<PiPen />}
          description="Combines multiple use cases to generate a blog post. By also automatically generating an article summary and thumbnail image, it becomes easier to set up OGP. As an example, it generates a blog post introducing generative AI based on information from the AWS official website."
        />
        <CardDemo
          label="Meeting Minutes Creation"
          onClickDemo={demoMeetingReport}
          icon={<PiNotebook />}
          description="Combines multiple use cases to automatically create meeting minutes from audio recordings of meetings. It's possible to perform transcription of the audio data, formatting of the transcription results, and creation of minutes without incurring human costs."
        />

        <CardDemo
          label="Industry Design Creation"
          onClickDemo={demoDesigner}
          icon={<PiNotebook />}
          description="It combines multiple use cases to automatically generate new product designs based on the URL of an existing product. It enables summarizing key features of the old product, ideating and visualizing new product features, as well as creating designs and advertisements for the new product."
        />

      </div>
    </div>
  );
};

export default LandingPage;
