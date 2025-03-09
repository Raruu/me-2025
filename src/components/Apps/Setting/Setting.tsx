import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { createRef, useId, useState } from "react";
import { Icon } from "@iconify/react";
import { settingItemTaskBar } from "./Items/STaskBar";
import { settingItemTheme } from "./Items/STheme";

export const SettingGroup = ({
  title,
  subtitle,
  children,
  hideBackground,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  hideBackground?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      {(title || subtitle) && (
        <div className="flex flex-col px-0.5">
          {title && (
            <h2
              className="text-lg font-bold"
              style={{ lineHeight: subtitle ? 0.9 : "" }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-foreground opacity-65">{subtitle}</p>
          )}
        </div>
      )}

      <div
        className={`w-full flex flex-col gap-2 rounded-lg px-4 py-2 ${
          hideBackground
            ? ""
            : "bg-background border border-secondary dark:border-gray-500"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const SettingBool = ({
  title,
  value,
  setValue,
}: {
  title: string;
  value?: boolean;
  setValue?: (value: boolean) => void;
}) => {
  const id = useId();

  return (
    <div className="flex flex-row items-center justify-between w-full ">
      <h1 className="text-base font-semibold pointer-events-none">{title}</h1>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input
          type="checkbox"
          className="hidden"
          id={id}
          checked={value}
          onChange={() => {
            setValue?.(!value);
          }}
        />
        <label
          htmlFor={id}
          className="block overflow-hidden h-5 rounded-full cursor-pointer bg-gray-300 shadow-sm"
          style={{
            backgroundColor: value ? "var(--tertiary)" : "",
          }}
        >
          <span
            className="block overflow-hidden h-5 w-5 rounded-full bg-white transition"
            style={{
              transform: value ? "translateX(100%)" : "translateX(0)",
            }}
          ></span>
        </label>
      </div>
    </div>
  );
};

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
    <div className="bg-background w-full h-full flex flex-row select-none overflow-auto">
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
        <div className="max-w-4xl flex-1 p-4">{selectedNavItem.content}</div>
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
