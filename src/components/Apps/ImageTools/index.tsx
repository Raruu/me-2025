"use client";

import { createRef, useContext } from "react";
import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { APP_TITLE, APPID, APP_ICON } from "./constants";
import { ImageToolsContext, ImageToolsProvider } from "./ImageToolsContext";
import { DropZone } from "./components/DropZone";
import { ImagePreview } from "./components/ImagePreview";
import { ControlPanel } from "./components/ControlPanel";
import { useElementSize } from "@/hooks/useElementSize";
import { cn } from "@/lib/utils";
import { mapMediaQuery } from "@/hooks/useMediaQuery";

const ImageToolsInner = () => {
  const { file } = useContext(ImageToolsContext);
  const { mediaQuery, elementRef } = useElementSize();

  return (
    <div
      ref={elementRef}
      className="bg-background w-full h-full flex flex-col select-none overflow-hidden"
    >
      <div
        className={cn(
          "flex-1 flex overflow-auto",
          mapMediaQuery(mediaQuery, { sm: "flex-row", default: "flex-col" }),
        )}
      >
        <div className="flex-1 flex flex-col p-4 gap-4 min-w-0">
          {!file ? <DropZone /> : <ImagePreview />}
        </div>
        <ControlPanel mediaQuery={mediaQuery} />
      </div>
    </div>
  );
};

const ImageTools = () => (
  <ImageToolsProvider>
    <ImageToolsInner />
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
