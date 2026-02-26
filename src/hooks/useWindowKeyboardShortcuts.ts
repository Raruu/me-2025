import { RefObject, useEffect } from "react";
import {
  TilingRect,
  WindowAction,
  WindowState,
} from "@/providers/WindowManagerContext";

type UseWindowKeyboardShortcutsParams = {
  windows: WindowState[];
  workspaceCount: number;
  tilingRects: Map<number, TilingRect>;
  activeWorkspaceRef: RefObject<number>;
  dispatch: React.Dispatch<WindowAction>;
  setActiveWorkspace: (workspace: number) => void;
  hoverFocusSuppressedUntilRef: RefObject<number>;
};

export function useWindowKeyboardShortcuts({
  windows,
  workspaceCount,
  tilingRects,
  activeWorkspaceRef,
  dispatch,
  setActiveWorkspace,
  hoverFocusSuppressedUntilRef,
}: UseWindowKeyboardShortcutsParams): void {
  useEffect(() => {
    const getFocusedWindow = (): WindowState | undefined =>
      windows.find(
        (w) =>
          w.workspace === activeWorkspaceRef.current &&
          !w.isMinimized &&
          w.zIndex === windows.length - 1,
      );

    const suppressHover = () => {
      hoverFocusSuppressedUntilRef.current = Date.now() + 400;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      //  Alt + Q: close focused window
      if (e.altKey && e.key === "q") {
        e.preventDefault();
        const focused = getFocusedWindow();
        if (focused) dispatch({ type: "CLOSE", id: focused.id });
        return;
      }

      //  Alt + 1…N: switch workspace
      if (e.altKey && !e.shiftKey && !e.ctrlKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= workspaceCount) {
          e.preventDefault();
          setActiveWorkspace(num);
          suppressHover();
          return;
        }
      }

      //  Alt + Ctrl + Shift + arrow left/right: move window to adjacent workspace
      if (
        e.altKey &&
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === "ArrowLeft" || e.key === "ArrowRight")
      ) {
        e.preventDefault();
        const focused = getFocusedWindow();
        if (!focused) return;

        const currentWs = focused.workspace ?? activeWorkspaceRef.current;
        const targetWs = currentWs + (e.key === "ArrowLeft" ? -1 : 1);
        if (targetWs < 1 || targetWs > workspaceCount) return;

        dispatch({
          type: "MOVE_TO_WORKSPACE",
          id: focused.id,
          workspace: targetWs,
        });
        setActiveWorkspace(targetWs);
        suppressHover();
        return;
      }

      //  Alt + Shift + arrow: swap with nearest tiling neighbour
      if (
        e.altKey &&
        e.shiftKey &&
        !e.ctrlKey &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
      ) {
        e.preventDefault();
        const focused = getFocusedWindow();
        if (!focused) return;

        const focusedRect = tilingRects.get(focused.id);
        if (!focusedRect) return;

        const fcx = focusedRect.x + focusedRect.width / 2;
        const fcy = focusedRect.y + focusedRect.height / 2;

        const activeWinIds = new Set(
          windows
            .filter(
              (w) =>
                w.workspace === activeWorkspaceRef.current && !w.isMinimized,
            )
            .map((w) => w.id),
        );

        let bestId: number | null = null;
        let bestDist = Infinity;

        for (const [winId, rect] of tilingRects) {
          if (winId === focused.id || !activeWinIds.has(winId)) continue;

          const cx = rect.x + rect.width / 2;
          const cy = rect.y + rect.height / 2;
          const dx = cx - fcx;
          const dy = cy - fcy;

          const valid =
            (e.key === "ArrowLeft" && dx < 0) ||
            (e.key === "ArrowRight" && dx > 0) ||
            (e.key === "ArrowUp" && dy < 0) ||
            (e.key === "ArrowDown" && dy > 0);

          if (!valid) continue;

          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < bestDist) {
            bestDist = dist;
            bestId = winId;
          }
        }

        if (bestId !== null) {
          dispatch({ type: "SWAP_TILING", id: focused.id, targetId: bestId });
          dispatch({ type: "FOCUS", id: focused.id });
          suppressHover();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    windows,
    workspaceCount,
    tilingRects,
    activeWorkspaceRef,
    dispatch,
    setActiveWorkspace,
    hoverFocusSuppressedUntilRef,
  ]);
}
