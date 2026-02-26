import { useMemo } from "react";
import {
  BorderConstrains,
  TilingRect,
  WindowState,
} from "@/providers/WindowManagerContext";
import { computeTilingLayout } from "@/lib/utils/tiling-layout";
import { WindowMode } from "@/lib/Etc/EtcWindowMode";

export function useTilingRects(
  windowMode: WindowMode,
  windows: WindowState[],
  borderConstrains: BorderConstrains,
  tilingGap: number,
  workspaceCount: number,
): Map<number, TilingRect> {
  return useMemo(() => {
    if (windowMode !== "tiling") return new Map<number, TilingRect>();

    const rects = new Map<number, TilingRect>();
    for (let ws = 1; ws <= workspaceCount; ws++) {
      const wsWindows = windows.filter((w) => w.workspace === ws);
      const wsRects = computeTilingLayout(
        wsWindows,
        borderConstrains,
        tilingGap,
      );
      for (const [id, rect] of wsRects) rects.set(id, rect);
    }
    return rects;
  }, [windowMode, windows, borderConstrains, tilingGap, workspaceCount]);
}
