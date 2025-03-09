import { useContext } from "react";
import { SettingBool, SettingGroup, SettingNavItemProps } from "../Setting";
import { EtcContext } from "@/lib/Etc/Etc";
import { TaskbarPlacement } from "@/components/ui/Taskbar/Taskbar";

const TaskBarPosition = () => {
  const { taskbarPlacement, setTaskbarPlacement } =
    useContext(EtcContext).taskbarSettings;

  const boxes: TaskbarPlacement[] = ["left", "bottom", "right"];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {boxes.map((position, index) => (
        <div key={index} className="flex flex-col items-center justify-center">
          <div
            className={`min-w-40 h-24 border border-secondary dark:border-gray-500 rounded-lg p-2 cursor-pointer transition-colors ${
              taskbarPlacement === position
                ? "bg-primary"
                : "bg-background hover:bg-tertiary"
            }`}
            onClick={() => setTaskbarPlacement(position)}
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
            </div>
          </div>
          <h5>{position.charAt(0).toUpperCase() + position.slice(1)}</h5>
        </div>
      ))}
    </div>
  );
};

const SettingItemContent = () => {
  const { isExpanded, setIsExpanded } = useContext(EtcContext).taskbarSettings;

  return (
    <div className="flex flex-col w-full h-full">
      <SettingGroup title="Taskbar Position" hideBackground>
        <TaskBarPosition />
      </SettingGroup>
      <SettingGroup title="Taskbar Setting">
        <SettingBool
          title="Expand"
          value={isExpanded}
          setValue={setIsExpanded}
        />
      </SettingGroup>
    </div>
  );
};

export const settingItemTaskBar: SettingNavItemProps = {
  title: "Taskbar",
  icon: "mdi:soundbar",
  content: <SettingItemContent />,
};
