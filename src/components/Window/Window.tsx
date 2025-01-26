import { Icon } from "@iconify/react";
import { WindowState, WindowAction, BorderConstrains } from "./WindowManager";
import { Dispatch, MouseEvent, useState, useEffect, useCallback } from "react";

interface WindowActionButtonProps {
  icon: string;
  useRightMargin?: boolean;
  onClick?: () => void;
}

const WindowActionButton = ({
  icon,
  useRightMargin,
  onClick,
}: WindowActionButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center bg-gray-200 hover:bg-gray-300 
        dark:bg-slate-50 dark:hover:bg-slate-300 dark:bg-opacity-25 dark:hover:bg-opacity-25 
        w-6 h-6 rounded-full ${useRightMargin ? "mr-2" : ""}`}
      onClick={onClick}
    >
      <Icon
        className="opacity-65 hover:opacity-100 transition-all duration-150 w-1/2 h-full"
        icon={icon}
      />
    </button>
  );
};

interface WindowProps extends WindowState {
  isFocused: boolean;
  borderConstrains: BorderConstrains;
  dispatch: Dispatch<WindowAction>;
}

export const Window = ({
  id,
  title,
  subtitle,
  content,
  isMinimized,
  isMaximized,
  position,
  size,
  isFocused,
  borderConstrains,
  minSize,
  dispatch,
}: WindowProps) => {
  const [isDraggingMove, setIsDraggingMove] = useState(false);
  const [isDraggingResize, setIsDraggingResize] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState("default");

  const maximize = () => {
    dispatch({ type: "FOCUS", id });
    setTimeout(() => dispatch({ type: "MAXIMIZE", id }), 1);
  };

  const RESIZE_THRESHOLD = 5;

  const calculateResizeDirection = (
    mouseX: number,
    mouseY: number
  ): string | null => {
    const { x, y } = position;
    const { width, height } = size;

    const nearTop = mouseY >= y && mouseY <= y + RESIZE_THRESHOLD;
    const nearBottom =
      mouseY >= y + height - RESIZE_THRESHOLD && mouseY <= y + height;
    const nearLeft = mouseX >= x && mouseX <= x + RESIZE_THRESHOLD;
    const nearRight =
      mouseX >= x + width - RESIZE_THRESHOLD && mouseX <= x + width;

    if (nearTop && nearLeft) return "top-left";
    if (nearTop && nearRight) return "top-right";
    if (nearBottom && nearLeft) return "bottom-left";
    if (nearBottom && nearRight) return "bottom-right";
    if (nearTop) return "top";
    if (nearBottom) return "bottom";
    if (nearLeft) return "left";
    if (nearRight) return "right";

    return null;
  };

  const handleMouseResizeCursor = (e: MouseEvent) => {
    if (!isDraggingResize) {
      const direction = calculateResizeDirection(e.clientX, e.clientY);
      const cursorMap: Record<string, string> = {
        "top-left": "nwse-resize",
        "top-right": "nesw-resize",
        "bottom-left": "nesw-resize",
        "bottom-right": "nwse-resize",
        top: "ns-resize",
        bottom: "ns-resize",
        left: "ew-resize",
        right: "ew-resize",
      };
      setCursorStyle(direction ? cursorMap[direction] : "default");
    }
  };

  const handleMouseDownResize = (e: MouseEvent) => {
    const direction = calculateResizeDirection(e.clientX, e.clientY);
    // console.log(direction);
    if (direction) {
      setIsDraggingResize(true);
      setResizeDirection(direction);
    }
  };

  const handleMouseDownMove = (e: MouseEvent) => {
    setIsDraggingMove(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const checkOutofConstrains = useCallback(
    (e: globalThis.MouseEvent) => {
      return (
        e.clientX < borderConstrains.left ||
        e.clientX > borderConstrains.right ||
        e.clientY < borderConstrains.top ||
        e.clientY > borderConstrains.bottom
      );
    },
    [borderConstrains]
  );

  useEffect(() => {
    const handleResize = (e: globalThis.MouseEvent) => {
      if (!isDraggingResize || !resizeDirection || isMaximized) return;
      if (checkOutofConstrains(e)) {
        setIsDraggingResize(false);
        setResizeDirection(null);
        return;
      }
      const { x, y } = position;
      const { width, height } = size;

      let newWidth = width;
      let newHeight = height;
      let newX = x;
      let newY = y;

      if (resizeDirection.includes("right")) {
        newWidth = e.clientX - x + RESIZE_THRESHOLD;
      }
      if (resizeDirection.includes("left")) {
        newWidth = width + (x - e.clientX) + RESIZE_THRESHOLD;
        newX = e.clientX - RESIZE_THRESHOLD;
      }
      if (resizeDirection.includes("bottom")) {
        newHeight = e.clientY - y + RESIZE_THRESHOLD;
      }
      if (resizeDirection.includes("top")) {
        newHeight = height + (y - e.clientY) + RESIZE_THRESHOLD;
        newY = e.clientY - RESIZE_THRESHOLD;
      }

      if (newWidth < minSize.width) {
        newWidth = minSize.width;
        if (resizeDirection.includes("left")) newX = x + width - minSize.width;
      }
      if (newHeight < minSize.height) {
        newHeight = minSize.height;
        if (resizeDirection.includes("top")) newY = y + height - minSize.height;
      }

      dispatch({
        type: "RESIZE",
        id,
        size: {
          width: newWidth,
          height: newHeight,
        },
      });

      dispatch({
        type: "MOVE",
        id,
        position: {
          x: newX,
          y: newY,
        },
      });
    };

    document.addEventListener("mousemove", handleResize);
    return () => {
      document.removeEventListener("mousemove", handleResize);
    };
  }, [
    checkOutofConstrains,
    borderConstrains,
    dispatch,
    id,
    isDraggingResize,
    isMaximized,
    minSize,
    position,
    resizeDirection,
    size,
  ]);

  useEffect(() => {
    const handleMove = (e: globalThis.MouseEvent) => {
      if (!isDraggingMove || isMaximized) return;
      if (checkOutofConstrains(e)) {
        setIsDraggingMove(false);
      }
      dispatch({
        type: "MOVE",
        id,
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        },
      });
    };
    document.addEventListener("mousemove", handleMove);
    return () => {
      document.removeEventListener("mousemove", handleMove);
    };
  }, [
    checkOutofConstrains,
    dispatch,
    dragOffset,
    id,
    isDraggingMove,
    isMaximized,
  ]);

  if (isMinimized) return null;

  return (
    <div
      className={`absolute flex flex-col w-96 h-96 bg-transparent rounded-lg 
        shadow-lg select-none cursor-move text-foreground ${
          !isDraggingResize && !isDraggingMove
            ? "transition-all duration-300"
            : ""
        }`}
      onMouseMove={handleMouseResizeCursor}
      onMouseDown={(e: MouseEvent) => {
        if (
          !isFocused &&
          e.target instanceof HTMLElement &&
          e.target.id !== "window-actions"
        ) {
          dispatch({ type: "FOCUS", id });
        }
        if (e.target === e.currentTarget) {
          handleMouseDownResize(e);
        }
      }}
      onMouseUp={() => setIsDraggingResize(false)}
      style={{
        top: isMaximized ? borderConstrains.top : position.y,
        left: isMaximized ? borderConstrains.left : position.x,
        width: isMaximized
          ? `calc(100% - ${borderConstrains.left}px - (100% - ${borderConstrains.right}px))`
          : size.width,
        height: isMaximized
          ? `calc(100% - ${borderConstrains.top}px - (100% - ${borderConstrains.bottom}px))`
          : size.height,
        padding: isMaximized ? 0 : "6px 4px 4px 4px",
        borderRadius: isMaximized ? 0 : "",
        cursor: cursorStyle,
      }}
    >
      <div
        style={{ borderRadius: isMaximized ? 0 : "" }}
        className="flex flex-row justify-between rounded-t-lg p-2 select-none bg-background"
        onMouseDown={(e: MouseEvent) => {
          if (e.target === e.currentTarget) {
            handleMouseDownMove(e);
          }
        }}
        onMouseUp={() => setIsDraggingMove(false)}
      >
        <div
          className="flex flex-col justify-center"
          onMouseDown={(e: MouseEvent) => handleMouseDownMove(e)}
        >
          <h1 className="font-bold text-base leading-none">{title}</h1>
          <p className="font-thin text-xs leading-none">{subtitle}</p>
        </div>
        <div
          className="flex-1 h-full w-full"
          onMouseDown={(e: MouseEvent) => handleMouseDownMove(e)}
          onDoubleClick={maximize}
        ></div>
        <div id="window-actions" className="flex flex-row">
          <WindowActionButton
            icon="mingcute:minimize-fill"
            useRightMargin
            onClick={() => dispatch({ type: "MINIMIZE", id })}
          />
          <WindowActionButton
            icon={`mingcute:${isMaximized ? "restore-fill" : "square-line"}`}
            useRightMargin
            onClick={maximize}
          />
          <WindowActionButton
            icon="mingcute:close-fill"
            onClick={() => dispatch({ type: "CLOSE", id })}
          />
        </div>
      </div>
      <div
        style={{ borderRadius: isMaximized ? 0 : "" }}
        className={`overflow-auto bg-transparent w-full h-full rounded-b-lg select-all  ${
          isDraggingResize || isDraggingMove || !isFocused
            ? "pointer-events-none"
            : ""
        }`}
      >
        {content}
      </div>
    </div>
  );
};
