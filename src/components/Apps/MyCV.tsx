"use client";

import { createRef, useContext, useEffect, useState } from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import { ServerContext } from "@/providers/ServerContext";
import { WebView } from "./Template/WebView";
import { WindowActionButton } from "../Window/Window";
import { Icon } from "@iconify/react";

const MyCv = () => {
  const myCV = useContext(ServerContext).cv;
  
  // Detect mobile device using User Agent
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || "";
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()));
    };
    
    checkMobile();
  }, []);

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

  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 bg-background">
        <Icon icon="raruu:ba-skillbook" className="text-6xl text-primary" />
        <h2 className="text-xl font-semibold text-center">My CV</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          PDF viewer is not available on mobile devices. Please download or open in a new tab to view the CV.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => window.open(myCV.cv_id, "_blank")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Icon icon="ic:round-open-in-new" className="text-lg" />
            Open in New Tab
          </button>
          <a
            href={myCV.cv_id}
            download
            className="flex items-center gap-2 px-4 py-2 bg-background text-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            <Icon icon="ic:round-download" className="text-lg" />
            Download CV
          </a>
        </div>
      </div>
    );
  }

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
