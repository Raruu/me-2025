"use client";

import { WindowManager } from "@/components/Window/WindowManager";
import { RaruuIconify } from "@/styles/RaruuIconify";
import { themeContext, initTheme, reducer } from "@/styles/theme";
import { useReducer, useEffect } from "react";

export default function Home() {
  RaruuIconify();
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
