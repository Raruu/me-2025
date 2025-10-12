import { useId } from "react";

export const SettingBool = ({
  title,
  value,
  setValue,
}: {
  title: string;
  value?: boolean;
  setValue?: (value: boolean) => void;
}) => {
  const id = useId();

  return (
    <div className="flex flex-row items-center justify-between w-full ">
      <h1 className="text-base font-semibold pointer-events-none">{title}</h1>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input
          type="checkbox"
          className="hidden"
          id={id}
          checked={value}
          onChange={() => {
            setValue?.(!value);
          }}
        />
        <label
          htmlFor={id}
          className="block overflow-hidden h-5 rounded-full cursor-pointer bg-gray-300 shadow-sm"
          style={{
            backgroundColor: value ? "oklch(var(--tertiary))" : "",
          }}
        >
          <span
            className="block overflow-hidden h-5 w-5 rounded-full bg-white transition"
            style={{
              transform: value ? "translateX(100%)" : "translateX(0)",
            }}
          ></span>
        </label>
      </div>
    </div>
  );
};