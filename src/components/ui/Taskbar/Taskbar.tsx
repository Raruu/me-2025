"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { WindowManagerContext, WindowState } from "../../Window/WindowManager";
import {
  TaskbarItem,
  TaskbarItemWindowLauncher,
  WindowLauncherProps,
} from "./TaskbarItem";
import { DropDown, DropDownRef } from "../../Dropdown/Dropdown";
import {
  DropDownItem,
  DropDownItemSeparator,
} from "../../Dropdown/DropdownItem";
import { TaskBarItems } from "@/configs/TaskBarItems";

export type TaskbarPlacement = "left" | "bottom" | "right";

interface TaskbarProps {
  reTriggerConstrains: () => void;
}

export const Taskbar = ({ reTriggerConstrains }: TaskbarProps) => {
  const {
    taskBarRef,
    statusBarRef,
    appsMenuRef,
    isAppsMenuOpen,
    setIsAppsMenuOpen,
    windows,
    dispatch,
  } = useContext(WindowManagerContext);

  const dropDownRef = useRef<DropDownRef>({
    handleOpen: () => {},
  });
  const [taskbarPlacement, setTaskbarPlacement] =
    useState<TaskbarPlacement>("bottom");

  const [xContextGap, setXContextGap] = useState(0);
  const [yContextGap, setYContextGap] = useState<number | undefined>(undefined);
  const [widthNotExpanded, setWidthNotExpanded] = useState<number | undefined>(
    undefined
  );
  const [heightNotExpanded, setHeightNotExpanded] = useState<
    number | undefined
  >(undefined);
  const [isExpand, setIsExpand] = useState(false);

  useEffect(() => {
    const assignConstrains = () => {
      Object.assign(taskBarRef.current, {
        left:
          taskbarPlacement === "left" ? taskBarRef.current.clientWidth ?? 0 : 0,
        right:
          taskbarPlacement === "right"
            ? taskBarRef.current.clientWidth ?? 0
            : 0,
        bottom:
          taskbarPlacement === "bottom"
            ? taskBarRef.current.clientHeight ?? 0
            : 0,
        taskbarPlacement: taskbarPlacement,
      });
      reTriggerConstrains();
    };

    setTimeout(() => {
      setXContextGap(
        taskbarPlacement == "bottom"
          ? (taskBarRef.current.clientWidth ?? 0) / 2
          : taskbarPlacement == "left"
          ? taskBarRef.current.clientWidth + 48
          : taskBarRef.current.clientWidth + 8
      );
      setYContextGap(
        taskbarPlacement == "bottom"
          ? (taskBarRef.current.clientHeight ?? 80) + 5
          : undefined
      );
      // console.log(xContextGap, yContextGap);
      assignConstrains();
    }, 50);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskBarRef.current?.clientWidth, taskbarPlacement, isExpand]);

  const [combinedWindows, setCombinedWindows] = useState<
    WindowState[] | WindowLauncherProps[]
  >([]);

  useEffect(() => {
    const combinedWindowsIds = new Set(
      TaskBarItems.flatMap((item) => item).map((window) => window.appId)
    );
    const combinedWindows = windows
      .filter((window) => !combinedWindowsIds.has(window.appId))
      .filter(
        (window, index, self) =>
          self.findIndex((w) => w.appId === window.appId) === index
      );
    setCombinedWindows([
      ...TaskBarItems.flatMap((item) => item),
      ...combinedWindows,
    ]);

    setWidthNotExpanded(undefined);
    setHeightNotExpanded(undefined);
  }, [windows]);

  return (
    <div
      className={`absolute flex items-center justify-center pointer-events-none ${
        taskbarPlacement === "bottom"
          ? "flex-row bottom-0 left-0 w-full"
          : taskbarPlacement === "left"
          ? `h-full flex-col left-0`
          : `h-full flex-col right-0`
      }`}
      style={{
        paddingTop:
          taskbarPlacement !== "bottom"
            ? statusBarRef.current?.clientHeight ?? 0
            : 0,
      }}
    >
      <div className="pointer-events-auto">
        <DropDown
          ref={dropDownRef}
          placement={taskbarPlacement === "bottom" ? "top" : undefined}
          align="center"
          triggerGapX={xContextGap}
          triggerGapY={yContextGap}
        >
          <DropDownItem
            text="Left"
            iconifyString="mingcute:align-left-2-line"
            checked={taskbarPlacement === "left"}
            onClick={() => setTaskbarPlacement("left")}
          />
          <DropDownItem
            text="Right"
            iconifyString="mingcute:align-right-2-line"
            checked={taskbarPlacement === "right"}
            onClick={() => setTaskbarPlacement("right")}
          />
          <DropDownItem
            text="Bottom"
            iconifyString="mingcute:align-bottom-line"
            checked={taskbarPlacement === "bottom"}
            onClick={() => setTaskbarPlacement("bottom")}
          />
          <DropDownItemSeparator space={8} />
          <DropDownItem
            text="Expand"
            iconifyString="material-symbols:width-wide"
            checked={isExpand}
            onClick={() => {
              if (!isExpand) {
                setWidthNotExpanded(
                  taskbarPlacement === "bottom"
                    ? taskBarRef.current.clientWidth
                    : undefined
                );
                setHeightNotExpanded(
                  taskbarPlacement !== "bottom"
                    ? taskBarRef.current.clientHeight
                    : undefined
                );
              }
              setTimeout(() => {
                setIsExpand(!isExpand);
              }, 50);
            }}
          />
        </DropDown>
      </div>

      <div
        ref={taskBarRef}
        className={`z-[1] flex items-center gap-2 pointer-events-auto relative ${
          taskbarPlacement === "bottom" ? "flex-row px-8" : "flex-col py-6 px-4"
        } ${
          isExpand
            ? taskbarPlacement === "bottom"
              ? "justify-center"
              : "h-full"
            : "w-fit h-fit justify-start "
        }
        min-h-20 transition-all duration-300`}
        style={{
          width: isExpand
            ? "100%"
            : taskbarPlacement === "bottom"
            ? widthNotExpanded ?? ""
            : "",
          height: isExpand
            ? "100%"
            : taskbarPlacement !== "bottom"
            ? heightNotExpanded ?? ""
            : "",
        }}
        onContextMenu={(e) => {
          if (e.target !== e.currentTarget) return;
          e.preventDefault();
          dropDownRef.current?.handleOpen();
        }}
      >
        <div
          id="background-tr"
          className={`absolute inset-0 w-full h-full pointer-events-none transition-all duration-300
            bg-[var(--background-tr)] backdrop-blur -z-10 ${
              isExpand ? "" : "rounded-3xl"
            }`}
        />
        {combinedWindows.map((item, index) => (
          <TaskbarItemWindowLauncher
            key={index}
            taskBarRef={taskBarRef}
            taskbarPlacement={taskbarPlacement}
            windows={windows}
            windowLauncherProps={item}
            dispatch={dispatch}
            ref={item.launcherRef}
          />
        ))}
        {/* <div className="w-1 h-1"></div> */}
        <TaskbarItem
          iconify="mage:dots-menu"
          title="Menu"
          onClick={() => {
            if (!isAppsMenuOpen) {
              setIsAppsMenuOpen(!isAppsMenuOpen);
              return;
            }
            appsMenuRef.current?.close();
          }}
          taskbarPlacement={taskbarPlacement}
          taskBarRef={taskBarRef}
        />
      </div>
    </div>
  );
};
