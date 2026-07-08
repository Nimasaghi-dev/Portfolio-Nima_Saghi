"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
};

/**
 * 3D perspective tilt that follows the pointer, plus an accent glow that
 * tracks the cursor. Falls back to a static card when the pointer can't
 * hover or the user prefers reduced motion.
 */
export function TiltCard({ children, className, max = 8 }: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const glow = useMotionTemplate`radial-gradient(320px circle at ${glowX}% ${glowY}%, rgba(59,130,246,0.14), transparent 65%)`;

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    rotateY.set((nx - 0.5) * 2 * max);
    rotateX.set(-(ny - 0.5) * 2 * max);
    glowX.set(nx * 100);
    glowY.set(ny * 100);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  }

  if (reduce) {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("relative [transform-style:preserve-3d]", className)}
    >
      {/* Cursor-tracking accent glow */}
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {children}
    </motion.div>
  );
}
