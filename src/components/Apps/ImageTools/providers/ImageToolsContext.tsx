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
import { OutputFormat, FORMAT_INFO, RESIZE_PRESETS, ActiveTool } from "../constants";
import {
  convertImage,
  getFileNameWithoutExt,
  loadImageElement,
} from "../lib/converter";
import { WindowContext } from "@/providers/WindowContext";

interface HistoryEntry {
  file: File;
  preview: string;
  imgDimensions: { w: number; h: number };
}

interface ImageToolsState {
  file: File | null;
  preview: string | null;
  imgDimensions: { w: number; h: number } | null;
  activeTool: ActiveTool;
  setActiveTool: Dispatch<SetStateAction<ActiveTool>>;
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
  applyResult: (blob: Blob, suffix?: string) => Promise<void>;
  handleUndo: () => void;
  canUndo: boolean;
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
  const [activeTool, setActiveTool] = useState<ActiveTool>("convert");
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
  const [history, setHistory] = useState<HistoryEntry[]>([]);

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
      for (const entry of history) URL.revokeObjectURL(entry.preview);
      setHistory([]);
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
    [preview, resultUrl, history],
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
    for (const entry of history) URL.revokeObjectURL(entry.preview);
    setFile(null);
    setPreview(null);
    setImgDimensions(null);
    setResultBlob(null);
    setResultUrl(null);
    setHistory([]);
  }, [preview, resultUrl, history]);

  const applyResult = useCallback(
    async (blob: Blob, suffix: string = "edited") => {
      if (file && preview && imgDimensions) {
        setHistory((prev) => [...prev, { file, preview, imgDimensions }]);
      }

      const baseName = file ? getFileNameWithoutExt(file.name) : "image";
      const newFile = new File([blob], `${baseName}_${suffix}.png`, {
        type: blob.type || "image/png",
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(newFile);
      setFile(newFile);
      setPreview(url);
      setResultBlob(null);
      setResultUrl(null);

      const img = new Image();
      img.onload = () =>
        setImgDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = url;
    },
    [file, preview, imgDimensions, resultUrl],
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];

    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(prev.file);
    setPreview(prev.preview);
    setImgDimensions(prev.imgDimensions);
    setResultBlob(null);
    setResultUrl(null);
    setHistory((h) => h.slice(0, -1));
  }, [history, preview, resultUrl]);

  const canUndo = history.length > 0;

  return (
    <ImageToolsContext.Provider
      value={{
        file,
        preview,
        imgDimensions,
        activeTool,
        setActiveTool,
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
        applyResult,
        handleUndo,
        canUndo,
      }}
    >
      {children}
    </ImageToolsContext.Provider>
  );
};
