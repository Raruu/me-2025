import { EtcTaskbarSettings } from "@/components/ui/Taskbar/Taskbar";
import { EtcThemeSettings } from "@/styles/theme";
import { createContext } from "react";

export interface EtcContextType {
  taskbarSettings: EtcTaskbarSettings;
  themeSettings: EtcThemeSettings;
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
  },
});
