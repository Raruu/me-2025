"use client";

import {
  useReducer,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { Window } from ".";
import { StatusBar } from "../ui/Statusbar/Statusbar";
import { Taskbar } from "../ui/Taskbar/Taskbar";
import { BackgroundUwU } from "../ui/Background/BackgroundUwU";
import { AppsMenu } from "../ui/AppsMenu";
import { useSearchParams } from "next/navigation";
import { getAllAppsList } from "@/configs/AppsList";
import {
  AppsMenuRef,
  TaskBarRef,
  WindowManagerContext,
  WindowState,
} from "@/providers/WindowManagerContext";
import { EtcStartup } from "@/lib/Etc/EtcStartup";
import { EtcContext } from "@/lib/Etc";
import { createWindowReducer } from "./windowReducer";
import { useBorderConstrains } from "@/hooks/useBorderConstrains";
import { useTilingRects } from "@/hooks/useTilingRects";
import { useWindowKeyboardShortcuts } from "@/hooks/useWindowKeyboardShortcuts";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const WindowManager = () => {
  const searchParams = useSearchParams();
  const { windowModeSettings } = useContext(EtcContext);
  const {
    windowMode: rawWindowMode,
    workspaceCount,
    tilingGap,
    autoTilingMobile,
  } = windowModeSettings;
  const mediaQuery = useMediaQuery();
  const isMobile = mediaQuery === "default" || mediaQuery === "sm";
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;
  const windowMode = isMobile && autoTilingMobile ? "tiling" : rawWindowMode;

  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const activeWorkspaceRef = useRef(activeWorkspace);
  activeWorkspaceRef.current = activeWorkspace;
  const hoverFocusSuppressedUntilRef = useRef(0);

  useEffect(() => {
    if (activeWorkspace > workspaceCount) setActiveWorkspace(workspaceCount);
  }, [workspaceCount, activeWorkspace]);

  const statusBarRef = useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement,
  );
  const taskBarRef = useRef<TaskBarRef>(null as unknown as TaskBarRef);
  const appsMenuRef = useRef<AppsMenuRef>(null as unknown as AppsMenuRef);
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);

  const { borderConstrains, borderConstrainsRef, recalculate } =
    useBorderConstrains(statusBarRef, taskBarRef);

  const reducer = useMemo(
    () =>
      createWindowReducer({
        borderConstrainsRef,
        activeWorkspaceRef,
        setActiveWorkspace,
      }),
    [],
  );

  const [windows, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const hasMaximised = windows.some((w) => w.isMaximized && !w.isMinimized);
    document.documentElement.setAttribute("class", hasMaximised ? "no-tr" : "");
  }, [windows]);

  const tilingRects = useTilingRects(
    windowMode,
    windows,
    borderConstrains,
    tilingGap,
    workspaceCount,
  );

  useWindowKeyboardShortcuts({
    windows,
    workspaceCount,
    tilingRects,
    activeWorkspaceRef,
    dispatch,
    setActiveWorkspace,
    hoverFocusSuppressedUntilRef,
  });

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
      activeWorkspace,
      setActiveWorkspace,
      windowMode,
      tilingRects,
      hoverFocusSuppressedUntilRef,
    }),
    [
      isAppsMenuOpen,
      borderConstrains,
      windows,
      activeWorkspace,
      windowMode,
      tilingRects,
    ],
  );

  const launchQuery = searchParams.getAll("launch");
  const positionQuery = searchParams.getAll("position");
  const { loadStartupApps } = EtcStartup();

  const buildLaunchHelper = useCallback(() => {
    const appList = getAllAppsList();
    const screenWidth =
      borderConstrains.right - borderConstrains.left || window.innerWidth;
    const screenHeight =
      borderConstrains.bottom - borderConstrains.top || window.innerHeight;

    /* Supported position values (case-insensitive):
       - fullscreen | max | maximized
       - left, right
       - top-left, top-right, bottom-left, bottom-right
       - center | middle
       - numeric: "x,y" or "x,y,w,h"
    */
    const parsePosition = (
      posStr: string | null,
      winSize: { width: number; height: number },
      winPos: { x: number; y: number },
      isMax: boolean,
    ) => {
      if (!posStr) return { winSize, winPos, isMax };
      const s = posStr.toLowerCase();

      if (s === "fullscreen" || s === "max" || s === "maximized")
        return { winSize, winPos, isMax: true };
      if (s === "left")
        return {
          winSize: { width: Math.floor(screenWidth / 2), height: screenHeight },
          winPos: {
            x: borderConstrains.left,
            y:
              winSize.height -
              winSize.height +
              (statusBarRef.current?.clientHeight ?? 0),
          },
          isMax,
        };
      if (s === "right")
        return {
          winSize: { width: Math.floor(screenWidth / 2), height: screenHeight },
          winPos: {
            x: borderConstrains.left + Math.ceil(screenWidth / 2),
            y: borderConstrains.top + (statusBarRef.current?.clientHeight ?? 0),
          },
          isMax,
        };
      if (s === "top-left" || s === "topleft")
        return {
          winSize,
          winPos: {
            x: borderConstrains.left,
            y:
              winSize.height -
              winSize.height +
              (statusBarRef.current?.clientHeight ?? 0),
          },
          isMax,
        };
      if (s === "top-right" || s === "topright")
        return {
          winSize,
          winPos: {
            x: borderConstrains.left + screenWidth - winSize.width,
            y: borderConstrains.top,
          },
          isMax,
        };
      if (s === "bottom-left" || s === "bottomleft")
        return {
          winSize,
          winPos: {
            x: borderConstrains.left,
            y: borderConstrains.top + screenHeight - winSize.height,
          },
          isMax,
        };
      if (s === "bottom-right" || s === "bottomright")
        return {
          winSize,
          winPos: {
            x: borderConstrains.left + screenWidth - winSize.width,
            y: borderConstrains.top + screenHeight - winSize.height,
          },
          isMax,
        };
      if (s === "center" || s === "middle")
        return {
          winSize,
          winPos: {
            x:
              borderConstrains.left +
              Math.floor((screenWidth - winSize.width) / 2),
            y:
              borderConstrains.top +
              Math.floor((screenHeight - winSize.height) / 2),
          },
          isMax,
        };

      const nums = s
        .split(",")
        .map((p) => Number(p.trim()))
        .filter((n) => !Number.isNaN(n));
      if (nums.length === 2)
        return { winSize, winPos: { x: nums[0], y: nums[1] }, isMax };
      if (nums.length === 4)
        return {
          winSize: { width: nums[2], height: nums[3] },
          winPos: { x: nums[0], y: nums[1] },
          isMax,
        };

      return { winSize, winPos, isMax };
    };

    const launchApp = (
      launcher: (typeof appList)[number],
      index: number,
      position: string | null,
      workspace?: number,
    ) => {
      let winSize = { ...(launcher.size ?? { width: 300, height: 300 }) };
      let winPos = { ...(launcher.position ?? { x: 0, y: 0 }) };
      let isMax = launcher.isMaximized ?? false;

      ({ winSize, winPos, isMax } = parsePosition(
        position,
        winSize,
        winPos,
        isMax,
      ));

      if (winSize.width > screenWidth) winSize.width = screenWidth;
      if (winSize.height > screenHeight) winSize.height = screenHeight;

      // Centre windows that have no explicit position
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
          workspace: workspace ?? activeWorkspace,
        } as WindowState,
      });
    };

    return { appList, launchApp };
  }, [borderConstrains, activeWorkspace]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const { appList, launchApp } = buildLaunchHelper();

      if (launchQuery.length > 0) {
        launchQuery.forEach((query, index) => {
          const launcher = appList.find((app) => app.appId === query);
          const position =
            index < positionQuery.length ? positionQuery[index] : null;
          if (launcher) launchApp(launcher, index, position);
        });
      } else {
        const startupApps = await loadStartupApps();
        startupApps.forEach((config, index) => {
          const launcher = appList.find((app) => app.appId === config.appId);
          const targetWorkspace = isMobileRef.current
            ? (index % 9) + 1
            : undefined;
          if (launcher)
            launchApp(launcher, index, config.position || null, targetWorkspace);
        });
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
          {windows.map((win) => (
            <Window
              key={win.id}
              {...win}
              isFocused={win.zIndex >= windows.length - 1}
              isHiddenByWorkspace={win.workspace !== activeWorkspace}
            />
          ))}
        </div>
        <Taskbar reTriggerConstrains={recalculate} />
        {isAppsMenuOpen && <AppsMenu />}
      </main>
    </WindowManagerContext.Provider>
  );
};
