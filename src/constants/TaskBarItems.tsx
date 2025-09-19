import { launcherAboutMe } from "@/components/Apps/AboutMe";
import { launcherArtCredit } from "@/components/Apps/ArtCredit";
import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";

export const TaskBarItems: WindowLauncherProps[] = [
  launcherAboutMe,
  launcherArtCredit,
];
