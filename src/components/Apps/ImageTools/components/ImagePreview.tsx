import { useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatBytes } from "../converter";
import { ImageToolsContext } from "../ImageToolsContext";

export const ImagePreview = () => {
  const { file, preview, resultUrl, resultBlob, imgDimensions, handleReset } =
    useContext(ImageToolsContext);

  if (!file) return null;

  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        <Icon icon="mdi:file-image" className="text-lg" />
        <span className="font-medium truncate">{file.name}</span>
        <span className="opacity-50 flex-shrink-0">
          {formatBytes(file.size)}
          {imgDimensions && ` • ${imgDimensions.w}×${imgDimensions.h}`}
        </span>
        <button
          onClick={handleReset}
          className="ml-auto p-1 rounded hover:bg-red-500/20 transition-colors"
          title="Remove image"
        >
          <Icon icon="mdi:close" className="text-lg" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center rounded-lg bg-[repeating-conic-gradient(oklch(80%_0_0)_0%_25%,oklch(95%_0_0)_0%_50%)] dark:bg-[repeating-conic-gradient(oklch(30%_0_0)_0%_25%,oklch(20%_0_0)_0%_50%)] bg-[length:16px_16px] overflow-hidden min-h-[150px]">
        <img
          src={resultUrl ?? preview ?? ""}
          alt="Preview"
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>

      {resultBlob && (
        <div className="flex items-center gap-2 text-sm">
          <Icon icon="mdi:check-circle" className="text-lg text-green-500" />
          <span className="text-green-600 dark:text-green-400 font-medium">
            Converted
          </span>
          <span className="opacity-50">
            {formatBytes(resultBlob.size)}
            {` (${((resultBlob.size / file.size) * 100).toFixed(1)}% of original)`}
          </span>
        </div>
      )}
    </>
  );
};
