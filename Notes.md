
# 去掉recognize-file的docker容器过小的问题

packages/cdk/lib/construct/recognize-file.ts 

      ephemeralStorageGiB: 100,


# 修正History中日文摘要的问题





# 系统关键字修改

generative-ai-use-cases-jp

# 修改日文提示 （1）

Dir = packages/cdk/lambda/ 下所有文件的修改

queryKendra.ts

        EqualsTo: {
          Key: '_language_code',
          Value: {
            StringValue: 'en',
            // StringValue: 'ja',
          },

retrieveKendra.ts

        EqualsTo: {
          Key: '_language_code',
          Value: {
            StringValue: 'en',
            // StringValue: 'ja',
          },
        },

startTranscription.ts

      LanguageOptions: ['ja-JP', 'en-US', 'zh-CN', 'zh-TW'],
      // LanguageOptions: ['ja-JP', 'en-US'],


# 修改日文提示 （2）

Dir = packages/cdk/lambda/utils 下所有文件的修改

bedrockAgentApi.ts

yield 'Please try again later as we are experiencing high traffic at the moment.';
// yield 'ただいまアクセスが集中しているため時間をおいて試してみてください。';

yield 'An error occurred. Please try again later.';
// yield 'エラーが発生しました。時間をおいて試してみてください。';

bedrockApi.ts

throw new Error('Failed to obtain authentication credentials.');
// throw new Error('認証情報を取得できませんでした。');

throw new Error('The authentication credentials received from STS are incomplete.');
// throw new Error('STSからの認証情報が不完全です。');      

yield 'Please try again later as we are experiencing high traffic at the moment.';
// yield 'ただいまアクセスが集中しているため時間をおいて試してみてください。';

yield 'An error occurred. Please try again later.';
// yield 'エラーが発生しました。時間をおいて試してみてください。';

models.ts

system: '\n\nHuman: {}\n\nAssistant: Context understood.',
// system: '\n\nHuman: {}\n\nAssistant: コンテキストを理解しました。',

system: 'User: {}\nBot: Context understood.',
// system: 'User: {}\nBot: コンテキストを理解しました。',

system: '{} [/INST]\nContext understood.</s>\n[INST] ',
// system: '{} [/INST]\nコンテキストを理解しました。</s>\n[INST] ',

suffix: 'System: ',
// suffix: 'システム: ',
user: 'User: {}',
// user: 'ユーザー: {}',
assistant: 'System: {}',
// assistant: 'システム: {}',
system: 'System: {}',
// system: 'システム: {}',

suffix: 'System: ',
// suffix: 'システム: ',
user: 'User: {}',
// user: 'ユーザー: {}',
assistant: 'System: {}',
// assistant: 'システム: {}',
system: 'System: {}',
// system: 'システム: {}',

# 修改日文提示 （3）

Dir = packages/cdk/lib/ 下所有文件的修改

generative-ai-use-cases-stack.ts

const errorMessageForBooleanContext = (key: string) => {
  return `An error occurred while setting ${key}. Possible causes are:
   - cdk.json Trying to set it via the -c option instead of modifying cdk.json
   - cdk.json Setting a non-boolean value in cdk.json (e.g., "true" double quotes are unnecessary)
   - cdk.json The item is not present in cdk.json (not set)`;
  // return `${key} の設定でエラーになりました。原因として考えられるものは以下です。
 // - cdk.json の変更ではなく、-c オプションで設定しようとしている
 // - cdk.json に boolean ではない値を設定している (例: "true" ダブルクォートは不要)
 // - cdk.json に項目がない (未設定)`;
};

rag-knowledge-base-stack.ts

      throw new Error(
      	'Knowledge Base RAG is enabled but embeddingModelId is not specified'
        // 'Knowledge Base RAG が有効になっていますが、embeddingModelId が指定されていません'
      );

      throw new Error(
        `embeddingModelId has an invalid value (valid embeddingModelIds are ${EMBEDDING_MODELS})`
        // `embeddingModelId が無効な値です (有効な embeddingModelId ${EMBEDDING_MODELS})`
      );

# 修改日文提示 （4）

Dir = packages/cdk/lib/construct 下所有文件的修改

agent.ts

      instruction:
       'You are an assistant who responds to instructions. If you have enough information to respond to the instruction, answer immediately. If you do not have enough information, perform a search to obtain the necessary information and then answer. You can perform multiple searches if needed.',
      // instruction:
      //  'あなたは指示に応えるアシスタントです。 指示に応えるために必要な情報が十分な場合はすぐに回答し、不十分な場合は検索を行い必要な情報を入手し回答してください。複数回検索することが可能です。',

# 修改日文提示 （5）

Dir = packages/cdk/assets/api-schema 下所有文件的修改

api-schema.json

				"description": "Perform a search using keywords to obtain information. This can be used for tasks such as investigating, researching, explaining, or summarizing. Please infer the search keywords from the conversation. The search results may include irrelevant content, so please base your answer only on the most relevant information. You can perform multiple searches if needed.",
                "description": "キーワードで検索し情報を取得します。調査、調べる、Xについて教える、まとめるといったタスクで利用できます。会話から検索キーワードを推測してください。検索結果には関連度の低い内容も含まれているため関連度の高い内容のみを参考に回答してください。複数回実行可能です。",
                "operationId": "Search",

                                        "description": "Search keywords"
                                        // "description": "検索キーワード"

                        "description": "检索结果",
                        // "description": "検索結果",

                                            "description": "检索结果"
                                            // "description": "検索結果"

# 修改日文提示 （6）

Dir = packages/web/ 下所有文件的修改

vite.config.ts

        description:
          'Implementation of business use case applications utilizing Generative AI',
        // description:
        //   'Generative AI を活用したビジネスユースケースのアプリケーション実装',

# 修改日文提示 （7）

Dir = packages/web/src 下所有文件的修改

App.tsx

    label: 'Home',
    // label: 'ホーム',

    label: 'Configure',
    // label: '設定情報',

    label: 'Chat',
    // label: 'チャット',

        label: 'Chat RAG',
        // label: 'RAG チャット',

        label: 'Chat RAG',
        // label: 'RAG チャット',

        label: 'Chat Agent',
        // label: 'Agent チャット',

    label: 'Report Creator',
    // label: '文章生成',

    label: 'Summarize',
    // label: '要約',

    label: 'Editorial',
    // label: '校正',

    label: 'Translate',
    // label: '翻訳',

    label: 'GenAI Web Search',
    // label: 'Web コンテンツ抽出',

    label: 'Image Creator',
    // label: '画像生成',

        label: 'Video Chat',
        // label: '映像分析',

    label: 'Voice Chat',
    // label: '音声認識',

        label: 'File Upload',
        // label: 'ファイルアップロード',

        label: 'Kendra RAG',
        // label: 'Kendra 検索',

# 修改日文提示 （8）

Dir = packages/web/src/prompts 下所有文件的修改

mistral.ts (暂时不翻译)

cp claude.ts to claude-en.ts (翻译claude-en.ts)

# 修改日文提示 （9）

Dir = packages/web/src/hooks/useRag.ts

      pushMessage('assistant', 'Retrieving reference documents from Kendra...');
      // pushMessage('assistant', 'Kendra から参照ドキュメントを取得中...');

        pushMessage(
          'assistant',
          `No reference documents were found. Please consider the following actions:
          - Check if the target documents have been added to the Amazon Kendra data source
          - Verify if the Amazon Kendra data source has been synced
          - Modify the input expression`
        );
        // pushMessage(
        //   'assistant',
        //   `参考ドキュメントが見つかりませんでした。次の対応を検討してください。
        //   - Amazon Kendra の data source に対象のドキュメントが追加されているか確認する
        //   - Amazon Kendra の data source が sync されているか確認する
        //   - 入力の表現を変更する`
        // );

                      ? `(Page ${_excerpt_page_number})`
                      // ? `(${_excerpt_page_number} ページ)`

Dir = packages/web/src/hooks/useRagKnowledgeBase.ts

      // pushMessage(
      //   'assistant',
      //   'Knowledge base から参考ドキュメントを取得中...'
      // );
      pushMessage(
        'assistant',
        'Retrieving reference documents from Knowledge base...'
      );

        // pushMessage(
        //   'assistant',
        //   `Retrieve 時にエラーになりました。次の対応を検討してください。
        //    - cdk.json で指定した embeddingModelId のモデルが Amazon Bedrock (${modelRegion}) で有効になっているか確認`
        // );
        pushMessage(
          'assistant',
          `An error occurred during retrieval. Please consider the following action:
           - Check if the model with the embeddingModelId specified in cdk.json is enabled in Amazon Bedrock (${modelRegion})`
        );

        // pushMessage(
        //   'assistant',
        //   `参考ドキュメントが見つかりませんでした。次の対応を検討してください。
        //    - Bedrock Knowledge bases の data source に対象のドキュメントが追加されているか確認する
        //    - Bedrock Knowledge bases の data source が sync されているか確認する
        //    - 入力の表現を変更する`
        // );
        pushMessage(
          'assistant',
          `No reference documents were found. Please consider the following actions:
           - Check if the target documents have been added to the Bedrock Knowledge bases data source
           - Verify if the Bedrock Knowledge bases data source has been synced
           - Modify the input expression`
        );

# 修改日文提示 （10）

Dir = packages/web/src/components/

ButtonSendToUseCase.tsx

            title="Select Use Case"
            // title="ユースケースを選択"

                title="Chat"
                // title="チャット"

                title="Text Generation"
                // title="文章生成"

                title="Summary"
                // title="要約"

                title="Proofreading"
                // title="校正"

                title="Translation"
                // title="翻訳"

DialogConfirmDeleteChat.tsx

    <ModalDialog {...props} title="Confirm Deletion">
      <div>
        チャット
        <span className="font-bold">「{props.target?.title}」</span>
        Are you sure you want to delete?
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button outlined onClick={props.onClose} className="p-2">
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.onDelete(decomposeId(props.target?.chatId ?? '') ?? '');
          }}
          className="bg-red-500 p-2 text-white">
          Delete
        </Button>
      </div>
    </ModalDialog>

