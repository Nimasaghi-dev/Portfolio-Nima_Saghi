"use client";

import dynamic from "next/dynamic";
import { cta } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";

// WebGL never renders on the server; load it after hydration.
const GalaxyScene = dynamic(() => import("@/components/three/GalaxyScene"), {
  ssr: false,
});

/** Headline with the accent phrase in italic, warm gradient. */
function Title() {
  const i = cta.title.indexOf(cta.accent);
  if (i === -1) return <>{cta.title}</>;
  return (
    <>
      {cta.title.slice(0, i)}
      <em className="whitespace-nowrap bg-linear-to-r from-accent via-accent-bright to-secondary bg-clip-text pr-[0.08em] text-transparent [text-shadow:none]">
        {cta.accent}
      </em>
      {cta.title.slice(i + cta.accent.length)}
    </>
  );
}

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

      <Reveal className="relative z-10 px-gutter pt-14 text-center sm:pt-16">
        <p className="font-mono text-[11px] tracking-[0.28em] text-secondary/80 uppercase">
          {cta.eyebrow}
        </p>
        <h2 className="mx-auto mt-4 max-w-[26ch] text-balance font-serif text-[clamp(2.2rem,4.6vw,3.75rem)] leading-[1.05] font-normal tracking-[-0.005em] text-fg [text-shadow:0_2px_24px_rgb(0_0_0/0.85)]">
          <Title />
        </h2>
      </Reveal>

      {/* Invisible click target over the star. The star flares on hover. */}
      <a
        href={cta.href}
        aria-label={cta.label}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="absolute left-1/2 top-1/2 z-10 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none sm:size-44"
      />
    </section>
  );
}
