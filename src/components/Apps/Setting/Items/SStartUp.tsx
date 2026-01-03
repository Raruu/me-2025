import { useContext, useEffect, useState } from "react";
import { SettingNavItemProps } from "..";
import { getAllAppsList } from "@/configs/AppsList";
import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { SettingGroup } from "../SettingGroup";
import { Icon } from "@iconify/react";
import { EtcStartup, StartupAppConfig } from "@/lib/Etc/EtcStartup";
import { useElementSize } from "@/hooks/useElementSize";
import { WindowContext } from "@/providers/WindowContext";

const POSITION_OPTIONS = [
  { value: "", label: "Default" },
  { value: "max", label: "Maximized" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
  { value: "center", label: "Center" },
];

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

const AddAppDialog = ({
  availableApps,
  onAdd,
  onClose,
}: {
  availableApps: WindowLauncherProps[];
  onAdd: (appId: string) => void;
  onClose: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { mediaQuery, elementRef } = useElementSize();
  const { windowSize } = useContext(WindowContext);

  const filteredApps = availableApps.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGridCols = () => {
    switch (mediaQuery) {
      case "2xl":
      case "xl":
        return "grid-cols-5";
      case "lg":
        return "grid-cols-4";
      case "md":
        return "grid-cols-3";
      case "sm":
        return "grid-cols-2";
      default:
        return "grid-cols-1";
    }
  };

  return (
    <div
      ref={elementRef}
      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-background border border-secondary dark:border-gray-500 rounded-lg shadow-lg w-5/6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: windowSize.height * 0.8 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-secondary dark:border-gray-500">
          <h3 className="text-lg font-bold">Add Application</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-tertiary transition-colors"
          >
            <Icon icon="mdi:close" className="text-xl" />
          </button>
        </div>

        <div className="p-4 border-b border-secondary dark:border-gray-500">
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background appearance-none rounded-3xl w-full
                        py-2 px-4 text-foreground leading-tight border-2 shadow-m border-secondary
                        focus:outline-none focus:bg-background focus:border-primary"
              autoFocus
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4">
          {filteredApps.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              {searchQuery
                ? "No applications found"
                : "All applications are already added"}
            </p>
          ) : (
            <div className={`grid ${getGridCols()} gap-3`}>
              {filteredApps.map((app) => (
                <button
                  key={app.appId}
                  onClick={() => onAdd(app.appId!)}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-primary transition-colors border border-transparent hover:border-secondary"
                >
                  <Icon
                    icon={app.icon || "mingcute:app-line"}
                    className="text-4xl"
                  />
                  <p className="font-medium text-sm text-center line-clamp-2">
                    {app.title}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingItemContent = () => {
  const { startupApps, loadStartupApps, addStartupApp, removeStartupApp, updateStartupAppPosition } =
    EtcStartup();
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

  const startupAppIds = startupApps.map(app => app.appId);
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
              className="flex items-center justify-center p-1 rounded-lg bg-primary hover:bg-tertiary text-white transition-colors"
            >
              <Icon icon="mdi:plus" className="text-xl" />
            </button>
          }
        >
          <div className="flex flex-col gap-2">
            {startupAppsList.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No startup applications configured
              </p>
            ) : (
              startupAppsList.map((app) => {
                const config = startupApps.find(c => c.appId === app.appId!) || { appId: app.appId!, position: "" };
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
