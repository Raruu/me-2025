import { AboutMe } from "@/components/Apps/AboutMe";
import { AddWindowProps } from "@/components/ui/Taskbar/TaskbarItem";

export const TaskBarItems: AddWindowProps[] = [
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
      width: 400,
      height: 450,
    },
  },
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
  },
];
