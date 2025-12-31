import { launcherAboutMe } from "@/components/Apps/AboutMe";
import { launcherArtCredit } from "@/components/Apps/ArtCredit";
import { launcherMyCv } from "@/components/Apps/MyCV";
import { launcherMyWorks } from "@/components/Apps/MyWorks";
import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";

export const TaskBarItems: WindowLauncherProps[] = [
  launcherAboutMe,
  launcherMyWorks,
  launcherMyCv,
  launcherArtCredit,
];
