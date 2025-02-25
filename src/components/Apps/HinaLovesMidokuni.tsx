import { createRef } from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import { WindowActionButton } from "../Window/Window";
import { WebView } from "./Template/WebView";

const HinaLovesMidokuni = () => {
  const url = "https://hina.loves.midokuni.com/";
  return (
    <WebView
      url={url}
      freeSlot={
        <WindowActionButton
          icon="ic:round-open-in-new"
          onClick={() => window.open(url, "_blank")}
          useRightMargin
        />
      }
    />
  );
};

export const launcherHinaLovesMidokuni: WindowLauncherProps = {
  title: "Hina Loves Midokuni",
  initialSubtitle: "credits to Midokuni",
  appId: "hina-loves-midokuni",
  icon: "raruu:ic-midokuni-logo-512",
  content: <HinaLovesMidokuni />,
  size: {
    width: 1000,
    height: 700,
  },
  launcherRef: createRef(),
};
