import { useReducer, useRef } from "react";
import { Window } from "./Window";
import { StatusBar } from "../ui/Statusbar";

export interface WindowState {
  id: number;
  title: string;
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
  const statusBarRef = useRef<HTMLDivElement>(null);
  const borderConstrains: BorderConstrains = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  if (statusBarRef.current) {
    borderConstrains.top = statusBarRef.current.clientHeight;
    borderConstrains.right = window.innerWidth;
    borderConstrains.bottom = window.innerHeight;
    borderConstrains.left = 0;
  }

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

  const addWindow = () => {
    dispatch({
      type: "ADD_WINDOW",
      window: {
        id: Date.now(),
        title: `Window ${windows.length}`,
        content: <div>Content</div>,
        isMinimized: false,
        isMaximized: false,
        position: {
          x: borderConstrains.left,
          y: borderConstrains.top,
        },
        size: { width: 400, height: 300 },
      },
    });
  };

  return (
    <main className="flex flex-col min-h-screen">
      <StatusBar ref={statusBarRef} />
      <div className="bg-foreground text-background  flex-1 min-w-full p-8">
        <button onClick={addWindow}>Open Window</button>
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
    </main>
  );
};
