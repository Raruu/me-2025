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

  const RESIZE_THRESHOLD = 10;

  const getClientCoordinates = (
    e:
      | globalThis.MouseEvent
      | MouseEvent
      | React.TouchEvent<HTMLDivElement>
      | TouchEvent
  ): { clientX: number; clientY: number } => {
    if ("touches" in e && e.touches.length > 0) {
      return {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      };
    }
    return {
      clientX: (e as MouseEvent).clientX,
      clientY: (e as MouseEvent).clientY,
    };
  };

  const calculateResizeDirection = (
    clientX: number,
    clientY: number
  ): string | null => {
    const { x, y } = position;
    const { width, height } = size;

    const nearTop = clientY >= y && clientY <= y + RESIZE_THRESHOLD;
    const nearBottom =
      clientY >= y + height - RESIZE_THRESHOLD && clientY <= y + height;
    const nearLeft = clientX >= x && clientX <= x + RESIZE_THRESHOLD;
    const nearRight =
      clientX >= x + width - RESIZE_THRESHOLD && clientX <= x + width;

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

  const handleMouseResizeCursor = (
    e: MouseEvent | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isDraggingResize) {
      const { clientX, clientY } = getClientCoordinates(e);
      const direction = calculateResizeDirection(clientX, clientY);
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

  const handleDownResize = (
    e: MouseEvent | React.TouchEvent<HTMLDivElement>
  ) => {
    const { clientX, clientY } = getClientCoordinates(e);
    const direction = calculateResizeDirection(clientX, clientY);
    // console.log(direction);
    if (direction) {
      setIsDraggingResize(true);
      setResizeDirection(direction);
    }
  };

  const handleDownMove = (e: MouseEvent | React.TouchEvent<HTMLDivElement>) => {
    const { clientX, clientY } = getClientCoordinates(e);
    setIsDraggingMove(true);
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const checkOutofConstrains = useCallback(
    (clientX: number, clientY: number) => {
      return (
        // clientX < borderConstrains.left ||
        // clientX > borderConstrains.right ||
        clientY < borderConstrains.top
        // clientY > borderConstrains.bottom
      );
    },
    [borderConstrains]
  );

  useEffect(() => {
    const handleResize = (
      e: globalThis.MouseEvent | React.TouchEvent<HTMLDivElement> | TouchEvent
    ) => {
      if (!isDraggingResize || !resizeDirection || isMaximized) return;
      const { clientX, clientY } = getClientCoordinates(e);
      // if (checkOutofConstrains(clientX, clientY)) {
      //   setIsDraggingResize(false);
      //   setResizeDirection(null);
      //   return;
      // }
      const { x, y } = position;
      const { width, height } = size;

      let newWidth = width;
      let newHeight = height;
      let newX = x;
      let newY = y;

      if (resizeDirection.includes("right")) {
        newWidth = clientX - x + RESIZE_THRESHOLD;
      }
      if (resizeDirection.includes("left")) {
        newWidth = width + (x - clientX) + RESIZE_THRESHOLD;
        newX = clientX - RESIZE_THRESHOLD;
      }
      if (resizeDirection.includes("bottom")) {
        newHeight = clientY - y + RESIZE_THRESHOLD;
      }
      if (resizeDirection.includes("top")) {
        newHeight = height + (y - clientY) + RESIZE_THRESHOLD;
        newY = clientY - RESIZE_THRESHOLD;
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
    document.addEventListener("touchmove", handleResize, { passive: false });
    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("touchmove", handleResize);
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
    const handleMove = (
      e: globalThis.MouseEvent | React.TouchEvent<HTMLDivElement> | TouchEvent
    ) => {
      if (!isDraggingMove || isMaximized) return;
      const { clientX, clientY } = getClientCoordinates(e);
      if (checkOutofConstrains(clientX, clientY)) {
        setIsDraggingMove(false);
      }
      dispatch({
        type: "MOVE",
        id,
        position: {
          x: clientX - dragOffset.x,
          y: clientY - dragOffset.y,
        },
      });
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove, { passive: false });
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
    };
  }, [
    checkOutofConstrains,
    dispatch,
    dragOffset,
    id,
    isDraggingMove,
    isMaximized,
  ]);

  const [animateMinimize, setAnimateMinimize] = useState(false);

  useEffect(() => {
    if (isMinimized) return;
    setAnimateMinimize(false);
  }, [isMinimized]);

  if (isMinimized) return null;

  return (
    <div
      className={`absolute flex flex-col w-96 h-96 bg-transparent rounded-lg 
        shadow-lg select-none cursor-move text-foreground overflow-hidden max-w-full max-h-full ${
          !isDraggingResize && !isDraggingMove
            ? "transition-all duration-300"
            : ""
        } ${animateMinimize ? "opacity-0" : "opacity-100"}`}
      onTransitionEnd={() => {
        if (animateMinimize) {
          dispatch({ type: "MINIMIZE", id });
          // setAnimateMinimize(false);
        }
      }}
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
          handleDownResize(e);
        }
      }}
      onMouseUp={() => setIsDraggingResize(false)}
      onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          handleDownResize(e);
        }
      }}
      onTouchEnd={() => {
        setIsDraggingResize(false);
        setIsDraggingMove(false);
      }}
      style={{
        top: isMaximized ? borderConstrains.top : position.y,
        left: isMaximized ? borderConstrains.left : position.x,
        width: isMaximized
          ? `calc(100% - ${borderConstrains.left}px - (100% - ${borderConstrains.right}px))`
          : size.width,
        height: isMaximized
          ? `calc(100% - ${borderConstrains.top}px - (100% - ${borderConstrains.bottom}px))`
          : size.height,
        padding: isMaximized ? 0 : "10px 8px 8px 8px",
        borderRadius: isMaximized ? 0 : "",
        cursor: cursorStyle,
      }}
    >
      <div
        style={{ borderRadius: isMaximized ? 0 : "" }}
        className="flex flex-row justify-between rounded-t-lg p-2 select-none bg-[--taskbar-bg] backdrop-blur"
        onMouseDown={(e: MouseEvent) => {
          if (e.target === e.currentTarget) {
            handleDownMove(e);
          }
        }}
        onMouseUp={() => setIsDraggingMove(false)}
        onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) handleDownMove(e);
        }}
        onTouchEnd={() => setIsDraggingMove(false)}
      >
        <div
          className="flex flex-col justify-center"
          onMouseDown={(e: MouseEvent) => handleDownMove(e)}
          onTouchStart={(e: React.TouchEvent<HTMLDivElement>) =>
            handleDownMove(e)
          }
        >
          <h1 className="font-bold text-base leading-none">{title}</h1>
          <p className="font-thin text-xs leading-none">{subtitle}</p>
        </div>
        <div
          className="flex-1 h-full w-full"
          onMouseDown={(e: MouseEvent) => handleDownMove(e)}
          onTouchStart={(e: React.TouchEvent<HTMLDivElement>) =>
            handleDownMove(e)
          }
          onDoubleClick={maximize}
        ></div>
        <div id="window-actions" className="flex flex-row">
          <WindowActionButton
            icon="mingcute:minimize-fill"
            useRightMargin
            onClick={() => setAnimateMinimize(true)}
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
