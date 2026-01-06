import { DropDownRef, DropDown } from "@/components/Dropdown";
import { DropDownItem } from "@/components/Dropdown/DropdownItem";
import { WindowContext } from "@/providers/WindowContext";
import { formatFileSize } from "@/utils/system";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMemo, useContext, useRef, useState, useEffect } from "react";
import { ExplorerItemDetails, ExplorerItemCompact, ExplorerItemIcon } from "./ExplorerItem";
import { SortBy, SortOrder, TypeExplorerViewItems, ExplorerPaneState, FileExplorerContext } from "./provider";

export const DetailsViewHeader = ({
  sortBy,
  sortOrder,
  onSort,
}: {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSort: (sort: SortBy) => void;
}) => {
  const SortIndicator = ({ active }: { active: boolean }) =>
    active ? (
      <Icon
        icon={
          sortOrder === "asc"
            ? "heroicons:chevron-up-16-solid"
            : "heroicons:chevron-down-16-solid"
        }
        className="text-xs ml-1"
      />
    ) : null;

  return (
    <div className="flex flex-row items-center py-1 px-2 h-7 w-full border-b border-primary/20 text-xs font-semibold opacity-70">
      <div
        className="flex items-center flex-1 cursor-pointer hover:text-primary"
        onClick={() => onSort("name")}
      >
        Name
        <SortIndicator active={sortBy === "name"} />
      </div>
      <div
        className="flex items-center w-20 justify-end cursor-pointer hover:text-primary"
        onClick={() => onSort("size")}
      >
        Size
        <SortIndicator active={sortBy === "size"} />
      </div>
      <div
        className="flex items-center w-32 justify-end cursor-pointer hover:text-primary"
        onClick={() => onSort("date")}
      >
        Modified
        <SortIndicator active={sortBy === "date"} />
      </div>
    </div>
  );
};

