import { useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  FORMAT_INFO,
  ICO_PRESETS,
  OutputFormat,
  QUALITY_FORMATS,
  RESIZE_PRESETS,
} from "../constants";
import { ImageToolsContext } from "../ImageToolsContext";
import { mapMediaQuery, MediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export const ControlPanel = ({ mediaQuery }: { mediaQuery: MediaQuery }) => {
  const {
    file,
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
    handleConvert,
    handleDownload,
  } = useContext(ImageToolsContext);

  return (
    <div
      className={cn(
        mapMediaQuery(mediaQuery, { default: "w-full", sm: "w-72 " }),
        "flex-shrink-0 border-t lg:border-t-0 lg:border-l border-secondary dark:border-gray-600 p-4 flex flex-col gap-4 overflow-auto bg-background-tr",
      )}
    >
      {/* Output format */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
          Output Format
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(FORMAT_INFO) as OutputFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setOutputFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${
                  outputFormat === fmt
                    ? "bg-primary text-white"
                    : "hover:bg-primary/50 dark:bg-slate-50 dark:bg-opacity-15 dark:hover:bg-secondary/50"
                }`}
            >
              {FORMAT_INFO[fmt].label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality slider */}
      {QUALITY_FORMATS.includes(outputFormat) && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
            Quality: {quality}%
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs opacity-40">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
      )}

      {/* ICO presets */}
      {outputFormat === "ico" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
            ICO Preset
          </label>
          <div className="flex flex-col gap-1.5">
            {ICO_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => setIcoPresetIndex(i)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors
                  ${
                    icoPresetIndex === i
                      ? "bg-primary text-white"
                      : "hover:bg-primary/50 dark:bg-slate-50 dark:hover:bg-slate-300 dark:bg-opacity-15 dark:hover:bg-secondary/50"
                  }`}
              >
                <div className="font-medium">{preset.label}</div>
                {preset.label !== "Custom" && (
                  <div className="text-xs opacity-70">
                    {preset.sizes.map((s) => `${s}×${s}`).join(", ")}
                  </div>
                )}
              </button>
            ))}
          </div>

          {ICO_PRESETS[icoPresetIndex].label === "Custom" && (
            <div className="flex items-center gap-2 mt-1">
              <label className="text-xs opacity-60">Size:</label>
              <input
                type="number"
                min={1}
                max={512}
                value={customIcoSize}
                onChange={(e) =>
                  setCustomIcoSize(
                    Math.max(1, Math.min(512, Number(e.target.value))),
                  )
                }
                className="w-20 px-2 py-1 rounded-lg text-sm bg-background border border-secondary dark:border-gray-500 focus:outline-none focus:border-primary"
              />
              <span className="text-xs opacity-50">px</span>
            </div>
          )}
        </div>
      )}

      {/* Resize presets — non-ICO */}
      {outputFormat !== "ico" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
            Resize
          </label>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                setResizePresetIndex(null);
                setCustomResizeWidth(null);
                setCustomResizeHeight(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm text-left transition-colors
                ${
                  resizePresetIndex === null && customResizeWidth === null
                    ? "bg-primary text-white"
                    : "hover:bg-primary/50 dark:bg-slate-50 dark:hover:bg-slate-300 dark:bg-opacity-15 dark:hover:bg-secondary/50"
                }`}
            >
              Original size
            </button>
            {RESIZE_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setResizePresetIndex(i);
                  setCustomResizeWidth(null);
                  setCustomResizeHeight(null);
                }}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors
                  ${
                    resizePresetIndex === i
                      ? "bg-primary text-white"
                      : "hover:bg-primary/50 dark:bg-slate-50 dark:hover:bg-slate-300 dark:bg-opacity-15 dark:hover:bg-secondary/50"
                  }`}
              >
                <div className="font-medium">{preset.label}</div>
                <div className="text-xs opacity-70">
                  {preset.width}×{preset.height}
                </div>
              </button>
            ))}
            <button
              onClick={() => {
                setResizePresetIndex(null);
                setCustomResizeWidth(customResizeWidth ?? 256);
                setCustomResizeHeight(customResizeHeight ?? 256);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm text-left transition-colors
                ${
                  resizePresetIndex === null && customResizeWidth !== null
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-slate-50 dark:hover:bg-slate-300 dark:bg-opacity-15 dark:hover:bg-opacity-25"
                }`}
            >
              Custom
            </button>
          </div>

          {resizePresetIndex === null && customResizeWidth !== null && (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min={1}
                max={8192}
                value={customResizeWidth}
                onChange={(e) =>
                  setCustomResizeWidth(
                    Math.max(1, Math.min(8192, Number(e.target.value))),
                  )
                }
                className="w-full px-2 py-1 rounded-lg text-sm bg-background border border-secondary dark:border-gray-500 focus:outline-none focus:border-primary"
              />
              <span className="text-xs opacity-50">×</span>
              <input
                type="number"
                min={1}
                max={8192}
                value={customResizeHeight ?? 256}
                onChange={(e) =>
                  setCustomResizeHeight(
                    Math.max(1, Math.min(8192, Number(e.target.value))),
                  )
                }
                className="w-full px-2 py-1 rounded-lg text-sm bg-background border border-secondary dark:border-gray-500 focus:outline-none focus:border-primary"
              />
              <span className="text-xs opacity-50">px</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={handleConvert}
          disabled={!file || converting}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors
            ${
              !file || converting
                ? "bg-gray-300 dark:bg-gray-600 opacity-50 cursor-not-allowed"
                : "bg-primary text-white hover:brightness-110 active:brightness-95"
            }`}
        >
          {converting ? (
            <>
              <Icon icon="mdi:loading" className="text-lg animate-spin" />
              Converting…
            </>
          ) : (
            <>
              <Icon icon="mdi:swap-horizontal" className="text-lg" />
              Convert to {FORMAT_INFO[outputFormat].label}
            </>
          )}
        </button>

        {resultBlob && (
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
              bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors"
          >
            <Icon icon="mdi:download" className="text-lg" />
            Download {FORMAT_INFO[outputFormat].ext}
          </button>
        )}
      </div>
    </div>
  );
};
