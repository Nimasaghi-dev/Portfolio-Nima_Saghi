"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { skills } from "@/data/portfolio";
import { techIcons, TechIcon } from "@/components/icons/TechIcons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { easeOutExpo, inView } from "@/lib/motion";

/** Extrusion depth of a 3D mark: stacked copies of the glyph, 0.8px apart. */
const LAYERS = 7;
const LAYER_GAP = 0.8;

/**
 * A brand mark that fades in on scroll, then spins as an extruded 3D coin on
 * a slow, index-derived loop and reveals its true brand color on hover.
 * Timing comes from `index` (not random) so server and client render
 * identically and no two marks turn in unison. The spin is a CSS animation,
 * so the global reduced-motion rule in globals.css stops it face-on.
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
  const duration = 7 + (index % 5) * 0.9;
  // Negative delay starts each mark mid-turn, so the row never lines up.
  const delay = -((index * 1.7) % duration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.5, ease: easeOutExpo }}
    >
      <div
        title={note}
        style={{ "--brand": hex } as CSSProperties}
        className="group flex w-[76px] flex-col items-center gap-2.5 rounded-xl px-2 py-3 sm:w-[92px]"
      >
        <div className="logo-3d relative size-9 transition-transform duration-300 group-hover:scale-110 sm:size-10">
          <div
            className="logo-3d-spin absolute inset-0"
            style={{
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            {Array.from({ length: LAYERS }, (_, k) => {
              const face = k === 0 || k === LAYERS - 1;
              const z = ((LAYERS - 1) / 2 - k) * LAYER_GAP;
              return (
                <TechIcon
                  key={k}
                  slug={slug}
                  className={`absolute inset-0 size-full ${face ? "logo-3d-face" : "logo-3d-side"}`}
                  style={{ transform: `translateZ(${z}px)` }}
                />
              );
            })}
          </div>
        </div>
        <span className="text-center font-mono text-[11px] leading-tight text-faint transition-colors duration-300 group-hover:text-fg">
          {name}
        </span>
      </div>
    </motion.div>
  );
}

/** Concept skills with no brand mark render as a quiet text pill. */
function SkillPill({ name, note }: { name: string; note?: string }) {
  return (
    <span
      title={note}
      className="inline-flex items-center gap-1.5 over-wall rounded-lg px-3 py-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:border-accent/40 hover:text-fg"
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
                    <SkillPill
                      key={item.name}
                      name={item.name}
                      note={item.note}
                    />
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