Drawer.tsx (多处弹窗修改)

GenerateImageAssistant.tsx (多处弹窗修改)

InputChatContent.tsx (多处弹窗修改)

PromptList.tsx (多处弹窗修改)

SketchPad.tsx (多处弹窗修改)

TextEditor.tsx (多处弹窗修改)
 

# 修改日文提示 （11）

Dir = packages/web/src/pages/

AgentChatPage.tsx

      return 'Agent チャット';
      return 'Chat Agent';

ChatPage.tsx

      return 'チャット';
      return 'Chat';

                ファイルをドロップしてアップロード
                Drop files to upload

                  {share ? <>シェア中</> : <>シェアする</>}
                  {share ? <>Sharing</> : <>Share</>}

              label="システムコンテキストの表示"
              label="Display system context"

              label="システムコンテキスト"
              label="System Context"

                    初期化
                    Initialize

                    保存
                    Save

        title="システムコンテキストの作成"
        title="Create system context"

          placeholder="入力してください"
          placeholder="Please Enter"

			システムコンテキスト
			System Context

			入力してください
			Please Enter

            作成
            Create

        title="会話履歴のシェア"
        title="Share conversation history"

            <>リンクを削除することで、会話履歴の公開を停止できます。</>
            <>You can stop sharing the conversation history by deleting the link.</>

              リンクを作成することで、このアプリケーションにログイン可能な全ユーザーに対して会話履歴を公開します。
              By creating this link, you will share the conversation with all users who can log in to this application.

                リンクを開く
                Open Link

                リンクの削除
                Delete Link

              リンクの作成
              Create Link

