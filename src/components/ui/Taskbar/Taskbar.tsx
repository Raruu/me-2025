"use client";

import { Dispatch, useEffect, useRef, useState } from "react";
import {
  BorderConstrains,
  WindowAction,
  WindowState,
} from "../../Window/WindowManager";
import { TaskbarItem } from "./TaskbarItem";
import { DropDown } from "../../Dropdown/Dropdown";
import {
  DropDownItem,
  DropDownItemSeparator,
} from "../../Dropdown/DropdownItem";

export type TaskbarPlacement = "left" | "bottom" | "right";

interface TaskbarProps {
  reTriggerConstrains: () => void;
  taskBarRef: React.RefObject<HTMLDivElement & BorderConstrains>;
  statusBarRef: React.RefObject<HTMLDivElement>;
  windows: WindowState[];
  dispatch: Dispatch<WindowAction>;
}

export const Taskbar = ({
  reTriggerConstrains,
  taskBarRef,
  statusBarRef,
  windows,
  dispatch,
}: TaskbarProps) => {
  // const taskBarRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const dropDownRef = useRef<{ handleOpen: () => void }>({
    handleOpen: () => {},
  });
  const [taskbarPlacement, setTaskbarPlacement] =
    useState<TaskbarPlacement>("bottom");

  const [xContextGap, setXContextGap] = useState(0);
  const [yContextGap, setYContextGap] = useState<number | undefined>(undefined);
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
            onClick={() => setIsExpand(!isExpand)}
          />
        </DropDown>
      </div>

      <div
        ref={taskBarRef}
        className={`z-[1] flex items-center gap-2 pointer-events-auto ${
          taskbarPlacement === "bottom" ? "flex-row px-8" : "flex-col py-6 px-4"
        } ${
          isExpand
            ? taskbarPlacement === "bottom"
              ? "w-full justify-center"
              : "h-full"
            : "w-fit h-fit justify-start rounded-3xl"
        }
        bg-[--taskbar-bg] min-h-20 transition-all duration-300`}
        onContextMenu={(e) => {
          if (e.target !== e.currentTarget) return;
          e.preventDefault();
          dropDownRef.current?.handleOpen();
        }}
      >
        <TaskbarItem
          taskBarRef={taskBarRef}
          taskbarPlacement={taskbarPlacement}
          windows={windows}
          addWindowProps={{
            title: `Test`,
            appId: "test0",
            content: <p className="text-red-700">asda</p>,
            size: {
              width: 300,
              height: 300,
            },
          }}
          dispatch={dispatch}
        />
        <TaskbarItem
          taskBarRef={taskBarRef}
          taskbarPlacement={taskbarPlacement}
          windows={windows}
          addWindowProps={{
            title: `Test`,
            appId: "test0",
            content: <p className="text-red-700">asda</p>,
            size: {
              width: 300,
              height: 300,
            },
          }}
          dispatch={dispatch}
        />
        <TaskbarItem
          taskBarRef={taskBarRef}
          taskbarPlacement={taskbarPlacement}
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
