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
import { ImageToolsContext } from "./ImageToolsContext";
import {
  detectBackgroundColor,
  removeBackgroundAndExport,
} from "../lib/remove-bg";
import { getFileNameWithoutExt, loadImageElement } from "../lib/converter";

interface RemoveBgState {
  bgColor: { r: number; g: number; b: number };
  setBgColor: Dispatch<SetStateAction<{ r: number; g: number; b: number }>>;
  tolerance: number;
  setTolerance: Dispatch<SetStateAction<number>>;
  processing: boolean;
  resultBlob: Blob | null;
  resultUrl: string | null;
  handleRemoveBg: () => void;
  handleAutoDetect: () => void;
  handlePickColor: (x: number, y: number) => void;
  handleDownload: () => void;
  handleResetResult: () => void;
}

export const RemoveBgContext = createContext<RemoveBgState>(
  {} as RemoveBgState,
);

export const RemoveBgProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { file, preview } = useContext(ImageToolsContext);

  const [bgColor, setBgColor] = useState({ r: 255, g: 255, b: 255 });
  const [tolerance, setTolerance] = useState(30);
  const [processing, setProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Auto-detect when file changes
  useEffect(() => {
    if (!preview) return;
    loadImageElement(preview).then((img) => {
      const detected = detectBackgroundColor(img);
      setBgColor(detected);
    });
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
  }, [preview]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []);

  const handleAutoDetect = useCallback(async () => {
    if (!preview) return;
    const img = await loadImageElement(preview);
    const detected = detectBackgroundColor(img);
    setBgColor(detected);
  }, [preview]);

  const handlePickColor = useCallback(
    async (x: number, y: number) => {
      if (!preview) return;
      const img = await loadImageElement(preview);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      setBgColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
    },
    [preview],
  );

  const handleRemoveBg = useCallback(async () => {
    if (!preview || !file) return;
    setProcessing(true);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl(null);

    try {
      const img = await loadImageElement(preview);
      const blob = await removeBackgroundAndExport(img, bgColor, tolerance);
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Remove BG error:", err);
    } finally {
      setProcessing(false);
    }
  }, [preview, file, bgColor, tolerance, resultUrl]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !file) return;
    const baseName = getFileNameWithoutExt(file.name);
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${baseName}_no-bg.png`;
    a.click();
  }, [resultUrl, file]);

  const handleResetResult = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl(null);
  }, [resultUrl]);

  return (
    <RemoveBgContext.Provider
      value={{
        bgColor,
        setBgColor,
        tolerance,
        setTolerance,
        processing,
        resultBlob,
        resultUrl,
        handleRemoveBg,
        handleAutoDetect,
        handlePickColor,
        handleDownload,
        handleResetResult,
      }}
    >
      {children}
    </RemoveBgContext.Provider>
  );
};
