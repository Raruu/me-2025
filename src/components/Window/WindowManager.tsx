"use client";

import { useReducer, useRef, useEffect, useState, useMemo } from "react";
import { Window } from ".";
import { StatusBar } from "../ui/Statusbar/Statusbar";
import { Taskbar, TaskbarPlacement } from "../ui/Taskbar/Taskbar";
import { BackgroundUwU } from "../ui/Background/BackgroundUwU";
import { AppsMenu } from "../ui/AppsMenu";
import { useSearchParams } from "next/navigation";
import { getAllAppsList } from "@/configs/AppsList";
import {
  AppsMenuRef,
  BorderConstrains,
  TaskBarRef,
  WindowAction,
  WindowManagerContext,
  WindowState,
} from "@/providers/WindowManagerContext";
import { EtcStartup, StartupAppConfig } from "@/lib/Etc/EtcStartup";
import { db } from "@/lib/db";

export const WindowManager = () => {
  const searchParams = useSearchParams();

  const statusBarRef = useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement
  );
  const taskBarRef = useRef<TaskBarRef>(null as unknown as TaskBarRef);
  const appsMenuRef = useRef<AppsMenuRef>(null as unknown as AppsMenuRef);
  const [borderConstrains, setBorderConstrains] = useState<BorderConstrains>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const handleWindowResize = () => {
    if (statusBarRef.current) {
      setBorderConstrains({
        top: statusBarRef.current.clientHeight,
        right: window.innerWidth - (taskBarRef.current.right ?? 0),
        bottom: window.innerHeight - (taskBarRef.current.bottom ?? 0),
        left: 0 + (taskBarRef.current.left ?? 0),
      });
    }
  };

  useEffect(() => {
    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const reducer = (
    state: WindowState[],
    action: WindowAction
  ): WindowState[] => {
    switch (action.type) {
      case "MINIMIZE":
        return state.map((window) => {
          if (window.id === action.id) {
            return { ...window, isMinimized: true };
          }
          return window;
        });
      case "MAXIMIZE":
        return state.map((window) => {
          if (window.id === action.id) {
            return { ...window, isMaximized: !window.isMaximized };
          }
          return window;
        });
      case "CLOSE":
        const close = () => {
          const targetIndex = state.findIndex(
            (window) => window.id === action.id
          );
          const targetWindow = state[targetIndex];

          if (targetIndex > -1) {
            const tmpZIndex = targetWindow.zIndex;
            for (let i = 0; i < state.length; i++) {
              if (state[i].zIndex > tmpZIndex) {
                state[i].zIndex -= 1;
              }
            }
          }
        };
        close();

        return state.filter((window) => window.id !== action.id);
      case "ADD_WINDOW":
        const screenWidth = borderConstrains.right - borderConstrains.left;
        const screenHeight = borderConstrains.bottom - borderConstrains.top;
        if (screenWidth < action.window.size.width) {
          action.window.size.width = screenWidth;
          if (screenWidth < action.window.minSize.width) {
            action.window.minSize.width = screenWidth;
          }
        }
        if (screenHeight < action.window.size.height) {
          action.window.size.height = screenHeight;
          if (screenHeight < action.window.minSize.height) {
            action.window.minSize.height = screenHeight;
          }
        }

        if (
          action.window.position?.x === 0 &&
          action.window.position?.y === 0
        ) {
          action.window.position = {
            x:
              (borderConstrains.right + borderConstrains.left) / 2 -
              action.window.size.width / 2,
            y:
              (borderConstrains.bottom + borderConstrains.top) / 2 -
              action.window.size.height / 2,
          };
        }

        if (action.window.launcherRef?.current === null) {
          const existingWindow = state.find(
            (window) => window.appId === action.window.appId
          );
          if (existingWindow) {
            action.window.launcherRef = existingWindow.launcherRef;
          }
        }

        action.window.zIndex = state.length;

        return [...state, action.window];
      case "MOVE":
        return state.map((window) => {
          if (window.id === action.id) {
            const { x, y } = action.position;
            return {
              ...window,
              position: {
                x,
                y: y < borderConstrains.top ? borderConstrains.top : y,
              },
            };
          }
          return window;
        });
      case "RESIZE":
        return state.map((window) => {
          if (window.id === action.id) {
            return { ...window, size: action.size };
          }
          return window;
        });
      case "FOCUS":
        const focus = (): boolean => {
          const targetIndex = state.findIndex(
            (window) => window.id === action.id
          );
          if (targetIndex > -1) {
            const targetWindow = state[targetIndex];
            targetWindow.isMinimized = false;
            const { innerWidth, innerHeight } = window;
            const { x, y } = targetWindow.position;
            const { width, height } = targetWindow.size;
            if (x + width > innerWidth) {
              targetWindow.position.x = (innerWidth - width) / 2;
            }
            if (y + height > innerHeight) {
              targetWindow.position.y = (innerHeight - height) / 2;
            }

            if (targetWindow.zIndex === state.length) return false;

            const tmpZIndex = targetWindow.zIndex;
            for (let i = 0; i < state.length; i++) {
              if (state[i].zIndex > tmpZIndex) {
                state[i].zIndex -= 1;
              }
            }
            targetWindow.zIndex = state.length - 1;
          }
          return true;
        };

        return focus() ? [...state] : state;
      default:
        return state;
    }
  };

  const [windows, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const hasMaximizedWindow = windows.some(
      (window) => window.isMaximized && !window.isMinimized
    );
    if (hasMaximizedWindow) {
      document.documentElement.setAttribute("class", "no-tr");
    } else {
      document.documentElement.setAttribute("class", "");
    }
  }, [windows]);

  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      taskBarRef,
      statusBarRef,
      appsMenuRef,
      isAppsMenuOpen,
      setIsAppsMenuOpen,
      windows,
      borderConstrains,
      dispatch,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      taskBarRef,
      statusBarRef,
      appsMenuRef,
      isAppsMenuOpen,
      borderConstrains,
      windows.length,
    ]
  );

  const launchQuery = searchParams.getAll("launch");
  const positionQuery = searchParams.getAll("position");

  const { loadStartupApps } = EtcStartup();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const appList = getAllAppsList();

      // Launch startup apps
      const launchStartupApps = async () => {
        const startupApps = await loadStartupApps();
        console.log(startupApps);
        startupApps.forEach((config, index) => {
          const launcher = appList.find((app) => app.appId === config.appId);
          if (launcher !== undefined) {
            launchApp(launcher, index, config.position || null);
          }
        });
      };

      const launchApp = (
        launcher: (typeof appList)[number],
        index: number,
        position: string | null
      ) => {
        const screenWidth =
          borderConstrains.right - borderConstrains.left || window.innerWidth;
        const screenHeight =
          borderConstrains.bottom - borderConstrains.top || window.innerHeight;

        const winSize = {
          ...(launcher.size ?? { width: 300, height: 300 }),
        };
        const winPos = { ...(launcher.position ?? { x: 0, y: 0 }) };
        let isMax = launcher.isMaximized ?? false;

        /* Supported position values (case-insensitive):
          - fullscreen | max | maximized
          - left, right
          - top-left, top-right, bottom-left, bottom-right
          - center | middle
          - numeric coordinate lists: "x,y" or "x,y,w,h"
            */
        const parsePosition = (posStr: string | null) => {
          if (!posStr) return;
          const s = posStr.toLowerCase();

          if (s === "fullscreen" || s === "max" || s === "maximized") {
            isMax = true;
            return;
          }

          // halves
          if (s === "left") {
            winSize.width = Math.floor(screenWidth / 2);
            winSize.height = screenHeight;
            winPos.x = borderConstrains.left;
            winPos.y =
              winSize.height -
              winSize.height +
              (statusBarRef.current?.clientHeight ?? 0);
            return;
          }
          if (s === "right") {
            winSize.width = Math.floor(screenWidth / 2);
            winSize.height = screenHeight;
            winPos.x = borderConstrains.left + Math.ceil(screenWidth / 2);
            winPos.y =
              borderConstrains.top + (statusBarRef.current?.clientHeight ?? 0);
            return;
          }

          // corners
          if (s === "top-left" || s === "topleft") {
            winPos.x = borderConstrains.left;
            winPos.y =
              winSize.height -
              winSize.height +
              (statusBarRef.current?.clientHeight ?? 0);
            return;
          }
          if (s === "top-right" || s === "topright") {
            winPos.x = borderConstrains.left + screenWidth - winSize.width;
            winPos.y = borderConstrains.top;
            return;
          }
          if (s === "bottom-left" || s === "bottomleft") {
            winPos.x = borderConstrains.left;
            winPos.y = borderConstrains.top + screenHeight - winSize.height;
            return;
          }
          if (s === "bottom-right" || s === "bottomright") {
            winPos.x = borderConstrains.left + screenWidth - winSize.width;
            winPos.y = borderConstrains.top + screenHeight - winSize.height;
            return;
          }

          // center
          if (s === "center" || s === "middle") {
            winPos.x =
              borderConstrains.left +
              Math.floor((screenWidth - winSize.width) / 2);
            winPos.y =
              borderConstrains.top +
              Math.floor((screenHeight - winSize.height) / 2);
            return;
          }

          // numeric coordinates: 'x,y' or 'x,y,w,h'
          const parts = s.split(",").map((p) => p.trim());
          const nums = parts
            .map((p) => Number(p))
            .filter((n) => !Number.isNaN(n));
          if (nums.length === 2) {
            winPos.x = nums[0];
            winPos.y = nums[1];
            return;
          }
          if (nums.length === 4) {
            winPos.x = nums[0];
            winPos.y = nums[1];
            winSize.width = nums[2];
            winSize.height = nums[3];
            return;
          }
        };

        parsePosition(position);

        if (winSize.width > screenWidth) winSize.width = screenWidth;
        if (winSize.height > screenHeight) winSize.height = screenHeight;

        // if launcher had 0,0 as position, then center unless position query set it
        if (
          (launcher.position?.x === 0 && launcher.position?.y === 0) ||
          (launcher.position === undefined && winPos.x === 0 && winPos.y === 0)
        ) {
          if (position === null) {
            winPos.x =
              borderConstrains.left +
              Math.floor((screenWidth - winSize.width) / 2);
            winPos.y =
              borderConstrains.top +
              Math.floor((screenHeight - winSize.height) / 2);
          }
        }

        dispatch({
          type: "ADD_WINDOW",
          window: {
            zIndex: windows.length,
            id: Date.now() + index,
            title: launcher.title,
            appId: launcher.appId,
            initialSubtitle: launcher.initialSubtitle,
            icon: launcher.icon ?? "mingcute:terminal-box-line",
            content: launcher.content,
            isMaximized: isMax,
            isMinimized: launcher.isMinimized ?? false,
            size: winSize,
            position: winPos,
            minSize: launcher.minSize ?? { width: 300, height: 300 },
            launcherRef: launcher.launcherRef,
          },
        });
      };

      if (launchQuery.length > 0) {
        launchQuery.forEach((query, index) => {
          const launcher = appList.find((app) => app.appId === query);
          const position =
            index < positionQuery.length ? positionQuery[index] : null;
          if (launcher !== undefined) {
            launchApp(launcher, index, position);
          }
        });
      } else {
        launchStartupApps();
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <WindowManagerContext.Provider value={contextValue}>
      <main className="flex flex-col justify-between min-h-screen">
        <StatusBar />
        <BackgroundUwU />
        <div
          className="bg-transparent transition-colors duration-300
        text-background absolute min-h-full min-w-full overflow-hidden z-0"
        >
          {windows.map((window) => (
            <Window
              key={window.id}
              {...window}
              isFocused={window.zIndex >= windows.length - 1}
            />
          ))}
        </div>
        <Taskbar reTriggerConstrains={handleWindowResize} />
        {isAppsMenuOpen && <AppsMenu />}
      </main>
    </WindowManagerContext.Provider>
  );
};
