"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { skills } from "@/data/portfolio";
import { techIcons, TechIcon } from "@/components/icons/TechIcons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { easeOutExpo, inView } from "@/lib/motion";

/**
 * A brand mark that fades in on scroll, then drifts on a slow, index-derived
 * loop and reveals its true brand color on hover. Timing comes from `index`
 * (not random) so server and client render identically and no two marks bob
 * in unison. The bob is auto-disabled for reduced-motion users via the
 * app-wide <MotionConfig reducedMotion="user">.
 */
function FloatingLogo({
  slug,
  name,
  note,
  index,
}: {
  slug: string;
  name: string;
  note?: string;
  index: number;
}) {
  const hex = techIcons[slug]?.hex ?? "currentColor";
  const duration = 3.2 + (index % 5) * 0.35;
  const delay = (index % 6) * 0.26;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.5, ease: easeOutExpo }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          title={note}
          style={{ "--brand": hex } as CSSProperties}
          className="group flex w-[76px] flex-col items-center gap-2.5 rounded-xl px-2 py-3 sm:w-[92px]"
        >
          <TechIcon
            slug={slug}
            className="size-9 text-fg/45 transition duration-300 group-hover:scale-110 group-hover:[color:var(--brand)] group-hover:drop-shadow-[0_0_14px_var(--brand)] sm:size-10"
          />
          <span className="text-center font-mono text-[11px] leading-tight text-faint transition-colors duration-300 group-hover:text-fg">
            {name}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Concept skills with no brand mark render as a quiet text pill. */
function SkillPill({ name, note }: { name: string; note?: string }) {
  return (
    <span
      title={note}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated/40 px-3 py-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:border-accent/40 hover:text-fg"
    >
      <span className="size-1 rounded-full bg-accent/50" />
      {name}
    </span>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        index="02"
        path="skills"
        title="The stack I reach for."
        description="A toolkit built around TypeScript, React, and a bias for shipping fast, resilient interfaces. Hover any mark for the detail."
      />

      <div className="mt-14 flex flex-col gap-12">
        {skills.map((group, g) => {
          const logos = group.items.filter((i) => i.slug);
          const concepts = group.items.filter((i) => !i.slug);
          return (
            <div key={group.category}>
              <p className="font-mono text-sm text-accent">
                {`// ${group.category.toLowerCase()}`}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-4">
                {logos.map((item, i) => (
                  <FloatingLogo
                    key={item.name}
                    slug={item.slug as string}
                    name={item.name}
                    note={item.note}
                    index={g * 4 + i}
                  />
                ))}
              </div>

              {concepts.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {concepts.map((item) => (
                    <SkillPill key={item.name} name={item.name} note={item.note} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
