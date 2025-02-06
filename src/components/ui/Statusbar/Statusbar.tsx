"use client";

import { Clock } from "@/components/Clock";
import { Icon } from "@iconify/react";
import { useContext, useState } from "react";
import { DropDown } from "../../Dropdown/Dropdown";
import { DropDownItem } from "../../Dropdown/DropdownItem";
import { themeContext, getSystemTheme } from "@/styles/theme";
import { Calendar } from "./Calendar";
import { WindowManagerContext } from "@/components/Window/WindowManager";

interface StatusBarProps {
  children: React.ReactNode;
  hoverBgEffect?: boolean;
  hovered?: boolean;
}

const StatusBarItem = ({
  children,
  hoverBgEffect,
  hovered,
}: StatusBarProps) => {
  return (
    <div
      className={`${
        hovered ? "opacity-100" : "opacity-65"
      } hover:opacity-100 transition duration-150 select-none cursor-pointer ${
        hoverBgEffect &&
        "hover:bg-gray-300 dark:hover:bg-white/35 px-3 py-0.5 rounded-3xl"
      } 
      ${
        hovered &&
        hoverBgEffect &&
        "bg-gray-300 dark:bg-white/35 px-3 py-0.5 rounded-3xl"
      }`}
    >
      {children}
    </div>
  );
};

export const StatusBar = () => {
  const { statusBarRef: ref } = useContext(WindowManagerContext);
  const { theme, setTheme } = useContext(themeContext);
  const [dropDownThemeIsOpen, setdropDownThemeIsOpen] = useState(false);
  const [dropDownClockIsOpen, setDropDownClockIsOpen] = useState(false);

  return (
    <header
      ref={ref}
      className="transition-colors duration-300 z-[1] flex flex-row items-center justify-between min-h-7 px-3 py-1"
    >
      <div className="sm:w-1/3 hidden sm:flex flex-row justify-start">
        <a href="https://github.com/Raruu" target="_blank" rel="noreferrer">
          <StatusBarItem hoverBgEffect>
            <div className="flex flex-row items-center gap-2">
              <Icon icon={"ri-github-fill"} />
              Raruu
            </div>
          </StatusBarItem>
        </a>
      </div>
      <div className="sm:w-1/3 flex flex-row justify-start sm:justify-center">
        <DropDown
          triggerGapY={14}
          callback={(isOpen) => {
            setDropDownClockIsOpen(isOpen);
          }}
          trigger={
            <StatusBarItem hoverBgEffect hovered={dropDownClockIsOpen}>
              <Clock />
            </StatusBarItem>
          }
        >
          <Calendar />
        </DropDown>
      </div>
      <div className="sm:w-1/3 flex flex-row justify-end">
        <div className="flex flex-row items-center gap-1">
          <button
            className="focus:outline-none"
            onClick={() => setTheme(undefined)}
          >
            <StatusBarItem>
              <Icon
                icon={
                  theme.includes("light")
                    ? "iconamoon:mode-dark"
                    : "iconamoon:mode-light"
                }
              />
            </StatusBarItem>
          </button>
          <DropDown
            triggerGapY={14}
            callback={(isOpen) => {
              setdropDownThemeIsOpen(isOpen);
            }}
            trigger={
              <StatusBarItem hovered={dropDownThemeIsOpen}>
                <Icon icon={"iconamoon:arrow-down-2-bold"} />
              </StatusBarItem>
            }
          >
            <DropDownItem
              text="Light"
              iconifyString="iconamoon:mode-light"
              checked={theme == "light"}
              onClick={() => setTheme("tr-light")}
            />
            <DropDownItem
              text="Dark"
              iconifyString="iconamoon:mode-dark"
              checked={theme == "dark"}
              onClick={() => setTheme("tr-dark")}
            />
            <DropDownItem
              text="System"
              iconifyString="iconamoon:settings"
              onClick={() => setTheme(getSystemTheme())}
            />
          </DropDown>
        </div>
      </div>
    </header>
  );
};
