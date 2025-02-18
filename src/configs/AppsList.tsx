import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { createRef } from "react";
import { TaskBarItems } from "./TaskBarItems";
import { launcherHinaLovesMidokuni } from "@/components/Apps/HinaLovesMidokuni";
import { launcherMidokuniStudentInsigh } from "@/components/Apps/MidokuniStudentInsigh";

const _AppsList: WindowLauncherProps[] = [
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
];

export const AppsList = () => {
  return [
    ...TaskBarItems,
    ..._AppsList.filter(
      (item) => !TaskBarItems.some((i) => i.appId === item.appId)
    ),
  ].sort((a, b) => a.title.localeCompare(b.title));
};
