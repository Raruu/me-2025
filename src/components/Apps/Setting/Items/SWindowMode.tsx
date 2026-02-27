import { useContext } from "react";
import { SettingNavItemProps } from "..";
import { EtcContext } from "@/lib/Etc";
import { WindowMode } from "@/lib/Etc/EtcWindowMode";
import { SettingBool } from "../SettingBool";
import { SettingGroup } from "../SettingGroup";
import { SettingTextField } from "../SettingTextField";

const WindowModeSelector = () => {
  const { windowMode, setWindowMode } =
    useContext(EtcContext).windowModeSettings;

  const modes: { mode: WindowMode; label: string; desc: string }[] = [
    {
      mode: "windowed",
      label: "Windowed",
      desc: "Floating windows, free move & resize",
    },
    {
      mode: "tiling",
      label: "Tiling",
      desc: "Tiling layout",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {modes.map(({ mode, label, desc }) => (
        <div key={mode} className="flex flex-col items-center justify-center">
          <div
            className={`min-w-40 h-24 border border-secondary dark:border-gray-500 rounded-lg p-2 cursor-pointer transition-colors ${
              windowMode === mode
                ? "bg-primary"
                : "bg-background hover:bg-tertiary"
            }`}
            onClick={() => setWindowMode(mode)}
          >
            <div className="w-full h-full rounded relative bg-secondary overflow-clip">
              {mode === "windowed" ? (
                // Windowed preview: overlapping rectangles
                <>
                  <div className="absolute bg-black/60 w-12 h-8 left-2 top-2 rounded-sm" />
                  <div className="absolute bg-black/80 w-12 h-8 left-6 top-5 rounded-sm" />
                  <div className="absolute bg-black w-10 h-6 right-2 bottom-1 rounded-sm" />
                </>
              ) : (
                // Tiling preview: BSP grid
                <div className="flex h-full w-full gap-[2px] p-[2px]">
                  <div className="bg-black flex-1 rounded-sm" />
                  <div className="flex flex-col flex-1 gap-[2px]">
                    <div className="bg-black flex-1 rounded-sm" />
                    <div className="bg-black flex-1 rounded-sm" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <h5 className="font-semibold">{label}</h5>
          <p className="text-xs text-foreground/60">{desc}</p>
        </div>
      ))}
    </div>
  );
};

const SettingItemContent = () => {
  const {
    workspaceCount,
    setWorkspaceCount,
    tilingGap,
    setTilingGap,
    windowMode,
    autoTilingMobile,
    setAutoTilingMobile,
  } = useContext(EtcContext).windowModeSettings;

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <SettingGroup title="Window Mode" hideBackground>
        <WindowModeSelector />
      </SettingGroup>
      <SettingGroup title="Mobile">
        <SettingBool
          title="Use tiling mode in mobile"
          value={autoTilingMobile}
          setValue={setAutoTilingMobile}
        />
      </SettingGroup>
      <SettingGroup title="Workspaces">
        <SettingTextField
          title="Number of Workspaces"
          subtitle="1 to 9 (Alt + Number to switch)"
          value={workspaceCount.toString()}
          onChange={(v) => {
            const num = parseInt(v);
            if (!isNaN(num)) setWorkspaceCount(num);
          }}
        />
      </SettingGroup>
      {windowMode === "tiling" && (
        <SettingGroup title="Tiling">
          <SettingTextField
            title="Gap Size"
            subtitle="Gap between tiled windows (0-32px)"
            value={tilingGap.toString()}
            onChange={(v) => {
              const num = parseInt(v);
              if (!isNaN(num)) setTilingGap(num);
            }}
          />
        </SettingGroup>
      )}
    </div>
  );
};

export const settingItemWindowMode: SettingNavItemProps = {
  title: "Window Mode",
  icon: "material-symbols:window",
  content: <SettingItemContent />,
};
