"use client";

import dynamic from "next/dynamic";
import { cta } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";

// WebGL never renders on the server; load it after hydration.
const GalaxyScene = dynamic(() => import("@/components/three/GalaxyScene"), {
  ssr: false,
});

/** Call to action set inside a slowly turning spiral galaxy. */
export function CtaBand() {
  return (
    <section aria-label="Availability" className="relative py-8">
      <div className="relative isolate mx-auto max-w-6xl px-gutter">
        <div className="relative h-[640px] overflow-hidden rounded-[10px] border border-line-soft bg-[#070709] sm:h-[680px]">
          <div aria-hidden className="absolute inset-0">
            <GalaxyScene />
          </div>
          {/* Vignette so the edges of the canvas melt into the card */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,#070709_100%)]"
          />

          <Reveal className="relative z-10 px-6 pt-14 text-center sm:pt-16">
            <p className="text-sm text-secondary">{cta.eyebrow}</p>
            <h2 className="mx-auto mt-3 max-w-[22ch] text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {cta.title}
            </h2>
          </Reveal>

          {/* The core of the galaxy is the button */}
          <a
            href={cta.href}
            className="sun absolute left-1/2 top-1/2 z-10 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold text-accent-fg transition-transform duration-500 ease-out-expo hover:scale-110 focus-visible:scale-110 sm:size-28 sm:text-base"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
