import { useEffect, useState } from "react";
import { db } from "../db";

export type WindowMode = "windowed" | "tiling";

export interface EtcWindowModeSettings {
  windowMode: WindowMode;
  setWindowMode: (mode: WindowMode) => void;
  workspaceCount: number;
  setWorkspaceCount: (count: number) => void;
  tilingGap: number;
  setTilingGap: (gap: number) => void;
  autoTilingMobile: boolean;
  setAutoTilingMobile: (value: boolean) => void;
}

export const EtcWindowMode = (): EtcWindowModeSettings => {
  const [windowMode, setWindowModeState] = useState<WindowMode>("windowed");
  const [workspaceCount, setWorkspaceCountState] = useState(9);
  const [tilingGap, setTilingGapState] = useState(4);
  const [autoTilingMobile, setAutoTilingMobileState] = useState(true);

  useEffect(() => {
    const readSettings = async () => {
      const file = await db.loadFile("windowModeSettings");
      if (file) {
        const text = await file.blob.text();
        const lines = text.split("\n");
        for (const line of lines) {
          const [key, value] = line.split("=");
          if (key === "windowMode") {
            setWindowModeState(value as WindowMode);
          } else if (key === "workspaceCount") {
            setWorkspaceCountState(parseInt(value) || 9);
          } else if (key === "tilingGap") {
            setTilingGapState(parseInt(value) || 4);
          } else if (key === "autoTilingMobile") {
            setAutoTilingMobileState(value === "true");
          }
        }
      }
    };
    readSettings();
  }, []);

  const saveSettings = (
    mode: WindowMode,
    wsCount: number,
    gap: number,
    autoTiling: boolean,
  ) => {
    const text =
      `windowMode=${mode}\n` +
      `workspaceCount=${wsCount}\n` +
      `tilingGap=${gap}\n` +
      `autoTilingMobile=${autoTiling}`;
    db.saveFile(
      "windowModeSettings",
      "windowMode.conf",
      "etc",
      new Blob([text], { type: "text/plain" }),
    );
  };

  const setWindowMode = (mode: WindowMode) => {
    setWindowModeState(mode);
    saveSettings(mode, workspaceCount, tilingGap, autoTilingMobile);
  };

  const setWorkspaceCount = (count: number) => {
    const clamped = Math.max(1, Math.min(9, count));
    setWorkspaceCountState(clamped);
    saveSettings(windowMode, clamped, tilingGap, autoTilingMobile);
  };

  const setTilingGap = (gap: number) => {
    const clamped = Math.max(0, Math.min(32, gap));
    setTilingGapState(clamped);
    saveSettings(windowMode, workspaceCount, clamped, autoTilingMobile);
  };

  const setAutoTilingMobile = (value: boolean) => {
    setAutoTilingMobileState(value);
    saveSettings(windowMode, workspaceCount, tilingGap, value);
  };

  return {
    windowMode,
    setWindowMode,
    workspaceCount,
    setWorkspaceCount,
    tilingGap,
    setTilingGap,
    autoTilingMobile,
    setAutoTilingMobile,
  };
};
