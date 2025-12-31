import { Icon } from "@iconify/react";
import { WindowState } from "./WindowManager";
import {
  MouseEvent,
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  createContext,
} from "react";
import { WindowManagerContext } from "@/providers/WindowManagerContext";
import { WindowActionButton } from "./WindowActionButton";

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
}

export const WindowContext = createContext<{
  setModal: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setFreeSlot: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setSubtitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  setWindowColor: React.Dispatch<React.SetStateAction<string | undefined>>;
  windowRef: React.RefObject<HTMLDivElement | null>;
  position: { x: number; y: number };
  windowId: number;
}>({
  setModal: () => {},
  setFreeSlot: () => {},
  setSubtitle: () => {},
  setWindowColor: () => {},
  windowRef: { current: null },
  position: { x: 0, y: 0 },
  windowId: 0,
});

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
}: WindowProps) => {
  const { borderConstrains, dispatch } = useContext(WindowManagerContext);
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

  const handleDownResize = (
    e: MouseEvent | React.TouchEvent<HTMLDivElement>,
    direction: ResizeDirection
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
    [borderConstrains]
  );

  useEffect(() => {
    const stopResizing = () => {
      setIsDraggingResize(false);
      setResizeDirection(null);
      document.body.style.cursor = "";
    };

    const handleResize = (
      e: globalThis.MouseEvent | React.TouchEvent<HTMLDivElement> | TouchEvent
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

  return (
    <div ref={windowRef}
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
      onMouseDown={(e: MouseEvent) => focus(e)}
      onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => focus(e)}
      onTouchEnd={() => setIsDraggingMove(false)}
      style={{
        top: 0,
        left: 0,
        transform: animateMinimize
          ? launcherRef?.current === null
            ? `translate(${position.x}px, ${position.y}px)`
            : `translate(${launcherPosX}px, ${launcherPosY}px)`
          : isMaximized
          ? `translate(${borderConstrains.left}px, ${borderConstrains.top}px)`
          : `translate(${position.x}px, ${position.y}px)`,
        width: isMaximized
          ? `calc(100% - ${borderConstrains.left}px - (100% - ${borderConstrains.right}px))`
          : size.width,
        height: isMaximized
          ? `calc(100% - ${borderConstrains.top}px - (100% - ${borderConstrains.bottom}px))`
          : size.height,
        borderRadius: isMaximized ? 0 : "",
        opacity: animateMinimize ? 0 : 1,
        scale: animateMinimize ? 0.75 : 1,
        zIndex: zIndex,
        display: isMinimized ? "none" : "",
      }}
    >
      <div
        ref={headerRef}
        style={{
          borderRadius: isMaximized ? 0 : "",
          minWidth: "130px",
          backgroundColor: windowColor,
        }}
        className="flex flex-row justify-between rounded-t-lg p-2 select-none bg-background-tr backdrop-blur"
        onMouseDown={(e: MouseEvent) => {
          if (e.target === e.currentTarget) {
            handleDownMove(e);
          }
        }}
        onMouseUp={() => setIsDraggingMove(false)}
        onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) handleDownMove(e);
        }}
      >
        <div className="flex flex-row items-center gap-2">
          {icon && <Icon icon={icon} width={24} height={24} />}
          <div
            className="flex flex-col h-full justify-center"
            onMouseDown={(e: MouseEvent) => handleDownMove(e)}
            onTouchStart={(e: React.TouchEvent<HTMLDivElement>) =>
              handleDownMove(e)
            }
          >
            <h1 className="font-bold text-base leading-none">{title}</h1>
            <p className="font-thin text-xs leading-none">{subtitle}</p>
          </div>
        </div>

        <div
          className="flex-1 h-full w-full"
          onMouseDown={(e: MouseEvent) => handleDownMove(e)}
          onTouchStart={(e: React.TouchEvent<HTMLDivElement>) =>
            handleDownMove(e)
          }
          onDoubleClick={maximize}
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
        style={{ borderRadius: isMaximized ? 0 : "" }}
        className={`overflow-hidden bg-transparent w-full h-full rounded-b-lg select-all will-change-auto relative flex ${
          isDraggingResize || isDraggingMove || !isFocused
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
            windowId: id,
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
            display: isMaximized ? "none" : "",
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
            display: isMaximized ? "none" : "",
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
            display: isMaximized ? "none" : "",
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
            display: isMaximized ? "none" : "",
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
            display: isMaximized ? "none" : "",
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
            display: isMaximized ? "none" : "",
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
            display: isMaximized ? "none" : "",
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
            display: isMaximized ? "none" : "",
          }}
          onMouseDown={(e) => handleDownResize(e, "bottom-right")}
          onTouchStart={(e) => handleDownResize(e, "bottom-right")}
        ></div>
      </div>
    </div>
  );
};
