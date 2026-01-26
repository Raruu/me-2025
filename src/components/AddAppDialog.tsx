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
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-3xl shadow-2xl w-5/6 flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: windowSize.height * 0.8 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-foreground/10">
          <h3 className="text-xl font-semibold">Add Application</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-foreground/10 transition-all duration-200 active:scale-95"
          >
            <Icon icon="mdi:close" className="text-xl text-foreground/70" />
          </button>
        </div>

        <div className="p-4 border-b border-foreground/10">
          <div className="relative">
            <Icon
              icon="mdi:magnify"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-foreground/50"
            />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-foreground/5 appearance-none rounded-full w-full
                        py-3 pl-11 pr-4 text-foreground leading-tight
                        focus:outline-none focus:bg-foreground/10 focus:ring-2 focus:ring-primary/50
                        transition-all duration-200"
              autoFocus
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4">
          {filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Icon
                icon={searchQuery ? "mdi:magnify-close" : "mdi:apps"}
                className="text-5xl text-foreground/30"
              />
              <p className="text-sm text-foreground/50 text-center">
                {searchQuery
                  ? "No applications found"
                  : "All applications are already added"}
              </p>
            </div>
          ) : (
            <div className={`grid ${getGridCols()} gap-3`}>
              {filteredApps.map((app) => (
                <button
                  key={app.appId}
                  onClick={() => onAdd(app.appId!)}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl 
                    hover:bg-primary/10 active:bg-primary/20 transition-all duration-200 
                    active:scale-95 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center
                    group-hover:bg-primary/20 transition-colors duration-200">
                    <Icon
                      icon={app.icon || "mingcute:app-line"}
                      className="text-3xl text-primary"
                    />
                  </div>
                  <p className="font-medium text-sm text-center line-clamp-2 text-foreground/80">
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
