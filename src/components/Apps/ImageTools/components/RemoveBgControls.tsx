import { useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ImageToolsContext } from "../providers/ImageToolsContext";
import { RemoveBgContext } from "../providers/RemoveBgContext";
import { mapMediaQuery, MediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export const RemoveBgControls = ({
  mediaQuery,
}: {
  mediaQuery: MediaQuery;
}) => {
  const { file, applyResult } = useContext(ImageToolsContext);
  const {
    bgColor,
    setBgColor,
    tolerance,
    setTolerance,
    processing,
    resultBlob,
    handleRemoveBg,
    handleAutoDetect,
    handleDownload,
    handleResetResult,
  } = useContext(RemoveBgContext);

  const colorHex = `#${bgColor.r.toString(16).padStart(2, "0")}${bgColor.g.toString(16).padStart(2, "0")}${bgColor.b.toString(16).padStart(2, "0")}`;

  const parseHex = (hex: string) => {
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      setBgColor({ r, g, b });
    }
  };

  return (
    <div
      className={cn(
        mapMediaQuery(mediaQuery, { default: "w-full", sm: "w-72 " }),
        "flex-shrink-0 border-t lg:border-t-0 lg:border-l border-secondary dark:border-gray-600 p-4 flex flex-col gap-4 overflow-auto bg-background-tr",
      )}
    >
      {/* Background color */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
          Background Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorHex}
            onChange={(e) => parseHex(e.target.value)}
            className="w-10 h-10 rounded-lg border border-secondary dark:border-gray-500 cursor-pointer"
          />
          <div className="flex-1 flex flex-col gap-1">
            <input
              type="text"
              value={colorHex}
              onChange={(e) => parseHex(e.target.value)}
              className="w-full px-2 py-1 rounded-lg text-sm bg-background border border-secondary dark:border-gray-500 focus:outline-none focus:border-primary font-mono"
            />
            <div className="flex gap-1 text-xs opacity-50">
              <span>
                R:{bgColor.r} G:{bgColor.g} B:{bgColor.b}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleAutoDetect}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
            hover:bg-primary/50 dark:bg-slate-50 dark:bg-opacity-15 dark:hover:bg-secondary/50 transition-colors"
        >
          <Icon icon="mdi:auto-fix" className="text-sm" />
          Auto-detect from corners
        </button>
      </div>

      {/* Quick presets */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
          Quick Presets
        </label>
        <div className="flex gap-1.5">
          {[
            { label: "White", color: { r: 255, g: 255, b: 255 } },
            { label: "Black", color: { r: 0, g: 0, b: 0 } },
            { label: "Green", color: { r: 0, g: 177, b: 64 } },
            { label: "Blue", color: { r: 0, g: 110, b: 255 } },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setBgColor(preset.color)}
              className={`flex-1 flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-colors
                ${
                  bgColor.r === preset.color.r &&
                  bgColor.g === preset.color.g &&
                  bgColor.b === preset.color.b
                    ? "bg-primary/15 ring-1 ring-primary"
                    : "hover:bg-primary/50 dark:bg-slate-50 dark:bg-opacity-15 dark:hover:bg-secondary/50"
                }`}
            >
              <div
                className="w-5 h-5 rounded-full border border-secondary dark:border-gray-500"
                style={{
                  backgroundColor: `rgb(${preset.color.r},${preset.color.g},${preset.color.b})`,
                }}
              />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tolerance */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide opacity-60">
          Tolerance: {tolerance}
        </label>
        <input
          type="range"
          min={1}
          max={150}
          value={tolerance}
          onChange={(e) => setTolerance(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs opacity-40">
          <span>Precise</span>
          <span>Aggressive</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={handleRemoveBg}
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
              Removing…
            </>
          ) : (
            <>
              <Icon icon="mdi:image-remove" className="text-lg" />
              Remove Background
            </>
          )}
        </button>

        {resultBlob && (
          <>
            <button
              onClick={async () => {
                await applyResult(resultBlob, "no-bg");
                handleResetResult();
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
              Download PNG
            </button>
            <button
              onClick={handleResetResult}
              className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl font-medium text-xs
                opacity-50 hover:opacity-80 transition-colors"
            >
              <Icon icon="mdi:refresh" className="text-sm" />
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
};
