import { EtcTaskbarSettings } from "@/components/ui/Taskbar/Taskbar";
import { EtcThemeSettings } from "@/styles/theme";
import { EtcWindowModeSettings } from "./EtcWindowMode";
import { createContext } from "react";

export interface EtcContextType {
  taskbarSettings: EtcTaskbarSettings;
  themeSettings: EtcThemeSettings;
  windowModeSettings: EtcWindowModeSettings;
}

export const EtcContext = createContext<EtcContextType>({
  taskbarSettings: {
    taskbarPlacement: "bottom",
    setTaskbarPlacement: () => {},
    isExpanded: false,
    setIsExpanded: () => {},
  },
  themeSettings: {
    theme: "dark",
    setTheme: () => {},
    bgHzUrlLight: "",
    bgHzUrlDark: "",
    bgVerUrlLight: "",
    bgVerUrlDark: "",
    applyBg: () => {},
    silhouetteTr: "",
    applySilhouette: () => {},
    silhouetteDuration: 0,
    setSilhouetteDuration: () => {},
  },
  windowModeSettings: {
    windowMode: "windowed",
    setWindowMode: () => {},
    workspaceCount: 4,
    setWorkspaceCount: () => {},
    tilingGap: 4,
    setTilingGap: () => {},
  },
});
