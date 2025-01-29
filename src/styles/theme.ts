"use client";

import { ActionDispatch, createContext } from "react";

export type themeType = "light" | "dark" | "tr-light" | "tr-dark";

export const themeContext = createContext<{
  theme: themeType;
  setTheme: ActionDispatch<[action: themeType | undefined]>;
}>({
  theme: "dark",
  setTheme: () => {},
});

export const getSystemTheme = (): themeType => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "tr-dark"
    : "tr-light";
};

// me lazy ehe
export const getTheme = (): themeType => {
  const theme = localStorage.getItem("theme");
  return `tr-${
    theme === "light" || theme === "dark" ? theme : (getSystemTheme().replace("tr-", "") as string)
  }` as themeType;
};

export const initTheme = (): themeType => {
  const savedTheme = getTheme();
  document.documentElement.setAttribute("data-theme", savedTheme);
  return savedTheme;
};

export const reducer = (state: themeType, action?: themeType): themeType => {
  action = action ?? (state == "light" ? "tr-dark" : "tr-light");
  if (!action?.includes("tr")) {
    document.documentElement.setAttribute("data-theme", action);
    localStorage.setItem("theme", action);
  }
  return action;
};
