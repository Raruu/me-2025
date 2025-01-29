"use client";

import { WindowManager } from "@/components/Window/WindowManager";
import { themeContext, initTheme, reducer } from "@/styles/theme";
import { useReducer, useEffect } from "react";

export default function Home() {
  const [theme, setTheme] = useReducer(reducer, "dark");
  useEffect(() => {
    setTheme(initTheme());
  }, []);

  return (
    <themeContext.Provider value={{ theme, setTheme}}>      
      <WindowManager />
    </themeContext.Provider>
  );
}
