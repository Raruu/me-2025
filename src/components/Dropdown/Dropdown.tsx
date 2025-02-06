import React from "react";

export type DropDownRef = { handleOpen: () => void };

interface DropDownProps {
  ref?: React.RefObject<DropDownRef>;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  align?: "left" | "center" | "right";
  placement?: "top" | "bottom";
  triggerGapX?: number;
  triggerGapY?: number;
  backgroundColor?: string;
  backgroundColorHover?: string;
  callback?: (isOpen: boolean) => void;
}

export const DropDownContentContext = React.createContext<{
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  setIsOpen: () => {},
});

export const DropDown = ({
  ref,
  children,
  trigger,
  placement,
  align,
  triggerGapX,
  triggerGapY,
  backgroundColor = "var(--background-tr)",
  backgroundColorHover = "var(--background)",
  callback,
}: DropDownProps) => {
  React.useEffect(() => {
    if (ref) {
      Object.assign(ref.current, { handleOpen });
    }
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [isHover, setIsHover] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    // console.log("handleOpen");
    contentRef.current?.classList.remove("hidden");
    setTimeout(() => {
      callback?.(!isOpen);
      setIsOpen(!isOpen);
    }, 0);
  };

  const onTransitionEnd = (event: React.TransitionEvent) => {
    if (!isOpen && event.propertyName === "opacity") {
      contentRef.current?.classList.add("hidden");
      callback?.(isOpen);
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const calculatePosition = () => {
      if (triggerRef.current && contentRef.current) {
        const { innerWidth, innerHeight } = window;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        let xPos = 0;
        if (align === "left") {
          xPos = triggerRect.left;
          xPos += triggerGapX || 0;
        } else if (align === "right") {
          xPos = triggerRect.left - contentRect.width;
          xPos -= triggerGapX || 0;
        } else {
          xPos =
            triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
          xPos += triggerGapX || 0;
        }
        const x =
          contentRect.right > innerWidth
            ? innerWidth - contentRect.width - (triggerGapX || 0)
            : xPos < 0
            ? 0
            : xPos;

        let y;
        if (placement === "top") {
          if (contentRect.top < innerHeight) {
            y = innerHeight - contentRect.height;
          } else {
            y = triggerRect.top;
          }
          y -= triggerGapY || 0;
        } else {
          if (contentRect.bottom > innerHeight) {
            y = innerHeight - contentRect.height;
          } else {
            y = triggerRect.bottom;
          }
          y += triggerGapY || 0;
        }
        return { x, y };
      }
      return { x: 0, y: 0 };
    };

    if (contentRef.current) {
      contentRef.current.style.left = ``;
      contentRef.current.style.top = ``;
    }
    const position = calculatePosition();
    if (contentRef.current) {
      contentRef.current.style.left = `${position.x}px`;
      contentRef.current.style.top = `${position.y}px`;
    }

    const handleWindowResize = () => {
      setIsOpen(false);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [isOpen, align, placement, triggerGapY, triggerGapX]);

  return (
    <div>
      <div onClick={handleOpen} ref={triggerRef}>
        {trigger}
      </div>
      <div
        ref={contentRef}
        className={`z-[900001] hidden fixed`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className={`${
            isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0"
          } transition-all flex flex-col p-4 rounded-3xl backdrop-blur shadow-md max-h-[75vh] overflow-y-auto`}
          onTransitionEnd={onTransitionEnd}
          style={{
            background: isHover ? backgroundColorHover : backgroundColor,
            transition: "all, background-color",
            transitionDuration: "100ms, 300ms",
          }}
        >
          <DropDownContentContext.Provider value={{ setIsOpen }}>
            {children}
          </DropDownContentContext.Provider>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[900000]"
          onClick={() => {
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};
