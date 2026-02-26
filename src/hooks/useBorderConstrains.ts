import { useState, useEffect, useCallback, useRef } from "react";
import { BorderConstrains, TaskBarRef } from "@/providers/WindowManagerContext";

export function useBorderConstrains(
  statusBarRef: React.RefObject<HTMLDivElement | null>,
  taskBarRef: React.RefObject<TaskBarRef | null>,
) {
  const [borderConstrains, setBorderConstrains] = useState<BorderConstrains>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const borderConstrainsRef = useRef<BorderConstrains>(borderConstrains);
  borderConstrainsRef.current = borderConstrains;

  const recalculate = useCallback(() => {
    if (!statusBarRef.current) return;
    setBorderConstrains({
      top: statusBarRef.current.clientHeight,
      right: window.innerWidth - (taskBarRef.current?.right ?? 0),
      bottom: window.innerHeight - (taskBarRef.current?.bottom ?? 0),
      left: 0 + (taskBarRef.current?.left ?? 0),
    });
  }, [statusBarRef, taskBarRef]);

  useEffect(() => {
    recalculate();
    window.addEventListener("resize", recalculate);
    return () => window.removeEventListener("resize", recalculate);
  }, [recalculate]);

  return { borderConstrains, borderConstrainsRef, recalculate };
}
