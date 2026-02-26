import {
  BorderConstrains,
  TilingRect,
  WindowState,
} from "@/providers/WindowManagerContext";

export function computeTilingLayout(
  windows: WindowState[],
  borderConstrains: BorderConstrains,
  gap: number = 4,
): Map<number, TilingRect> {
  const rects = new Map<number, TilingRect>();

  const visible = windows.filter((w) => !w.isMinimized);
  if (visible.length === 0) return rects;

  const screenX = borderConstrains.left;
  const screenY = borderConstrains.top;
  const screenW = borderConstrains.right - borderConstrains.left;
  const screenH = borderConstrains.bottom - borderConstrains.top;

  if (visible.length === 1) {
    rects.set(visible[0].id, {
      x: screenX + gap,
      y: screenY + gap,
      width: screenW - gap * 2,
      height: screenH - gap * 2,
    });
    return rects;
  }

  dwindle(
    visible,
    0,
    screenX + gap,
    screenY + gap,
    screenW - gap * 2,
    screenH - gap * 2,
    true,
    gap,
    rects,
  );

  return rects;
}

function dwindle(
  windows: WindowState[],
  index: number,
  x: number,
  y: number,
  w: number,
  h: number,
  splitVertical: boolean,
  gap: number,
  rects: Map<number, TilingRect>,
): void {
  if (index >= windows.length) return;

  // Window gets the remaining space
  if (index === windows.length - 1) {
    rects.set(windows[index].id, { x, y, width: w, height: h });
    return;
  }

  const halfGap = gap / 2;

  if (splitVertical) {
    // Split left | right
    const leftW = Math.floor(w / 2) - halfGap;
    const rightW = w - leftW - gap;

    rects.set(windows[index].id, { x, y, width: leftW, height: h });
    dwindle(
      windows,
      index + 1,
      x + leftW + gap,
      y,
      rightW,
      h,
      !splitVertical,
      gap,
      rects,
    );
  } else {
    // Split top / bottom
    const topH = Math.floor(h / 2) - halfGap;
    const bottomH = h - topH - gap;

    rects.set(windows[index].id, { x, y, width: w, height: topH });
    dwindle(
      windows,
      index + 1,
      x,
      y + topH + gap,
      w,
      bottomH,
      !splitVertical,
      gap,
      rects,
    );
  }
}
