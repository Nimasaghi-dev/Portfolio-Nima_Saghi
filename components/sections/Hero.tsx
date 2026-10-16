"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "motion/react";
import { hero } from "@/data/portfolio";
import { easeOutExpo, fadeUp, staggerParent } from "@/lib/motion";
import { BrickButtonIcon } from "@/components/brickwall/BrickMark";
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
  const sectionRef = useRef<HTMLElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);

  // Lamp-light follows the cursor via CSS vars — no React state, so nothing
  // re-renders. The bricks live in the page-wide wall behind the hero (not
  // inside it), so the pointer is tracked on window and mapped to the hero's
  // rect. Throttled to one write per animation frame.
  useEffect(() => {
    const section = sectionRef.current;
    const lamp = lampRef.current;
    if (!section || !lamp) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = section.getBoundingClientRect();
        const inside =
          x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        if (inside) {
          lamp.style.setProperty("--mx", `${x - r.left}px`);
          lamp.style.setProperty("--my", `${y - r.top}px`);
        }
        lamp.style.opacity = inside ? "1" : "0";
      });
    };
    const onLeave = () => {
      lamp.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      // Transparent to the pointer so hover reaches the wall behind it;
      // only interactive children opt back in.
      className="pointer-events-none relative flex min-h-[900px] flex-col overflow-hidden pt-16"
    >
      <div ref={lampRef} className={styles.lamp} />

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
              className="glass flex flex-col items-start gap-[26px] rounded-2xl p-6 sm:p-8"
            >
              {hero.showAvailability && (
                <p
                  className="liquid-glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm"
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
                  className={`${styles.interactive} ${styles.btnSecondary} liquid-glass inline-flex min-h-12 items-center gap-2 rounded-[6px] px-5 font-medium`}
                >
                  {hero.secondaryCta.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
