import { createRef, useContext, useEffect } from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import { WindowActionButton, WindowContext } from "../Window/Window";

const HinaLovesMidokuni = () => {
  const url = "https://hina.loves.midokuni.com/";
  const { setFreeSlot } = useContext(WindowContext);
  useEffect(() => {
    setFreeSlot(
      <WindowActionButton
        icon="ic:round-open-in-new"
        onClick={() => window.open(url, "_blank")}
        useRightMargin
      />
    );
  }, [setFreeSlot]);

  return (
    <div className="w-full h-full flex bg-background">
      <iframe className="w-full h-full" src={url} allowFullScreen></iframe>
    </div>
  );
};

export const launcherHinaLovesMidokuni: WindowLauncherProps = {
  title: "Hina Loves Midokuni",
  subtitle: "credits to Midokuni",
  appId: "hina-loves-midokuni",
  icon: "raruu:ic-midokuni-logo-512",
  content: <HinaLovesMidokuni />,
  size: {
    width: 1000,
    height: 700,
  },
  launcherRef: createRef(),
};
