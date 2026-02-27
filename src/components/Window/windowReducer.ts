import type { RefObject } from "react";
import {
  BorderConstrains,
  WindowAction,
  WindowState,
} from "@/providers/WindowManagerContext";

interface WindowReducerRefs {
  borderConstrainsRef: RefObject<BorderConstrains>;
  activeWorkspaceRef: RefObject<number>;
  setActiveWorkspace: (workspace: number) => void;
}

export function createWindowReducer(refs: WindowReducerRefs) {
  return function windowReducer(
    state: WindowState[],
    action: WindowAction,
  ): WindowState[] {
    const bc = refs.borderConstrainsRef.current;

    switch (action.type) {
      case "MINIMIZE":
        return state.map((w) =>
          w.id === action.id ? { ...w, isMinimized: true } : w,
        );
      case "MAXIMIZE":
        return state.map((w) =>
          w.id === action.id ? { ...w, isMaximized: !w.isMaximized } : w,
        );
      case "CLOSE": {
        const target = state.find((w) => w.id === action.id);
        if (!target) return state;

        return state
          .filter((w) => w.id !== action.id)
          .map((w) =>
            w.zIndex > target.zIndex ? { ...w, zIndex: w.zIndex - 1 } : w,
          );
      }
      case "ADD_WINDOW": {
        const screenW = bc.right - bc.left;
        const screenH = bc.bottom - bc.top;

        // Clamp to screen
        let { size, minSize, position } = action.window;
        if (screenW < size.width) {
          size = { ...size, width: screenW };
          if (screenW < minSize.width) minSize = { ...minSize, width: screenW };
        }
        if (screenH < size.height) {
          size = { ...size, height: screenH };
          if (screenH < minSize.height)
            minSize = { ...minSize, height: screenH };
        }

        if (position?.x === 0 && position?.y === 0) {
          position = {
            x: (bc.right + bc.left) / 2 - size.width / 2,
            y: (bc.bottom + bc.top) / 2 - size.height / 2,
          };
        }

        let { launcherRef } = action.window;
        if (launcherRef?.current === null) {
          const existing = state.find((w) => w.appId === action.window.appId);
          if (existing) launcherRef = existing.launcherRef;
        }

        const newWindow: WindowState = {
          ...action.window,
          size,
          minSize,
          position,
          launcherRef,
          zIndex: state.length,
          workspace: action.window.workspace ?? refs.activeWorkspaceRef.current,
        };

        return [...state, newWindow];
      }
      case "MOVE":
        return state.map((w) => {
          if (w.id !== action.id) return w;
          const { x, y } = action.position;
          return {
            ...w,
            position: { x, y: y < bc.top ? bc.top : y },
          };
        });
      case "RESIZE":
        return state.map((w) =>
          w.id === action.id ? { ...w, size: action.size } : w,
        );
      case "FOCUS": {
        const targetIndex = state.findIndex((w) => w.id === action.id);
        if (targetIndex === -1) return state;

        const target = state[targetIndex];
        const { innerWidth, innerHeight } = window;
        const { x, y } = target.position;
        const { width, height } = target.size;

        const correctedPos = {
          x: x + width > innerWidth ? (innerWidth - width) / 2 : x,
          y: y + height > innerHeight ? (innerHeight - height) / 2 : y,
        };

        const focusedWindow: WindowState = {
          ...target,
          isMinimized: false,
          position: correctedPos,
        };

        if (focusedWindow.zIndex === state.length) {
          return state.map((w) => (w.id === action.id ? focusedWindow : w));
        }

        const prevZ = target.zIndex;
        refs.setActiveWorkspace(focusedWindow.workspace!);

        return state.map((w, i) => {
          if (i === targetIndex)
            return { ...focusedWindow, zIndex: state.length - 1 };
          return w.zIndex > prevZ ? { ...w, zIndex: w.zIndex - 1 } : w;
        });
      }
      case "MOVE_TO_WORKSPACE":
        return state.map((w) =>
          w.id === action.id ? { ...w, workspace: action.workspace } : w,
        );
      case "SWAP_TILING": {
        const idxA = state.findIndex((w) => w.id === action.id);
        const idxB = state.findIndex((w) => w.id === action.targetId);
        if (idxA === -1 || idxB === -1) return state;

        const next = [...state];
        const tmpZ = next[idxA].zIndex;
        next[idxA] = { ...next[idxA], zIndex: next[idxB].zIndex };
        next[idxB] = { ...next[idxB], zIndex: tmpZ };
        [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
        return next;
      }
      default:
        return state;
    }
  };
}
