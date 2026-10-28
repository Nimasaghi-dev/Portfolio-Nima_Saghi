"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/portfolio";
import { fadeUp, inView, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon3D } from "@/components/ui/Icon3D";
import { TiltCard } from "@/components/ui/TiltCard";

/**
 * "What I do" grid. One card is lit orange at a time: the first by default,
 * then whichever the pointer or keyboard focus last landed on.
 */
export function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-gutter">
        <SectionHeading
          eyebrow="Services"
          title="What I can do for your team"
          intro="Frontend first, full-stack when it matters. I care about the parts users never see: contracts, permissions, and states that don't break."
        />

        <motion.ul
          variants={staggerParent(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s, i) => {
            const on = active === i;
            return (
              <motion.li key={s.title} variants={fadeUp} className="h-full">
                <TiltCard className="group h-full rounded-[10px]" max={6}>
                  <div
                    tabIndex={0}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden rounded-[10px] border p-7 transition-colors duration-300 outline-none",
                      on
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-line-soft bg-surface text-fg",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={cn(
                          "inline-flex size-14 items-center justify-center rounded-md transition-colors duration-300",
                          on ? "bg-accent-fg/10" : "bg-elevated",
                        )}
                      >
                        <Icon3D
                          render={(p) => <s.icon {...p} />}
                          depth={4}
                          duration={7 + i}
                          delay={-i * 1.3}
                          className={cn("size-7", on ? "text-accent-fg" : "text-accent")}
                        />
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "text-5xl font-bold leading-none transition-colors duration-300",
                          on ? "text-accent-fg/15" : "text-fg/5",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-7 text-lg font-semibold">{s.title}</h3>
                    <p
                      className={cn(
                        "mt-3 text-sm leading-relaxed transition-colors duration-300",
                        on ? "text-accent-fg/80" : "text-muted",
                      )}
                    >
                      {s.body}
                    </p>
                    <ArrowUpRight
                      aria-hidden
                      className={cn(
                        "mt-6 size-5 transition-all duration-300",
                        on ? "translate-x-1 -translate-y-1 opacity-100" : "opacity-40",
                      )}
                    />
                  </div>
                </TiltCard>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
