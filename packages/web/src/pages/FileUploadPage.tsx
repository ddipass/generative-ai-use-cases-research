import React, { useCallback, useMemo, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import ButtonCopy from '../components/ButtonCopy';
import ButtonSendToUseCase from '../components/ButtonSendToUseCase';
import Markdown from '../components/Markdown';
import useFile from '../hooks/useFile';

const FileUploadPage: React.FC = () => {
  const { file, loading, recognizedText, clear, setFile, recognizeFile } =
    useFile();
  const ref = useRef<HTMLInputElement>(null);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const disabledExec = useMemo(() => {
    return !file || loading;
  }, [file, loading]);

  const onClickExec = useCallback(() => {
    if (loading) return;
    recognizeFile();
  }, [recognizeFile, loading]);

  const onClickClear = useCallback(() => {
    if (ref.current) {
      ref.current.value = '';
    }
    clear();
  }, [clear]);

  return (
    <div className="grid grid-cols-12">
      <div className="invisible col-span-12 my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min print:visible print:my-5 print:h-min">
        File Upload
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
            accept=".csv, .doc, .docx, .md, .pdf, .ppt, .pptx, .tsv, .xlsx"
            ref={ref}></input>
          <p className="ml-0.5 mt-1 text-sm text-gray-500" id="file_input_help">
            csv, doc, docx, md, pdf, ppt, pptx, tsv, xlsx files are allowed.
          </p>
          <div className="flex justify-end gap-3">
            <Button outlined disabled={disabledExec} onClick={onClickClear}>
              Clear
            </Button>
            <Button disabled={disabledExec} onClick={onClickExec}>
              Execute
            </Button>
          </div>
          <div className="mt-5 rounded border border-black/30 p-1.5">
            {recognizedText != '' && <Markdown>{recognizedText}</Markdown>}
            {!loading && recognizedText == '' && (
              <div className="text-gray-500">
                File recognition results will be displayed here
              </div>
            )}
            {loading && (
              <div className="border-aws-sky size-5 animate-spin rounded-full border-4 border-t-transparent"></div>
            )}

            <div className="flex w-full justify-end">
              {recognizedText && (
                <>
                  <ButtonCopy
                    text={recognizedText}
                    interUseCasesKey="transcript"></ButtonCopy>
                  <ButtonSendToUseCase text={recognizedText} />
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FileUploadPage;
