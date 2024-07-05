import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';
import useChat from '../hooks/useChat';
import useTyping from '../hooks/useTyping';
import useFileApi from '../hooks/useFileApi';
import { UploadedFileType } from 'generative-ai-use-cases-jp';
import { extractBaseURL } from '../hooks/useFiles';
import { create } from 'zustand';
import { getPrompter } from '../prompts';
import { VideoAnalyzerPageQueryParams } from '../@types/navigate';
import { MODELS } from '../hooks/useModel';
import Button from '../components/Button';
import Markdown from '../components/Markdown';
import InputChatContent from '../components/InputChatContent';
import Card from '../components/Card';
import Select from '../components/Select';
import queryString from 'query-string';
// ffmpeg
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg.js';

type StateType = {
  content: string;
  setContent: (c: string) => void;
  analysis: string;
  setAnalysis: (a: string) => void;
  clear: () => void;
};

const useVideoAnalyzerPageState = create<StateType>((set) => {
  const INIT_STATE = {
    content: '',
    analysis: '',
  };
  return {
    ...INIT_STATE,
    setContent: (c: string) => {
      set(() => ({
        content: c,
      }));
    },
    setAnalysis: (a: string) => {
      set(() => ({
        analysis: a,
      }));
    },
    clear: () => {
      set(INIT_STATE);
    },
  };
});

