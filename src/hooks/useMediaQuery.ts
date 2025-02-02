"use client";

import { useEffect, useState, createContext } from "react";

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

export function useMediaQuery() {
  const [mediaQuery, setMediaQuery] = useState<MediaQuery>("default");

  useEffect(() => {
    const checkMediaQuery = () => {
      if (window.matchMedia("(min-width: 1536px)").matches) {
        setMediaQuery("2xl");
      } else if (window.matchMedia("(min-width: 1280px)").matches) {
        setMediaQuery("xl");
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        setMediaQuery("lg");
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setMediaQuery("md");
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setMediaQuery("sm");
      } else {
        setMediaQuery("default");
      }      
    };

    checkMediaQuery();
    window.addEventListener("resize", checkMediaQuery);
    return () => window.removeEventListener("resize", checkMediaQuery);
  }, []);

  return mediaQuery;
}
