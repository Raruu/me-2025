import { useEffect, useState } from "react";
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
  order,
  isFirst,
  isLast,
  onRemove,
  onPositionChange,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}: {
  app: WindowLauncherProps;
  config: StartupAppConfig;
  order: number;
  isFirst: boolean;
  isLast: boolean;
  onRemove: (appId: string) => void;
  onPositionChange: (appId: string, position: string) => void;
  onMoveUp: (appId: string) => void;
  onMoveDown: (appId: string) => void;
  onDragStart: (appId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (appId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(app.appId!)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(app.appId!)}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 p-3 rounded-lg bg-background border border-secondary dark:border-gray-500 transition-all cursor-move ${
        isDragging ? "opacity-50 scale-95" : "hover:border-primary"
      }`}
    >
      <div className="flex-shrink-0 flex items-center gap-3">
        <div className="flex flex-row gap-0 justify-center items-center">
          <Icon
            icon="mdi:drag-vertical"
            className="text-2xl text-gray-400 cursor-grab active:cursor-grabbing"
          />
          <span className="font-bold text-sm text-gray-500 dark:text-gray-400 w-4">
            {order}
          </span>
        </div>
        <Icon icon={app.icon || "mingcute:app-line"} className="text-2xl" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{app.title}</p>
      </div>
      <div className="flex-shrink-0 flex flex-row gap-1">
        <button
          onClick={() => onMoveUp(app.appId!)}
          disabled={isFirst}
          className={`p-1 rounded transition-colors ${
            isFirst
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-primary hover:text-white"
          }`}
          title="Move up"
        >
          <Icon icon="mdi:chevron-up" className="text-lg" />
        </button>
        <button
          onClick={() => onMoveDown(app.appId!)}
          disabled={isLast}
          className={`p-1 rounded transition-colors ${
            isLast
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-primary hover:text-white"
          }`}
          title="Move down"
        >
          <Icon icon="mdi:chevron-down" className="text-lg" />
        </button>
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
    reorderStartupApps,
    moveStartupApp,
  } = EtcStartup();
  const [allApps, setAllApps] = useState<WindowLauncherProps[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

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

  const handleMoveUp = (appId: string) => {
    moveStartupApp(appId, "up");
  };

  const handleMoveDown = (appId: string) => {
    moveStartupApp(appId, "down");
  };

  const handleDragStart = (appId: string) => {
    setDraggedAppId(appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnd = () => {
    setDraggedAppId(null);
  };

  const handleDrop = (targetAppId: string) => {
    if (!draggedAppId || draggedAppId === targetAppId) {
      setDraggedAppId(null);
      return;
    }

    const draggedIndex = startupApps.findIndex(
      (app) => app.appId === draggedAppId,
    );
    const targetIndex = startupApps.findIndex(
      (app) => app.appId === targetAppId,
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedAppId(null);
      return;
    }

    const newOrder = [...startupApps];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    reorderStartupApps(newOrder);
    setDraggedAppId(null);
  };

  const startupAppIds = startupApps.map((app) => app.appId);
  const startupAppsList = allApps.filter((app) =>
    startupAppIds.includes(app.appId!),
  );
  const availableApps = allApps.filter(
    (app) => !startupAppIds.includes(app.appId!),
  );

  const orderedStartupAppsList = startupApps
    .map((config) => startupAppsList.find((app) => app.appId === config.appId))
    .filter((app): app is WindowLauncherProps => app !== undefined);

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
            {orderedStartupAppsList.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <Icon
                  icon="mdi:apps"
                  className="text-4xl mx-auto mb-2 opacity-50"
                />
                <p>No startup applications configured</p>
                <p className="text-xs mt-1">Click "+" to get started</p>
              </div>
            ) : (
              orderedStartupAppsList.map((app, index) => {
                const config = startupApps.find(
                  (c) => c.appId === app.appId!,
                ) || { appId: app.appId!, position: "" };
                return (
                  <StartupAppItem
                    key={app.appId}
                    app={app}
                    config={config}
                    order={index + 1}
                    isFirst={index === 0}
                    isLast={index === orderedStartupAppsList.length - 1}
                    onRemove={handleRemove}
                    onPositionChange={handlePositionChange}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedAppId === app.appId}
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
