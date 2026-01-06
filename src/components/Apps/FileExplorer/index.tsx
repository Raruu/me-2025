import { createRef, useCallback, useContext, useEffect, useState } from "react";
import { WindowLauncherProps } from "../../ui/Taskbar/TaskbarItem";
import {
  UILocationItem,
  UILocationItemSeparator,
} from "../../ui/components/UILocationItem";
import { db } from "@/lib/db";

import {
  FileExplorerContextType,
  PathSegment,
  SortBy,
  SortOrder,
  ExplorerPaneState,
  ViewMode,
  FileExplorerContext,
} from "./provider";
import { Toolbar } from "./Toolbar";
import { ExplorerView, InformationPanel } from "./View";

const StatusBar = ({
  itemCount,
  selectedCount,
}: {
  itemCount: number;
  selectedCount: number;
}) => {
  return (
    <div className="h-6 min-h-6 bg-background-tr border-t border-primary/20 px-3 flex items-center justify-between text-xs opacity-70">
      <span>
        {itemCount} item{itemCount !== 1 ? "s" : ""}
      </span>
      {selectedCount > 0 && <span>{selectedCount} selected</span>}
    </div>
  );
};

const PlacesPanel = ({
  currentLocationId,
  onNavigate,
}: {
  currentLocationId: string;
  onNavigate: (id: string) => void;
}) => {
  return (
    <div className="flex flex-col min-w-44 w-44 px-1 py-1 bg-background-tr border-r border-primary/20 gap-0.5">
      <div className="text-xs font-semibold px-2 py-1 opacity-60">Places</div>
      <UILocationItem
        title="Home"
        icon="heroicons:home"
        iconIfSelected="heroicons:home-solid"
        isSelected={
          currentLocationId === "home" || currentLocationId === "homeAzusa"
        }
        onClick={() => onNavigate("home")}
      />
      <UILocationItem title="Documents" icon="heroicons:document-text" />
      <UILocationItem title="Downloads" icon="heroicons:arrow-down-tray" />
      <UILocationItem title="Pictures" icon="heroicons:photo" />
      <UILocationItem title="Music" icon="heroicons:musical-note" />
      <UILocationItem title="Videos" icon="heroicons:film" />

      <UILocationItemSeparator />
      <div className="text-xs font-semibold px-2 py-1 opacity-60">Devices</div>
      <UILocationItem
        title="Root"
        icon="heroicons:server"
        isSelected={currentLocationId === "root"}
        onClick={() => onNavigate("root")}
      />
    </div>
  );
};

