import { createRef } from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import { WindowActionButton } from "../Window/Window";
import { WebView } from "./Template/WebView";

const MidokuniStudentInsigh = () => {
  return (
    <WebView
      url="https://docs.google.com/spreadsheets/d/1BO-Uh_CsAOIetPjrNyFy9-7r1a4RAtVwK135bBC3hzM/pubhtml?widget=true&amp;headers=false"
      freeSlot={
        <WindowActionButton
          icon="ic:round-open-in-new"
          onClick={() =>
            window.open(
              "https://docs.google.com/spreadsheets/d/1BO-Uh_CsAOIetPjrNyFy9-7r1a4RAtVwK135bBC3hzM/edit?usp=sharing",
              "_blank"
            )
          }
          useRightMargin
        />
      }
    />
  );
};

export const launcherMidokuniStudentInsigh: WindowLauncherProps = {
  title: "Midokuni's Student Insight",
  appId: "midokuni-student-insight",
  initialSubtitle: "credits to Midokuni",
  icon: "raruu:ic-midokuni-logo-512-document",
  content: <MidokuniStudentInsigh />,
  size: {
    width: 1000,
    height: 700,
  },
  launcherRef: createRef(),
};
