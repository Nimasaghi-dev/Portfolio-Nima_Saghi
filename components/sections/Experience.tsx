"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Briefcase, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { experience } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";

/**
 * Coverflow of roles: the active card faces the viewer, neighbours swing
 * back in 3D. Swipe, the arrows, or the dots move between them.
 */
export function Experience() {
  const [active, setActive] = useState(0);
  const last = experience.length - 1;
  const go = (i: number) => setActive(Math.max(0, Math.min(last, i)));

  return (
    <section id="experience" className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-gutter">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've been building"
          intro="Production work and the training behind it."
        />

        <Reveal className="relative mt-20">
          <div
            className="grid [perspective:1400px]"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(active + 1);
              if (e.key === "ArrowLeft") go(active - 1);
            }}
          >
            {experience.map((job, i) => {
              const offset = i - active;
              const abs = Math.abs(offset);
              const on = offset === 0;
              const Icon = job.kind === "work" ? Briefcase : GraduationCap;
              return (
                <motion.article
                  key={job.role}
                  aria-hidden={!on}
                  inert={!on}
                  onClick={() => !on && go(i)}
                  drag={on ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) go(active + 1);
                    if (info.offset.x > 60) go(active - 1);
                  }}
                  animate={{
                    x: `${offset * 78}%`,
                    rotateY: offset * -28,
                    scale: 1 - Math.min(abs, 2) * 0.12,
                    opacity: abs > 1 ? 0 : on ? 1 : 0.25,
                  }}
                  transition={{ type: "spring", stiffness: 160, damping: 24 }}
                  style={{ gridArea: "1 / 1", zIndex: 10 - abs }}
                  className={cn(
                    "relative mx-auto w-full max-w-2xl rounded-[10px] border bg-surface px-6 pb-8 pt-14 sm:px-10",
                    on
                      ? "border-line shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)]"
                      : "cursor-pointer border-line-soft",
                  )}
                >
                  {/* Avatar-style icon breaking the top edge */}
                  <span className="absolute left-1/2 top-0 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-bg bg-accent text-accent-fg">
                    <Icon aria-hidden className="size-6" />
                  </span>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-fg">{job.role}</h3>
                    <p className="mt-1 text-sm text-secondary">
                      {job.company} · <span className="text-muted">{job.period}</span>
                    </p>
                    <p className="mx-auto mt-5 max-w-prose text-pretty leading-relaxed text-muted">
                      {job.summary}
                    </p>
                  </div>

                  <ul className="mt-6 flex flex-col gap-2.5 text-left text-sm leading-relaxed text-fg/85">
                    {job.highlights.map((h) => (
                      <li key={h.slice(0, 32)} className="flex gap-3">
                        <span aria-hidden className="mt-2 h-[2px] w-3 flex-none bg-secondary" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {job.stack.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                      {job.stack.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous role"
              className="inline-flex size-11 items-center justify-center rounded-md border border-line text-fg transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-fg"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center gap-2">
              {experience.map((job, i) => (
                <button
                  key={job.role}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show ${job.role}`}
                  aria-current={i === active}
                  className="flex h-11 items-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300",
                      i === active ? "w-8 bg-accent" : "w-4 bg-line hover:bg-faint",
                    )}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(active + 1)}
              disabled={active === last}
              aria-label="Next role"
              className="inline-flex size-11 items-center justify-center rounded-md border border-line text-fg transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-fg"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
