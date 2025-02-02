"use client";
import { useEffect, useRef, useState } from "react";
import { MediaQuery } from "./useMediaQuery";

export const useElementSize = () => {
  const [mediaQuery, setMediaQuery] = useState<MediaQuery>("default");
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      if (width >= 1536) {
        setMediaQuery("2xl");
      } else if (width >= 1280) {
        setMediaQuery("xl");
      } else if (width >= 1024) {
        setMediaQuery("lg");
      } else if (width >= 768) {
        setMediaQuery("md");
      } else if (width >= 640) {
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
