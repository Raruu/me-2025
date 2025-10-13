import { Icon } from "@iconify/react";

export const UILocationItem = ({
  title,
  icon = "f7:gear",
  iconIfSelected,
  isSelected,
  onClick,
}: {
  title: string;
  icon?: string;
  isSelected?: boolean;
  iconIfSelected?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className="flex flex-row items-center gap-2 h-9 w-full pl-2 rounded-md cursor-pointer
      transition-colors duration-150 dark:hover:text-background dark:hover:bg-secondary hover:bg-tertiary"
      style={{
        backgroundColor: isSelected ? "oklch(var(--primary))" : "",
      }}
      onClick={onClick}
    >
      <Icon
        icon={isSelected && iconIfSelected ? iconIfSelected : icon}
        width={24}
        height={24}
      />
      <h1 className="text-sm font-bold">{title}</h1>
    </div>
  );
};

export const UILocationItemSeparator = () => {
  return <div className="w-full h-[1px] bg-secondary opacity-50 rounded-md" />;
};
