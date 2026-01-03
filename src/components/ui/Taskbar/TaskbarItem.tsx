"use client";

import { Icon } from "@iconify/react";
import { Dispatch, useState, useRef, useEffect } from "react";
import { DropDown, DropDownRef } from "../../Dropdown/Dropdown";
import { DropDownItem } from "../../Dropdown/DropdownItem";
import { TaskbarPlacement } from "./Taskbar";
import { WindowAction, WindowState } from "@/providers/WindowManagerContext";

export interface WindowLauncherProps
  extends Pick<
    WindowState,
    "title" | "appId" | "icon" | "initialSubtitle" | "content" | "launcherRef"
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
  contextMenuCallback?: () => void;
  dispatch: Dispatch<WindowAction>;
}

const IconTitle = ({
  title,
  size,
  isShowTitle,
  isParentHovered,
  istextWrap,
}: {
  title: string;
  size: number;
  isShowTitle?: boolean;
  isParentHovered?: boolean;
  istextWrap?: boolean;
}) => {
  return (
    <p
      style={{
        width: size + 10,
        opacity: isShowTitle || isParentHovered ? 1 : 0,
        lineHeight: isShowTitle || isParentHovered ? 0.8 : 0,        
      }}
      className={`transition-all duration-300 select-none text-sm hover:flex items-center justify-around
        text-ellipsis overflow-hidden hover:overflow-visible text-center hover:justify-center
        ${
          istextWrap && title.length > 14
            ? "hover:text-wrap text-nowrap"
            : "text-nowrap"
        } ${isShowTitle || isParentHovered ? "hover:h-auto hover:mb-0 -mb-[4.5px] h-4 hover:duration-0" : "h-0"}`}
    >
      {title}
    </p>
  );
};

export const TaskbarItemWindowLauncher = ({
  ref,
  taskbarPlacement,
  taskBarRef,
  windowLauncherProps,
  windows,
  isShowTitle,
  size = 40,
  contextMenuCallback,
  dispatch,
}: TaskbarItemWindowLauncherProps) => {
  const [isHovered, setHovered] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const dropDownRef = useRef<DropDownRef>({
    handleOpen: () => {},
  });

  const [windowsAppId, setwindowsAppId] = useState<WindowState[]>([]);

  useEffect(() => {
    if (!taskbarPlacement) return;
    // console.log("windowsAppId Changed");
    setwindowsAppId(
      windows.filter((window) => window.appId === windowLauncherProps.appId)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windows.length]);

  const addWindow = () => {
    contextMenuCallback?.();
    dispatch({
      type: "ADD_WINDOW",
      window: {
        zIndex: windows.length,
        id: Date.now(),
        title: windowLauncherProps.title,
        appId: windowLauncherProps.appId,
        initialSubtitle: windowLauncherProps.initialSubtitle,
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
            onClick={() => {
              dispatch({ type: "FOCUS", id: window.id });
              contextMenuCallback?.();
            }}
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
      <IconTitle
        title={windowLauncherProps.title}
        size={size}
        isShowTitle={isShowTitle}
        isParentHovered={isHovered}
        istextWrap
      />
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
  alt?: string;
  size?: number;
  isShowTitle?: boolean;
  onClick?: () => void;
  taskbarPlacement?: TaskbarPlacement;
  taskBarRef: React.RefObject<HTMLDivElement>;
}

export const TaskbarItem = ({
  iconify = "mingcute:terminal-box-line",
  title,
  alt = title,
  size = 40,
  isShowTitle,
  taskbarPlacement,
  taskBarRef,
  onClick,
}: TaskbarItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const dropDownRef = useRef<DropDownRef>({
    handleOpen: () => {},
  });
  const [isContextOpen, setIsContextOpen] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (isContextOpen) return;
        onClick?.();
      }}
      onContextMenu={(e) => {
        if (!taskbarPlacement) return;
        e.preventDefault();
        if (dropDownRef.current) {
          dropDownRef.current.handleOpen();
        }
      }}
    >
      <DropDown
        ref={dropDownRef}
        callback={(isOpen: boolean) => {
          if (!isOpen) {
            setIsHovered(false);
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
        <DropDownItem
          text={alt ?? ""}
          onClick={onClick}
          iconifyString={iconify}
        />
      </DropDown>
      <Icon icon={iconify} width={size} height={size} />
      {title && (
        <IconTitle
          title={title}
          size={size}
          isShowTitle={isShowTitle}
          isParentHovered={isHovered}
        />
      )}
    </div>
  );
};
