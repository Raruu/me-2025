import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { TaskBarItems } from "./TaskBarItems";
import { launcherHinaLovesMidokuni } from "@/components/Apps/HinaLovesMidokuni";
import { launcherMidokuniStudentInsigh } from "@/components/Apps/MidokuniStudentInsigh";
import { launcherSetting } from "@/components/Apps/Setting";
import { launcherFileExplorer } from "@/components/Apps/FileExplorer";
import { launcherBrowser } from "@/components/Apps/Browser";
import { launcherShareApps } from "@/components/Apps/ShareApps";

export const MenuAppsList: WindowLauncherProps[] = [
  launcherBrowser,
  launcherHinaLovesMidokuni,
  launcherMidokuniStudentInsigh,
  launcherSetting,
  launcherFileExplorer,
  launcherShareApps,
];

export const getAllAppsList = () => {
  return [
    ...TaskBarItems,
    ...MenuAppsList.filter(
      (item) => !TaskBarItems.some((i) => i.appId === item.appId)
    ),
  ].sort((a, b) => a.title.localeCompare(b.title));
};
