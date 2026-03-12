import { SettingNavItemProps } from "..";
import { SettingGroup } from "../SettingGroup";
import { ButtonNetral } from "@/components/ButtonNetral";
import { usePWAInstall } from "@/providers/PWAInstallContext";
import { Icon } from "@iconify/react";

export const settingItemAbout: SettingNavItemProps = {
  title: "About",
  icon: "mdi:information-outline",
  content: <AboutSettings />,
};

function AboutSettings() {
  const { canInstall, isInstalled, promptInstall } = usePWAInstall();

  return (
    <div className="flex flex-col gap-4 select-none">
      <SettingGroup title="Install App">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Icon
                icon={
                  isInstalled
                    ? "mdi:check-circle-outline"
                    : "mdi:cellphone-arrow-down"
                }
                className="text-xl"
              />
              <span className="text-base font-semibold">
                {isInstalled
                  ? "App is installed"
                  : canInstall
                    ? "Install as app for a better experience"
                    : "Install prompt not available"}
              </span>
            </div>
            {canInstall && !isInstalled && (
              <ButtonNetral text="Install" onClick={promptInstall} />
            )}
          </div>
          {!canInstall && !isInstalled && (
            <p className="text-sm opacity-65">
              Use a supported browser (Chrome, Edge) or check if the app is
              already installed.
            </p>
          )}
        </div>
      </SettingGroup>

      <SettingGroup title="App Info">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-between">
            <span className="font-semibold">Name</span>
            <span className="opacity-75">Raruu 2K25</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="font-semibold">Version</span>
            <span className="opacity-75">0.1.0</span>
          </div>
        </div>
      </SettingGroup>
    </div>
  );
}
