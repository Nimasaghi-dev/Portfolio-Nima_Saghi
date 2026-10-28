import { cta } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";

/** Full-bleed band with slowly turning 3D rings behind the call to action. */
export function CtaBand() {
  return (
    <section aria-label="Availability" className="relative py-8">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden px-gutter">
        <div className="relative overflow-hidden rounded-[10px] border border-line-soft bg-surface px-6 py-20 text-center sm:py-24">
          {/* Rings, tilted into the screen */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center [perspective:900px]">
            {[520, 400, 280].map((size, i) => (
              <div
                key={size}
                className="ring-3d absolute rounded-full border border-accent/40"
                style={{
                  width: size,
                  height: size,
                  animationDuration: `${18 + i * 6}s`,
                  animationDirection: i % 2 ? "reverse" : "normal",
                  borderStyle: i === 1 ? "dashed" : "solid",
                }}
              />
            ))}
            <div className="absolute size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.22),transparent)]" />
          </div>
          <div aria-hidden className="bg-grid absolute inset-0" />

          <Reveal className="relative">
            <p className="text-sm text-muted">{cta.eyebrow}</p>
            <h2 className="mx-auto mt-3 max-w-[22ch] text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {cta.title}
            </h2>
            <a href={cta.href} className="btn-primary mt-8">
              {cta.label}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
