import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";

export const WindowContext = createContext<{
  setModal: Dispatch<SetStateAction<ReactNode>>;
  setFreeSlot: Dispatch<SetStateAction<ReactNode>>;
  setSubtitle: Dispatch<SetStateAction<string | undefined>>;
  setWindowColor: Dispatch<SetStateAction<string | undefined>>;
  windowRef: RefObject<HTMLDivElement | null>;
  position: { x: number; y: number };
  windowSize: { width: number; height: number };
  windowId: number;
  isDragging: boolean;
}>({
  setModal: () => {},
  setFreeSlot: () => {},
  setSubtitle: () => {},
  setWindowColor: () => {},
  windowRef: { current: null },
  position: { x: 0, y: 0 },
  windowSize: { width: 0, height: 0 },
  windowId: 0,
  isDragging: false,
});
