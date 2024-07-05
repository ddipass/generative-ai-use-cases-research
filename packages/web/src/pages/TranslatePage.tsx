import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import ExpandableField from '../components/ExpandableField';
import Select from '../components/Select';
import Markdown from '../components/Markdown';
import ButtonCopy from '../components/ButtonCopy';
import Switch from '../components/Switch';
import useChat from '../hooks/useChat';
import useMicrophone from '../hooks/useMicrophone';
import useTyping from '../hooks/useTyping';
import useLocalStorageBoolean from '../hooks/useLocalStorageBoolean';
import { PiMicrophone, PiMicrophoneSlash } from 'react-icons/pi';
import { create } from 'zustand';
import debounce from 'lodash.debounce';
import { TranslatePageQueryParams } from '../@types/navigate';
import { MODELS } from '../hooks/useModel';
import { getPrompter } from '../prompts';
import queryString from 'query-string';

const languages = [
  'English',
  'Japanese',
  'Chinese',
  'Korean',
  'French',
  'Spanish',
  'German',
];

type StateType = {
  sentence: string;
  setSentence: (s: string) => void;
  additionalContext: string;
  setAdditionalContext: (s: string) => void;
  language: string;
  setLanguage: (s: string) => void;
  translatedSentence: string;
  setTranslatedSentence: (s: string) => void;
  clear: () => void;
};

const useTranslatePageState = create<StateType>((set) => {
  const INIT_STATE = {
    sentence: '',
    additionalContext: '',
    language: languages[0],
    translatedSentence: '',
  };
  return {
    ...INIT_STATE,
    setSentence: (s: string) => {
      set(() => ({
        sentence: s,
      }));
    },
    setAdditionalContext: (s: string) => {
      set(() => ({
        additionalContext: s,
      }));
    },
    setLanguage: (s: string) => {
      set(() => ({
        language: s,
      }));
    },
    setTranslatedSentence: (s: string) => {
      set(() => ({
        translatedSentence: s,
      }));
    },
    clear: () => {
      set(INIT_STATE);
    },
  };
});

