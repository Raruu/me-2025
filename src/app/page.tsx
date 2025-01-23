"use client";

import { WindowManager } from "@/components/Window/WindowManager";
import { themeContext, themeType, initTheme, setTheme } from "@/styles/theme";
import { useState, useEffect } from "react";

export default function Home() {
  const [theme, setThemeState] = useState<themeType>("dark");
  useEffect(() => {
    setTheme(setThemeState, "dark", initTheme());
  }, []);

  return (
    <themeContext.Provider value={{ theme, setThemeState: setThemeState }}>
      <WindowManager />
    </themeContext.Provider>
  );
}
