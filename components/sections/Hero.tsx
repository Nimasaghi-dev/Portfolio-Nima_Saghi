"use client";

import { motion } from "motion/react";
import { ArrowRight, ArrowDown, Mail } from "lucide-react";
import { site, socials } from "@/data/portfolio";
import { Button } from "@/components/ui/Button";
import { Typewriter } from "@/components/ui/Typewriter";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { fadeUp, staggerParent } from "@/lib/motion";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      <HeroBackground />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-gutter py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* Left — identity */}
        <motion.div
          variants={staggerParent(0.12, 0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start"
        >
          {/* Availability badge */}
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-3 py-1 font-mono text-xs text-muted"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#28c840] opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-[#28c840]" />
            </span>
            open to full-time roles
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mb-3 font-mono text-sm text-accent"
          >
            {"// hey there, I'm"}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {site.name}
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="mt-4 flex items-baseline gap-2 text-2xl font-medium sm:text-3xl"
          >
            <span className="text-faint">&gt;</span>
            <Typewriter words={site.roles} />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted sm:text-lg"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button href="#work" iconRight={ArrowRight}>
              View Projects
            </Button>
            <Button href="#contact" variant="outline" icon={Mail}>
              Contact Me
            </Button>
          </motion.div>

          {/* Socials */}
          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex size-10 items-center justify-center rounded-lg text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
              >
                <s.icon className="size-[18px]" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — terminal signature */}
        <div className="w-full lg:pl-4">
          <TerminalCard />
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint transition-colors hover:text-accent sm:flex"
      >
        <span className="font-mono text-[11px] tracking-widest">scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
