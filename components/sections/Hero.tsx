"use client";

import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { motion, type Variants } from "motion/react";
import { hero } from "@/data/portfolio";
import { easeOutExpo, fadeUp, staggerParent } from "@/lib/motion";
import { BrickWall } from "@/components/brickwall/BrickWall";
import {
  BrickBullet,
  BrickButtonIcon,
  BrickScrollCue,
} from "@/components/brickwall/BrickMark";
import styles from "@/components/brickwall/brickwall.module.css";

/** fadeUp, tightened to fit the hero's ≤ 400ms entrance budget. */
const heroRise: Variants = {
  ...fadeUp,
  show: {
    ...(fadeUp.show as object),
    transition: { duration: 0.4, ease: easeOutExpo },
  },
};

/** Splits the headline so the configured accent word can be coloured. */
function Headline() {
  const { headline, accentWord } = hero;
  const i = accentWord ? headline.indexOf(accentWord) : -1;
  if (i === -1) return <>{headline}</>;
  return (
    <>
      {headline.slice(0, i)}
      <span className="text-accent">{accentWord}</span>
      {headline.slice(i + accentWord.length)}
    </>
  );
}

export function Hero() {
  const lampRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const point = useRef({ x: 0, y: 0 });

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  // Lamp-light follows the cursor via CSS vars — no React state, so the
  // wall never re-renders. Throttled to one write per animation frame.
  const onPointerMove = useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    point.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const lamp = lampRef.current;
      if (!lamp) return;
      lamp.style.setProperty("--mx", `${point.current.x}px`);
      lamp.style.setProperty("--my", `${point.current.y}px`);
      lamp.style.opacity = "1";
    });
  }, []);

  const onPointerLeave = useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    if (lampRef.current) lampRef.current.style.opacity = "0";
  }, []);

  return (
    <section
      id="top"
      aria-label="Introduction"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`${styles.hero} relative flex min-h-[900px] flex-col overflow-hidden pt-16`}
    >
      <BrickWall rows={39} rowOffset={0} animate={false} />
      <div ref={lampRef} className={styles.lamp} />
      <div className={styles.scrimHero} />

      <div
        className={`${styles.ui} mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-[clamp(20px,4vw,40px)]`}
      >
        <div className="flex flex-1 items-center pt-[clamp(32px,7vw,96px)] pb-10">
          <motion.div
            variants={staggerParent(0, 0)}
            initial="hidden"
            animate="show"
            className="w-full max-w-[704px]"
          >
            <motion.div
              variants={heroRise}
              className="over-wall flex flex-col items-start gap-[26px] rounded-2xl p-6 sm:p-8"
            >
              {hero.showAvailability && (
                <p
                  className={`${styles.pill} inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm`}
                >
                  <span
                    aria-hidden="true"
                    className={`${styles.pulse} block h-[7px] w-[14px] flex-none rounded-[1px] bg-accent`}
                  />
                  {hero.availability}
                </p>
              )}

              <div className="flex flex-col gap-4">
                <p className="font-mono text-sm text-accent">{hero.eyebrow}</p>
                <h1 className={`${styles.headline} text-balance text-fg`}>
                  <Headline />
                </h1>
              </div>

              <p className={`${styles.body} text-pretty`}>{hero.body}</p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={hero.primaryCta.href}
                  className={`${styles.interactive} ${styles.btnPrimary} inline-flex min-h-12 items-center gap-2.5 rounded-[6px] px-5 font-medium`}
                >
                  <BrickButtonIcon />
                  {hero.primaryCta.label}
                </a>
                <a
                  href={hero.secondaryCta.href}
                  {...(hero.secondaryCta.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className={`${styles.interactive} ${styles.btnSecondary} inline-flex min-h-12 items-center gap-2 rounded-[6px] px-5 font-medium`}
                >
                  {hero.secondaryCta.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  Stack
                </span>
                <ul className="flex flex-wrap gap-2" aria-label="Stack">
                  {hero.stack.map((tech, i) => (
                    <li
                      key={tech}
                      className={`${styles.interactive} ${styles.chip} inline-flex items-center gap-2 rounded-[4px] px-2.5 py-1 font-mono text-[13px]`}
                    >
                      <BrickBullet gold={i % 2 === 1} />
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between gap-6 pb-8">
          <a
            href="#work"
            className={`${styles.interactive} over-wall inline-flex min-h-11 items-center gap-3 rounded-lg px-3 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-fg`}
          >
            <BrickScrollCue />
            Scroll
          </a>
          <p
            className={`${styles.hint} over-wall rounded-lg px-3 py-2 font-mono text-xs text-muted`}
          >
            {hero.scrollHint}
          </p>
        </div>
      </div>
    </section>
  );
}
