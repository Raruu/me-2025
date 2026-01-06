import { FileSystemDB } from "@/lib/db";
import { createContext } from "react";

export type TypeExplorerViewItems = Array<
  FileSystemDB["files"]["value"] | FileSystemDB["folders"]["value"]
>;

export type ViewMode = "icons" | "compact" | "details";
export type SortBy = "name" | "type" | "date" | "size";
export type SortOrder = "asc" | "desc";

export interface PathSegment {
  id: string;
  name: string;
}

export interface ExplorerPaneState {
  currentLocationId: string;
  explorerViewItems: TypeExplorerViewItems;
  directoryPath: string;
  pathSegments: PathSegment[];
  parentId: string;
  stepHistory: string[];
  currentStep: number;
  selectedItems: Set<string>;
}

export interface FileExplorerContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  showHidden: boolean;
  setShowHidden: (show: boolean) => void;
  filterText: string;
  setFilterText: (text: string) => void;
  splitView: boolean;
  setSplitView: (split: boolean) => void;
  showInfoPanel: boolean;
  setShowInfoPanel: (show: boolean) => void;
  activePaneIndex: number;
  setActivePaneIndex: (index: number) => void;
}

export const FileExplorerContext =
  createContext<FileExplorerContextType | null>(null);
