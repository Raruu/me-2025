"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { OutputFormat, FORMAT_INFO, RESIZE_PRESETS } from "./constants";
import {
  convertImage,
  getFileNameWithoutExt,
  loadImageElement,
} from "./converter";
import { WindowContext } from "@/providers/WindowContext";

interface ImageToolsState {
  file: File | null;
  preview: string | null;
  imgDimensions: { w: number; h: number } | null;
  outputFormat: OutputFormat;
  setOutputFormat: Dispatch<SetStateAction<OutputFormat>>;
  quality: number;
  setQuality: Dispatch<SetStateAction<number>>;
  icoPresetIndex: number;
  setIcoPresetIndex: Dispatch<SetStateAction<number>>;
  customIcoSize: number;
  setCustomIcoSize: Dispatch<SetStateAction<number>>;
  resizePresetIndex: number | null;
  setResizePresetIndex: Dispatch<SetStateAction<number | null>>;
  customResizeWidth: number | null;
  setCustomResizeWidth: Dispatch<SetStateAction<number | null>>;
  customResizeHeight: number | null;
  setCustomResizeHeight: Dispatch<SetStateAction<number | null>>;
  converting: boolean;
  resultBlob: Blob | null;
  resultUrl: string | null;
  loadFile: (f: File) => void;
  handleConvert: () => void;
  handleDownload: () => void;
  handleReset: () => void;
}

export const ImageToolsContext = createContext<ImageToolsState>(
  {} as ImageToolsState,
);

export const ImageToolsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setSubtitle } = useContext(WindowContext);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("webp");
  const [quality, setQuality] = useState(90);
  const [icoPresetIndex, setIcoPresetIndex] = useState(0);
  const [customIcoSize, setCustomIcoSize] = useState(32);
  const [converting, setConverting] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resizePresetIndex, setResizePresetIndex] = useState<number | null>(
    null,
  );
  const [customResizeWidth, setCustomResizeWidth] = useState<number | null>(
    null,
  );
  const [customResizeHeight, setCustomResizeHeight] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setSubtitle(file ? file.name : undefined);
  }, [file, setSubtitle]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []);

  const loadFile = useCallback(
    (f: File) => {
      if (preview) URL.revokeObjectURL(preview);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultBlob(null);
      setResultUrl(null);

      const url = URL.createObjectURL(f);
      setFile(f);
      setPreview(url);

      const img = new Image();
      img.onload = () =>
        setImgDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = url;
    },
    [preview, resultUrl],
  );

  const handleConvert = useCallback(async () => {
    if (!preview || !file) return;
    setConverting(true);
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    try {
      const img = await loadImageElement(preview);

      let resizeW: number | undefined;
      let resizeH: number | undefined;
      if (resizePresetIndex !== null) {
        const preset = RESIZE_PRESETS[resizePresetIndex];
        resizeW = preset.width;
        resizeH = preset.height;
      } else if (customResizeWidth !== null) {
        resizeW = customResizeWidth;
        resizeH = customResizeHeight ?? customResizeWidth;
      }

      const blob = await convertImage(
        img,
        outputFormat,
        quality,
        icoPresetIndex,
        customIcoSize,
        resizeW,
        resizeH,
      );
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Conversion error:", err);
    } finally {
      setConverting(false);
    }
  }, [
    preview,
    file,
    outputFormat,
    quality,
    icoPresetIndex,
    customIcoSize,
    resizePresetIndex,
    customResizeWidth,
    customResizeHeight,
    resultUrl,
  ]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !file) return;
    const baseName = getFileNameWithoutExt(file.name);
    const ext = FORMAT_INFO[outputFormat].ext;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${baseName}${ext}`;
    a.click();
  }, [resultUrl, file, outputFormat]);

  const handleReset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreview(null);
    setImgDimensions(null);
    setResultBlob(null);
    setResultUrl(null);
  }, [preview, resultUrl]);

  return (
    <ImageToolsContext.Provider
      value={{
        file,
        preview,
        imgDimensions,
        outputFormat,
        setOutputFormat,
        quality,
        setQuality,
        icoPresetIndex,
        setIcoPresetIndex,
        customIcoSize,
        setCustomIcoSize,
        resizePresetIndex,
        setResizePresetIndex,
        customResizeWidth,
        setCustomResizeWidth,
        customResizeHeight,
        setCustomResizeHeight,
        converting,
        resultBlob,
        resultUrl,
        loadFile,
        handleConvert,
        handleDownload,
        handleReset,
      }}
    >
      {children}
    </ImageToolsContext.Provider>
  );
};
