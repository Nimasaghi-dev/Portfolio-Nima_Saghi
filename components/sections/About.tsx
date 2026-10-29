"use client";

import { motion } from "motion/react";
import { FileText, Mail } from "lucide-react";
import { BtnChip } from "@/components/ui/BtnChip";
import { about, site } from "@/data/portfolio";
import { easeOutExpo, inView } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

/** Syntax-tinted snippet for the code window; tokens are [text, class]. */
const code: [string, string][][] = [
  [["export function ", "text-accent"], ["PanelGate", "text-fg"], ["({ ", "text-muted"], ["can", "text-accent-bright"], [", children }) {", "text-muted"]],
  [["  const ", "text-accent"], ["{ ok, loading } ", "text-fg"], ["= ", "text-muted"], ["usePermissions", "text-secondary-bright"], ["(can);", "text-muted"]],
  [["", ""]],
  [["  if ", "text-accent"], ["(loading) ", "text-muted"], ["return ", "text-accent"], ["<Skeleton />", "text-secondary"], [";", "text-muted"]],
  [["  if ", "text-accent"], ["(!ok) ", "text-muted"], ["return ", "text-accent"], ["<NoAccess />", "text-secondary"], [";", "text-muted"]],
  [["", ""]],
  [["  return ", "text-accent"], ["<>{children}</>", "text-fg"], [";", "text-muted"]],
  [["}", "text-muted"]],
];

function CodeWindow() {
  return (
    <TiltCard className="group rounded-lg" max={7}>
      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-line-soft bg-elevated px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-faint">PanelGate.tsx</span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 sm:p-6 sm:text-sm">
          {code.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-8 shrink-0 select-none text-faint/60">{i + 1}</span>
              <code>
                {line.map(([t, c], k) => (
                  <span key={k} className={c}>
                    {t}
                  </span>
                ))}
                {i === code.length - 1 && (
                  <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent" />
                )}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </TiltCard>
  );
}

export function About() {
  return (
    <section id="about" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-16 px-gutter lg:grid-cols-2 lg:gap-20">
        {/* Visual */}
        <Reveal className="relative pb-10 pl-0 sm:pl-6 lg:sticky lg:top-32">
          <CodeWindow />
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -40 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={inView}
            transition={{ delay: 0.3, duration: 0.8, ease: easeOutExpo }}
            className="absolute -bottom-2 left-0 w-44 overflow-hidden rounded-md border border-line bg-bg shadow-2xl [transform-origin:bottom] sm:-left-2"
          >
            <div aria-hidden className="keys h-3 bg-bg" />
            <div className="px-5 pb-5 pt-3">
              <p className="text-4xl font-bold text-accent">{about.badge.value}</p>
              <p className="mt-1 text-sm font-medium leading-snug text-fg">
                {about.badge.label}
              </p>
            </div>
          </motion.div>
        </Reveal>

        {/* Copy */}
        <div className="flex flex-col items-start">
          <Reveal>
            <p className="text-sm font-medium tracking-[0.2em] text-secondary uppercase">
              About me
            </p>
            <h2 className="mt-4 max-w-[18ch] text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {about.title}
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-6 text-pretty leading-relaxed text-fg/90">{about.lead}</p>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-4 text-pretty text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </Reveal>

          {about.levels.length > 0 && (
            <ul className="mt-8 flex w-full flex-col gap-5">
              {about.levels.map((s, i) => (
                <li key={s.name}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-fg">{s.name}</span>
                    <span className="text-muted">{s.level}%</span>
                  </div>
                  <div
                    className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line"
                    role="meter"
                    aria-label={s.name}
                    aria-valuenow={s.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-secondary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={inView}
                      transition={{ delay: 0.15 + i * 0.1, duration: 1.2, ease: easeOutExpo }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="btn-primary">
              Hire Me!
              <BtnChip icon={Mail} dir="right" />
            </a>
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <FileText aria-hidden className="size-4" />
              Résumé
            </a>
          </Reveal>

          <dl className="mt-10 grid w-full grid-cols-1 gap-4 border-t border-line-soft pt-6 sm:grid-cols-3">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs tracking-wider text-faint uppercase">{f.label}</dt>
                <dd className="mt-1 text-sm font-medium text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
