import { useState } from "react";
import { db } from "../db";
import DEFAULT from "@/constants/DefaultStartupApps";

export interface StartupAppConfig {
  appId: string;
  position?: string;
}

export interface EtcStartupSettings {
  startupApps: StartupAppConfig[];
  loadStartupApps: () => Promise<StartupAppConfig[]>;
  addStartupApp: (appId: string, position?: string) => void;
  removeStartupApp: (appId: string) => void;
  updateStartupAppPosition: (appId: string, position: string) => void;
}

export const EtcStartup = (): EtcStartupSettings => {
  const [startupApps, setStartupApps] = useState<StartupAppConfig[]>([]);

  const loadStartupApps = async () => {
    const file = await db.loadFile("startupApps");
    let readedStartupApps: StartupAppConfig[] = [];
    if (file) {
      const text = await file.blob.text();
      const lines = text.split("\n").filter((line) => line.trim());
      readedStartupApps = lines.map((line) => {
        const [appId, position] = line.split(",").map((s) => s.trim());
        return { appId, position };
      });
      setStartupApps(readedStartupApps);
    } else {
      await saveStartupApps(DEFAULT);
      readedStartupApps = DEFAULT;
    }

    return readedStartupApps;
  };

  const saveStartupApps = async (startupApps: StartupAppConfig[] = []) => {
    setStartupApps(startupApps);
    const text = startupApps
      .map((config) =>
        config.position ? `${config.appId},${config.position}` : config.appId
      )
      .join("\n");
    await db.saveFile(
      "startupApps",
      "startupApps.conf",
      "etc",
      new Blob([text], { type: "text/plain" })
    );
  };

  const addStartupApp = async (appId: string, position?: string) => {
    if (startupApps.some((app) => app.appId === appId)) return;
    await saveStartupApps([...startupApps, { appId, position }]);
  };

  const removeStartupApp = (appId: string) => {
    saveStartupApps(startupApps.filter((app) => app.appId !== appId));
  };

  const updateStartupAppPosition = (appId: string, position: string) => {
    const updatedApps = startupApps.map((app) =>
      app.appId === appId ? { ...app, position } : app
    );
    saveStartupApps(updatedApps);
  };

  return {
    startupApps,
    loadStartupApps,
    addStartupApp,
    removeStartupApp,
    updateStartupAppPosition,
  };
};