EditorialPage.tsx

        校正
        Proofreading

        <Card label="校正したい文章">
        <Card label="Text to proofread">

            <Switch label="自動校正" checked={auto} onSwitch={setAuto} />
            <Switch label="Auto-proofread" checked={auto} onSwitch={setAuto} />

            placeholder="入力してください"
            placeholder="Please enter"

          <ExpandableField label="追加コンテキスト" optional>
          <ExpandableField label="Additional context" optional>

              placeholder="追加で指摘してほしい点を入力することができます"
              placeholder="You can enter additional points you want to be addressed"

              クリア
              Clear

              実行
              Execute

FileUploadPage.tsx

        ファイルアップロード
        File Upload

        <Card label="ファイルアップロード">
        <Card label="File Upload">

            csv, doc, docx, md, pdf, ppt, pptx, tsv, xlsx ファイルが利用可能です
            csv, doc, docx, md, pdf, ppt, pptx, tsv, xlsx files are allowed.

              クリア
              Clear

              実行
              Execute

                ファイル認識結果がここに表示されます
                File recognition results will be displayed here

GenerateImagePage.tsx (多处弹窗修改)

GenerateTextPage.tsx (多处弹窗修改)

KendraSearchPage.tsx (多处弹窗修改)

LandingPage.tsx (多处弹窗修改)

RagKnowledgeBasePage.tsx (多处弹窗修改)

RagPage.tsx (多处弹窗修改)

Setting.tsx (多处弹窗修改)

SharedChatPage.tsx (多处弹窗修改)

SummarizePage.tsx (多处弹窗修改)

TranscribePage.tsx (多处弹窗修改)

TranslatePage.tsx (多处弹窗修改)

VideoAnalyzerPage.tsx (多处弹窗修改)

WebContent.tsx (多处弹窗修改) 


# 引用修改 （1）

Dir = packages/web/src/prompts/index.ts

//import { claudePrompter } from './claude';
import { claudePrompter } from './claude-en';

# 引用修改 （2）

Dir = packages/web/src/hooks/useGitHub.ts

        '/repos/ddipass/generative-ai-use-cases-research/pulls?state=close'
        //'/repos/aws-samples/generative-ai-use-cases-jp/pulls?state=close',

# 引用修改 （3）

Dir = packages/web/src/hooks/useVersion.ts

const PACKAGE_JSON_URL =
  'https://raw.githubusercontent.com/ddipass/generative-ai-use-cases-research/main/package.json';
// const PACKAGE_JSON_URL =
//   'https://raw.githubusercontent.com/aws-samples/generative-ai-use-cases-jp/main/package.json';

# 说明文档修订（1）



