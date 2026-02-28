"use client";

import { createRef, useContext } from "react";
import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { APP_TITLE, APPID, APP_ICON } from "./constants";
import { ImageToolsContext, ImageToolsProvider } from "./providers/ImageToolsContext";
import { DropZone } from "./components/DropZone";
import { ImagePreview } from "./components/ImagePreview";
import { ControlPanel } from "./components/ControlPanel";
import { ToolSelector } from "./components/ToolSelector";
import { CropProvider } from "./providers/CropContext";
import { CropPreview } from "./components/CropPreview";
import { CropControls } from "./components/CropControls";
import { RemoveBgProvider } from "./providers/RemoveBgContext";
import { RemoveBgPreview } from "./components/RemoveBgPreview";
import { RemoveBgControls } from "./components/RemoveBgControls";
import { useElementSize } from "@/hooks/useElementSize";
import { cn } from "@/lib/utils";
import { mapMediaQuery } from "@/hooks/useMediaQuery";

const ImageToolsInner = () => {
  const { file, activeTool } = useContext(ImageToolsContext);
  const { mediaQuery, elementRef } = useElementSize();

  const previewClass = "flex-1 flex flex-col p-4 gap-4 min-w-0";

  return (
    <div
      ref={elementRef}
      className="bg-background w-full h-full flex flex-col select-none overflow-hidden"
    >
      <ToolSelector />
      <div
        className={cn(
          "flex-1 flex overflow-auto",
          mapMediaQuery(mediaQuery, { sm: "flex-row", default: "flex-col" }),
        )}
      >
        {activeTool === "convert" && (
          <>
            <div className={previewClass}>
              {!file ? <DropZone /> : <ImagePreview />}
            </div>
            <ControlPanel mediaQuery={mediaQuery} />
          </>
        )}

        {activeTool === "crop" && (
          <>
            <div className={previewClass}>
              {!file ? <DropZone /> : <CropPreview />}
            </div>
            <CropControls mediaQuery={mediaQuery} />
          </>
        )}

        {activeTool === "remove-bg" && (
          <>
            <div className={previewClass}>
              {!file ? <DropZone /> : <RemoveBgPreview />}
            </div>
            <RemoveBgControls mediaQuery={mediaQuery} />
          </>
        )}
      </div>
    </div>
  );
};

const ImageTools = () => (
  <ImageToolsProvider>
    <CropProvider>
      <RemoveBgProvider>
        <ImageToolsInner />
      </RemoveBgProvider>
    </CropProvider>
  </ImageToolsProvider>
);

export const launcherImageTools: WindowLauncherProps = {
  title: APP_TITLE,
  appId: APPID,
  icon: APP_ICON,
  content: <ImageTools />,
  size: {
    width: 800,
    height: 550,
  },
  minSize: {
    width: 400,
    height: 350,
  },
  launcherRef: createRef(),
};
