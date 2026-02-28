import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatBytes } from "../lib/converter";
import { ImageToolsContext } from "../providers/ImageToolsContext";
import { CropContext } from "../providers/CropContext";

type DragHandle = "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

export const CropPreview = () => {
  const { file, preview, imgDimensions, handleReset } =
    useContext(ImageToolsContext);
  const { crop, setCrop, aspectRatio, resultUrl, resultBlob } =
    useContext(CropContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgRect, setImgRect] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    scale: 1,
  });
  const [dragging, setDragging] = useState<DragHandle | null>(null);
  const dragStart = useRef({ mx: 0, my: 0, crop: crop });

  const updateImgRect = useCallback(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img || !imgDimensions) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const iw = imgDimensions.w;
    const ih = imgDimensions.h;

    const scale = Math.min(cw / iw, ch / ih);
    const rw = iw * scale;
    const rh = ih * scale;
    const rx = (cw - rw) / 2;
    const ry = (ch - rh) / 2;

    setImgRect({ x: rx, y: ry, w: rw, h: rh, scale });
  }, [imgDimensions]);

  useEffect(() => {
    updateImgRect();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => updateImgRect());
    ro.observe(container);
    return () => ro.disconnect();
  }, [updateImgRect]);

  const handleImgLoad = useCallback(() => {
    updateImgRect();
  }, [updateImgRect]);

  const toScreen = useCallback(
    (ix: number, iy: number) => ({
      x: imgRect.x + ix * imgRect.scale,
      y: imgRect.y + iy * imgRect.scale,
    }),
    [imgRect],
  );

  const screenCrop = useMemo(() => {
    const tl = toScreen(crop.x, crop.y);
    return {
      x: tl.x,
      y: tl.y,
      w: crop.w * imgRect.scale,
      h: crop.h * imgRect.scale,
    };
  }, [crop, toScreen, imgRect.scale]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, handle: DragHandle) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(handle);
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      dragStart.current = {
        mx: e.clientX - rect.left,
        my: e.clientY - rect.top,
        crop: { ...crop },
      };
    },
    [crop],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !imgDimensions) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dx = (mx - dragStart.current.mx) / imgRect.scale;
      const dy = (my - dragStart.current.my) / imgRect.scale;
      const prev = dragStart.current.crop;
      const maxW = imgDimensions.w;
      const maxH = imgDimensions.h;

      let nx = prev.x;
      let ny = prev.y;
      let nw = prev.w;
      let nh = prev.h;

      if (dragging === "move") {
        nx = Math.max(0, Math.min(maxW - prev.w, prev.x + dx));
        ny = Math.max(0, Math.min(maxH - prev.h, prev.y + dy));
        nw = prev.w;
        nh = prev.h;
      } else {
        // Resize handles
        if (dragging.includes("w")) {
          const newX = Math.max(0, Math.min(prev.x + prev.w - 10, prev.x + dx));
          nw = prev.w + (prev.x - newX);
          nx = newX;
        }
        if (dragging.includes("e")) {
          nw = Math.max(10, Math.min(maxW - prev.x, prev.w + dx));
        }
        if (dragging.includes("n")) {
          const newY = Math.max(0, Math.min(prev.y + prev.h - 10, prev.y + dy));
          nh = prev.h + (prev.y - newY);
          ny = newY;
        }
        if (dragging.includes("s")) {
          nh = Math.max(10, Math.min(maxH - prev.y, prev.h + dy));
        }

        // Enforce aspect ratio
        if (aspectRatio) {
          const ar = aspectRatio.w / aspectRatio.h;
          if (dragging === "n" || dragging === "s") {
            nw = nh * ar;
            if (nx + nw > maxW) {
              nw = maxW - nx;
              nh = nw / ar;
            }
          } else {
            nh = nw / ar;
            if (ny + nh > maxH) {
              nh = maxH - ny;
              nw = nh * ar;
            }
          }
        }
      }

      setCrop({
        x: Math.round(nx),
        y: Math.round(ny),
        w: Math.round(nw),
        h: Math.round(nh),
      });
    },
    [dragging, imgDimensions, imgRect.scale, aspectRatio, setCrop],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  if (!file) return null;

  const handleStyle =
    "absolute w-2.5 h-2.5 bg-white border-2 border-primary rounded-sm z-10";

  return (
    <>
      {/* File info */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-2 text-sm">
          <Icon icon="mdi:file-image" className="text-lg" />
          <span className="font-medium truncate">{file.name}</span>
          <span className="opacity-50 flex-shrink-0">
            {formatBytes(file.size)}
            {imgDimensions && ` • ${imgDimensions.w}×${imgDimensions.h}`}
          </span>
          <span className="opacity-50 flex-shrink-0">•</span>
          <div className="flex items-center gap-2 text-xs opacity-60">
            <Icon icon="mdi:crop" className="text-sm" />
            <span>
              Crop: {Math.round(crop.w)}×{Math.round(crop.h)} at (
              {Math.round(crop.x)}, {Math.round(crop.y)})
            </span>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="ml-auto p-1 rounded hover:bg-red-500/20 transition-colors"
          title="Remove image"
        >
          <Icon icon="mdi:close" className="text-lg" />
        </button>
      </div>

      {/* Interactive crop area */}
      {resultUrl ? (
        <div className="flex-1 flex items-center justify-center rounded-lg bg-[repeating-conic-gradient(oklch(80%_0_0)_0%_25%,oklch(95%_0_0)_0%_50%)] dark:bg-[repeating-conic-gradient(oklch(30%_0_0)_0%_25%,oklch(20%_0_0)_0%_50%)] bg-[length:16px_16px] overflow-hidden min-h-[150px]">
          <img
            src={resultUrl}
            alt="Cropped preview"
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative flex-1 rounded-lg bg-[repeating-conic-gradient(oklch(80%_0_0)_0%_25%,oklch(95%_0_0)_0%_50%)] dark:bg-[repeating-conic-gradient(oklch(30%_0_0)_0%_25%,oklch(20%_0_0)_0%_50%)] bg-[length:16px_16px] overflow-hidden min-h-[150px] select-none touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <img
            ref={imgRef}
            src={preview ?? ""}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            draggable={false}
            onLoad={handleImgLoad}
          />

          {/* Dimmed overlay outside crop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))`,
              clipPath: `polygon(
                0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                ${screenCrop.x}px ${screenCrop.y}px,
                ${screenCrop.x}px ${screenCrop.y + screenCrop.h}px,
                ${screenCrop.x + screenCrop.w}px ${screenCrop.y + screenCrop.h}px,
                ${screenCrop.x + screenCrop.w}px ${screenCrop.y}px,
                ${screenCrop.x}px ${screenCrop.y}px
              )`,
            }}
          />

          {/* Crop border */}
          <div
            className="absolute border-2 border-white/80 border-dashed cursor-move"
            style={{
              left: screenCrop.x,
              top: screenCrop.y,
              width: screenCrop.w,
              height: screenCrop.h,
            }}
            onPointerDown={(e) => handlePointerDown(e, "move")}
          >
            {/* Rule of thirds guides */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
            </div>
          </div>

          {/* Corners */}
          <div
            className={`${handleStyle} cursor-nw-resize`}
            style={{
              left: screenCrop.x - 5,
              top: screenCrop.y - 5,
            }}
            onPointerDown={(e) => handlePointerDown(e, "nw")}
          />
          <div
            className={`${handleStyle} cursor-ne-resize`}
            style={{
              left: screenCrop.x + screenCrop.w - 5,
              top: screenCrop.y - 5,
            }}
            onPointerDown={(e) => handlePointerDown(e, "ne")}
          />
          <div
            className={`${handleStyle} cursor-sw-resize`}
            style={{
              left: screenCrop.x - 5,
              top: screenCrop.y + screenCrop.h - 5,
            }}
            onPointerDown={(e) => handlePointerDown(e, "sw")}
          />
          <div
            className={`${handleStyle} cursor-se-resize`}
            style={{
              left: screenCrop.x + screenCrop.w - 5,
              top: screenCrop.y + screenCrop.h - 5,
            }}
            onPointerDown={(e) => handlePointerDown(e, "se")}
          />

          {/* Edge midpoints */}
          <div
            className={`${handleStyle} cursor-n-resize`}
            style={{
              left: screenCrop.x + screenCrop.w / 2 - 5,
              top: screenCrop.y - 5,
            }}
            onPointerDown={(e) => handlePointerDown(e, "n")}
          />
          <div
            className={`${handleStyle} cursor-s-resize`}
            style={{
              left: screenCrop.x + screenCrop.w / 2 - 5,
              top: screenCrop.y + screenCrop.h - 5,
            }}
            onPointerDown={(e) => handlePointerDown(e, "s")}
          />
          <div
            className={`${handleStyle} cursor-w-resize`}
            style={{
              left: screenCrop.x - 5,
              top: screenCrop.y + screenCrop.h / 2 - 5,
            }}
            onPointerDown={(e) => handlePointerDown(e, "w")}
          />
          <div
            className={`${handleStyle} cursor-e-resize`}
            style={{
              left: screenCrop.x + screenCrop.w - 5,
              top: screenCrop.y + screenCrop.h / 2 - 5,
            }}
            onPointerDown={(e) => handlePointerDown(e, "e")}
          />
        </div>
      )}

      {/* Result info */}
      {resultBlob && (
        <div className="flex items-center gap-2 text-sm">
          <Icon icon="mdi:check-circle" className="text-lg text-green-500" />
          <span className="text-green-600 dark:text-green-400 font-medium">
            Cropped
          </span>
          <span className="opacity-50">
            {formatBytes(resultBlob.size)} • {Math.round(crop.w)}×
            {Math.round(crop.h)}
          </span>
        </div>
      )}
    </>
  );
};
