
import {
  WindowState,
  BorderConstrains,
  WindowAction,
  TaskBarRef,
  AppsMenuRef,
} from "@/components/Window/WindowManager";
import { createContext } from "react";

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
