"use client";

import { Icon } from "@iconify/react";
import { Dispatch, useState, useRef, useEffect } from "react";
import { WindowAction, WindowState } from "../../Window/WindowManager";
import { DropDown } from "../../Dropdown/Dropdown";
import { DropDownItem } from "../../Dropdown/DropdownItem";
import { TaskbarPlacement } from "./Taskbar";

export interface WindowLauncherProps
  extends Pick<
    WindowState,
    "title" | "appId" | "icon" | "subtitle" | "content" | "launcherRef"
  > {
  isMinimized?: boolean;
  isMaximized?: boolean;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  minSize?: {
    width: number;
    height: number;
  };
}

interface TaskbarItemWindowLauncherProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  taskbarPlacement?: TaskbarPlacement;
  taskBarRef: React.RefObject<HTMLDivElement>;
  windowLauncherProps: WindowLauncherProps;
  windows: WindowState[];
  size?: number;
  isShowTitle?: boolean;
  dispatch: Dispatch<WindowAction>;
}

export const TaskbarItemWindowLauncher = ({
  ref,
  taskbarPlacement,
  taskBarRef,
  windowLauncherProps,
  windows,
  isShowTitle,
  size = 40,
  dispatch,
}: TaskbarItemWindowLauncherProps) => {
  const [isHovered, setHovered] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const dropDownRef = useRef<{ handleOpen: () => void }>({
    handleOpen: () => {},
  });

  const [windowsAppId, setwindowsAppId] = useState<WindowState[]>([]);

  useEffect(() => {
    if (!taskbarPlacement) return;
    console.log("windowsAppId Changed");
    setwindowsAppId(
      windows.filter((window) => window.appId === windowLauncherProps.appId)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windows.length]);

  const addWindow = () => {
    dispatch({
      type: "ADD_WINDOW",
      window: {
        id: Date.now(),
        title: windowLauncherProps.title,
        appId: windowLauncherProps.appId,
        subtitle: windowLauncherProps.subtitle,
        icon: windowLauncherProps.icon ?? "mingcute:terminal-box-line",
        content: windowLauncherProps.content,
        isMaximized: windowLauncherProps.isMaximized ?? false,
        isMinimized: windowLauncherProps.isMinimized ?? false,
        size: windowLauncherProps.size ?? { width: 300, height: 300 },
        position: windowLauncherProps.position ?? { x: 0, y: 0 },
        minSize: windowLauncherProps.minSize ?? { width: 300, height: 300 },
        launcherRef: windowLauncherProps.launcherRef,
      },
    });
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center cursor-pointer
        transition-all duration-300 ${
          windowsAppId.length > 0 ? "gap-[5px]" : "gap-1"
        } ${taskbarPlacement ? " h-16" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onContextMenu={(e) => {
        if (!taskbarPlacement) return;
        e.preventDefault();
        if (dropDownRef.current) {
          dropDownRef.current.handleOpen();
        }
      }}
      onClick={() => {
        if (isContextOpen) return;
        if (
          windowsAppId.length > 0 &&
          dropDownRef.current &&
          taskbarPlacement
        ) {
          dropDownRef.current.handleOpen();
          return;
        }
        addWindow();
      }}
    >
      <DropDown
        ref={dropDownRef}
        callback={(isOpen: boolean) => {
          if (!isOpen) {
            setHovered(false);
          }
          setIsContextOpen(isOpen);
        }}
        placement={taskbarPlacement === "bottom" ? "top" : undefined}
        align={
          taskbarPlacement === "left"
            ? "left"
            : taskbarPlacement === "right"
            ? "right"
            : undefined
        }
        triggerGapX={
          taskbarPlacement !== "bottom"
            ? taskbarPlacement === "left"
              ? size
              : 92
            : undefined
        }
        triggerGapY={
          taskbarPlacement === "bottom"
            ? (taskBarRef.current?.clientHeight ?? 80) + 5
            : undefined
        }
      >
        {windowsAppId.map((window) => (
          <DropDownItem
            key={window.id}
            text={window.title}
            iconifyString={window.icon}
            onClick={() => dispatch({ type: "FOCUS", id: window.id })}
            rightIcon="mingcute:close-line"
            rightIconClick={() => dispatch({ type: "CLOSE", id: window.id })}
          />
        ))}
        <DropDownItem
          text={"New Window"}
          onClick={addWindow}
          iconifyString="mingcute:add-fill"
        />
      </DropDown>
      <Icon
        icon={windowLauncherProps.icon ?? "mingcute:terminal-box-line"}
        width={size}
        height={size}
      />
      <p
        style={{
          width: size + 10,
          opacity: isShowTitle || isHovered ? 1 : 0,
          lineHeight: isShowTitle || isHovered ? 0.8 : 0,
        }}
        className={`transition-all duration-300 select-none flex 
          text-ellipsis text-nowrap  text-center items-center justify-center  `}
      >
        {windowLauncherProps.title}
      </p>
      {taskbarPlacement && (
        <div className="flex flex-row items-center justify-center gap-1">
          {windowsAppId.length === 0 && (
            <div className="w-2 h-2 -mt-2 bg-transparent"></div>
          )}
          {windowsAppId.map((window, index) => {
            if (index > 2) return null;
            const expand = `w-[40px] h-1 mt-0`;
            const hide = "opacity-0 w-0 -mr-1";
            return (
              <div
                key={index}
                className={`transition-all duration-300 bg-black dark:bg-white rounded-full ${
                  isHovered
                    ? index == 0
                      ? windowsAppId.length <= 2
                        ? expand
                        : hide
                      : index == 1 && windowsAppId.length > 2
                      ? expand
                      : hide
                    : "w-2 h-2 -mt-2"
                }`}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface TaskbarItemProps {
  iconify?: string;
  title?: string;
  size?: number;
  isShowTitle?: boolean;
  onClick?: () => void;
}

export const TaskbarItem = ({
  iconify = "mingcute:terminal-box-line",
  title,
  size = 40,
  isShowTitle,
  onClick,
}: TaskbarItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <Icon icon={iconify} width={size} height={size} />
      {title && (
        <p
          style={{
            width: size + 10,
            opacity: isShowTitle ? 1 : "",
            lineHeight: isShowTitle ? 0.8 : "",
          }}
          className={`transition-all duration-300 select-none 
          text-ellipsis text-nowrap overflow-hidden text-center ${
            isHovered ? "opacity-100 leading-[0.8]" : "opacity-0 leading-[0]"
          } `}
        >
          {title}
        </p>
      )}
    </div>
  );
};
