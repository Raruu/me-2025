import { Icon } from "@iconify/react";

export const ExplorerItemIcon = ({
  type,
  title,
  icon,
  isSelected,
  onClick,
  onDoubleClick,
}: {
  type: "FOLDER" | "FILE";
  title: string;
  icon?: string;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
}) => {
  return (
    <div
      className={`flex flex-col items-center py-2 h-fit max-h-24 w-20 transition-colors duration-150
        rounded-md cursor-pointer ${
          isSelected
            ? "bg-primary/30 ring-1 ring-primary"
            : "hover:bg-secondary/50"
        }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <Icon
        icon={
          icon
            ? icon
            : type === "FOLDER"
            ? "flat-color-icons:folder"
            : "flat-color-icons:file"
        }
        className="text-5xl min-h-12 max-h-12"
        onClick={(e) => e.stopPropagation()}
      />
      <span
        className="text-xs w-11/12 overflow-hidden text-center line-clamp-2"
        title={title}
      >
        {title}
      </span>
    </div>
  );
};

export const ExplorerItemCompact = ({
  type,
  title,
  icon,
  isSelected,
  onClick,
  onDoubleClick,
}: {
  type: "FOLDER" | "FILE";
  title: string;
  icon?: string;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
}) => {
  return (
    <div
      className={`flex flex-row items-center py-1 px-2 h-8 w-48 transition-colors duration-150
        rounded-md cursor-pointer gap-2 ${
          isSelected
            ? "bg-primary/30 ring-1 ring-primary"
            : "hover:bg-secondary/50"
        }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <Icon
        icon={
          icon
            ? icon
            : type === "FOLDER"
            ? "flat-color-icons:folder"
            : "flat-color-icons:file"
        }
        className="text-xl flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      />
      <span className="text-sm truncate" title={title}>
        {title}
      </span>
    </div>
  );
};

export const ExplorerItemDetails = ({
  type,
  title,
  icon,
  isSelected,
  onClick,
  onDoubleClick,
  size,
  modified,
}: {
  type: "FOLDER" | "FILE";
  title: string;
  icon?: string;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: () => void;
  size?: string;
  modified?: string;
}) => {
  return (
    <div
      className={`flex flex-row items-center py-1 px-2 h-8 w-full transition-colors duration-150
        rounded cursor-pointer gap-2 ${
          isSelected
            ? "bg-primary/30 ring-1 ring-primary"
            : "hover:bg-secondary/30"
        }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <Icon
        icon={
          icon
            ? icon
            : type === "FOLDER"
            ? "flat-color-icons:folder"
            : "flat-color-icons:file"
        }
        className="text-lg flex-shrink-0"
      />
      <span className="text-sm flex-1 truncate min-w-0" title={title}>
        {title}
      </span>
      <span className="text-xs opacity-60 w-20 text-right">{size || "-"}</span>
      <span className="text-xs opacity-60 w-32 text-right">
        {modified || "-"}
      </span>
    </div>
  );
};
