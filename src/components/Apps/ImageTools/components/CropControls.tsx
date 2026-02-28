import { useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ASPECT_RATIO_PRESETS } from "../constants";
import { ImageToolsContext } from "../providers/ImageToolsContext";
import { CropContext } from "../providers/CropContext";
import { mapMediaQuery, MediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export const CropControls = ({ mediaQuery }: { mediaQuery: MediaQuery }) => {
  const { file, imgDimensions, applyResult } = useContext(ImageToolsContext);
  const {
    crop,
    setCrop,
    aspectRatio,
    setAspectRatio,
    processing,
    resultBlob,
    handleCrop,
    handleDownload,
    handleResetCrop,
  } = useContext(CropContext);

  const applyAspectRatio = (w: number, h: number) => {
    if (!imgDimensions) return;
    const ar = w / h;
    const imgW = imgDimensions.w;
    const imgH = imgDimensions.h;

    let cropW: number, cropH: number;
    if (imgW / imgH > ar) {
      cropH = imgH;
      cropW = cropH * ar;
    } else {
      cropW = imgW;
      cropH = cropW / ar;
    }

    setCrop({
      x: Math.round((imgW - cropW) / 2),
      y: Math.round((imgH - cropH) / 2),
      w: Math.round(cropW),
      h: Math.round(cropH),
    });
  };

  return (
    <div
      className={cn(
        mapMediaQuery(mediaQuery, { default: "w-full", sm: "w-72 " }),
        "flex-shrink-0 border-t lg:border-t-0 lg:border-l border-secondary dark:border-gray-600 p-4 flex flex-col gap-4 overflow-auto bg-background-tr",
      )}
    >
      {/* Aspect ratio */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => {
              setAspectRatio(null);
              if (imgDimensions) {
                setCrop({
                  x: 0,
                  y: 0,
                  w: imgDimensions.w,
                  h: imgDimensions.h,
                });
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                aspectRatio === null
                  ? "bg-primary text-white"
                  : "hover:bg-primary/50 dark:bg-slate-50 dark:bg-opacity-15 dark:hover:bg-secondary/50"
              }`}
          >
            Free
          </button>
          {ASPECT_RATIO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setAspectRatio({ w: preset.w, h: preset.h });
                applyAspectRatio(preset.w, preset.h);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${
                  aspectRatio &&
                  aspectRatio.w === preset.w &&
                  aspectRatio.h === preset.h
                    ? "bg-primary text-white"
                    : "hover:bg-primary/50 dark:bg-slate-50 dark:bg-opacity-15 dark:hover:bg-secondary/50"
                }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manual crop input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
          Crop Area (px)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs opacity-50">X</span>
            <input
              type="number"
              min={0}
              max={imgDimensions ? imgDimensions.w - 10 : 9999}
              value={Math.round(crop.x)}
              onChange={(e) =>
                setCrop((c) => ({ ...c, x: Number(e.target.value) }))
              }
              className="w-full px-2 py-1 rounded-lg text-sm bg-background border border-secondary dark:border-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs opacity-50">Y</span>
            <input
              type="number"
              min={0}
              max={imgDimensions ? imgDimensions.h - 10 : 9999}
              value={Math.round(crop.y)}
              onChange={(e) =>
                setCrop((c) => ({ ...c, y: Number(e.target.value) }))
              }
              className="w-full px-2 py-1 rounded-lg text-sm bg-background border border-secondary dark:border-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs opacity-50">Width</span>
            <input
              type="number"
              min={1}
              max={imgDimensions ? imgDimensions.w : 9999}
              value={Math.round(crop.w)}
              onChange={(e) =>
                setCrop((c) => ({ ...c, w: Number(e.target.value) }))
              }
              className="w-full px-2 py-1 rounded-lg text-sm bg-background border border-secondary dark:border-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs opacity-50">Height</span>
            <input
              type="number"
              min={1}
              max={imgDimensions ? imgDimensions.h : 9999}
              value={Math.round(crop.h)}
              onChange={(e) =>
                setCrop((c) => ({ ...c, h: Number(e.target.value) }))
              }
              className="w-full px-2 py-1 rounded-lg text-sm bg-background border border-secondary dark:border-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={handleCrop}
          disabled={!file || processing}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors
            ${
              !file || processing
                ? "bg-gray-300 dark:bg-gray-600 opacity-50 cursor-not-allowed"
                : "bg-primary text-white hover:brightness-110 active:brightness-95"
            }`}
        >
          {processing ? (
            <>
              <Icon icon="mdi:loading" className="text-lg animate-spin" />
              Cropping…
            </>
          ) : (
            <>
              <Icon icon="mdi:crop" className="text-lg" />
              Apply Crop
            </>
          )}
        </button>

        {resultBlob && (
          <>
            <button
              onClick={async () => {
                await applyResult(resultBlob, "cropped");
                handleResetCrop();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              <Icon icon="mdi:check" className="text-lg" />
              Apply as Working Image
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors"
            >
              <Icon icon="mdi:download" className="text-lg" />
              Download Cropped
            </button>
          </>
        )}

        <button
          onClick={handleResetCrop}
          disabled={!file}
          className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl font-medium text-xs
            opacity-50 hover:opacity-80 transition-colors"
        >
          <Icon icon="mdi:refresh" className="text-sm" />
          Reset
        </button>
      </div>
    </div>
  );
};
