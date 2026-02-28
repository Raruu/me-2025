import { motion } from "framer-motion";

type WorkCardProps = {
  title: string;
  desc: string;
  img: string;
  tags: string[];
  layoutId: string;
  showAllTags: boolean;
  index: number;
  onClick: () => void;
};

export const WorkCard = ({
  title,
  desc,
  img,
  tags,
  layoutId,
  showAllTags,
  index,
  onClick,
}: WorkCardProps) => {
  return (
    <motion.article
      layout
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.02,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="group relative rounded-lg overflow-hidden bg-neutral-900/8 transform-gpu cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
    >
      <motion.div
        layoutId={layoutId}
        className="w-full h-56 bg-neutral-800/20 overflow-hidden relative"
      >
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover block transform transition-all duration-300 grayscale contrast-[0.95] group-hover:grayscale-0 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/70 group-hover:from-black via-transparent to-transparent">
          <div className="flex items-end justify-between transform transition-transform duration-200 group-hover:-translate-y-2">
            <div>
              <h3 className="text-sm font-medium text-white translate-y-5 group-hover:translate-y-0">
                {title}
              </h3>
              <p
                className="text-xs text-white/80 mt-1 line-clamp-2 opacity-0 transform translate-y-1 
                            truncate max-w-1 group-hover:max-w-max group-hover:whitespace-normal group-hover:translate-y-0 
                            group-hover:opacity-100 transition-all duration-200"
              >
                {desc}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 justify-end max-w-[50%]">
              {(showAllTags ? tags : tags.slice(0, 1)).map((tag, tagIdx) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: tagIdx * 0.05,
                  }}
                  className="text-[10px] px-2 py-1 bg-white rounded-md text-black"
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};
