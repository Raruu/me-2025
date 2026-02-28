import { useContext } from "react";
import { WindowManagerContext } from "@/providers/WindowManagerContext";
import { EtcContext } from "@/lib/Etc";
import { cn } from "@/lib/utils";

export const WorkspaceSwitcher = () => {
  const {
    activeWorkspace,
    setActiveWorkspace,
    windows,
    hoverFocusSuppressedUntilRef,
  } = useContext(WindowManagerContext);
  const { workspaceCount } = useContext(EtcContext).windowModeSettings;

  const workspaces = Array.from({ length: workspaceCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-row items-center gap-2 md:gap-0.5">
      {workspaces.map((ws) => {
        const isActive = ws === activeWorkspace;
        const hasWindows = windows.some(
          (w) => w.workspace === ws && !w.isMinimized,
        );

        return (
          <button
            key={ws}
            onClick={() => {
              setActiveWorkspace(ws);
              hoverFocusSuppressedUntilRef.current = Date.now() + 400;
            }}
            className={cn(
              "min-w-8 md:min-w-6 h-8 md:h-6 rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center",
              isActive
                ? "bg-primary text-primary-foreground scale-110"
                : hasWindows
                  ? "bg-foreground/20 hover:bg-foreground/30 text-foreground"
                  : "bg-foreground/5 hover:bg-foreground/15 text-foreground/40",
            )}
            title={`Workspace ${ws}${hasWindows ? " (has windows)" : ""}`}
          >
            {ws}
          </button>
        );
      })}
    </div>
  );
};
