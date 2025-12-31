import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { createRef, useState } from "react";
import { settingItemTaskBar } from "./Items/STaskBar";
import { settingItemTheme } from "./Items/STheme";
import { UILocationItem } from "@/components/ui/components/UILocationItem";

export interface SettingNavItemProps {
  title: string;
  icon?: string;
  content: React.ReactNode;
}

const Settings = () => {
  const settingNavItems: SettingNavItemProps[] = [
    settingItemTheme,
    settingItemTaskBar,
  ];
  const [selectedNavItem, setSelectedNavItem] = useState(settingNavItems[0]);

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
  appId: "settings",
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
