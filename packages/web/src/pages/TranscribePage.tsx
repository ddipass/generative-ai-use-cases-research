import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { create } from 'zustand';
import Card from '../components/Card';
import Button from '../components/Button';
import ButtonCopy from '../components/ButtonCopy';
import ButtonSendToUseCase from '../components/ButtonSendToUseCase';
import useTranscribe from '../hooks/useTranscribe';
import useMicrophone from '../hooks/useMicrophone';
import Markdown from '../components/Markdown';
import { PiMicrophone, PiMicrophoneSlash } from 'react-icons/pi';

type StateType = {
  content: string;
  setContent: (c: string) => void;
};

const useTranscribeState = create<StateType>((set) => {
  return {
    content: '',
    setContent: (s: string) => {
      set(() => ({
        content: s,
      }));
    },
  };
});

const TranscribePage: React.FC = () => {
  const { loading, transcriptData, file, setFile, transcribe, clear } =
    useTranscribe();
  const {
    startTranscription,
    stopTranscription,
    transcriptMic,
    recording,
    clearTranscripts,
  } = useMicrophone();
  const { content, setContent } = useTranscribeState();
  const ref = useRef<HTMLInputElement>(null);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  useEffect(() => {
    if (transcriptData && transcriptData.transcript) {
      setContent(transcriptData.transcript);
    }
  }, [setContent, transcriptData]);

  useEffect(() => {
    if (transcriptMic && transcriptMic.length > 0) {
      const _content: string = transcriptMic.map((t) => t.transcript).join(' ');
      setContent(_content);
    }
  }, [setContent, transcriptMic]);

  const disabledExec = useMemo(() => {
    return !file || loading || recording;
  }, [file, loading, recording]);

  const disableClearExec = useMemo(() => {
    return (!file && content == '') || loading || recording;
  }, [content, file, loading, recording]);

  const disabledMicExec = useMemo(() => {
    return loading;
  }, [loading]);

  const onClickExec = useCallback(() => {
    if (loading) return;
    setContent('');
    stopTranscription();
    clearTranscripts();
    transcribe();
  }, [loading, setContent, stopTranscription, clearTranscripts, transcribe]);

  const onClickClear = useCallback(() => {
    if (ref.current) {
      ref.current.value = '';
    }
    setContent('');
    stopTranscription();
    clear();
    clearTranscripts();
  }, [setContent, stopTranscription, clear, clearTranscripts]);

  const onClickExecStartTranscription = useCallback(() => {
    if (ref.current) {
      ref.current.value = '';
    }
    setContent('');
    clear();
    clearTranscripts();
    startTranscription();
  }, [clear, clearTranscripts, setContent, startTranscription]);

  return (
   <div className="grid grid-cols-12">
      <div className="invisible col-span-12 my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min print:visible print:my-5 print:h-min">
        Speech Recognition
      </div>
      <div className="col-span-12 col-start-1 mx-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
        <Card label="File Upload">
          <input
            className="file:bg-aws-squid-ink block w-full cursor-pointer rounded-lg border
            border-gray-400 text-sm text-gray-900 file:mr-4 file:cursor-pointer file:border-0
            file:px-4 file:py-2 file:text-white focus:outline-none"
            onChange={onChangeFile}
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            accept=".mp3, .mp4, .wav, .flac, .ogg, .amr, .webm, .m4a"
            ref={ref}></input>
          <p className="ml-0.5 mt-1 text-sm text-gray-500" id="file_input_help">
            mp3, mp4, wav, flac, ogg, amr, webm, m4a files are available
          </p>
          <div className="flex justify-end gap-3">
            <Button outlined disabled={disableClearExec} onClick={onClickClear}>
              Clear
            </Button>
            <Button disabled={disabledExec} onClick={onClickExec}>
              Execute
            </Button>
            {recording ? (
              <Button disabled={disabledMicExec} onClick={stopTranscription}>
                <PiMicrophone /> Speech Recognition Active
              </Button>
            ) : (
              <Button
                outlined
                disabled={disabledMicExec}
                onClick={onClickExecStartTranscription}>
                <PiMicrophoneSlash /> Speech Recognition Inactive
              </Button>
            )}
          </div>
          <div className="mt-5 rounded border border-black/30 p-1.5">
            {content != '' && <Markdown>{content}</Markdown>}
            {!loading && content == '' && (
              <div className="text-gray-500">
                Speech recognition results will be displayed here
              </div>
            )}
            {loading && (
              <div className="border-aws-sky size-5 animate-spin rounded-full border-4 border-t-transparent"></div>
            )}

            <div className="flex w-full justify-end">
              {content && content && (
                <>
                  <ButtonCopy
                    text={content}
                    interUseCasesKey="transcript"></ButtonCopy>
                  <ButtonSendToUseCase text={content} />
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TranscribePage;
