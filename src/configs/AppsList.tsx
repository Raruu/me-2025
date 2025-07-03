import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { createRef } from "react";
import { TaskBarItems } from "./TaskBarItems";
import { launcherHinaLovesMidokuni } from "@/components/Apps/HinaLovesMidokuni";
import { launcherMidokuniStudentInsigh } from "@/components/Apps/MidokuniStudentInsigh";
import { launcherSetting } from "@/components/Apps/Setting/Setting";
import { collegeLauncherSPKJS2 } from "@/components/Apps/College/SPK-JS2";
import { launcherFileExplorer } from "@/components/Apps/FileExplorer";

export const MenuAppsList: WindowLauncherProps[] = [
  {
    title: `This`,
    appId: "localhostApp",
    content: (
      <iframe
        className="w-full h-full"
        src={typeof window === "undefined" ? "" : window.location.href}
        allowFullScreen
      ></iframe>
    ),
    size: {
      width: 300,
      height: 700,
    },
    launcherRef: createRef(),
  },
  launcherHinaLovesMidokuni,
  launcherMidokuniStudentInsigh,
  launcherSetting,
  collegeLauncherSPKJS2,
  launcherFileExplorer,
];

export const getAllAppsList = () => {
  return [
    ...TaskBarItems,
    ...MenuAppsList.filter(
      (item) => !TaskBarItems.some((i) => i.appId === item.appId)
    ),
  ].sort((a, b) => a.title.localeCompare(b.title));
};
