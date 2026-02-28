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
import { CropRect, cropAndExport } from "../lib/crop";
import { getFileNameWithoutExt, loadImageElement } from "../lib/converter";

interface CropState {
  crop: CropRect;
  setCrop: Dispatch<SetStateAction<CropRect>>;
  aspectRatio: { w: number; h: number } | null;
  setAspectRatio: Dispatch<SetStateAction<{ w: number; h: number } | null>>;
  processing: boolean;
  resultBlob: Blob | null;
  resultUrl: string | null;
  handleCrop: () => void;
  handleDownload: () => void;
  handleResetCrop: () => void;
}

export const CropContext = createContext<CropState>({} as CropState);

export const CropProvider = ({ children }: { children: React.ReactNode }) => {
  const { file, preview, imgDimensions } = useContext(ImageToolsContext);

  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [aspectRatio, setAspectRatio] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Initialize crop to full image when file changes
  useEffect(() => {
    if (imgDimensions) {
      setCrop({ x: 0, y: 0, w: imgDimensions.w, h: imgDimensions.h });
      setResultBlob(null);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
  }, [imgDimensions]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []);

  const handleCrop = useCallback(async () => {
    if (!preview || !file) return;
    setProcessing(true);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl(null);

    try {
      const img = await loadImageElement(preview);
      const blob = await cropAndExport(img, crop);
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Crop error:", err);
    } finally {
      setProcessing(false);
    }
  }, [preview, file, crop, resultUrl]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !file) return;
    const baseName = getFileNameWithoutExt(file.name);
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${baseName}_cropped.png`;
    a.click();
  }, [resultUrl, file]);

  const handleResetCrop = useCallback(() => {
    if (imgDimensions) {
      setCrop({ x: 0, y: 0, w: imgDimensions.w, h: imgDimensions.h });
      setAspectRatio(null);
    }
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl(null);
  }, [imgDimensions, resultUrl]);

  return (
    <CropContext.Provider
      value={{
        crop,
        setCrop,
        aspectRatio,
        setAspectRatio,
        processing,
        resultBlob,
        resultUrl,
        handleCrop,
        handleDownload,
        handleResetCrop,
      }}
    >
      {children}
    </CropContext.Provider>
  );
};
