import { createRef, useEffect, useContext } from "react";
import { WindowLauncherProps } from "../../ui/Taskbar/TaskbarItem";
import { motion, AnimatePresence } from "framer-motion";
import { useElementSize } from "@/hooks/useElementSize";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ServerContext } from "@/providers/ServerContext";
import { WindowContext } from "@/providers/WindowContext";
import { useMyWorksState } from "./useMyWorksState";
import { MyWorksHeader } from "./components/MyWorksHeader";
import { WorkGrid } from "./components/WorkGrid";
import { WorkDetail } from "./components/WorkDetail";
import { FullImagePreview } from "./components/FullImagePreview";
import { FreeSlotControls } from "./components/FreeSlotControls";

const APP_TITLE = "My Works";
const APP_ICON = "raruu:sensei-laptop";

const MyWorks = () => {
  const { mediaQuery, elementRef } = useElementSize();
  const { windowId, setSubtitle, isDragging, setFreeSlot } =
    useContext(WindowContext);
  const myWorks = useContext(ServerContext).myWorks;

  const state = useMyWorksState(myWorks, windowId);
  const {
    query,
    setQuery,
    selectedTags,
    setSelectedTags,
    showAllTags,
    setShowAllTags,
    showTags,
    setShowTags,
    selectedId,
    setSelectedId,
    selected,
    getId,
    filtered,
    availableTags,
    groupedByYear,
    gallery,
    activeImageIndex,
    setActiveImageIndex,
    lightboxOpen,
    setLightboxOpen,
  } = state;

  // Sync subtitle with filtered count
  useEffect(() => {
    setSubtitle(`${filtered.length} items`);
  }, [filtered.length, setSubtitle]);

  // Sync free-slot toolbar controls
  useEffect(() => {
    if (selected) {
      setFreeSlot(null);
      return;
    }
    setFreeSlot(
      <FreeSlotControls
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        showAllTags={showAllTags}
        setShowAllTags={setShowAllTags}
      />,
    );
    return () => setFreeSlot(null);
  }, [
    selected,
    showAllTags,
    selectedTags,
    setFreeSlot,
    setSelectedTags,
    setShowAllTags,
  ]);

  if (myWorks.length === 0)
    return (
      <div className="bg-background select-none w-full h-full overflow-hidden flex items-center justify-center">
        <div className="text-5xl font-bold">No data</div>
      </div>
    );

  return (
    <div
      className="flex flex-col bg-background select-none w-full h-full overflow-hidden"
      ref={elementRef}
    >
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="w-full h-full absolute top-0 left-0 z-10 select-none bg-background flex flex-col items-center justify-center"
        >
          <Icon icon={APP_ICON} width={128} height={128} />
          <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
        </motion.div>
      )}

      <MyWorksHeader
        isDetail={!!selected}
        onBack={() => setSelectedId(null)}
        query={query}
        setQuery={setQuery}
        showTags={showTags}
        setShowTags={setShowTags}
        availableTags={availableTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

      <div className="px-4 w-full h-full flex flex-col gap-4 rounded-md overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="popLayout">
          {!selected ? (
            <WorkGrid
              groupedByYear={groupedByYear}
              mediaQuery={mediaQuery}
              showAllTags={showAllTags}
              getId={getId}
              onSelect={setSelectedId}
            />
          ) : (
            <WorkDetail
              selected={selected}
              gallery={gallery}
              activeImageIndex={activeImageIndex}
              setActiveImageIndex={setActiveImageIndex}
              setLightboxOpen={setLightboxOpen}
              mediaQuery={mediaQuery}
              layoutId={`card-image-${getId(selected.title)}`}
            />
          )}
        </AnimatePresence>
        <FullImagePreview
          gallery={gallery}
          lightboxOpen={lightboxOpen}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
          setLightboxOpen={setLightboxOpen}
        />
      </div>
    </div>
  );
};

export const launcherMyWorks: WindowLauncherProps = {
  title: APP_TITLE,
  appId: "my-works",
  icon: APP_ICON,
  content: <MyWorks />,
  size: {
    width: 820,
    height: 540,
  },
  minSize: {
    width: 340,
    height: 260,
  },
  launcherRef: createRef(),
};
