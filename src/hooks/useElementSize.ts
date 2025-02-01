"use client";

import { useEffect, useState, useRef, createContext } from "react";

export type MediaQuery = "default" | "sm" | "md" | "lg" | "xl" | "2xl";

export type MediaQueryMap = Partial<Record<MediaQuery, string>>;

export const mapMediaQuery = (
  mediaQuery: MediaQuery,
  mediaQueryMap: MediaQueryMap
): string => {
  switch (mediaQuery) {
    case "2xl":
      if (mediaQueryMap["2xl"]) return mediaQueryMap["2xl"] ?? "";
    case "xl":
      if (mediaQueryMap.xl) return mediaQueryMap.xl ?? "";
    case "lg":
      if (mediaQueryMap.lg) return mediaQueryMap.lg ?? "";
    case "md":
      if (mediaQueryMap.md) return mediaQueryMap.md ?? "";
    case "sm":
      if (mediaQueryMap.sm) return mediaQueryMap.sm ?? "";
    case "default":
      return mediaQueryMap.default ?? "";
  }
};

export const mediaQueryContext = createContext<MediaQuery>("default");

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

