import { EtcThemeSettings } from "@/styles/theme";
import { initTheme, reducer as themeReducer } from "@/styles/theme";
import { useEffect, useReducer, useState } from "react";
import {
  bgHzLightImage,
  bgHzDarkImage,
  bgVerLightImage,
  bgVerDarkImage,
} from "@/utils/picture-helper";
import { db } from "../db";

export const bgNames = {
  bgHzLightImage: "bgHzLight",
  bgHzDarkImage: "bgHzDark",
  bgVerLightImage: "bgVerLight",
  bgVerDarkImage: "bgVerDark",
};

export const EtcTheme = (): EtcThemeSettings => {
  const [theme, setTheme] = useReducer(themeReducer, "dark");
  const [bgHzUrlLight, setBgHzUrlLight] = useState(bgHzLightImage);
  const [bgHzUrlDark, setBgHzUrlDark] = useState(bgHzDarkImage);
  const [bgVerUrlLight, setBgVerUrlLight] = useState(bgVerLightImage);
  const [bgVerUrlDark, setBgVerUrlDark] = useState(bgVerDarkImage);

  const loadImages = async () => {
    const hzLight = await db.loadFile(bgNames.bgHzLightImage);
    setBgHzUrlLight(
      hzLight ? URL.createObjectURL(hzLight.blob) : bgHzLightImage
    );

    const hzDark = await db.loadFile(bgNames.bgHzDarkImage);
    setBgHzUrlDark(hzDark ? URL.createObjectURL(hzDark.blob) : bgHzDarkImage);

    const verLight = await db.loadFile(bgNames.bgVerLightImage);
    setBgVerUrlLight(
      verLight ? URL.createObjectURL(verLight.blob) : bgVerLightImage
    );

    const verDark = await db.loadFile(bgNames.bgVerDarkImage);
    setBgVerUrlDark(
      verDark ? URL.createObjectURL(verDark.blob) : bgVerDarkImage
    );
  };

  useEffect(() => {
    setTheme(initTheme());
    loadImages();
  }, []);

  const applyBg = (name: string, file: File | null) => {
    if (file) db.saveFile(name, name, "azusaEnvironment", file);
    URL.revokeObjectURL(bgHzUrlLight);
    URL.revokeObjectURL(bgHzUrlDark);
    URL.revokeObjectURL(bgVerUrlLight);
    URL.revokeObjectURL(bgVerUrlDark);
    loadImages();
  };

  return {
    theme: theme,
    setTheme: setTheme,
    bgHzUrlLight: bgHzUrlLight,
    bgHzUrlDark: bgHzUrlDark,
    bgVerUrlLight: bgVerUrlLight,
    bgVerUrlDark: bgVerUrlDark,
    applyBg: applyBg,
  };
};
