"use client";

import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { Icon } from "@iconify/react";
import { useContext, useEffect, useState } from "react";
import { WindowManagerContext } from "@/providers/WindowManagerContext";
import { launcherSetting } from "./Setting";
import { WindowContext } from "@/providers/WindowContext";
import { EtcStartup } from "@/lib/Etc/EtcStartup";
import { useDBusApp } from "@/hooks/useDBusApp";

const FirstTimeExperience = () => {
  const { dispatch, windows } = useContext(WindowManagerContext);
  const { windowId, setFreeSlot } = useContext(WindowContext);
  const dbus = useDBusApp(launcherFirstTimeExperience.appId!, windowId);
  const { loadStartupApps, addStartupApp, removeStartupApp } = EtcStartup();

  const [runInStartup, setRunInStartup] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStartupStatus = async () => {
      const apps = await loadStartupApps();
      const isInStartup = apps.some(
        (app) => app.appId === launcherFirstTimeExperience.appId,
      );
      setRunInStartup(isInStartup);
    };
    checkStartupStatus();
  }, []);

  useEffect(() => {
    if (runInStartup === null) return;
    if (runInStartup) {
      addStartupApp(launcherFirstTimeExperience.appId!, "center");
    } else {
      removeStartupApp(launcherFirstTimeExperience.appId!);
    }
  }, [runInStartup]);

  useEffect(() => {
    setFreeSlot(
      <div className="flex items-center gap-2 pr-2">
        <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer select-none">
          <span className="whitespace-nowrap">Run in startup</span>
          <button
            role="switch"
            aria-checked={runInStartup ?? false}
            onClick={() => setRunInStartup((v) => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
              runInStartup ? "bg-primary" : "bg-secondary"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                runInStartup ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </label>
      </div>,
    );
  }, [runInStartup]);

  const openSettings = async (settingIndex: number = 0) => {
    const settingsWindow = windows.find((w) => w.appId === "settings");
    const sendMessage = () =>
      dbus.sendMessage(
        `${launcherSetting.appId!}-events`,
        {
          index: settingIndex,
        },
        launcherSetting.appId!,
      );
    if (settingsWindow) {
      dispatch({ type: "FOCUS", id: settingsWindow.id });
      sendMessage();
    } else {
      dispatch({
        type: "ADD_WINDOW",
        window: {
          zIndex: windows.length,
          id: Date.now(),
          content: launcherSetting.content,
          appId: launcherSetting.appId,
          title: launcherSetting.title,
          icon: launcherSetting.icon,
          isMaximized: launcherSetting.isMaximized ?? false,
          isMinimized: launcherSetting.isMinimized ?? false,
          size: launcherSetting.size ?? { width: 300, height: 300 },
          position: launcherSetting.position ?? { x: 0, y: 0 },
          minSize: launcherSetting.minSize ?? { width: 300, height: 300 },
          callback: sendMessage,
        },
      });
    }
  };

  return (
    <div className="w-full h-full bg-background overflow-auto p-6 select-none">
      <div className="w-full h-full flex flex-col">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-tertiary mb-2 shadow-xl">
            <Icon
              icon="raruu:patapata-lanubiscuit"
              className="text-7xl hover:text-9xl transition-all duration-300"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Welcome!
          </h1>
        </div>

        <div className="flex flex-row gap-4 mb-2">
          {/* Startup Apps */}
          <button
            onClick={() => openSettings(2)}
            className="relative rounded-2xl p-4 text-left
              hover:shadow-lg transition-all duration-150 hover:-translate-y-1
              overflow-hidden w-1/2 border border-background-tr"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-600/5 rounded-full -mr-8 -mt-8" />
            <div className="relative flex flex-col justify-between h-full">
              <div className="flex flex-col gap-1 items-start justify-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-blue-600 mb-2 shadow-lg group-hover:scale-110 transition-transform">
                  <Icon
                    icon="mdi:rocket-launch"
                    className="text-xl text-white"
                  />
                </div>
                <h2 className="text-base font-bold text-foreground mb-2">
                  Default Startup Apps
                </h2>
                <p className="text-sm text-foreground/60 leading-relaxed mb-2">
                  Configure startup applications.
                </p>
              </div>
              <div className="flex items-center text-primary font-semibold">
                <span>Configure</span>
                <Icon
                  icon="mdi:arrow-right"
                  className="ml-1 text-sm group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </div>
          </button>

          {/* Theme */}
          <button
            onClick={() => openSettings(0)}
            className="relative rounded-2xl p-4 text-left
              hover:shadow-lg transition-all duration-150 hover:-translate-y-1
              overflow-hidden w-1/2 border border-background-tr"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-pink-600/5 rounded-full -mr-8 -mt-8" />
            <div className="relative flex flex-col justify-between h-full">
              <div className="flex flex-col gap-1 items-start justify-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-pink-600 mb-2 shadow-lg group-hover:scale-110 transition-transform">
                  <Icon icon="mdi:palette" className="text-xl text-white" />
                </div>
                <h2 className="text-base font-bold text-foreground mb-2">
                  Change Theme
                </h2>
                <p className="text-sm text-foreground/60 leading-relaxed mb-2">
                  Personalize somethings, like wallpapers and taskbar layout.
                </p>
              </div>
              <div className="flex items-center text-primary font-semibold">
                <span>Customize</span>
                <Icon
                  icon="mdi:arrow-right"
                  className="ml-1 text-sm group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-center flex-1 text-foreground/90">
          <p className="font-light text-sm">⸜(｡˃ ᵕ ˂)⸝♡</p>
        </div>
      </div>
    </div>
  );
};

export const launcherFirstTimeExperience: WindowLauncherProps = {
  title: "First Time Experience",
  appId: "first-time-experience",
  icon: "pajamas:first-contribution",
  content: <FirstTimeExperience />,
  size: {
    width: 600,
    height: 500,
  },
  minSize: {
    width: 600,
    height: 470,
  },
};
