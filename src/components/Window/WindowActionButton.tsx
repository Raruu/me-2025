import { useState } from "react";
import { Icon } from "@iconify/react";

interface WindowActionButtonProps {
  icon: string;
  useRightMargin?: boolean;
  onClick?: () => void;
}

export const WindowActionButton = ({
  icon,
  useRightMargin,
  onClick,
}: WindowActionButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`flex items-center justify-center bg-gray-200 hover:bg-gray-300 
        dark:bg-slate-50 dark:hover:bg-slate-300 dark:bg-opacity-25 dark:hover:bg-opacity-25 
        w-6 h-6 rounded-full ${useRightMargin ? "mr-2" : ""}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon
        className={`transition-all duration-150 w-1/2 h-full ${
          isHovered ? "opacity-100" : "opacity-65"
        }`}
        icon={icon}
      />
    </button>
  );
};
