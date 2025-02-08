import { AboutMe } from "@/components/Apps/AboutMe";
import { ArtCredit } from "@/components/Apps/ArtCredit";
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
  {
    title: `Art Credits`,
    appId: "art-credits",
    icon: "raruu:patapata-lanubiscuit",
    content: <ArtCredit />,
    size: {
      width: 750,
      height: 550,
    },
    minSize: {
      width: 400,
      height: 0,
    },
    launcherRef: createRef(),
  },
];