export const InformationPanel = ({
  selectedItems,
  explorerViewItems,
}: {
  selectedItems: Set<string>;
  explorerViewItems: TypeExplorerViewItems;
}) => {
  const selectedItem = useMemo(() => {
    if (selectedItems.size !== 1) return null;
    const id = Array.from(selectedItems)[0];
    return explorerViewItems.find((item) => item.id === id);
  }, [selectedItems, explorerViewItems]);

  return (
    <div className="w-56 min-w-56 bg-background-tr border-l border-primary/20 p-3 flex flex-col gap-3">
      <div className="text-sm font-semibold border-b border-primary/20 pb-2">
        Information
      </div>
      {selectedItems.size === 0 ? (
        <div className="text-xs opacity-60 text-center py-4">
          No item selected
        </div>
      ) : selectedItems.size > 1 ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <Icon
            icon="heroicons:document-duplicate-solid"
            className="text-4xl opacity-50"
          />
          <span className="text-sm font-medium">
            {selectedItems.size} items selected
          </span>
        </div>
      ) : selectedItem ? (
        <div className="flex flex-col items-center gap-3">
          <Icon
            icon={
              "blob" in selectedItem
                ? "flat-color-icons:file"
                : "flat-color-icons:folder"
            }
            className="text-6xl"
          />
          <span className="text-sm font-medium text-center break-all">
            {selectedItem.name}
          </span>
          <div className="w-full text-xs space-y-1 opacity-70">
            <div className="flex justify-between">
              <span>Type:</span>
              <span>{"blob" in selectedItem ? "File" : "Folder"}</span>
            </div>
            {"blob" in selectedItem && (
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{formatFileSize(selectedItem.blob.size)}</span>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const ExplorerView = ({
  paneState,
  openLocation,
  onSelectItem,
  isActive,
  onActivate,
}: {
  paneState: ExplorerPaneState;
  openLocation: (location: string, updateHistory?: boolean) => void;
  onSelectItem: (id: string, multi: boolean) => void;
  isActive: boolean;
  onActivate: () => void;
}) => {
  const context = useContext(FileExplorerContext);
  const contextPosMenuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<DropDownRef>({
    handleOpen: () => {},
    close: () => {},
  });
  const windowPos = useContext(WindowContext).position;
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const { explorerViewItems, selectedItems } = paneState;

  const processedItems = useMemo(() => {
    let items = [...explorerViewItems];

    // Filter by text
    if (context?.filterText) {
      const filter = context.filterText.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(filter));
    }

    // Filter hidden files
    if (!context?.showHidden) {
      items = items.filter((item) => !item.name.startsWith("."));
    }

    // Sort items
    items.sort((a, b) => {
      const aIsFolder = !("blob" in a);
      const bIsFolder = !("blob" in b);

      // Folders first
      if (aIsFolder !== bIsFolder) {
        return aIsFolder ? -1 : 1;
      }

      let comparison = 0;
      switch (context?.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "type":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          const aSize = "blob" in a ? a.blob.size : 0;
          const bSize = "blob" in b ? b.blob.size : 0;
          comparison = aSize - bSize;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return context?.sortOrder === "desc" ? -comparison : comparison;
    });

    return items;
  }, [
    explorerViewItems,
    context?.filterText,
    context?.showHidden,
    context?.sortBy,
    context?.sortOrder,
  ]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (contextPosMenuRef.current && !isContextMenuOpen) {
        const posX = event.clientX - windowPos.x + 10;
        const posY = event.clientY - windowPos.y - 50;
        contextPosMenuRef.current.style.transform = `translate(${posX}px, ${posY}px)`;
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [contextPosMenuRef, isContextMenuOpen, windowPos]);

  const handleItemClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    onActivate();
    onSelectItem(itemId, e.ctrlKey || e.metaKey);
  };

  const handleBackgroundClick = () => {
    onActivate();
    paneState.selectedItems.clear();
    onSelectItem("", false);
  };

  const handleSort = (sort: SortBy) => {
    if (context?.sortBy === sort) {
      context.setSortOrder(context.sortOrder === "asc" ? "desc" : "asc");
    } else {
      context?.setSortBy(sort);
      context?.setSortOrder("asc");
    }
  };

  const renderItems = () => {
    if (processedItems.length === 0) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Icon
            icon="solar:folder-open-line-duotone"
            className="text-6xl opacity-30"
          />
          <span className="text-lg opacity-50">
            {context?.filterText ? "No matching items" : "This folder is empty"}
          </span>
        </div>
      );
    }

    const viewMode = context?.viewMode || "icons";

    if (viewMode === "details") {
      return (
        <div className="flex flex-col w-full">
          <DetailsViewHeader
            sortBy={context?.sortBy || "name"}
            sortOrder={context?.sortOrder || "asc"}
            onSort={handleSort}
          />
          <div className="flex flex-col gap-0.5 p-1">
            {processedItems.map((item) => {
              const isFile = "blob" in item;
              return (
                <ExplorerItemDetails
                  key={item.id}
                  type={isFile ? "FILE" : "FOLDER"}
                  title={item.name}
                  isSelected={selectedItems.has(item.id)}
                  onClick={(e) => handleItemClick(e, item.id)}
                  onDoubleClick={
                    isFile ? undefined : () => openLocation(item.id)
                  }
                  size={isFile ? formatFileSize(item.blob.size) : "-"}
                />
              );
            })}
          </div>
        </div>
      );
    }

    const ItemComponent =
      viewMode === "compact" ? ExplorerItemCompact : ExplorerItemIcon;

    return (
      <div
        className={`flex flex-row flex-wrap gap-2 p-2 w-full h-fit ${
          viewMode === "compact" ? "content-start" : "content-start"
        }`}
      >
        {processedItems.map((item) => {
          const isFile = "blob" in item;
          return (
            <ItemComponent
              key={item.id}
              type={isFile ? "FILE" : "FOLDER"}
              title={item.name}
              isSelected={selectedItems.has(item.id)}
              onClick={(e) => handleItemClick(e, item.id)}
              onDoubleClick={isFile ? undefined : () => openLocation(item.id)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`w-full h-full flex flex-col overflow-hidden ${
        isActive ? "ring-1 ring-primary/30 ring-inset" : ""
      }`}
      onClick={handleBackgroundClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onActivate();
        contextMenuRef.current?.handleOpen();
      }}
    >
      <div
        className="d-none absolute w-full h-full left-0 top-0"
        style={{
          display: isContextMenuOpen ? "block" : "",
          pointerEvents: isContextMenuOpen ? "all" : "none",
        }}
        onClick={() => {
          if (contextMenuRef.current && "close" in contextMenuRef.current) {
            contextMenuRef.current.close();
          }
        }}
      ></div>
      <div ref={contextPosMenuRef} className="absolute top-0 left-0 z-50">
        <DropDown
          ref={contextMenuRef}
          calcPosition={false}
          callback={(val) => setIsContextMenuOpen(val)}
          hoverState
        >
          <DropDownItem
            text="New Folder"
            iconifyString="heroicons:folder-plus-solid"
            disabled
          />
          <DropDownItem
            text="New File"
            iconifyString="heroicons:document-plus-solid"
            disabled
          />
          <DropDownItem
            text="Paste"
            iconifyString="heroicons:clipboard-solid"
            disabled
          />
          <DropDownItem
            text="Select All"
            iconifyString="heroicons:check-circle-solid"
            disabled
          />
          <DropDownItem
            text="Properties"
            iconifyString="heroicons:information-circle-solid"
            disabled
          />
        </DropDown>
      </div>
      <div className="flex-1 overflow-auto">{renderItems()}</div>
    </div>
  );
};