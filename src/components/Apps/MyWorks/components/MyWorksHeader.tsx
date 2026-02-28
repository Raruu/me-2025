import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";

type MyWorksHeaderProps = {
  isDetail: boolean;
  onBack: () => void;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  showTags: boolean;
  setShowTags: Dispatch<SetStateAction<boolean>>;
  availableTags: string[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
};

export const MyWorksHeader = ({
  isDetail,
  onBack,
  query,
  setQuery,
  showTags,
  setShowTags,
  availableTags,
  selectedTags,
  setSelectedTags,
}: MyWorksHeaderProps) => {
  if (isDetail) {
    return (
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="flex items-center gap-3 bg-background p-4 pb-2"
      >
        <button
          onClick={onBack}
          className="text-sm text-foreground/80 bg-white/3 px-3 py-1 rounded-md hover:bg-white/6 flex flex-row gap-4 items-center"
        >
          ←<h2 className="text-lg font-semibold">Back</h2>
        </button>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-3 p-4 pb-2"
    >
      <div className="flex items-center justify-center gap-4">
        <div className="flex-1">
          <button
            onClick={() => setShowTags((v) => !v)}
            className={`flex flex-row ml-4 items-center justify-center gap-1 text-xs px-3 py-3 rounded-3xl 
            bg-transparent  hover:bg-foreground/10 transition-colors duration-150 ${
              showTags ? "bg-foreground/30" : "border border-secondary"
            }`}
          >
            {showTags ? <Icon icon="mdi:eye" /> : <Icon icon="mdi:eye-off" />}{" "}
            Tags
          </button>
        </div>

        <div className="flex-[2] max-w-sm">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search works..."
            className="bg-background appearance-none rounded-3xl w-full
                      py-2 px-4 text-foreground leading-tight border-2 shadow-m border-secondary
                      focus:outline-none focus:bg-background focus:border-primary"
          />
        </div>
        <div className="flex-1"></div>
      </div>

      {showTags && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-y-auto max-h-28 scrollbar-thin scrollbar-thumb-secondary"
        >
          <div className="flex flex-row flex-wrap gap-2 pb-1 px-5">
            {availableTags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      isActive ? prev.filter((t) => t !== tag) : [...prev, tag],
                    )
                  }
                  className={`flex-none text-xs px-3 py-1.5 rounded-md border transition-colors duration-150 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-transparent text-foreground/80 border-secondary hover:border-tertiary"
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
