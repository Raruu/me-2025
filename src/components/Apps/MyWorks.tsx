/* eslint-disable @next/next/no-img-element */
import { createRef, useMemo, useState, useEffect, useContext } from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import { motion, AnimatePresence } from "framer-motion";
import { useElementSize } from "@/hooks/useElementSize";
import { mapMediaQuery } from "@/hooks/useMediaQuery";
import { myWorks } from "@/constants/MyWorks";
import { WindowContext } from "../Window/Window";
import { Icon } from "@iconify/react/dist/iconify.js";

const MyWorks = () => {
  const { mediaQuery, elementRef } = useElementSize();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { windowId, setSubtitle } = useContext(WindowContext);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return myWorks;
    return myWorks.filter(
      (it) =>
        it.title.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)
    );
  }, [query]);

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

  useEffect(() => {
    setSubtitle(`${filtered.length} items`);
  }, [filtered.length, setSubtitle]);

  const getId = (id: string) => id + windowId;

  const selected = myWorks.find((i) => getId(i.title) === selectedId) ?? null;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const gallery = selected ? selected.img : [];

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight")
        setActiveImageIndex((i) => Math.min(i + 1, gallery.length - 1));
      if (e.key === "ArrowLeft") setActiveImageIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, gallery.length]);

  useEffect(() => {
    setActiveImageIndex(0);
    setLightboxOpen(false);
  }, [selectedId]);

  return (
    <div
      className="bg-background select-none w-full h-full overflow-hidden"
      ref={elementRef}
    >
      <div className="p-4 w-full h-full flex flex-col gap-4 bg-white/5 rounded-md overflow-y-auto overflow-x-hidden">
        {selected ? (
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => setSelectedId(null)}
              className="text-sm text-foreground/80 bg-white/3 px-3 py-1 rounded-md hover:bg-white/6 flex flex-row gap-4 items-center"
            >
              ←<h2 className="text-lg font-semibold">Back</h2>
            </button>
          </motion.header>
        ) : (
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex-1 max-w-sm">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search works..."
                className="bg-background appearance-none rounded-3xl w-full
                        py-2 px-4 text-foreground leading-tight border-2 shadow-m border-secondary
                        focus:outline-none focus:bg-background focus:border-primary"
              />
            </div>
          </motion.header>
        )}

        <div className="mt-2">
          <AnimatePresence initial={false} mode="popLayout">
            {!selected ? (
              <motion.section
                key="grid"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6"
              >
                {groupedByYear.map(({ year, items }) => (
                  <section key={year} className="mb-6">
                    <h3 className="text-sm text-foreground px-2 mb-3">
                      {year}
                    </h3>
                    <div className="w-full h-[2px] bg-foreground/60 rounded-md" />
                    <div
                      className={
                        "mt-4 grid gap-4 px-2 " +
                        mapMediaQuery(mediaQuery, {
                          default: " grid-cols-1 ",
                          sm: "grid-cols-2",
                          lg: "grid-cols-3",
                          xl: "grid-cols-4",
                          "2xl": "grid-cols-5",
                        })
                      }
                    >
                      {items.map((it, idx) => (
                        <motion.article
                          key={getId(it.title)}
                          layout
                          whileHover={{ scale: 1.05, zIndex: 10 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 24,
                            delay: idx * 0.02,
                          }}
                          onClick={() => setSelectedId(getId(it.title))}
                          role="button"
                          tabIndex={0}
                          className="group relative rounded-lg overflow-hidden bg-neutral-900/8 transform-gpu cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
                        >
                          <motion.div
                            layoutId={`card-image-${getId(it.title)}`}
                            className="w-full h-56 bg-neutral-800/20 overflow-hidden relative"
                          >
                            <img
                              src={it.img[0]}
                              alt={it.title}
                              className="w-full h-full object-cover block transform transition-all duration-300 grayscale contrast-[0.95] group-hover:grayscale-0 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/70 group-hover:from-black via-transparent to-transparent">
                              <div className="flex items-end justify-between transform transition-transform duration-200 group-hover:-translate-y-2">
                                <div>
                                  <h3 className="text-sm font-medium text-white translate-y-5 group-hover:translate-y-0">
                                    {it.title}
                                  </h3>
                                  <p
                                    className="text-xs text-white/80 mt-1 line-clamp-2 opacity-0 transform translate-y-1 
                                              truncate max-w-1 group-hover:max-w-max group-hover:whitespace-normal group-hover:translate-y-0 
                                              group-hover:opacity-100 transition-all duration-200"
                                  >
                                    {it.desc}
                                  </p>
                                </div>
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-[10px] px-2 py-1 bg-white rounded-md text-black"
                                >
                                  {it.tags[0] &&
                                    it.tags[0].charAt(0).toUpperCase() +
                                      it.tags[0].slice(1)}
                                </motion.span>
                              </div>
                            </div>
                          </motion.div>
                        </motion.article>
                      ))}
                    </div>
                  </section>
                ))}
              </motion.section>
            ) : (
              <motion.div
                key="detail"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="bg-neutral-900/6 rounded-md overflow-hidden"
              >
                <div
                  className={
                    "p-4 flex gap-4 " +
                    mapMediaQuery(mediaQuery, {
                      default: "flex-col",
                      md: "flex-row",
                    })
                  }
                >
                  <div
                    className={
                      "items-center flex flex-col min-w-0 " +
                      mapMediaQuery(mediaQuery, {
                        default: "w-full",
                        md: "w-1/2",
                        lg: "w-2/5",
                      })
                    }
                  >
                    <motion.div
                      layoutId={`card-image-${getId(selected.title)}`}
                      className={
                        "w-full rounded-md overflow-hidden mb-3 " +
                        mapMediaQuery(mediaQuery, {
                          default: "h-64",
                          md: "h-80",
                          lg: "h-96",
                        })
                      }
                    >
                      <img
                        src={gallery[activeImageIndex]}
                        alt={`${selected.title} - ${activeImageIndex + 1}`}
                        className="w-full h-full object-contain rounded-md cursor-zoom-in"
                        onClick={() => setLightboxOpen(true)}
                      />
                    </motion.div>

                    <div className="overflow-x-auto w-full justify-center flex">
                      <div className="flex flex-row flex-nowrap gap-2 min-w-0 p-1">
                        {gallery.map((g, i) => (
                          <button
                            key={g}
                            onClick={() => setActiveImageIndex(i)}
                            className={`flex-none w-20 h-20 rounded-md overflow-hidden border-2 ${
                              i === activeImageIndex
                                ? "border-tertiary"
                                : "border-transparent"
                            }`}
                          >
                            <img
                              src={g}
                              alt={`thumb-${i}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{selected.title}</h4>
                    <p className="text-sm text-foreground/80 mt-2">
                      {selected.desc}
                    </p>

                    {selected.desc_long && (
                      <p className="text-sm text-foreground/80 mt-2">
                        {selected.desc_long}
                      </p>
                    )}

                    {(selected.liveProject || selected.repo) && (
                      <div className="mt-4 flex gap-2">
                        {selected.liveProject && (
                          <a
                            className="inline-block text-xs px-3 py-2 bg-primary text-white rounded-md hover:bg-tertiary transition-all duration-150 hover:text-black"
                            href={selected.liveProject}                         
                            target="_blank"
                          >
                            <span className="flex items-center gap-1">
                              Open Project
                              <Icon
                                icon="fluent:live-24-regular"
                                className="text-xs"
                              />
                            </span>
                          </a>
                        )}

                        {selected.repo && (
                          <a
                            className="inline-block text-xs px-3 py-2 bg-transparent border border-secondary hover:border-tertiary 
                                        text-foreground rounded-md hover:bg-tertiary transition-all duration-150 hover:text-black"
                            href={selected.repo}
                            target="_blank"
                          >
                            <span className="flex items-center gap-1">
                              View Repository
                              <Icon
                                icon="ri:external-link-line"
                                className="text-xs"
                              />
                            </span>
                          </a>
                        )}
                      </div>
                    )}

                    <div className="mt-6">
                      <h5 className="text-xs text-foreground uppercase">
                        Tags
                      </h5>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {selected.tags.map((t) => (
                          <motion.span
                            key={t}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs px-2 py-1 bg-foreground rounded-md text-background"
                          >
                            #{t}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <FullImagePreview
            {...{
              gallery,
              lightboxOpen,
              activeImageIndex,
              setActiveImageIndex,
              setLightboxOpen,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const FullImagePreview = ({
  gallery,
  lightboxOpen,
  activeImageIndex,
  setActiveImageIndex,
  setLightboxOpen,
}: {
  gallery: string[];
  lightboxOpen: boolean;
  activeImageIndex: number;
  setActiveImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <AnimatePresence>
      {lightboxOpen && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="relative h-full w-full flex justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <img
              src={gallery[activeImageIndex]}
              alt={`lightbox-${activeImageIndex}`}
              onClick={(e) => e.stopPropagation()}
              className="w-fit h-full object-contain rounded-md"
            />

            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 text-white/90 bg-black/30 rounded-full p-2 w-10 h-10"
            >
              ✕
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                return setActiveImageIndex(
                  (i) => (i - 1 + gallery.length) % gallery.length
                );
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/90 bg-black/30 rounded-full p-2 w-10 h-10"
            >
              ←
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                return setActiveImageIndex((i) => (i + 1) % gallery.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/90 bg-black/30 rounded-full p-2 w-10 h-10"
            >
              →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const launcherMyWorks: WindowLauncherProps = {
  title: `My Works`,
  appId: "my-works",
  icon: "raruu:sensei-laptop",
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
