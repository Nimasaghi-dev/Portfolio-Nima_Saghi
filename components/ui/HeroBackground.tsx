"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";

/**
 * Ambient hero backdrop: a masked IDE grid, a soft static accent bloom,
 * and a GPU-cheap radial glow that follows the pointer. All decorative.
 */
export function HeroBackground() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const glow = useMotionTemplate`radial-gradient(480px circle at ${x}px ${y}px, rgba(59,130,246,0.12), transparent 70%)`;

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* IDE grid, faded toward edges */}
      <div className="bg-grid mask-radial absolute inset-0 opacity-60" />

      {/* Static accent bloom, top-centre */}
      <div
        className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.16), transparent 60%)",
        }}
      />

      {/* Pointer-tracking glow */}
      {!reduce && (
        <motion.div className="absolute inset-0" style={{ background: glow }} />
      )}

      {/* Fade into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
