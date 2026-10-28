"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { skills, stats } from "@/data/portfolio";
import { fadeUp, inView, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TechIcon, techIcons } from "@/components/icons/TechIcons";

/** Counts from 0 to `to` the first time it scrolls into view. */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !seen) return;
    if (reduce) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    const ctrl = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => ctrl.stop();
  }, [seen, to, suffix, reduce]);

  return (
    <span ref={ref}>
      {to}
      {suffix}
    </span>
  );
}

/** Every skill that has a brand mark, for the scrolling strip. */
const brandSkills = skills
  .flatMap((g) => g.items)
  .filter((s) => s.slug && techIcons[s.slug]);

export function Stats() {
  return (
    <section aria-label="Highlights" className="relative py-10">
      <div className="mx-auto max-w-6xl px-gutter">
        <motion.ul
          variants={staggerParent(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.li
              key={s.label}
              variants={fadeUp}
              whileHover={{ y: -6, rotateX: 8 }}
              style={{ transformPerspective: 600 }}
              className={cn(
                "flex flex-col items-center justify-center rounded-[10px] border px-4 py-8 text-center",
                s.highlight
                  ? "border-accent bg-accent text-accent-fg shadow-[0_20px_50px_-20px_rgb(255_90_31/0.7)]"
                  : "border-line-soft bg-surface text-fg",
              )}
            >
              <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </span>
              <span
                className={cn(
                  "mt-2 text-sm",
                  s.highlight ? "text-accent-fg/80" : "text-muted",
                )}
              >
                {s.label}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Tech strip — pauses on hover, brand color on hover */}
      <div className="marquee-wrap mask-x mt-16 overflow-hidden" aria-label="Tech stack">
        <ul className="marquee flex w-max items-center gap-12 pr-12">
          {[...brandSkills, ...brandSkills].map((s, i) => {
            const icon = techIcons[s.slug!];
            return (
              <li
                key={`${s.name}-${i}`}
                aria-hidden={i >= brandSkills.length}
                className="group flex items-center gap-3 text-faint transition-colors"
                style={{ ["--brand" as string]: icon.hex }}
              >
                <TechIcon
                  slug={s.slug!}
                  className="size-7 transition-colors duration-300 group-hover:text-[var(--brand)]"
                />
                <span className="text-sm font-medium whitespace-nowrap transition-colors group-hover:text-fg">
                  {s.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
