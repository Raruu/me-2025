import { Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FullImagePreviewProps = {
  gallery: string[];
  lightboxOpen: boolean;
  activeImageIndex: number;
  setActiveImageIndex: Dispatch<SetStateAction<number>>;
  setLightboxOpen: Dispatch<SetStateAction<boolean>>;
};

export const FullImagePreview = ({
  gallery,
  lightboxOpen,
  activeImageIndex,
  setActiveImageIndex,
  setLightboxOpen,
}: FullImagePreviewProps) => {
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
                setActiveImageIndex(
                  (i) => (i - 1 + gallery.length) % gallery.length,
                );
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/90 bg-black/30 rounded-full p-2 w-10 h-10"
            >
              ←
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((i) => (i + 1) % gallery.length);
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
