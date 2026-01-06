"use client";
import { useEffect, useRef, useState } from "react";
import { MediaQuery } from "./useMediaQuery";

export const useElementSize = (checkHeight = false) => {
  const [mediaQuery, setMediaQuery] = useState<MediaQuery>("default");
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const height = checkHeight ? entries[0].contentRect.height * 1.5 : width;
      const size = Math.min(width, height);
      if (size >= 1536) {
        setMediaQuery("2xl");
      } else if (size >= 1280) {
        setMediaQuery("xl");
      } else if (size >= 1024) {
        setMediaQuery("lg");
      } else if (size >= 768) {
        setMediaQuery("md");
      } else if (size >= 640) {
        setMediaQuery("sm");
      } else {
        setMediaQuery("default");
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { mediaQuery, elementRef };
};
