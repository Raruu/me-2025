import { createRef, useContext, useEffect } from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import { WindowActionButton, WindowContext } from "../Window/Window";

const MidokuniStudentInsigh = () => {
  const { setFreeSlot } = useContext(WindowContext);
  useEffect(() => {
    setFreeSlot(
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
    );
  }, [setFreeSlot]);

  return (
    <div className="w-full h-full flex bg-background">
      <iframe
        className="w-full h-full"
        src="https://docs.google.com/spreadsheets/d/1BO-Uh_CsAOIetPjrNyFy9-7r1a4RAtVwK135bBC3hzM/pubhtml?widget=true&amp;headers=false"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export const launcherMidokuniStudentInsigh: WindowLauncherProps = {
  title: "Midokuni's Student Insight",
  appId: "midokuni-student-insight",
  subtitle: "credits to Midokuni",
  icon: "raruu:ic-midokuni-logo-512-document",
  content: <MidokuniStudentInsigh />,
  size: {
    width: 1000,
    height: 700,
  },
  launcherRef: createRef(),
};
