import { EtcContextType } from "@/lib/Etc";
import { EtcTaskbar } from "@/lib/Etc/EtcTaskbar";
import { EtcTheme } from "@/lib/Etc/EtcTheme";
import { EtcWindowMode } from "@/lib/Etc/EtcWindowMode";

export const useEtc = (): EtcContextType => {
  //   TaskBar
  const taskbarSettings = EtcTaskbar();

  // Theme
  const themeSettings = EtcTheme();

  // Window Mode
  const windowModeSettings = EtcWindowMode();

  return {
    taskbarSettings: taskbarSettings,
    themeSettings: themeSettings,
    windowModeSettings: windowModeSettings,
  };
};
