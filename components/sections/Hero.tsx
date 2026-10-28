"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { Download } from "lucide-react";
import { about, hero, socials } from "@/data/portfolio";
import { easeOutExpo } from "@/lib/motion";

// WebGL never renders on the server; load it after hydration.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

/** Name that rises in letter by letter, each flipping up on its X axis. */
function AnimatedName({ text }: { text: string }) {
  let n = 0;
  return (
    <span aria-hidden className="inline-block [perspective:600px]">
      {text.split(" ").map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split("").map((ch) => {
            const i = n++;
            return (
              <motion.span
                key={i}
                className="inline-block origin-bottom"
                initial={{ opacity: 0, y: "0.6em", rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.25 + i * 0.04, duration: 0.7, ease: easeOutExpo }}
              >
                {ch}
              </motion.span>
            );
          })}
          {w < text.split(" ").length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

function Subtitle() {
  const { subtitle, accent } = hero;
  const i = accent ? subtitle.indexOf(accent) : -1;
  if (i === -1) return <>{subtitle}</>;
  return (
    <>
      {subtitle.slice(0, i)}
      <span className="bg-linear-to-r from-accent to-secondary bg-clip-text text-transparent">
        {accent}
      </span>
      {subtitle.slice(i + accent.length)}
    </>
  );
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: easeOutExpo },
});

export function Hero() {
  // Portrait drifts slightly against the pointer for depth.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const px = useTransform(sx, (v) => v * -14);
  const py = useTransform(sy, (v) => v * -10);
  const frameX = useTransform(sx, (v) => v * 10);
  const frameY = useTransform(sy, (v) => v * 8);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative isolate overflow-hidden pt-20"
    >
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      {/* Warm glow behind the portrait */}
      <div
        aria-hidden
        className="absolute -z-10 right-[-10%] top-[10%] size-[720px] rounded-full bg-[radial-gradient(closest-side,rgb(255_122_61/0.18),transparent)]"
      />
      {/* Cool counter-glow, low left */}
      <div
        aria-hidden
        className="absolute -z-10 top-[30%] left-[-15%] size-[560px] rounded-full bg-[radial-gradient(closest-side,rgb(45_212_191/0.08),transparent)]"
      />

      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl grid-cols-1 items-center gap-12 px-gutter py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:py-0">
        {/* Copy */}
        <div className="relative z-10 flex flex-col items-start">
          <motion.p {...rise(0.05)} className="speech-tag px-4 py-2 text-sm font-medium">
            {hero.greeting}
          </motion.p>

          <h1 className="mt-7 text-[clamp(2.6rem,7vw,4.6rem)] leading-[1.05] font-bold tracking-tight text-fg">
            <span className="sr-only">{hero.name}</span>
            <AnimatedName text={hero.name} />
          </h1>

          <motion.p
            {...rise(0.7)}
            className="mt-5 max-w-[34ch] text-pretty text-lg leading-relaxed text-muted sm:text-xl"
          >
            <Subtitle />
          </motion.p>

          <motion.div {...rise(0.85)} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={hero.primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Download aria-hidden className="size-4" />
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className="btn-outline">
              {hero.secondaryCta.label}
            </a>
          </motion.div>

          <motion.div {...rise(1)} className="mt-10 flex flex-wrap items-center gap-6">
            {hero.showAvailability && (
              <p className="inline-flex items-center gap-2.5 text-sm text-muted">
                <span className="relative flex size-2">
                  <span className="ping-soft absolute inline-flex size-full rounded-full bg-secondary" />
                  <span className="relative inline-flex size-2 rounded-full bg-secondary" />
                </span>
                {hero.availability}
              </p>
            )}
            <span aria-hidden className="hidden h-4 w-px bg-line sm:block" />
            <ul className="flex items-center gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex size-10 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <s.icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Portrait + 3D layer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.1, ease: easeOutExpo }}
          className="relative mx-auto aspect-[4/5] w-full max-w-[460px] lg:max-w-none"
        >
          {/* Offset orange frame */}
          <motion.div
            aria-hidden
            style={{ x: frameX, y: frameY }}
            className="absolute inset-[6%_2%_10%_14%] translate-x-5 translate-y-5 rounded-md border-2 border-accent/80"
          />
          <motion.div
            style={{ x: px, y: py }}
            className="absolute inset-[6%_2%_10%_14%] overflow-hidden rounded-md bg-surface"
          >
            <Image
              src={about.avatar}
              alt="Portrait of Nima Saghi"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 520px"
              className="object-cover object-[50%_30%] grayscale contrast-[1.08] brightness-[0.82]"
            />
            {/* Fade the photo into the page and tint it warm at the base */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_0%,transparent_45%),linear-gradient(to_right,rgb(10_10_10/0.5),transparent_40%)]" />
            <div className="absolute inset-0 bg-accent/10 mix-blend-color" />
          </motion.div>

          {/* WebGL geometry floating over the portrait */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-[14%] [mask-image:radial-gradient(closest-side,#000_72%,transparent)]"
          >
            <HeroScene />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden h-12 w-7 -translate-x-1/2 justify-center rounded-full border-2 border-accent/80 pt-2 lg:flex"
      >
        <span className="scroll-cue block h-3 w-[2px] rounded-full bg-accent" />
      </a>
    </section>
  );
}
