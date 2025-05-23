"use client";

import {
  useReducer,
  useRef,
  useEffect,
  useState,
  createContext,
  useMemo,
} from "react";
import { Window } from "./Window";
import { StatusBar } from "../ui/Statusbar/Statusbar";
import { Taskbar, TaskbarPlacement } from "../ui/Taskbar/Taskbar";
import { BackgroundUwU } from "../ui/Background/BackgroundUwU";
import { AppsMenu } from "../ui/AppsMenu";

type TaskBarRef = HTMLDivElement &
  BorderConstrains & { taskbarPlacement?: TaskbarPlacement };

type AppsMenuRef = HTMLDivElement & { close: () => void };

export const WindowManagerContext = createContext<{
  taskBarRef: React.RefObject<TaskBarRef>;
  statusBarRef: React.RefObject<HTMLDivElement>;
  appsMenuRef: React.RefObject<AppsMenuRef>;
  isAppsMenuOpen: boolean;
  setIsAppsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  windows: WindowState[];
  borderConstrains: BorderConstrains;
  dispatch: React.Dispatch<WindowAction>;
}>({
  taskBarRef: { current: null as unknown as TaskBarRef },
  statusBarRef: { current: null as unknown as HTMLDivElement },
  appsMenuRef: { current: null as unknown as AppsMenuRef },
  isAppsMenuOpen: false,
  setIsAppsMenuOpen: () => {},
  windows: [],
  borderConstrains: { top: 0, right: 0, bottom: 0, left: 0 },
  dispatch: () => {},
});

export interface WindowState {
  zIndex: number;
  id: number;
  appId?: string;
  title: string;
  icon?: string;
  initialSubtitle?: string;
  content: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  minSize: {
    width: number;
    height: number;
  };
  launcherRef?: React.RefObject<HTMLDivElement | null>;
  initialWindowColor?: string;
}

export type WindowAction =
  | { type: "MINIMIZE"; id: number }
  | { type: "MAXIMIZE"; id: number }
  | { type: "CLOSE"; id: number }
  | { type: "ADD_WINDOW"; window: WindowState }
  | { type: "MOVE"; id: number; position: { x: number; y: number } }
  | { type: "RESIZE"; id: number; size: { width: number; height: number } }
  | { type: "FOCUS"; id: number };

export type BorderConstrains = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const WindowManager = () => {
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
