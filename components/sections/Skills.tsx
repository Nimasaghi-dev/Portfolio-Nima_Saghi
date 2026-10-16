"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { skills, type IconType } from "@/data/portfolio";
import { techIcons, TechIcon } from "@/components/icons/TechIcons";
import { Icon3D } from "@/components/ui/Icon3D";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { easeOutExpo, inView } from "@/lib/motion";

/**
 * A mark that fades in on scroll, then spins as an extruded 3D coin on a
 * slow, index-derived loop, glowing on hover. Brand marks (`slug`) use their
 * true brand color; concept marks (`icon`) use the accent color.
 * Timing comes from `index` so no two marks turn in unison.
 */
function FloatingLogo({
  slug,
  icon: Icon,
  name,
  note,
  index,
}: {
  slug?: string;
  icon?: IconType;
  name: string;
  note?: string;
  index: number;
}) {
  const hex = slug
    ? (techIcons[slug]?.hex ?? "currentColor")
    : "var(--color-accent)";
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
        <Icon3D
          render={(p) =>
            slug ? <TechIcon slug={slug} {...p} /> : Icon && <Icon {...p} />
          }
          duration={duration}
          delay={delay}
          className="size-9 text-(--brand) transition-transform duration-300 group-hover:scale-110 sm:size-10"
        />
        <span className="text-center font-mono text-[11px] leading-tight text-faint transition-colors duration-300 group-hover:text-fg">
          {name}
        </span>
      </div>
    </motion.div>
  );
}

/** Concept skills with no brand mark render as an inline label, led by an accent icon. */
function SkillLabel({
  name,
  note,
  icon: Icon,
}: {
  name: string;
  note?: string;
  icon?: IconType;
}) {
  return (
    <span
      title={note}
      className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors duration-200 hover:text-fg"
    >
      {Icon ? (
        <Icon aria-hidden className="size-4 text-accent" />
      ) : (
        <span className="size-1 rounded-full bg-accent/50" />
      )}
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
          const logos = group.items.filter((i) => i.slug || i.icon);
          const concepts = group.items.filter((i) => !i.slug && !i.icon);
          return (
            <div key={group.category}>
              <p className="font-mono text-sm text-accent">
                {`// ${group.category.toLowerCase()}`}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-4">
                {logos.map((item, i) => (
                  <FloatingLogo
                    key={item.name}
                    slug={item.slug}
                    icon={item.icon}
                    name={item.name}
                    note={item.note}
                    index={g * 4 + i}
                  />
                ))}
              </div>

              {concepts.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {concepts.map((item) => (
                    <SkillLabel
                      key={item.name}
                      name={item.name}
                      note={item.note}
                      icon={item.icon}
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
