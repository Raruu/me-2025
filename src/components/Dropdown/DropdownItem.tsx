import { DropDownContentContext } from "./Dropdown";
import { useContext, useState } from "react";
import { Icon } from "@iconify/react";

interface DropDownItemProps {
  text: string;
  checked?: boolean;
  disabled?: boolean;
  iconifyString?: string;
  onClick?: () => void;
  hoverColor?: string;
  rightIcon?: string;
  rightIconClick?: () => void;
  rightIconHoverColor?: string;
  rightIconBgHoverColor?: string;
}

export const DropDownItem = ({
  text,
  checked,
  disabled,
  iconifyString,
  onClick,
  hoverColor = "var(--primary)",
  rightIcon,
  rightIconClick,
  rightIconHoverColor = "var(--background)",
  rightIconBgHoverColor = "var(--tertiary)",
}: DropDownItemProps) => {
  const { setIsOpen } = useContext(DropDownContentContext);
  const [isHover, setIsHover] = useState(false);
  const [isRightIconHover, setIsRightIconHover] = useState(false);

  return (
    <div
      className="flex flex-row rounded-3xl select-none transition-colors duration-150 min-w-32 px-2 py-1 gap-2"
      style={{
        backgroundColor: isHover ? hoverColor : "",
        opacity: disabled ? "0.5" : "",
        cursor: disabled ? "" : "pointer",
      }}
      onMouseEnter={() => setIsHover(true && !disabled)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => {
        onClick?.();
        setIsOpen(false);
      }}
    >
      {iconifyString && (
        <div className="flex items-center justify-start">
          <Icon icon={iconifyString} />
        </div>
      )}
      <div className="flex items-center justify-start w-full">{text}</div>
      {checked && !rightIconClick && (
        <div className="flex items-center justify-start">
          <Icon icon={"ri-check-line"} />
        </div>
      )}
      {rightIconClick && (
        <div
          className="flex items-center justify-center rounded-full w-14 -m-1 -mr-2 transition-colors duration-150"
          style={{
            color: isRightIconHover ? rightIconHoverColor : "",
            backgroundColor: isRightIconHover ? rightIconBgHoverColor : "",
            height: "auto",
          }}
          onMouseEnter={() => setIsRightIconHover(true)}
          onMouseLeave={() => setIsRightIconHover(false)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
            rightIconClick();
          }}
        >
          <Icon icon={rightIcon ?? "mingcute:right-line"} />
        </div>
      )}
    </div>
  );
};

interface DropDownItemSeparatorProps {
  space?: number;
}

export const DropDownItemSeparator = ({
  space = 4,
}: DropDownItemSeparatorProps) => {
  return (
    <div
      style={{ marginTop: space, marginBottom: space }}
      className={`w-full h-0.5 bg-gray-300 dark:bg-gray-600`}
    ></div>
  );
};