const ExplorerPane = ({
  paneIndex,
  paneState,
  setPaneState,
}: {
  paneIndex: number;
  paneState: ExplorerPaneState;
  setPaneState: React.Dispatch<React.SetStateAction<ExplorerPaneState>>;
}) => {
  const context = useContext(FileExplorerContext);

  const openLocation = useCallback(
    async (location: string, updateHistory = true) => {
      const items = await db.loadChildren(location);
      let currentLocation = await db.loadFolder(location);
      const parentId = currentLocation?.parentId ?? "";

      // Build path segments
      const segments: PathSegment[] = [];
      let tempLocation = currentLocation;
      while (tempLocation) {
        segments.unshift({ id: tempLocation.id, name: tempLocation.name });
        if (tempLocation.parentId) {
          tempLocation = await db.loadFolder(tempLocation.parentId);
        } else {
          break;
        }
      }

      // Build path string
      let path = "";
      let pathLocation = currentLocation;
      while (pathLocation?.parentId !== undefined) {
        path = pathLocation.name + "/" + path;
        pathLocation = await db.loadFolder(pathLocation.parentId);
      }
      if (path[0] !== "/") path = "/" + path;

      setPaneState((prev) => {
        let newHistory = prev.stepHistory;
        let newStep = prev.currentStep;

        if (updateHistory) {
          if (prev.stepHistory[prev.stepHistory.length - 1] !== location) {
            newHistory = [
              ...prev.stepHistory.slice(0, prev.currentStep + 1),
              location,
            ];
            newStep = newHistory.length - 1;
          }
        }

        return {
          ...prev,
          currentLocationId: location,
          explorerViewItems: items,
          directoryPath: path,
          pathSegments: segments,
          parentId,
          stepHistory: newHistory,
          currentStep: newStep,
          selectedItems: new Set(),
        };
      });
    },
    [setPaneState]
  );

  const goBack = useCallback(() => {
    if (paneState.currentStep > 0) {
      const newStep = paneState.currentStep - 1;
      openLocation(paneState.stepHistory[newStep], false);
      setPaneState((prev) => ({ ...prev, currentStep: newStep }));
    }
  }, [
    paneState.currentStep,
    paneState.stepHistory,
    openLocation,
    setPaneState,
  ]);

  const goForward = useCallback(() => {
    if (paneState.currentStep < paneState.stepHistory.length - 1) {
      const newStep = paneState.currentStep + 1;
      openLocation(paneState.stepHistory[newStep], false);
      setPaneState((prev) => ({ ...prev, currentStep: newStep }));
    }
  }, [
    paneState.currentStep,
    paneState.stepHistory,
    openLocation,
    setPaneState,
  ]);

  const goUp = useCallback(() => {
    if (paneState.parentId) {
      openLocation(paneState.parentId);
    }
  }, [paneState.parentId, openLocation]);

  const handleSelectItem = useCallback(
    (id: string, multi: boolean) => {
      setPaneState((prev) => {
        const newSelected = new Set(multi ? prev.selectedItems : []);
        if (id) {
          if (newSelected.has(id) && multi) {
            newSelected.delete(id);
          } else {
            newSelected.add(id);
          }
        }
        return { ...prev, selectedItems: newSelected };
      });
    },
    [setPaneState]
  );

  const handleActivate = useCallback(() => {
    context?.setActivePaneIndex(paneIndex);
  }, [context, paneIndex]);

  useEffect(() => {
    if (paneState.stepHistory.length === 0) {
      openLocation("home");
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      <Toolbar
        paneState={paneState}
        openLocation={openLocation}
        goBack={goBack}
        goForward={goForward}
        goUp={goUp}
      />
      <div className="flex flex-row flex-1 overflow-hidden">
        <PlacesPanel
          currentLocationId={paneState.currentLocationId}
          onNavigate={openLocation}
        />
        <ExplorerView
          paneState={paneState}
          openLocation={openLocation}
          onSelectItem={handleSelectItem}
          isActive={context?.activePaneIndex === paneIndex}
          onActivate={handleActivate}
        />
        {context?.showInfoPanel && (
          <InformationPanel
            selectedItems={paneState.selectedItems}
            explorerViewItems={paneState.explorerViewItems}
          />
        )}
      </div>
      <StatusBar
        itemCount={paneState.explorerViewItems.length}
        selectedCount={paneState.selectedItems.size}
      />
    </div>
  );
};

const FileExplorer = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("icons");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showHidden, setShowHidden] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [splitView, setSplitView] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [activePaneIndex, setActivePaneIndex] = useState(0);

  const [paneState1, setPaneState1] = useState<ExplorerPaneState>({
    currentLocationId: "",
    explorerViewItems: [],
    directoryPath: "",
    pathSegments: [],
    parentId: "",
    stepHistory: [],
    currentStep: 0,
    selectedItems: new Set(),
  });

  const [paneState2, setPaneState2] = useState<ExplorerPaneState>({
    currentLocationId: "",
    explorerViewItems: [],
    directoryPath: "",
    pathSegments: [],
    parentId: "",
    stepHistory: [],
    currentStep: 0,
    selectedItems: new Set(),
  });

  const contextValue: FileExplorerContextType = {
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    showHidden,
    setShowHidden,
    filterText,
    setFilterText,
    splitView,
    setSplitView,
    showInfoPanel,
    setShowInfoPanel,
    activePaneIndex,
    setActivePaneIndex,
  };

  return (
    <FileExplorerContext.Provider value={contextValue}>
      <div className="bg-background w-full h-full flex flex-row select-none overflow-hidden">
        <ExplorerPane
          paneIndex={0}
          paneState={paneState1}
          setPaneState={setPaneState1}
        />
        {splitView && (
          <>
            <div className="w-px bg-primary/30" />
            <ExplorerPane
              paneIndex={1}
              paneState={paneState2}
              setPaneState={setPaneState2}
            />
          </>
        )}
      </div>
    </FileExplorerContext.Provider>
  );
};

export const launcherFileExplorer: WindowLauncherProps = {
  title: `File Explorer`,
  appId: "fileexplorer",
  icon: "solar:folder-with-files-bold",
  content: <FileExplorer />,
  size: {
    width: 900,
    height: 600,
  },
  minSize: {
    width: 500,
    height: 350,
  },
  launcherRef: createRef(),
};
