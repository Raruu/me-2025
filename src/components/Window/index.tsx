import { Icon } from "@iconify/react";
import {
  MouseEvent,
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import {
  WindowManagerContext,
  WindowState,
} from "@/providers/WindowManagerContext";
import { WindowActionButton } from "./WindowActionButton";
import { WindowContext } from "@/providers/WindowContext";

type ResizeDirection =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | null;

interface WindowProps extends WindowState {
  isFocused: boolean;
  isHiddenByWorkspace?: boolean;
}

export const Window = ({
  zIndex,
  id,
  title,
  initialSubtitle,
  icon,
  content,
  isMinimized,
  isMaximized,
  position,
  size,
  isFocused,
  minSize,
  launcherRef,
  initialWindowColor,
  callback,
  args,
  workspace,
  isHiddenByWorkspace,
}: WindowProps) => {
  const {
    borderConstrains,
    dispatch,
    windowMode,
    tilingRects,
    hoverFocusSuppressedUntilRef,
    activeWorkspace,
  } = useContext(WindowManagerContext);
  const isTiling = windowMode === "tiling";
  const tilingRect = tilingRects.get(id);
  const [isDraggingMove, setIsDraggingMove] = useState(false);
  const [isDraggingResize, setIsDraggingResize] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<React.ReactNode>(undefined);
  const [freeSlot, setFreeSlot] = useState<React.ReactNode>(undefined);
  const [subtitle, setSubtitle] = useState<string | undefined>(initialSubtitle);
  const [windowColor, setWindowColor] = useState(initialWindowColor);

  // Alt+grab mode: hold Alt to drag window from anywhere
  const [isAltHeld, setIsAltHeld] = useState(false);
  const [isAltGrabbing, setIsAltGrabbing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Alt" || e.altKey) setIsAltHeld(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setIsAltHeld(false);
        setIsAltGrabbing(false);
        setIsDraggingMove(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Alt+grab in tiling mode
  useEffect(() => {
    if (!isTiling || !isAltGrabbing) return;

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      for (const [winId, rect] of tilingRects) {
        if (winId === id) continue;
        if (
          e.clientX >= rect.x &&
          e.clientX <= rect.x + rect.width &&
          e.clientY >= rect.y &&
          e.clientY <= rect.y + rect.height
        ) {
          dispatch({ type: "SWAP_TILING", id, targetId: winId });
          dispatch({ type: "FOCUS", id });
          break;
        }
      }
      setIsAltGrabbing(false);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isTiling, isAltGrabbing, tilingRects, id, dispatch]);

  useEffect(() => {
    callback?.();
  }, []);

  const maximize = () => {
    dispatch({ type: "FOCUS", id });
    setTimeout(() => dispatch({ type: "MAXIMIZE", id }), 1);
  };

  const RESIZE_THRESHOLD = 2;

  const getClientCoordinates = (
    e:
      | globalThis.MouseEvent
      | MouseEvent
      | React.TouchEvent<HTMLDivElement>
      | TouchEvent,
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

  const handleDownResize = (
    e: MouseEvent | React.TouchEvent<HTMLDivElement>,
    direction: ResizeDirection,
  ) => {
    e.stopPropagation();
    setIsDraggingResize(true);
    setResizeDirection(direction);
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
    [borderConstrains],
  );

  useEffect(() => {
    const stopResizing = () => {
      setIsDraggingResize(false);
      setResizeDirection(null);
      document.body.style.cursor = "";
    };

    const handleResize = (
      e: globalThis.MouseEvent | React.TouchEvent<HTMLDivElement> | TouchEvent,
    ) => {
      if (!isDraggingResize || !resizeDirection || isMaximized) return;
      const { clientX, clientY } = getClientCoordinates(e);
      if (checkOutofConstrains(clientX, clientY)) {
        stopResizing();
        return;
      }
      const { x, y } = position;
      const { width, height } = size;

      let newWidth = width;
      let newHeight = height;
      let newX = x;
      let newY = y;

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
      document.body.style.cursor = resizeDirection
        ? cursorMap[resizeDirection]
        : "default";

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

      const headerMinWidth = parseInt(headerRef.current?.style.minWidth || "0");
      if (newWidth < minSize.width || newWidth < headerMinWidth) {
        newWidth =
          minSize.width > headerMinWidth ? minSize.width : headerMinWidth;
        if (resizeDirection.includes("left")) newX = x + width - newWidth;
      }
      const headerHeight = headerRef.current?.offsetHeight || 0;
      if (newHeight < minSize.height || newHeight < headerHeight) {
        newHeight =
          minSize.height > headerHeight ? minSize.height : headerHeight;
        if (resizeDirection.includes("top")) newY = y + height - newHeight;
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
    document.addEventListener("mouseup", stopResizing);
    document.addEventListener("touchend", stopResizing);
    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("touchmove", handleResize);
      document.removeEventListener("mouseup", stopResizing);
      document.removeEventListener("touchend", stopResizing);
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
      e: globalThis.MouseEvent | React.TouchEvent<HTMLDivElement> | TouchEvent,
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

  const focus = (e: React.TouchEvent<HTMLDivElement> | MouseEvent) => {
    if (
      !isFocused &&
      e.target instanceof HTMLElement &&
      e.target.id !== "window-actions"
    ) {
      dispatch({ type: "FOCUS", id });
    }
  };

  const [animateMinimize, setAnimateMinimize] = useState(true);

  useEffect(() => {
    if (isMinimized) return;
    setAnimateMinimize(false);
  }, [isMinimized]);

  const launcherPosX = launcherRef?.current
    ? isMaximized
      ? 0
      : launcherRef?.current?.getBoundingClientRect().x
    : 0;

  const launcherPosY = launcherRef?.current?.getBoundingClientRect().y ?? 0;

  // Compute effective position/size for tiling mode
  const effectivePos =
    isTiling && tilingRect ? { x: tilingRect.x, y: tilingRect.y } : position;
  const effectiveSize =
    isTiling && tilingRect
      ? { width: tilingRect.width, height: tilingRect.height }
      : size;
  const effectiveMaximized = isTiling ? false : isMaximized;

  const workspaceXOffset = isHiddenByWorkspace
    ? ((workspace ?? 1) - activeWorkspace) * window.innerWidth
    : 0;

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col w-96 h-96 bg-transparent rounded-lg 
        shadow-lg select-none text-foreground overflow-hidden max-w-full max-h-full ${
          !isDraggingResize && !isDraggingMove
            ? "transition-all duration-300"
            : ""
        }`}
      onTransitionEnd={(e) => {
        if (animateMinimize && e.propertyName === "opacity") {
          dispatch({ type: "MINIMIZE", id });
        }
      }}
      onMouseEnter={() => {
        if (
          isTiling &&
          !isFocused &&
          !isHiddenByWorkspace &&
          !isMinimized &&
          Date.now() > hoverFocusSuppressedUntilRef.current
        ) {
          dispatch({ type: "FOCUS", id });
        }
      }}
      onMouseDown={(e: MouseEvent) => {
        focus(e);
        if (isAltHeld && !effectiveMaximized) {
          e.preventDefault();
          setIsAltGrabbing(true);
          if (!isTiling) {
            handleDownMove(e);
          }
        }
      }}
      onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => focus(e)}
      onTouchEnd={() => {
        setIsDraggingMove(false);
        setIsAltGrabbing(false);
      }}
      style={{
        top: 0,
        left: 0,
        transform: animateMinimize
          ? launcherRef?.current === null
            ? `translate(${position.x}px, ${position.y}px)`
            : `translate(${launcherPosX}px, ${launcherPosY}px)`
          : effectiveMaximized
            ? `translate(${borderConstrains.left + workspaceXOffset}px, ${borderConstrains.top}px)`
            : `translate(${effectivePos.x + workspaceXOffset}px, ${effectivePos.y}px)`,
        width: effectiveMaximized
          ? `calc(100% - ${borderConstrains.left}px - (100% - ${borderConstrains.right}px))`
          : effectiveSize.width,
        height: effectiveMaximized
          ? `calc(100% - ${borderConstrains.top}px - (100% - ${borderConstrains.bottom}px))`
          : effectiveSize.height,
        borderRadius: effectiveMaximized ? 0 : "",
        opacity: animateMinimize ? 0 : 1,
        scale: animateMinimize ? 0.75 : 1,
        zIndex: zIndex,
        display: isMinimized ? "none" : "",
        pointerEvents: isHiddenByWorkspace ? "none" : undefined,
        cursor:
          isAltHeld && !effectiveMaximized
            ? isAltGrabbing
              ? "grabbing"
              : "grab"
            : "",
      }}
    >
      <div
        ref={headerRef}
        style={{
          borderRadius: effectiveMaximized || isTiling ? 0 : "",
          minWidth: "130px",
          backgroundColor: windowColor,
        }}
        className="flex flex-row justify-between rounded-t-lg p-2 select-none bg-background-tr backdrop-blur"
        onMouseDown={(e: MouseEvent) => {
          if (e.target === e.currentTarget && !isTiling) {
            handleDownMove(e);
          }
        }}
        onMouseUp={() => setIsDraggingMove(false)}
        onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget && !isTiling) handleDownMove(e);
        }}
      >
        <div className="flex flex-row items-center gap-2">
          {icon && <Icon icon={icon} width={24} height={24} />}
          <div
            className="flex flex-col h-full justify-center"
            onMouseDown={(e: MouseEvent) => {
              if (!isTiling) handleDownMove(e);
            }}
            onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
              if (!isTiling) handleDownMove(e);
            }}
          >
            <h1 className="font-bold text-base leading-none">{title}</h1>
            <p className="font-thin text-xs leading-none">{subtitle}</p>
          </div>
        </div>

        <div
          className="flex-1 h-full w-full"
          onMouseDown={(e: MouseEvent) => {
            if (!isTiling) handleDownMove(e);
          }}
          onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
            if (!isTiling) handleDownMove(e);
          }}
          onDoubleClick={() => {
            if (!isTiling) maximize();
          }}
        ></div>
        <div id="window-actions" className="flex flex-row items-center">
          {freeSlot}
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
        style={{
          borderRadius: effectiveMaximized || isTiling ? 0 : "",
        }}
        className={`overflow-hidden bg-transparent w-full h-full rounded-b-lg select-all will-change-auto relative flex ${
          isDraggingResize || isDraggingMove || !isFocused || isAltHeld
            ? "pointer-events-none"
            : ""
        }`}
      >
        <WindowContext.Provider
          value={{
            setModal: setModal,
            setFreeSlot: setFreeSlot,
            setSubtitle: setSubtitle,
            setWindowColor: setWindowColor,
            windowRef: windowRef,
            position: position,
            windowSize: size,
            windowId: id,
            isDragging:
              effectiveMaximized || isTiling
                ? false
                : isDraggingMove || isDraggingResize || isAltGrabbing,
            args: args,
          }}
        >
          {content}
          {modal}
        </WindowContext.Provider>
      </div>
      <div>
        <div
          className="absolute select-none"
          style={{
            width: "100%",
            height: "6px",
            left: "0px",
            bottom: "-3px",
            cursor: isDraggingResize ? "" : "ns-resize",
            display: effectiveMaximized || isTiling ? "none" : "",
          }}
          onMouseDown={(e) => handleDownResize(e, "bottom")}
          onTouchStart={(e) => handleDownResize(e, "bottom")}
        ></div>
        <div
          className="absolute select-none"
          style={{
            width: "6px",
            height: "100%",
            top: "0px",
            left: "-3px",
            cursor: isDraggingResize ? "" : "ew-resize",
            display: effectiveMaximized || isTiling ? "none" : "",
          }}
          onMouseDown={(e) => handleDownResize(e, "left")}
          onTouchStart={(e) => handleDownResize(e, "left")}
        ></div>
        <div
          className="absolute select-none"
          style={{
            width: "6px",
            height: "100%",
            top: "0px",
            right: "-3px",
            cursor: isDraggingResize ? "" : "ew-resize",
            display: effectiveMaximized || isTiling ? "none" : "",
          }}
          onMouseDown={(e) => handleDownResize(e, "right")}
          onTouchStart={(e) => handleDownResize(e, "right")}
        ></div>
        <div
          className="absolute select-none"
          style={{
            width: "100%",
            height: "6px",
            top: "-3px",
            left: "0px",
            cursor: isDraggingResize ? "" : "ns-resize",
            display: effectiveMaximized || isTiling ? "none" : "",
          }}
          onMouseDown={(e) => handleDownResize(e, "top")}
          onTouchStart={(e) => handleDownResize(e, "top")}
        ></div>
        <div
          className="absolute select-none"
          style={{
            width: "12px",
            height: "12px",
            left: "-3px",
            top: "-3px",
            cursor: isDraggingResize ? "" : "nwse-resize",
            display: effectiveMaximized || isTiling ? "none" : "",
          }}
          onMouseDown={(e) => handleDownResize(e, "top-left")}
          onTouchStart={(e) => handleDownResize(e, "top-left")}
        ></div>
        <div
          className="absolute select-none"
          style={{
            width: "12px",
            height: "12px",
            right: "-3px",
            top: "-3px",
            cursor: isDraggingResize ? "" : "nesw-resize",
            display: effectiveMaximized || isTiling ? "none" : "",
          }}
          onMouseDown={(e) => handleDownResize(e, "top-right")}
          onTouchStart={(e) => handleDownResize(e, "top-right")}
        ></div>
        <div
          className="absolute select-none"
          style={{
            width: "12px",
            height: "12px",
            left: "-3px",
            bottom: "-3px",
            cursor: isDraggingResize ? "" : "nesw-resize",
            display: effectiveMaximized || isTiling ? "none" : "",
          }}
          onMouseDown={(e) => handleDownResize(e, "bottom-left")}
          onTouchStart={(e) => handleDownResize(e, "bottom-left")}
        ></div>
        <div
          className="absolute select-none"
          style={{
            width: "12px",
            height: "12px",
            right: "-3px",
            bottom: "-3px",
            cursor: isDraggingResize ? "" : "nwse-resize",
            display: effectiveMaximized || isTiling ? "none" : "",
          }}
          onMouseDown={(e) => handleDownResize(e, "bottom-right")}
          onTouchStart={(e) => handleDownResize(e, "bottom-right")}
        ></div>
      </div>
    </div>
  );
};
