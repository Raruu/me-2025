import { useState } from "react";
import { SettingBool, SettingGroup, SettingNavItemProps } from "../Setting";

const TaskBarPosition = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const boxes = ["left", "bottom", "right"];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {boxes.map((position, index) => (
        <div key={index} className="flex flex-col items-center justify-center">
          <div
            className={`min-w-40 h-24 border border-secondary dark:border-gray-500 rounded-lg p-2 cursor-pointer transition-colors ${
              selected === index
                ? "bg-primary"
                : "bg-background hover:bg-tertiary"
            }`}
            onClick={() => setSelected(index)}
          >
            <div className="w-full h-full rounded relative bg-secondary overflow-clip">
              <div
                className={`absolute bg-black
                  ${
                    position === "left"
                      ? "left-0 w-2 h-full"
                      : position === "bottom"
                      ? "bottom-0 w-full h-2"
                      : "right-0 w-2 h-full"
                  }`}
              />
            </div>{" "}
          </div>
          <h5>{position.charAt(0).toUpperCase() + position.slice(1)}</h5>
        </div>
      ))}
    </div>
  );
};

const SettingItemContent = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <SettingGroup title="Taskbar Position" hideBackground>
        {/* <div className="flex flex-row flex-wrap items-center"></div> */}
        <TaskBarPosition />
      </SettingGroup>
      <SettingGroup title="Taskbar Setting">
        <SettingBool title="Expand" />
      </SettingGroup>
    </div>
  );
};

export const settingItemTaskBar: SettingNavItemProps = {
  title: "Taskbar",
  icon: "arcticons:taskbar",
  content: <SettingItemContent />,
};
