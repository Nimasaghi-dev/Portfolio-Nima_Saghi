"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { experience, type ExperienceEntry } from "@/data/portfolio";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { fadeUp, inView } from "@/lib/motion";

/** A single vertical timeline with a scroll-driven progress rail. */
function Timeline({ entries }: { entries: ExperienceEntry[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 75%", "end 65%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={trackRef} className="relative">
      {/* Base + progress rail */}
      <div aria-hidden className="absolute bottom-2 left-2 top-2 w-px bg-line" />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute bottom-2 left-2 top-2 w-px origin-top bg-accent"
      />

      <ol className="space-y-10">
        {entries.map((job) => (
          <motion.li
            key={`${job.company}-${job.period}`}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="relative pl-10"
          >
            {/* Node */}
            <span className="absolute left-2 top-1.5 grid size-4 -translate-x-1/2 place-items-center rounded-full border border-line bg-bg">
              <span className="size-2 rounded-full bg-accent" />
            </span>

            <div className="surface-card rounded-xl p-5 sm:p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold tracking-tight">
                  {job.role}
                  <span className="text-accent"> @ </span>
                  <span className="text-fg/90">{job.company}</span>
                </h3>
                <span className="font-mono text-xs text-muted">
                  {job.period}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                {job.summary}
              </p>

              <ul className="mt-4 space-y-2">
                {job.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2.5 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/60" />
                    {h}
                  </li>
                ))}
              </ul>

              {job.stack.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {job.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function Experience() {
  const work = experience.filter((e) => e.kind === "work");
  const education = experience.filter((e) => e.kind === "education");

  return (
    <Section id="experience">
      <SectionHeading
        index="04"
        path="experience"
        title="Where I've worked."
        description="A short history of the teams, programs, and problems I've built with."
      />

      <div className="mt-14 flex flex-col gap-14">
        <div>
          <p className="mb-6 font-mono text-sm text-accent">{"// work"}</p>
          <Timeline entries={work} />
        </div>

        <div>
          <p className="mb-6 font-mono text-sm text-accent">{"// education"}</p>
          <Timeline entries={education} />
        </div>
      </div>
    </Section>
  );
}
