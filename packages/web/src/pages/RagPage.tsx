import React, { useCallback, useEffect } from 'react';
import InputChatContent from '../components/InputChatContent';
import { create } from 'zustand';
import Alert from '../components/Alert';
import useChat from '../hooks/useChat';
import useRag from '../hooks/useRag';
import { useLocation, Link } from 'react-router-dom';
import ChatMessage from '../components/ChatMessage';
import Select from '../components/Select';
import useScroll from '../hooks/useScroll';
import BedrockIcon from '../assets/bedrock.svg?react';
import KendraIcon from '../assets/kendra.svg?react';
import { PiPlus } from 'react-icons/pi';
import { RagPageQueryParams } from '../@types/navigate';
import { MODELS } from '../hooks/useModel';
import queryString from 'query-string';

type StateType = {
  content: string;
  setContent: (c: string) => void;
};

const useRagPageState = create<StateType>((set) => {
  return {
    content: '',
    setContent: (s: string) => {
      set(() => ({
        content: s,
      }));
    },
  };
});

const RagPage: React.FC = () => {
  const { content, setContent } = useRagPageState();
  const { pathname, search } = useLocation();
  const { getModelId, setModelId } = useChat(pathname);
  const { postMessage, clear, loading, messages, isEmpty } = useRag(pathname);
  const { scrollToBottom, scrollToTop } = useScroll();
  const { modelIds: availableModels } = MODELS;
  const modelId = getModelId();

  useEffect(() => {
    const _modelId = !modelId ? availableModels[0] : modelId;
    if (search !== '') {
      const params = queryString.parse(search) as RagPageQueryParams;
      setContent(params.content ?? '');
      setModelId(
        availableModels.includes(params.modelId ?? '')
          ? params.modelId!
          : _modelId
      );
    } else {
      setModelId(_modelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableModels, modelId, search, setContent]);

  const onSend = useCallback(() => {
    postMessage(content);
    setContent('');
  }, [content, postMessage, setContent]);

  const onReset = useCallback(() => {
    clear();
    setContent('');
  }, [clear, setContent]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    } else {
      scrollToTop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
   <>
      <div className={`${!isEmpty ? 'screen:pb-36' : ''} relative`}>
        <div className="invisible my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min print:visible print:my-5 print:h-min">
          RAG Chat
        </div>

        <div className="mt-2 flex w-full items-end justify-center lg:mt-0">
          <Select
            value={modelId}
            onChange={setModelId}
            options={availableModels.map((m) => {
              return { value: m, label: m };
            })}
          />
        </div>

        {isEmpty && (
          <div className="relative flex h-[calc(100vh-9rem)] flex-col items-center justify-center">
            <div className="flex items-center gap-x-3">
              <KendraIcon className="size-[64px] fill-gray-400" />
              <PiPlus className="text-2xl text-gray-400" />
              <BedrockIcon className="fill-gray-400" />
            </div>
          </div>
        )}

        {isEmpty && (
          <div
            className={`absolute inset-x-0 top-28 m-auto flex justify-center`}>
            <Alert severity="info">
              <div>
                You can engage in chat using the RAG (Retrieval Augmented Generation) method.
              </div>
              <div>
                When a message is entered, it searches for documents in Amazon Kendra,
                and the LLM generates a response based on the retrieved documents.
              </div>
              <div className="font-bold">
                If you want to perform only Amazon Kendra search, please navigate to
                <Link className="text-aws-smile" to="/kendra">
                  this page
                </Link>
                .
              </div>
            </Alert>
          </div>
        )}

        {messages.map((chat, idx) => (
          <div key={idx}>
            <ChatMessage
              idx={idx}
              chatContent={chat}
              loading={loading && idx === messages.length - 1}
            />
            <div className="w-full border-b border-gray-300"></div>
          </div>
        ))}

        <div className="fixed bottom-0 z-0 flex w-full items-end justify-center lg:pr-64 print:hidden">
          <InputChatContent
            content={content}
            disabled={loading}
            onChangeContent={setContent}
            onSend={() => {
              onSend();
            }}
            onReset={onReset}
          />
        </div>
      </div>
    </>
  );
};

export default RagPage;
