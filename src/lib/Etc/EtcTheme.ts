import { EtcThemeSettings } from "@/styles/theme";
import { initTheme, reducer as themeReducer } from "@/styles/theme";
import { useEffect, useReducer, useState } from "react";
import {
  bgHzLightImage,
  bgHzDarkImage,
  bgVerLightImage,
  bgVerDarkImage,
  themeTrImage,
} from "@/utils/picture-helper";
import { db } from "../db";

export const imageNames = {
  bgHzLightImage: "bgHzLight",
  bgHzDarkImage: "bgHzDark",
  bgVerLightImage: "bgVerLight",
  bgVerDarkImage: "bgVerDark",
  silhouetteTr: "silhouetteTr",
};

export const EtcTheme = (): EtcThemeSettings => {
  const [theme, setTheme] = useReducer(themeReducer, "dark");
  const [bgHzUrlLight, setBgHzUrlLight] = useState(bgHzLightImage);
  const [bgHzUrlDark, setBgHzUrlDark] = useState(bgHzDarkImage);
  const [bgVerUrlLight, setBgVerUrlLight] = useState(bgVerLightImage);
  const [bgVerUrlDark, setBgVerUrlDark] = useState(bgVerDarkImage);

  const loadImages = async () => {
    const hzLight = await db.loadFile(imageNames.bgHzLightImage);
    setBgHzUrlLight(
      hzLight ? URL.createObjectURL(hzLight.blob) : bgHzLightImage
    );

    const hzDark = await db.loadFile(imageNames.bgHzDarkImage);
    setBgHzUrlDark(hzDark ? URL.createObjectURL(hzDark.blob) : bgHzDarkImage);

    const verLight = await db.loadFile(imageNames.bgVerLightImage);
    setBgVerUrlLight(
      verLight ? URL.createObjectURL(verLight.blob) : bgVerLightImage
    );

    const verDark = await db.loadFile(imageNames.bgVerDarkImage);
    setBgVerUrlDark(
      verDark ? URL.createObjectURL(verDark.blob) : bgVerDarkImage
    );
  };

  const applyBg = async (name: string, file: File | null) => {
    if (file) await db.saveFile(name, name, "azusaEnvironment", file);
    URL.revokeObjectURL(bgHzUrlLight);
    URL.revokeObjectURL(bgHzUrlDark);
    URL.revokeObjectURL(bgVerUrlLight);
    URL.revokeObjectURL(bgVerUrlDark);
    loadImages();
  };

  const [silhouetteTr, setSilhouetteTr] = useState(themeTrImage);

  const loadSilhouette = async () => {
    const silhouette = await db.loadFile(imageNames.silhouetteTr);
    setSilhouetteTr(
      silhouette ? URL.createObjectURL(silhouette.blob) : themeTrImage
    );
  };

  const applySilhouette = (file: File | null) => {
    if (file)
      db.saveFile(
        imageNames.silhouetteTr,
        imageNames.silhouetteTr,
        "azusaEnvironment",
        file
      );
    URL.revokeObjectURL(silhouetteTr);
    loadSilhouette();
  };

  const [silhouetteDuration, setSilhouetteDuration] = useState(700);

  const loadSilhouetteDuration = async () => {
    const file = await db.loadFile("silhouetteDuration");
    if (file) {
      const text = await file.blob.text();
      const lines = text.split("\n");
      for (const line of lines) {
        const [key, value] = line.split("=");
        if (key === "duration") {
          setSilhouetteDuration(parseInt(value));
        }
      }
    }
  };

  const eSetSilhouetteDuration = async (duration: number) => {
    await db.saveFile(
      "silhouetteDuration",
      "silhouetteDuration.conf",
      "etc",
      new Blob([`duration=${duration.toString()}`], { type: "text/plain" })
    );
    setSilhouetteDuration(duration);
  };

  useEffect(() => {
    setTheme(initTheme());
    loadSilhouetteDuration();
    loadSilhouette();
    loadImages();
  }, []);

  return {
    theme: theme,
    setTheme: setTheme,
    bgHzUrlLight: bgHzUrlLight,
    bgHzUrlDark: bgHzUrlDark,
    bgVerUrlLight: bgVerUrlLight,
    bgVerUrlDark: bgVerUrlDark,
    applyBg: applyBg,
    silhouetteTr: silhouetteTr,
    applySilhouette: applySilhouette,
    silhouetteDuration: silhouetteDuration,
    setSilhouetteDuration: eSetSilhouetteDuration,
  };
};
