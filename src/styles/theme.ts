"use client";

import { Dispatch, SetStateAction, createContext } from "react";

export type themeType = "light" | "dark";

export const themeContext = createContext<{
  theme: themeType;
  setThemeState: Dispatch<SetStateAction<themeType>>;
}>({
  theme: "dark",
  setThemeState: () => {},
});

export const getSystemTheme = (): themeType => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const getTheme = (): themeType => {
  const theme = localStorage.getItem("theme");
  return theme === "light" || theme === "dark" ? theme : getSystemTheme();
};

export const initTheme = (): themeType => {
  const savedTheme = getTheme();
  document.documentElement.setAttribute("data-theme", savedTheme);
  return savedTheme;
};

export const setTheme = (
  setThemeState: Dispatch<SetStateAction<themeType>>,
  theme: themeType,
  preferedTheme?: themeType
) => {
  preferedTheme = preferedTheme ?? (theme == "light" ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", preferedTheme);
  localStorage.setItem("theme", preferedTheme);
  setThemeState(preferedTheme);
};
