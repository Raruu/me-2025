"use client";

import { createRef, useContext, useEffect, useState } from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import { ServerContext } from "@/providers/ServerContext";
import { WebView } from "./Template/WebView";
import { WindowActionButton } from "../Window/Window";

const MyCv = () => {
  const myCV = useContext(ServerContext).cv;

  const [pdfUrl, setPdfUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    setIsLoading(true);

    fetch(myCV.cv_id)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        if (!isMounted) return;
        const pdfBlob =
          blob.type === "application/pdf"
            ? blob
            : new Blob([blob], { type: "application/pdf" });
        objectUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(objectUrl);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching PDF:", error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [myCV.cv_id]);

  return (
    <WebView
      url={pdfUrl}
      isLoading={isLoading}
      freeSlot={
        <WindowActionButton
          icon="ic:round-open-in-new"
          onClick={() => window.open(myCV.cv_id, "_blank")}
          useRightMargin
        />
      }
    />
  );
};

export const launcherMyCv: WindowLauncherProps = {
  title: `My CV (ID)`,
  appId: "my-cv-id",
  icon: "raruu:ba-skillbook",
  content: <MyCv />,
  size: {
    width: 640,
    height: 820,
  },
  minSize: {
    width: 260,
    height: 340,
  },
  launcherRef: createRef(),
};