const VideoAnalyzerPage: React.FC = () => {
  const { content, setContent, analysis, setAnalysis, clear } =
    useVideoAnalyzerPageState();
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [devices, setDevices] = useState<{ value: string; label: string }[]>(
    []
  );
  const [deviceId, setDeviceId] = useState('');
  // 添加这一行
  const [showNetworkCamera, setShowNetworkCamera] = useState(false); 
  // add webcam state
  const [networkCameraUrl, setNetworkCameraUrl] = useState('');
  const [sending, setSending] = useState(false);
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const callbackRef = useRef<() => void>();
  const { getSignedUrl, uploadFile } = useFileApi();
  const { pathname, search } = useLocation();
  const {
    getModelId,
    setModelId,
    loading,
    messages,
    postChat,
    clear: clearChat,
  } = useChat(pathname);
  const { setTypingTextInput, typingTextOutput } = useTyping(loading);
  const { modelIds: availableModels } = MODELS;
  const availableMultiModalModels = useMemo(() => {
    return availableModels.filter((modelId) =>
      MODELS.multiModalModelIds.includes(modelId)
    );
  }, [availableModels]);
  const modelId = getModelId();
  const prompter = useMemo(() => {
    return getPrompter(modelId);
  }, [modelId]);

  // loader
  const loadVideoFromNetworkCamera = async (url) => {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    const response = await fetch(url);
    const reader = response.body.getReader();

    const outputData = ffmpeg.FS('open', 'output.webm', 'w');

    const transcodeVideo = async () => {
      try {
        const { value, done } = await reader.read();
        if (done) {
          ffmpeg.FS('close', outputData);
          return;
        }

        ffmpeg.FS('write', outputData, value);

        await ffmpeg.run('-i', 'pipe:0', '-f', 'matroska', '-c:v', 'libx264', '-r', '30', '-b:v', '1M', '-s', '640x480', '-an', '-f', 'webm', 'pipe:1');

        const data = new Uint8Array(ffmpeg.FS('readFile', 'output.webm'));
        const videoBlob = new Blob([data.buffer], { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);

        const mediaSource = new MediaSource();
        videoElement.current.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', () => {
          const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
          sourceBuffer.appendBuffer(data);
          sourceBuffer.addEventListener('updateend', () => {
            mediaSource.endOfStream();
            videoElement.current.srcObject = mediaSource;
            videoElement.current.play();
          });
        });

        return videoUrl;
      } catch (error) {
        console.error('Error transcoding video:', error);
        ffmpeg.FS('close', outputData);
        return null;
      } finally {
        await transcodeVideo();
      }
    };

    return await transcodeVideo();
  };

  useEffect(() => {
    const _modelId = !modelId ? availableMultiModalModels[0] : modelId;
    if (search !== '') {
      const params = queryString.parse(search) as VideoAnalyzerPageQueryParams;
      setContent(params.content);
      setModelId(
        availableMultiModalModels.includes(params.modelId ?? '')
          ? params.modelId!
          : _modelId
      );
    } else {
      setModelId(_modelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setContent, modelId, availableMultiModalModels, search]);

  useEffect(() => {
    setTypingTextInput(analysis);
  }, [analysis, setTypingTextInput]);

  useEffect(() => {
    const getDevices = async () => {
      // 新規で画面を開いたユーザーにカメラの利用を要求する (ダミーのリクエスト)
      const dummyStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      if (dummyStream) {
        // 録画ボタンがついてしまうため消す
        dummyStream.getTracks().forEach((track) => track.stop());

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices
          .filter((device) => device.kind === 'videoinput')
          .map((device) => {
            return {
              value: device.deviceId,
              label: device.label.replace(/\s\(.*?\)/g, ''),
            };
          });
        setDevices(videoDevices);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    if (deviceId.length === 0 && devices.length > 0) {
      setDeviceId(devices[0].value);
    }
  }, [deviceId, devices]);

  useEffect(() => {
    if (messages.length === 0) return;
    const _lastMessage = messages[messages.length - 1];
    if (_lastMessage.role !== 'assistant') return;
    const _response = messages[messages.length - 1].content;
    setAnalysis(_response.trim());
  }, [messages, setAnalysis]);

  const onClickClear = useCallback(() => {
    clear();
    clearChat();
  }, [clear, clearChat]);

  const sendFrame = useCallback(() => {
    if (!videoElement.current) return;

    setSending(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.current.videoWidth;
    canvas.height = videoElement.current.videoHeight;
    const context = canvas.getContext('2d');
    context!.drawImage(videoElement.current, 0, 0, canvas.width, canvas.height);
    // toDataURL() で返す値は以下の形式 (;base64, 以降のみを使う)
    // ```
    // data:image/png;base64,<以下base64...>
    // ```
    const imageBase64 = canvas.toDataURL('image/png').split(';base64,')[1];

    canvas.toBlob(async (blob) => {
      const file = new File([blob!], 'tmp.png', { type: 'image/png' });
      const signedUrl = (await getSignedUrl({ mediaFormat: 'png' })).data;
      await uploadFile(signedUrl, { file });
      const baseUrl = extractBaseURL(signedUrl);
      const uploadedFiles: UploadedFileType[] = [
        {
          file,
          s3Url: baseUrl,
          base64EncodedImage: imageBase64,
          uploading: false,
        },
      ];

      postChat(
        prompter.videoAnalyzerPrompt({
          content,
        }),
        false,
        undefined,
        undefined,
        undefined,
        uploadedFiles
      );

      setSending(false);
    });
  }, [prompter, content, postChat, getSignedUrl, uploadFile]);

  const startRecording = useCallback(async () => {
    try {
      if (videoElement.current) {
        setRecording(true);

        let stream;
        if (showNetworkCamera && networkCameraUrl) {
          const response = await fetch(networkCameraUrl);
          const reader = response.body.getReader();
          const mediaSource = new MediaSource();
          videoElement.current.src = URL.createObjectURL(mediaSource);

          mediaSource.addEventListener('sourceopen', async () => {
            const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');

            try {
              const { value, done } = await reader.read();
              if (done) {
                mediaSource.endOfStream();
                return;
              }
              sourceBuffer.appendBuffer(value);
            } catch (error) {
              console.error('Error reading stream:', error);
              mediaSource.endOfStream();
            }
          });

          stream = mediaSource;
        } else {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              deviceId: {
                exact: deviceId,
              },
            },
          });
        }

        videoElement.current.srcObject = stream;
        videoElement.current.play();

        setMediaStream(stream);
      }
    } catch (e) {
      console.error('Could not access camera:', e);
    }
  }, [setRecording, videoElement, deviceId, networkCameraUrl]);

  // ビデオの停止
  const stopRecording = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  }, [mediaStream]);

  // Callback 関数を常に最新にしておく
  useEffect(() => {
    callbackRef.current = stopRecording;
  }, [stopRecording]);

  // Unmount 時 (画面を離れた時) の処理
  useEffect(() => {
    return () => {
      if (callbackRef.current) {
        callbackRef.current();
        callbackRef.current = undefined;
      }
    };
  }, []);

  return (
   <div className="grid grid-cols-12">
      <div className="invisible col-span-12 my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min print:visible print:my-5 print:h-min">
        Video Analysis
      </div>
      <div className="col-span-12 col-start-1 mx-2 lg:col-span-10 lg:col-start-2 xl:col-span-10 xl:col-start-2">
        <Card label="Analyze video in near real-time">
          <div className="flex flex-col gap-x-4 xl:flex-row">
            <div className="w-fit">
              <div className="flex w-full items-end">
                <Select
                  value={deviceId}
                  options={devices}
                  clearable={false}
                  onChange={setDeviceId}
                  label="Camera"
                />

                {recording ? (
                  <>
                    <Button
                      onClick={stopRecording}
                      className="mb-3 ml-3 h-fit w-16">
                      Stop
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={startRecording}
                      className="mb-3 ml-3 h-fit w-16">
                      Start
                    </Button>
                  </>
                )}
              </div>

              <input
                type="text"
                placeholder="Enter network camera URL"
                value={networkCameraUrl}
                onChange={(e) => setNetworkCameraUrl(e.target.value)}
              />

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={showNetworkCamera}
                    onChange={(e) => setShowNetworkCamera(e.target.checked)}
                  />
                  Show Network Camera
                </label>
              </div>

              <div className="w-96">
                <video ref={videoElement} autoPlay>
                  {showNetworkCamera && networkCameraUrl && (
                    <source src={networkCameraUrl} type="video/webm" />
                  )}
                </video>
              </div>

            </div>

            <div className="mt-3 w-full xl:mt-0">
              <Select
                value={modelId}
                onChange={setModelId}
                options={availableMultiModalModels.map((m) => {
                  return { value: m, label: m };
                })}
                label="Model"
              />

              <div className="relative h-48 overflow-y-scroll rounded border border-black/30 p-1.5 xl:h-96">
                <Markdown>{typingTextOutput}</Markdown>
                {(loading || sending) && (
                  <div className="border-aws-sky size-5 animate-spin rounded-full border-4 border-t-transparent"></div>
                )}

                <div className="absolute bottom-3 right-3">
                  <Button
                    outlined
                    onClick={onClickClear}
                    disabled={loading || sending || content.length === 0}>
                    Clear
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <InputChatContent
                  onSend={sendFrame}
                  disabled={
                    !recording || loading || sending || content.length === 0
                  }
                  loading={loading}
                  fullWidth={true}
                  disableMarginBottom={true}
                  hideReset={true}
                  content={content}
                  onChangeContent={setContent}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VideoAnalyzerPage;
