import { useReducer, useRef, useEffect, useState } from "react";
import { Window } from "./Window";
import { StatusBar } from "../ui/Statusbar";
import { Taskbar } from "../ui/Taskbar/Taskbar";

export interface WindowState {
  id: number;
  appId?: string;
  title: string;
  icon?: string;
  subtitle?: string;
  content: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  minSize: {
    width: number;
    height: number;
  };
}

export type WindowAction =
  | { type: "MINIMIZE"; id: number }
  | { type: "MAXIMIZE"; id: number }
  | { type: "CLOSE"; id: number }
  | { type: "ADD_WINDOW"; window: WindowState }
  | { type: "MOVE"; id: number; position: { x: number; y: number } }
  | { type: "RESIZE"; id: number; size: { width: number; height: number } }
  | { type: "FOCUS"; id: number };

export type BorderConstrains = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const WindowManager = () => {
  const statusBarRef = useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement
  );
  const taskBarRef = useRef<HTMLDivElement & BorderConstrains>(
    null as unknown as HTMLDivElement & BorderConstrains
  );
  const [borderConstrains, setBorderConstrains] = useState<BorderConstrains>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const handleWindowResize = () => {
    if (statusBarRef.current) {
      // console.log(
      //   taskBarRef.current.left,
      //   taskBarRef.current.right,
      //   taskBarRef.current.bottom
      // );
      setBorderConstrains({
        top: statusBarRef.current.clientHeight,
        right: window.innerWidth - (taskBarRef.current.right ?? 0),
        bottom: window.innerHeight - (taskBarRef.current.bottom ?? 0),
        left: 0 + (taskBarRef.current.left ?? 0),
      });
    }
  };

  useEffect(() => {
    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const reducer = (
    state: WindowState[],
    action: WindowAction
  ): WindowState[] => {
    switch (action.type) {
      case "MINIMIZE":
        return state.map((window) => {
          if (window.id === action.id) {
            return { ...window, isMinimized: true };
          }
          return window;
        });
      case "MAXIMIZE":
        return state.map((window) => {
          if (window.id === action.id) {
            return { ...window, isMaximized: !window.isMaximized };
          }
          return window;
        });
      case "CLOSE":
        return state.filter((window) => window.id !== action.id);
      case "ADD_WINDOW":
        if (
          action.window.position?.x === 0 &&
          action.window.position?.y === 0
        ) {
          action.window.position = {
            x: borderConstrains.left,
            y: borderConstrains.top,
          };
        }
        return [...state, action.window];
      case "MOVE":
        return state.map((window) => {
          if (window.id === action.id) {
            let { x, y } = action.position;
            x =
              x + window.size.width > borderConstrains.right
                ? borderConstrains.right - window.size.width
                : x < borderConstrains.left
                ? borderConstrains.left
                : x;
            y =
              y < borderConstrains.top
                ? borderConstrains.top
                : y + window.size.height > borderConstrains.bottom
                ? borderConstrains.bottom - window.size.height
                : y;
            return { ...window, position: { x, y } };
          }
          return window;
        });
      case "RESIZE":
        return state.map((window) => {
          if (window.id === action.id) {
            return { ...window, size: action.size };
          }
          return window;
        });
      case "FOCUS":
        const targetIndex = state.findIndex(
          (window) => window.id === action.id
        );
        if (targetIndex > -1) {
          const targetWindow = state[targetIndex];
          targetWindow.isMinimized = false;
          return [
            ...state.slice(0, targetIndex),
            ...state.slice(targetIndex + 1),
            targetWindow,
          ];
        }
        return state;
      default:
        return state;
    }
  };

  const [windows, dispatch] = useReducer(reducer, []);

  return (
    <main className="flex flex-col justify-between min-h-screen">
      <StatusBar ref={statusBarRef} />
      <div className="bg-foreground transition-colors duration-300 text-background absolute min-h-full min-w-full p-8 z-0">
        {windows.map((window, index) => (
          <Window
            key={window.id}
            {...window}
            isFocused={index == windows.length - 1}
            borderConstrains={borderConstrains}
            dispatch={dispatch}
          />
        ))}
      </div>
      <Taskbar
        reTriggerConstrains={handleWindowResize}
        taskBarRef={taskBarRef}
        statusBarRef={statusBarRef}
        windows={windows}
        dispatch={dispatch}
      />
    </main>
  );
};
