import { useMemo, useState, useEffect } from "react";

type Work = {
  title: string;
  img: string[];
  year: number;
  tags: string[];
  desc: string;
  desc_long?: string;
  repo?: string;
  liveProject?: string;
};

export const useMyWorksState = (myWorks: Work[], windowId: number) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [showTags, setShowTags] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const getId = (id: string) => id + windowId;

  const filtered = useMemo(() => {
    let result = myWorks;
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.desc.toLowerCase().includes(q) ||
          it.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (selectedTags.length > 0) {
      result = result.filter((it) =>
        selectedTags.some((tag) => it.tags.includes(tag))
      );
    }
    return result;
  }, [myWorks, query, selectedTags]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    filtered.forEach((it) => it.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [filtered]);

  const groupedByYear = useMemo(() => {
    const map: Record<string, typeof myWorks> = {} as Record<
      string,
      typeof myWorks
    >;
    filtered.forEach((item) => {
      const key = item.year ? String(item.year) : "Unknown";
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    const years = Object.keys(map).sort((a, b) => {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return Number(b) - Number(a);
    });
    return years.map((y) => ({ year: y, items: map[y] }));
  }, [filtered]);

  const selected = myWorks.find((i) => getId(i.title) === selectedId) ?? null;
  const gallery = selected ? selected.img : [];

  // Reset gallery state when selection changes
  useEffect(() => {
    setActiveImageIndex(0);
    setLightboxOpen(false);
  }, [selectedId]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight")
        setActiveImageIndex((i) => Math.min(i + 1, gallery.length - 1));
      if (e.key === "ArrowLeft")
        setActiveImageIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, gallery.length]);

  return {
    // Search & filter
    query,
    setQuery,
    selectedTags,
    setSelectedTags,
    showAllTags,
    setShowAllTags,
    showTags,
    setShowTags,

    // Selection
    selectedId,
    setSelectedId,
    selected,
    getId,

    // Derived data
    filtered,
    availableTags,
    groupedByYear,

    // Gallery / Lightbox
    gallery,
    activeImageIndex,
    setActiveImageIndex,
    lightboxOpen,
    setLightboxOpen,
  };
};
