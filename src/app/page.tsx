"use client";

import { WindowManager } from "@/components/Window/WindowManager";
import { raruuIconify } from "@/styles/raruu-iconify";
import { themeContext, initTheme, reducer } from "@/styles/theme";
import { LoadRequiredImage } from "@/utils/picture-helper";
import { useReducer, useEffect } from "react";

export default function Home() {
  raruuIconify();
  LoadRequiredImage();
  const [theme, setTheme] = useReducer(reducer, "dark");
  useEffect(() => {
    setTheme(initTheme());
  }, []);

  return (
    <themeContext.Provider value={{ theme, setTheme }}>
      <WindowManager />
    </themeContext.Provider>
  );
}
