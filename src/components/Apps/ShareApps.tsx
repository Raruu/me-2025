import { createRef, useMemo, useState, useContext, useEffect } from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import { Icon } from "@iconify/react/dist/iconify.js";
import { WindowContext } from "@/providers/WindowContext";
import { getAllAppsList } from "@/configs/AppsList";
import { AddAppDialog } from "../AddAppDialog";
import { POSITION_OPTIONS } from "@/configs/Position";

const APP_TITLE = "Share Apps";
const APP_ICON = "streamline:coin-share-solid";

const PRODUCTION_HOST = "https://me-2025.vercel.app";

interface SelectedApp {
  appId: string;
  position: string;
}

const SelectedAppItem = ({
  app,
  position,
  onRemove,
  onPositionChange,
}: {
  app: WindowLauncherProps;
  position: string;
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
        value={position}
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
        title="Remove from list"
      >
        <Icon icon="mdi:close" className="text-xl" />
      </button>
    </div>
  );
};

const ShareApps = () => {
  const { setSubtitle, windowSize } = useContext(WindowContext);
  const [useCurrentHost, setUseCurrentHost] = useState(false);
  const [selectedApps, setSelectedApps] = useState<SelectedApp[]>([]);
  const [currentHost, setCurrentHost] = useState<string>("");
  const [copiedUrl, setCopiedUrl] = useState<string>("");
  const [showAddMenu, setShowAddMenu] = useState(false);

  const appsList = useMemo(() => getAllAppsList(), []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setCurrentHost(origin);
      if (origin !== PRODUCTION_HOST) {
        setUseCurrentHost(true);
      }
    }
  }, []);

  useEffect(() => {
    setSubtitle(
      `${selectedApps.length} app${
        selectedApps.length !== 1 ? "s" : ""
      } selected`
    );
  }, [selectedApps.length, setSubtitle]);

  const selectedAppIds = selectedApps.map((app) => app.appId);
  const selectedAppsList = appsList.filter((app) =>
    selectedAppIds.includes(app.appId!)
  );
  const availableApps = appsList.filter(
    (app) => !selectedAppIds.includes(app.appId!)
  );

  const generatedUrl = useMemo(() => {
    const baseUrl = useCurrentHost ? currentHost : PRODUCTION_HOST;
    if (selectedApps.length === 0) return baseUrl;
    const params = new URLSearchParams();

    selectedApps.forEach((app) => {
      params.append("launch", app.appId);
      params.append("position", app.position);
    });

    return `${baseUrl}/?${params.toString()}`;
  }, [selectedApps, useCurrentHost, currentHost]);

  const handleAdd = (appId: string) => {
    setSelectedApps([...selectedApps, { appId, position: "maximized" }]);
    setShowAddMenu(false);
  };

  const handleRemove = (appId: string) => {
    setSelectedApps(selectedApps.filter((app) => app.appId !== appId));
  };

  const handlePositionChange = (appId: string, position: string) => {
    setSelectedApps(
      selectedApps.map((app) =>
        app.appId === appId ? { ...app, position } : app
      )
    );
  };

  const handleCopyUrl = async () => {
    if (!generatedUrl) return;

    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopiedUrl(generatedUrl);
      setTimeout(() => setCopiedUrl(""), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleOpenUrl = () => {
    if (!generatedUrl) return;
    window.open(generatedUrl, "_blank");
  };

  return (
    <div className="flex flex-col gap-4 p-6 w-full h-full overflow-auto bg-background select-none relative">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-300 dark:border-gray-700">
        <Icon icon={APP_ICON} className="text-4xl text-primary dark:text-secondary" />
        <div>
          <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate link to launch specific apps
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Host URL
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="host"
              checked={!useCurrentHost}
              onChange={() => setUseCurrentHost(false)}
              className="cursor-pointer"
            />
            <span className="text-sm">
              Production:{" "}
              <span className="font-mono text-xs">{PRODUCTION_HOST}</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="host"
              checked={useCurrentHost}
              onChange={() => setUseCurrentHost(true)}
              className="cursor-pointer"
            />
            <span className="text-sm">
              Current Host:{" "}
              <span className="font-mono text-xs">
                {currentHost || "Loading..."}
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Selected Applications
          </label>
          <button
            onClick={() => setShowAddMenu(true)}
            className="flex items-center justify-center p-1 rounded-lg bg-primary hover:bg-tertiary text-white hover:text-gray-800 transition-colors"
          >
            <Icon icon="mdi:plus" className="text-xl" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {selectedAppsList.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <Icon
                icon="mdi:apps"
                className="text-4xl mx-auto mb-2 opacity-50"
              />
              <p>No applications selected</p>
              <p className="text-xs mt-1">Click "+" to get started</p>
            </div>
          ) : (
            selectedAppsList.map((app) => {
              const selectedApp = selectedApps.find(
                (a) => a.appId === app.appId!
              );
              return (
                <SelectedAppItem
                  key={app.appId}
                  app={app}
                  position={selectedApp?.position || "maximized"}
                  onRemove={handleRemove}
                  onPositionChange={handlePositionChange}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Generated URL
        </label>
        <div className="flex items-stretch gap-2">
          <input
            type="text"
            readOnly
            value={generatedUrl}
            className="flex-1 px-3 py-2  dark:border-gray-700 rounded-md bg-gray-50
             dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-xs
              leading-tight border-2 shadow-m border-secondary focus:outline-none focus:bg-background focus:border-primary"
            onClick={(e) => e.currentTarget.select()}
          />
          <button
            onClick={handleCopyUrl}
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md flex items-center gap-2 transition-colors"
            title="Copy to clipboard"
          >
            <Icon
              icon={
                copiedUrl === generatedUrl ? "mdi:check" : "mdi:content-copy"
              }
              className="text-lg"
            />
            {copiedUrl === generatedUrl ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleOpenUrl}
            className="px-4 py-2 bg-transparent hover:bg-tertiary border border-secondary hover:border-tertiary  text-foreground hover:text-gray-800 rounded-md flex items-center gap-2 transition-colors"
            title="Open in new tab"
          >
            <Icon icon="mdi:open-in-new" className="text-lg" />
            Open
          </button>
        </div>
      </div>

      {showAddMenu && (
        <AddAppDialog
          availableApps={availableApps}
          onAdd={handleAdd}
          onClose={() => setShowAddMenu(false)}
        />
      )}
    </div>
  );
};

export default ShareApps;

export const launcherShareApps: WindowLauncherProps = {
  title: APP_TITLE,
  appId: "share-apps",
  icon: APP_ICON,
  content: <ShareApps />,
  size: {
    width: 700,
    height: 650,
  },
  minSize: {
    width: 500,
    height: 400,
  },
  launcherRef: createRef(),
};
