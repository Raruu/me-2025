import { useContext, useEffect, useState } from "react";
import { SettingNavItemProps } from "..";
import { getAllAppsList } from "@/configs/AppsList";
import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { SettingGroup } from "../SettingGroup";
import { Icon } from "@iconify/react";
import { EtcStartup, StartupAppConfig } from "@/lib/Etc/EtcStartup";
import { AddAppDialog } from "@/components/AddAppDialog";
import { POSITION_OPTIONS } from "@/configs/Position";

const StartupAppItem = ({
  app,
  config,
  onRemove,
  onPositionChange,
}: {
  app: WindowLauncherProps;
  config: StartupAppConfig;
  onRemove: (appId: string) => void;
  onPositionChange: (appId: string, position: string) => void;
}) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-secondary dark:border-gray-500">
      <div className="flex-shrink-0">
        <Icon icon={app.icon || "mingcute:app-line"} className="text-2xl" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{app.title}</p>
      </div>
      <select
        value={config.position || ""}
        onChange={(e) => onPositionChange(app.appId!, e.target.value)}
        className="flex-shrink-0 px-3 py-1 rounded-lg bg-background border border-secondary dark:border-gray-500 text-sm focus:outline-none focus:border-primary"
        title="Window position"
      >
        {POSITION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => onRemove(app.appId!)}
        className="flex-shrink-0 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
        title="Remove from startup"
      >
        <Icon icon="mdi:close" className="text-xl" />
      </button>
    </div>
  );
};

const SettingItemContent = () => {
  const {
    startupApps,
    loadStartupApps,
    addStartupApp,
    removeStartupApp,
    updateStartupAppPosition,
  } = EtcStartup();
  const [allApps, setAllApps] = useState<WindowLauncherProps[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    loadStartupApps();
    const apps = getAllAppsList().filter((app) => app.appId);
    setAllApps(apps);
  }, []);

  const handleAdd = (appId: string) => {
    addStartupApp(appId);
    setShowAddMenu(false);
  };

  const handleRemove = (appId: string) => {
    removeStartupApp(appId);
  };

  const handlePositionChange = (appId: string, position: string) => {
    updateStartupAppPosition(appId, position);
  };

  const startupAppIds = startupApps.map((app) => app.appId);
  const startupAppsList = allApps.filter((app) =>
    startupAppIds.includes(app.appId!)
  );
  const availableApps = allApps.filter(
    (app) => !startupAppIds.includes(app.appId!)
  );

  return (
    <>
      <div className="flex flex-col w-full h-full gap-4">
        <SettingGroup
          title="Startup Applications"
          subtitle="Applications that will launch automatically on startup"
          hideBackground
          badge={
            <button
              onClick={() => setShowAddMenu(true)}
              className="flex items-center justify-center p-1 rounded-lg bg-primary hover:bg-tertiary text-white hover:text-gray-800 transition-colors"
            >
              <Icon icon="mdi:plus" className="text-xl" />
            </button>
          }
        >
          <div className="flex flex-col gap-2">
            {startupAppsList.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <Icon
                  icon="mdi:apps"
                  className="text-4xl mx-auto mb-2 opacity-50"
                />
                <p>No startup applications configured</p>
                <p className="text-xs mt-1">Click "+" to get started</p>
              </div>
            ) : (
              startupAppsList.map((app) => {
                const config = startupApps.find(
                  (c) => c.appId === app.appId!
                ) || { appId: app.appId!, position: "" };
                return (
                  <StartupAppItem
                    key={app.appId}
                    app={app}
                    config={config}
                    onRemove={handleRemove}
                    onPositionChange={handlePositionChange}
                  />
                );
              })
            )}
          </div>
        </SettingGroup>
      </div>

      {showAddMenu && (
        <AddAppDialog
          availableApps={availableApps}
          onAdd={handleAdd}
          onClose={() => setShowAddMenu(false)}
        />
      )}
    </>
  );
};

export const settingItemStartUp: SettingNavItemProps = {
  title: "Startup",
  icon: "mdi:rocket-launch",
  content: <SettingItemContent />,
};
