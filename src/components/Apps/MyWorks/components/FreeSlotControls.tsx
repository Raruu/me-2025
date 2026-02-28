import { Dispatch, SetStateAction } from "react";

type FreeSlotControlsProps = {
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  showAllTags: boolean;
  setShowAllTags: Dispatch<SetStateAction<boolean>>;
};

export const FreeSlotControls = ({
  selectedTags,
  setSelectedTags,
  showAllTags,
  setShowAllTags,
}: FreeSlotControlsProps) => {
  return (
    <div className="flex items-center gap-2 pr-2">
      {selectedTags.length > 0 && (
        <button
          onClick={() => setSelectedTags([])}
          className="text-xs px-3 py-1.5 rounded-md bg-red-500 text-white border border-red-500/40 hover:bg-red-500/30 transition-colors duration-150 whitespace-nowrap"
        >
          Clear filters
        </button>
      )}
      <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer select-none">
        <span className="whitespace-nowrap">Show all tags</span>
        <button
          role="switch"
          aria-checked={showAllTags}
          onClick={() => setShowAllTags((v) => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
            showAllTags ? "bg-primary" : "bg-secondary"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
              showAllTags ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </label>
    </div>
  );
};
