import { useCallback, useContext, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ImageToolsContext } from "../ImageToolsContext";

export const DropZone = () => {
  const { loadFile } = useContext(ImageToolsContext);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f && f.type.startsWith("image/")) loadFile(f);
    },
    [loadFile],
  );

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) loadFile(f);
    },
    [loadFile],
  );

  return (
    <label
      className={`flex-1 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed 
        transition-colors cursor-pointer min-h-[200px]
        ${
          dragOver
            ? "border-primary bg-primary/10"
            : "border-secondary dark:border-gray-500 hover:border-primary hover:bg-primary/5"
        }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <Icon icon="mdi:upload" className="text-5xl opacity-50" />
      <p className="text-sm opacity-70">
        Drop an image here or{" "}
        <span className="text-primary underline">browse</span>
      </p>
      <p className="text-xs opacity-40">
        Supports PNG, JPEG, WebP, BMP, GIF, SVG, AVIF, TIFF…
      </p>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </label>
  );
};
