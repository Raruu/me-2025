import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { createRef, useContext, useEffect, useState } from "react";
import { settingItemTaskBar } from "./Items/STaskBar";
import { settingItemTheme } from "./Items/STheme";
import { settingItemStartUp } from "./Items/SStartUp";
import { settingItemStorage } from "./Items/SStorage";
import { UILocationItem } from "@/components/ui/components/UILocationItem";
import { WindowContext } from "@/providers/WindowContext";
import { useDBusApp } from "@/hooks/useDBusApp";

export interface SettingNavItemProps {
  title: string;
  icon?: string;
  content: React.ReactNode;
}

const APPID = "settings";

const Settings = () => {
  const settingNavItems: SettingNavItemProps[] = [
    settingItemTheme,
    settingItemTaskBar,
    settingItemStartUp,
    settingItemStorage,
  ];
  const [selectedNavItem, setSelectedNavItem] = useState(settingNavItems[0]);
  const { windowId } = useContext(WindowContext);
  const dbus = useDBusApp(APPID, windowId);

  useEffect(() => {
    const subscribe = dbus.subscribe(`${APPID}-events`, (message) => {
      const openNavIndex = message.data.index;
      if (openNavIndex !== undefined) {
        setSelectedNavItem(settingNavItems[openNavIndex]);
      }
    });

    return () => {
      subscribe();
    };
  }, []);

  return (
    <div className="bg-background w-full h-full flex flex-row select-none overflow-hidden">
      <div className="flex flex-col min-w-48 px-1 bg-background-tr">
        {settingNavItems.map((item, index) => (
          <UILocationItem
            key={index}
            title={item.title}
            icon={item.icon}
            isSelected={item.title === selectedNavItem.title}
            onClick={() => setSelectedNavItem(item)}
          />
        ))}
      </div>
      <div className="w-full flex justify-center">
        <div className="max-w-4xl flex-1 p-4 overflow-auto">
          {selectedNavItem.content}
        </div>
      </div>
    </div>
  );
};

export const launcherSetting: WindowLauncherProps = {
  title: `Settings`,
  appId: APPID,
  icon: "f7:gear",
  content: <Settings />,
  size: {
    width: 800,
    height: 550,
  },
  minSize: {
    width: 400,
    height: 0,
  },
  launcherRef: createRef(),
};