const TranslatePage: React.FC = () => {
  const {
    sentence,
    setSentence,
    additionalContext,
    setAdditionalContext,
    language,
    setLanguage,
    translatedSentence,
    setTranslatedSentence,
    clear,
  } = useTranslatePageState();
  const {
    startTranscription,
    stopTranscription,
    transcriptMic,
    recording,
    clearTranscripts,
  } = useMicrophone();
  const { pathname, search } = useLocation();
  const {
    getModelId,
    setModelId,
    loading,
    messages,
    postChat,
    clear: clearChat,
    updateSystemContextByModel,
  } = useChat(pathname);
  const { setTypingTextInput, typingTextOutput } = useTyping(loading);
  const { modelIds: availableModels } = MODELS;
  const modelId = getModelId();
  const prompter = useMemo(() => {
    return getPrompter(modelId);
  }, [modelId]);
  const [auto, setAuto] = useLocalStorageBoolean('Auto_Translate', true);
  // const [audio, setAudioInput] = useState(false); // 音声入力フラグ

  useEffect(() => {
    updateSystemContextByModel();
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [prompter]);

  // Memo 変数
  const disabledExec = useMemo(() => {
    return loading;
  }, [loading]);

  useEffect(() => {
    const _modelId = !modelId ? availableModels[0] : modelId;
    if (search !== '') {
      const params = queryString.parse(search) as TranslatePageQueryParams;
      setSentence(params.sentence ?? '');
      setAdditionalContext(params.additionalContext ?? '');
      setLanguage(params.language || languages[0]);
      setModelId(
        availableModels.includes(params.modelId ?? '')
          ? params.modelId!
          : _modelId
      );
    } else {
      setModelId(_modelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setSentence,
    setAdditionalContext,
    setLanguage,
    modelId,
    availableModels,
    search,
  ]);

  useEffect(() => {
    setTypingTextInput(translatedSentence);
  }, [translatedSentence, setTypingTextInput]);

  // 文章の更新時にコメントを更新
  useEffect(() => {
    if (auto) {
      // debounce した後翻訳
      onSentenceChange(sentence, additionalContext, language, loading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentence, language]);

  // debounce した後翻訳
  // 入力を止めて1秒ほど待ってから翻訳リクエストを送信
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSentenceChange = useCallback(
    debounce(
      (
        _sentence: string,
        _additionalContext: string,
        _language: string,
        _loading: boolean
      ) => {
        if (_sentence === '') {
          setTranslatedSentence('');
        }
        if (_sentence !== '' && !_loading) {
          getTranslation(_sentence, _language, _additionalContext);
        }
      },
      1000
    ),
    [prompter]
  );

  // リアルタイムにレスポンスを表示
  useEffect(() => {
    if (messages.length === 0) return;
    const _lastMessage = messages[messages.length - 1];
    if (_lastMessage.role !== 'assistant') return;
    const _response = messages[messages.length - 1].content;
    setTranslatedSentence(_response.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // 音声入力フラグの切り替え
  // audioのトグルボタンがOnになったら、startTranscriptionを実行する
  useEffect(() => {
    if (recording) {
      startTranscription();
    } else {
      stopTranscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  // // 録音機能がエラー終了した時にトグルスイッチをOFFにする
  // useEffect(() => {
  //   if (!recording) {
  //     setAudioInput(false);
  //   }
  // }, [recording]);

  // // transcribeの要素が追加された時の処理. 左のボックスに自動入力する
  // useEffect(() => {
  //   // transcriptMic[*].transcriptが重複していたら削除する
  //   const combinedTranscript = Array.from(
  //     new Set(transcriptMic.map((t) => t.transcript))
  //   ).join('');

  //   if (combinedTranscript.length > 0) {
  //     setSentence(combinedTranscript);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [transcriptMic]);

  // transcribeの要素が追加された時の処理. 左のボックスに自動入力する
  useEffect(() => {
    if (transcriptMic && transcriptMic.length > 0) {
      const _content: string = transcriptMic.map((t) => t.transcript).join(' ');
      setSentence(_content);
    }
  }, [setSentence, transcriptMic]);

  // LLM にリクエスト送信
  const getTranslation = (
    sentence: string,
    language: string,
    context: string
  ) => {
    postChat(
      prompter.translatePrompt({
        sentence,
        language,
        context: context === '' ? undefined : context,
      }),
      true
    );
  };

  // 翻訳を実行
  const onClickExec = useCallback(() => {
    if (loading) return;
    getTranslation(sentence, language, additionalContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentence, additionalContext, loading, prompter]);

  // リセット
  const onClickClear = useCallback(() => {
    clear();
    clearChat();
    clearTranscripts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
   <div className="grid grid-cols-12">
      <div className="invisible col-span-12 my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min print:visible print:my-5 print:h-min">
        Translation
      </div>
      <div className="col-span-12 col-start-1 mx-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
        <Card label="Text to translate">
          <div className="flex w-full flex-col justify-between sm:flex-row">
            <Select
              value={modelId}
              onChange={setModelId}
              options={availableModels.map((m) => {
                return { value: m, label: m };
              })}
            />
            <div className="col-span-12 col-start-1 mx-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
              <Switch label="Auto-translate" checked={auto} onSwitch={setAuto} />
            </div>
          </div>
          <div className="flex w-full flex-col lg:flex-row">
            <div className="w-full">
              <div className="flex items-center py-2.5">
                <div className="ml-2 justify-end">
                  {recording ? (
                    <Button disabled={disabledExec} onClick={stopTranscription}>
                      <PiMicrophone className="h-5 w-5 cursor-pointer text-orange-500"/> Voice Recognition Active
                    </Button>
                  ) : (
                    <Button
                      outlined
                      disabled={disabledExec}
                      onClick={startTranscription}>
                      <PiMicrophoneSlash className="h-5 w-5 cursor-pointer"/> Voice Recognition Inactive
                    </Button>
                  )}
                </div>
              </div>

              <Textarea
                placeholder="Please Enter"
                value={sentence}
                onChange={setSentence}
                maxHeight={-1}
              />
            </div>
            <div className="w-full lg:ml-2">
              <Select
                value={language}
                options={languages.map((l) => {
                  return { value: l, label: l };
                })}
                onChange={setLanguage}
              />
              <div className="rounded border border-black/30 p-1.5">
                <Markdown>{typingTextOutput}</Markdown>
                {loading && (
                  <div className="border-aws-sky size-5 animate-spin rounded-full border-4 border-t-transparent"></div>
                )}
                <div className="flex w-full justify-end">
                  <ButtonCopy
                    text={translatedSentence}
                    interUseCasesKey="translatedSentence"></ButtonCopy>
                </div>
              </div>
            </div>
          </div>

          <ExpandableField label="Additional Context" optional>
            <Textarea
              placeholder="You can enter additional points you want to be considered (e.g., casualness)"
              value={additionalContext}
              onChange={setAdditionalContext}
            />
          </ExpandableField>

          <div className="flex justify-end gap-3">
            <Button outlined onClick={onClickClear} disabled={disabledExec}>
              Clear
            </Button>

            <Button disabled={disabledExec} onClick={onClickExec}>
              Execute
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TranslatePage;
