import { useElementSize } from "@/hooks/useElementSize";
import { WindowContext } from "@/providers/WindowContext";
import { Icon } from "@iconify/react";
import { useState, useContext } from "react";
import { WindowLauncherProps } from "./ui/Taskbar/TaskbarItem";

export const AddAppDialog = ({
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
            className="p-2 rounded-lg hover:bg-tertiary text-white hover:text-gray-800 transition-colors"
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
