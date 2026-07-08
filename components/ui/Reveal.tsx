"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, inView, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating in. */
  delay?: number;
  as?: "div" | "li" | "span";
};

/** Single element that fades + rises into view once on scroll. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
};

/**
 * Parent that staggers `RevealItem` children into view. Combine:
 *   <RevealGroup><RevealItem/>…</RevealGroup>
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      {children}
    </motion.div>
  );
}

/** Child of RevealGroup. Inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={cn(className)}>
      {children}
    </motion.div>
  );
}
