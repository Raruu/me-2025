import { motion } from "framer-motion";
import { mapMediaQuery, MediaQuery } from "@/hooks/useMediaQuery";
import { WorkCard } from "./WorkCard";

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

type WorkGridProps = {
  groupedByYear: { year: string; items: Work[] }[];
  mediaQuery: MediaQuery;
  showAllTags: boolean;
  getId: (id: string) => string;
  onSelect: (id: string) => void;
};

export const WorkGrid = ({
  groupedByYear,
  mediaQuery,
  showAllTags,
  getId,
  onSelect,
}: WorkGridProps) => {
  return (
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
          <h3 className="text-sm text-foreground px-2 mb-3">{year}</h3>
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
              <WorkCard
                key={getId(it.title)}
                title={it.title}
                desc={it.desc}
                img={it.img[0]}
                tags={it.tags}
                layoutId={`card-image-${getId(it.title)}`}
                showAllTags={showAllTags}
                index={idx}
                onClick={() => onSelect(getId(it.title))}
              />
            ))}
          </div>
        </section>
      ))}
    </motion.section>
  );
};
