import { AboutMe } from "@/components/Apps/AboutMe";
import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { createRef } from "react";

export const TaskBarItems: WindowLauncherProps[] = [
  {
    title: `Me`,
    appId: "me",
    icon: "raruu:azusa-cat",
    content: <AboutMe />,
    size: {
      width: 450,
      height: 450,
    },
    minSize: {
      width: 0,
      height: 0,
    },
    launcherRef: createRef(),
  },
  
];
