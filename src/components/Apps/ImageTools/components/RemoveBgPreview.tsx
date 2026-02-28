import { useCallback, useContext, useRef, useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatBytes, loadImageElement } from "../lib/converter";
import { ImageToolsContext } from "../providers/ImageToolsContext";
import { RemoveBgContext } from "../providers/RemoveBgContext";

export const RemoveBgPreview = () => {
  const { file, preview, imgDimensions, handleReset } =
    useContext(ImageToolsContext);
  const { resultUrl, resultBlob, handlePickColor } =
    useContext(RemoveBgContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [picking, setPicking] = useState(false);
  const [imgRect, setImgRect] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const updateImgRect = useCallback(() => {
    const container = containerRef.current;
    if (!container || !imgDimensions) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const iw = imgDimensions.w;
    const ih = imgDimensions.h;

    const scale = Math.min(cw / iw, ch / ih);
    const rw = iw * scale;
    const rh = ih * scale;
    const rx = (cw - rw) / 2;
    const ry = (ch - rh) / 2;

    setImgRect({ x: rx, y: ry, w: rw, h: rh });
  }, [imgDimensions]);

  useEffect(() => {
    updateImgRect();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => updateImgRect());
    ro.observe(container);
    return () => ro.disconnect();
  }, [updateImgRect]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!picking || !imgDimensions) return;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Convert to image coordinates
      const scale = imgRect.w / imgDimensions.w;
      const imgX = (mx - imgRect.x) / scale;
      const imgY = (my - imgRect.y) / scale;

      if (
        imgX >= 0 &&
        imgX < imgDimensions.w &&
        imgY >= 0 &&
        imgY < imgDimensions.h
      ) {
        handlePickColor(imgX, imgY);
        setPicking(false);
      }
    },
    [picking, imgDimensions, imgRect, handlePickColor],
  );

  if (!file) return null;

  return (
    <>
      {/* File info */}
      <div className="flex items-center gap-2 text-sm">
        <Icon icon="mdi:file-image" className="text-lg" />
        <span className="font-medium truncate">{file.name}</span>
        <span className="opacity-50 flex-shrink-0">
          {formatBytes(file.size)}
          {imgDimensions && ` • ${imgDimensions.w}×${imgDimensions.h}`}
        </span>
        <button
          onClick={() => setPicking(!picking)}
          className={`ml-auto p-1 rounded transition-colors ${
            picking
              ? "bg-primary/20 text-primary"
              : "hover:bg-primary/10 opacity-60"
          }`}
          title="Pick background color from image"
        >
          <Icon icon="mdi:eyedropper" className="text-lg" />
        </button>
        <button
          onClick={handleReset}
          className="p-1 rounded hover:bg-red-500/20 transition-colors"
          title="Remove image"
        >
          <Icon icon="mdi:close" className="text-lg" />
        </button>
      </div>

      {/* Preview */}
      <div
        ref={containerRef}
        className={`flex-1 flex items-center justify-center rounded-lg bg-[repeating-conic-gradient(oklch(80%_0_0)_0%_25%,oklch(95%_0_0)_0%_50%)] dark:bg-[repeating-conic-gradient(oklch(30%_0_0)_0%_25%,oklch(20%_0_0)_0%_50%)] bg-[length:16px_16px] overflow-hidden min-h-[150px] ${
          picking ? "cursor-crosshair" : ""
        }`}
        onClick={handleClick}
      >
        <img
          ref={imgRef}
          src={resultUrl ?? preview ?? ""}
          alt="Preview"
          className="max-w-full max-h-full object-contain"
          draggable={false}
          onLoad={updateImgRect}
        />
      </div>

      {/* Result info */}
      {resultBlob && (
        <div className="flex items-center gap-2 text-sm">
          <Icon icon="mdi:check-circle" className="text-lg text-green-500" />
          <span className="text-green-600 dark:text-green-400 font-medium">
            Background removed
          </span>
          <span className="opacity-50">{formatBytes(resultBlob.size)}</span>
        </div>
      )}
    </>
  );
};
