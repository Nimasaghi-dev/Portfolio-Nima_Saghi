"use client";

import dynamic from "next/dynamic";
import { cta } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";

// WebGL never renders on the server; load it after hydration.
const GalaxyScene = dynamic(() => import("@/components/three/GalaxyScene"), {
  ssr: false,
});

/**
 * Call to action set inside a slowly turning spiral galaxy that bleeds
 * into the page background. The star at the core is the click target.
 */
export function CtaBand() {
  const setHover = (on: boolean) => {
    // Lazy import keeps the module out of the server bundle.
    import("@/components/three/GalaxyScene").then((m) => {
      m.sunHover.on = on;
    });
  };

  return (
    <section aria-label="Availability" className="relative h-[720px] overflow-hidden sm:h-[780px]">
      <div aria-hidden className="absolute inset-0">
        <GalaxyScene />
      </div>
      {/* Fade every edge into the page so the galaxy floats in the black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_55%_at_50%_50%,transparent_40%,var(--color-bg)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-bg to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-bg to-transparent"
      />

      <Reveal className="relative z-10 px-gutter pt-20 text-center sm:pt-24">
        <p className="text-sm text-secondary">{cta.eyebrow}</p>
        <h2 className="mx-auto mt-3 max-w-[22ch] text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {cta.title}
        </h2>
      </Reveal>

      {/* Invisible click target over the star. The star itself flares on hover. */}
      <a
        href={cta.href}
        aria-label={cta.label}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="group absolute left-1/2 top-1/2 z-10 flex size-36 -translate-x-1/2 -translate-y-1/2 items-end justify-center rounded-full outline-none sm:size-44"
      >
        <span className="translate-y-9 rounded-full border border-fg/20 bg-bg/70 px-3 py-1 text-xs font-medium tracking-wider text-fg uppercase opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-12 group-hover:opacity-100 group-focus-visible:translate-y-12 group-focus-visible:opacity-100">
          {cta.label}
        </span>
      </a>
    </section>
  );
}
