"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useScrolled } from "@/lib/hooks";

/** Floating button that appears after scrolling and returns to the top. */
export function BackToTop() {
  const show = useScrolled(600);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ y: -2 }}
          className="fixed bottom-6 right-6 z-40 grid size-11 place-items-center rounded-full border border-line bg-surface/80 text-muted shadow-lg backdrop-blur transition-colors hover:border-accent/60 hover:text-accent"
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
