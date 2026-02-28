import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { mapMediaQuery, MediaQuery } from "@/hooks/useMediaQuery";
import { Icon } from "@iconify/react/dist/iconify.js";

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

type WorkDetailProps = {
  selected: Work;
  gallery: string[];
  activeImageIndex: number;
  setActiveImageIndex: Dispatch<SetStateAction<number>>;
  setLightboxOpen: Dispatch<SetStateAction<boolean>>;
  mediaQuery: MediaQuery;
  layoutId: string;
};

export const WorkDetail = ({
  selected,
  gallery,
  activeImageIndex,
  setActiveImageIndex,
  setLightboxOpen,
  mediaQuery,
  layoutId,
}: WorkDetailProps) => {
  return (
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
        {/* Gallery */}
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
            layoutId={layoutId}
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

        {/* Info */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold">{selected.title}</h4>
          <p className="text-sm text-foreground/80 mt-2">{selected.desc}</p>

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
                    Live Project
                    <Icon icon="fluent:live-24-regular" className="text-xs" />
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
                    <Icon icon="ri:external-link-line" className="text-xs" />
                  </span>
                </a>
              )}
            </div>
          )}

          <div className="mt-6">
            <h5 className="text-xs text-foreground uppercase">Tags</h5>
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

          <div>
            <h5 className="text-xs text-foreground uppercase mt-6">
              Year Created: {selected.year}
            </h5>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
