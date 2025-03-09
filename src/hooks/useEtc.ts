import { EtcContextType } from "@/lib/Etc/Etc";
import { EtcTaskbar } from "@/lib/Etc/EtcTaskbar";
import { EtcTheme } from "@/lib/Etc/EtcTheme";

export const useEtc = (): EtcContextType => {
  //   TaskBar
  const taskbarSettings = EtcTaskbar();

  // Theme
  const themeSettings = EtcTheme();

  return {
    taskbarSettings: taskbarSettings,
    themeSettings: themeSettings,
  };
};
