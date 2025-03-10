import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { createRef, useState } from "react";
import { Icon } from "@iconify/react";
import { settingItemTaskBar } from "./Items/STaskBar";
import { settingItemTheme } from "./Items/STheme";

const SettingNavItem = ({
  title,
  icon = "f7:gear",
  isSelected,
  onClick,
}: {
  title: string;
  icon?: string;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className="flex flex-row items-center gap-2 h-9 w-full pl-2 rounded-md cursor-pointer
      transition-colors duration-150 dark:hover:text-background hover:bg-secondary"
      style={{
        backgroundColor: isSelected ? "var(--primary)" : "",
      }}
      onClick={onClick}
    >
      <Icon icon={icon} width={24} height={24} />
      <h1 className="text-sm font-bold">{title}</h1>
    </div>
  );
};

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
      <div className="flex flex-col min-w-48 px-0">
        {settingNavItems.map((item, index) => (
          <SettingNavItem
            key={index}
            title={item.title}
            icon={item.icon}
            isSelected={item.title === selectedNavItem.title}
            onClick={() => setSelectedNavItem(item)}
          />
        ))}
      </div>
      <div className="w-full flex justify-center">
        <div className="max-w-4xl flex-1 p-4 overflow-auto">{selectedNavItem.content}</div>
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
