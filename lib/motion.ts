import type { Variants, Transition } from "motion/react";

/** Shared easing — matches the CSS --ease-out-expo token. */
export const easeOutExpo: Transition["ease"] = [0.16, 1, 0.3, 1];

/** Fade + rise. Used for most scroll-reveal elements. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/** Fade in place, no movement. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } },
};

/**
 * Parent that staggers its children. Pair with `fadeUp` on children.
 * `staggerChildren` spacing can be tuned per-usage via custom variants.
 */
export const staggerParent = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Standard viewport config for whileInView — fire once, a bit early. */
export const inView = {
  once: true,
  margin: "0px 0px -12% 0px",
} as const;
