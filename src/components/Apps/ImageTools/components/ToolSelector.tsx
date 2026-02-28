import { useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { TOOLS } from "../constants";
import { ImageToolsContext } from "../providers/ImageToolsContext";

export const ToolSelector = () => {
  const { activeTool, setActiveTool, canUndo, handleUndo } =
    useContext(ImageToolsContext);

  return (
    <div className="flex items-center gap-1 px-2 pt-1.5 bg-background-tr border-b border-secondary dark:border-gray-600 flex-shrink-0">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors
            ${
              activeTool === tool.id
                ? "bg-primary/15 border border-b-0 border-secondary dark:border-gray-600 text-foreground dark:text-primary "
                : "opacity-50 hover:opacity-80 hover:bg-primary/5"
            }`}
        >
          <Icon icon={tool.icon} className="text-sm" />
          {tool.label}
        </button>
      ))}

      {canUndo && (
        <button
          onClick={handleUndo}
          className="ml-auto flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg
            text-foreground dark:text-primary hover:bg-primary/10 transition-colors"
          title="Undo last applied change"
        >
          <Icon icon="mdi:undo" className="text-sm" />
          Undo
        </button>
      )}
    </div>
  );
};
