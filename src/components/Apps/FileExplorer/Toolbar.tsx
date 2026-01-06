import { Icon } from "@iconify/react/dist/iconify.js";
import { useContext } from "react";
import {
  ExplorerPaneState,
  FileExplorerContext,
  PathSegment,
  SortBy,
  SortOrder,
} from "./provider";

const NavigationButton = ({
  icon,
  disabled,
  onClick,
}: {
  icon: string;
  disabled?: boolean;
  onClick: () => void;
}) => {
  return (
    <Icon
      icon={icon}
      className={`text-xl transition-colors duration-150 rounded-md p-1 ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-secondary hover:text-background cursor-pointer"
      }`}
      onClick={disabled ? undefined : onClick}
    />
  );
};

const ToolbarButton = ({
  icon,
  active,
  onClick,
}: {
  icon: string;
  active?: boolean;
  onClick: () => void;
}) => {
  return (
    <Icon
      icon={icon}
      className={`text-lg transition-colors duration-150 rounded-md p-1 cursor-pointer ${
        active
          ? "bg-primary text-background"
          : "hover:bg-secondary hover:text-background"
      }`}
      onClick={onClick}
    />
  );
};

const Breadcrumb = ({
  pathSegments,
  onNavigate,
}: {
  pathSegments: PathSegment[];
  onNavigate: (id: string) => void;
}) => {
  return (
    <div className="flex flex-row items-center h-8 px-2 bg-background border border-primary/30 rounded-md overflow-hidden flex-1 min-w-0">
      <Icon
        icon="heroicons:folder-solid"
        className="text-lg mr-1 text-primary/70 flex-shrink-0"
      />
      <div className="flex flex-row items-center overflow-x-auto scrollbar-hide">
        {pathSegments.map((segment, index) => (
          <div key={segment.id} className="flex items-center flex-shrink-0">
            {index > 0 && (
              <Icon
                icon="heroicons:chevron-right-16-solid"
                className="text-sm mx-1 opacity-50"
              />
            )}
            <span
              className={`text-sm px-1 rounded cursor-pointer transition-colors duration-150 hover:bg-secondary hover:text-background whitespace-nowrap ${
                index === pathSegments.length - 1 ? "font-semibold" : ""
              }`}
              onClick={() => onNavigate(segment.id)}
            >
              {segment.name || "/"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FilterBar = () => {
  const context = useContext(FileExplorerContext);
  if (!context) return null;

  return (
    <div className="flex items-center gap-2 px-2">
      <div className="relative flex-1 max-w-xs">
        <Icon
          icon="heroicons:magnifying-glass-16-solid"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-sm opacity-50"
        />
        <input
          type="text"
          placeholder="Filter..."
          value={context.filterText}
          onChange={(e) => context.setFilterText(e.target.value)}
          className="w-full h-7 pl-7 pr-2 text-sm border border-primary/30 rounded-md outline-none bg-background focus:border-primary"
        />
        {context.filterText && (
          <Icon
            icon="heroicons:x-mark-16-solid"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm cursor-pointer opacity-50 hover:opacity-100"
            onClick={() => context.setFilterText("")}
          />
        )}
      </div>
    </div>
  );
};

export const Toolbar = ({
  paneState,
  openLocation,
  goBack,
  goForward,
  goUp,
}: {
  paneState: ExplorerPaneState;
  openLocation: (id: string) => void;
  goBack: () => void;
  goForward: () => void;
  goUp: () => void;
}) => {
  const context = useContext(FileExplorerContext);
  if (!context) return null;

  return (
    <div className="flex flex-row w-full py-1.5 items-center px-2 bg-background-tr border-b border-primary/20 gap-2">
      <div className="flex flex-row items-center gap-1">
        <NavigationButton
          icon="heroicons:arrow-left-solid"
          onClick={goBack}
          disabled={paneState.currentStep === 0}
        />
        <NavigationButton
          icon="heroicons:arrow-right-solid"
          onClick={goForward}
          disabled={paneState.currentStep === paneState.stepHistory.length - 1}
        />
        <NavigationButton
          icon="heroicons:arrow-up-solid"
          onClick={goUp}
          disabled={paneState.parentId === ""}
        />
      </div>

      <Breadcrumb
        pathSegments={paneState.pathSegments}
        onNavigate={openLocation}
      />

      <FilterBar />

      <div className="flex flex-row items-center gap-1 border-l border-primary/20 pl-2">
        <ToolbarButton
          icon="heroicons:squares-2x2-solid"
          active={context.viewMode === "icons"}
          onClick={() => context.setViewMode("icons")}
        />
        <ToolbarButton
          icon="heroicons:list-bullet-solid"
          active={context.viewMode === "compact"}
          onClick={() => context.setViewMode("compact")}
        />
        <ToolbarButton
          icon="heroicons:bars-3-solid"
          active={context.viewMode === "details"}
          onClick={() => context.setViewMode("details")}
        />
      </div>

      <div className="flex flex-row items-center gap-1 border-l border-primary/20 pl-2">
        {/* <ToolbarButton
          icon="heroicons:view-columns-solid"
          active={context.splitView}
          onClick={() => context.setSplitView(!context.splitView)}
        /> */}
        <ToolbarButton
          icon="heroicons:information-circle-solid"
          active={context.showInfoPanel}
          onClick={() => context.setShowInfoPanel(!context.showInfoPanel)}
        />
        <ToolbarButton
          icon="heroicons:eye-solid"
          active={context.showHidden}
          onClick={() => context.setShowHidden(!context.showHidden)}
        />
      </div>
    </div>
  );
};
