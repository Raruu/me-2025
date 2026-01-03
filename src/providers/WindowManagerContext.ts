import { TaskbarPlacement } from "@/components/ui/Taskbar/Taskbar";
import { createContext } from "react";

export type TaskBarRef = HTMLDivElement &
  BorderConstrains & { taskbarPlacement?: TaskbarPlacement };

export type AppsMenuRef = HTMLDivElement & { close: () => void };

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
