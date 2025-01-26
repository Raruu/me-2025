"use client";

import { Icon } from "@iconify/react";
import { Dispatch, useState, useRef, useEffect } from "react";
import { WindowAction, WindowState } from "../Window/WindowManager";
import { DropDown } from "../Dropdown/Dropdown";
import { DropDownItem } from "../Dropdown/DropdownItem";

interface AddWindowProps
  extends Pick<
    WindowState,
    "title" | "appId" | "icon" | "subtitle" | "content"
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

interface TaskbarItemProps {
  taskBarRef: React.RefObject<HTMLDivElement>;
  addWindowProps: AddWindowProps;
  windows: WindowState[];
  dispatch: Dispatch<WindowAction>;
}

const TaskbarItem = ({
  taskBarRef,
  addWindowProps,
  windows,
  dispatch,
}: TaskbarItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const dropDownRef = useRef<{ handleOpen: () => void }>({
    handleOpen: () => {},
  });

  const [windowsAppId, setwindowsAppId] = useState<WindowState[]>([]);

  useEffect(() => {
    if (windows.length > 0 && windowsAppId.length > 0) {
      if(windows[windows.length - 1].appId !== windowsAppId[windowsAppId.length - 1].appId) {
        return;
      }
    };
    console.log("windowsAppId Changed");
    setwindowsAppId(
      windows.filter((window) => window.appId === addWindowProps.appId)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windows.length]);

  const addWindow = () => {
    dispatch({
      type: "ADD_WINDOW",
      window: {
        id: Date.now(),
        title: addWindowProps.title + windowsAppId.length,
        appId: addWindowProps.appId,
        subtitle: addWindowProps.subtitle,
        icon: addWindowProps.icon ?? "mingcute:terminal-box-line",
        content: addWindowProps.content,
        isMaximized: addWindowProps.isMaximized ?? false,
        isMinimized: addWindowProps.isMinimized ?? false,
        size: addWindowProps.size ?? { width: 300, height: 300 },
        position: addWindowProps.position ?? { x: 0, y: 0 },
        minSize: addWindowProps.minSize ?? { width: 300, height: 300 },
      },
    });
  };

  return (
    <div
      className={`flex flex-col items-center justify-center cursor-pointer
        transition-all duration-300 ${
          windowsAppId.length > 0 ? "gap-[5]" : "gap-1"
        }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onContextMenu={(e) => {
        e.preventDefault();
        if (dropDownRef.current) {
          dropDownRef.current.handleOpen();
        }
      }}
      onClick={() => {
        if (isContextOpen) return;
        if (windowsAppId.length > 0 && dropDownRef.current) {
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
        placement="top"
        triggerGap={(taskBarRef.current?.clientHeight ?? 80) + 5}
      >
        {windowsAppId.map((window) => (
          <DropDownItem
            key={window.id}
            text={window.title}
            iconifyString={window.icon}
            onClick={() => dispatch({ type: "FOCUS", id: window.id })}
          />
        ))}
        <DropDownItem
          text={"New Window"}
          onClick={addWindow}
          iconifyString="mingcute:add-fill"
        />
      </DropDown>
      <Icon
        icon={addWindowProps.icon ?? "hugeicons:ai-programming"}
        width={40}
        height={40}
      />
      <p
        className={`transition-all duration-300 select-none ${
          hovered ? "opacity-100 leading-[0.7]" : "opacity-0 leading-[0]"
        } `}
      >
        {addWindowProps.title}
      </p>
      <div className="flex flex-row items-center justify-center gap-1">
        {windowsAppId.length === 0 && (
          <div className="w-2 h-2 -mt-2 bg-transparent"></div>
        )}
        {windowsAppId.map((window, index) => {
          if (index > 2) return null;
          const expand = "w-[40] h-1 mt-0";
          const hide = "opacity-0 w-0 -mr-1";
          return (
            <div
              key={index}
              className={`transition-all duration-300 bg-black dark:bg-white rounded-full ${
                hovered
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
    </div>
  );
};

interface TaskbarProps {
  windows: WindowState[];
  dispatch: Dispatch<WindowAction>;
}

export const Taskbar = ({ windows, dispatch }: TaskbarProps) => {
  const taskBarRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  return (
    <div className="flex flex-row items-center justify-center w-full">
      <div
        ref={taskBarRef}
        className="z-[1] flex flex-row items-center justify-start gap-2 
        bg-[--taskbar-bg] rounded-3xl px-8 w-fit h-20 transition-all duration-300"
      >
        <TaskbarItem
          taskBarRef={taskBarRef}
          windows={windows}
          addWindowProps={{
            title: `Test`,
            appId: "test0",
            content: (
              <p className="text-red-700">asda</p>
            ),
            size: {
              width: 300,
              height: 300,
            },
          }}
          dispatch={dispatch}
        />
        <TaskbarItem
          taskBarRef={taskBarRef}
          windows={windows}
          addWindowProps={{
            title: `Iyaaaa`,
            appId: "test1",
            content: (
              <iframe
                className="w-full h-full"
                src="http://localhost:3000/"
                allowFullScreen
              ></iframe>
            ),
            size: {
              width: 300,
              height: 300,
            },
          }}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
};
