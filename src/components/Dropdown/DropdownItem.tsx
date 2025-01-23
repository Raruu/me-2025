import { DropDownContentContext } from "./Dropdown";
import { useContext } from "react";
import { Icon } from "@iconify/react";

interface DropDownItemProps {
  text: string;
  checked?: boolean;
  iconifyString?: string;
  onClick?: () => void;
}

const DropDownItem = ({
  text,
  checked,
  iconifyString,
  onClick,
}: DropDownItemProps) => {
  const { setIsOpen } = useContext(DropDownContentContext);
  return (
    <div
      className="flex flex-row rounded-3xl cursor-pointer select-none transition min-w-32 px-2 py-1 gap-2 hover:bg-pink-300"
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
      {checked && (
        <div className="flex items-center justify-start">
          <Icon icon={"ri-check-line"} />
        </div>
      )}
    </div>
  );
};

export { DropDownItem };
