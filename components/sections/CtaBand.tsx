import { cta, nav } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";

/** Orbit tilt, in degrees. Planets are counter-tilted so they stay round. */
const TILT = 72;

/**
 * One planet per nav section. Each sits on an orbit around the "Hire Me"
 * sun and links to its section. Add entries here to grow the galaxy.
 */
const planets = [
  { id: "about", size: 22, radius: 150, duration: 26, start: 20, color: "#f0cfa0" },
  { id: "services", size: 16, radius: 150, duration: 26, start: 200, color: "#9aa4b2" },
  { id: "work", size: 30, radius: 230, duration: 40, start: 110, color: "#ff7a3d", ring: true },
  { id: "experience", size: 14, radius: 230, duration: 40, start: 300, color: "#c7b9ff" },
  { id: "contact", size: 18, radius: 310, duration: 58, start: 40, color: "#6fb6ff" },
];

/** Small deterministic PRNG so the starfield is the same on every render. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(11);
const stars = Array.from({ length: 90 }, () => ({
  x: rand() * 100,
  y: rand() * 100,
  size: 1 + rand() * 1.6,
  delay: rand() * 6,
  duration: 3 + rand() * 4,
}));

/** CTA band styled as a small galaxy: starfield, tilted orbits, planets. */
export function CtaBand() {
  const labelOf = (id: string) => nav.find((n) => n.id === id)?.label ?? id;

  return (
    <section aria-label="Availability" className="relative py-8">
      <div className="relative isolate mx-auto max-w-6xl px-gutter">
        <div className="relative overflow-hidden rounded-[10px] border border-line-soft bg-[radial-gradient(ellipse_at_50%_80%,#1a1210_0%,#0d0d0f_45%,#0a0a0a_100%)] px-6 pb-24 pt-16 text-center sm:pt-20">
          {/* Starfield */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {stars.map((s, i) => (
              <span
                key={i}
                className="star absolute rounded-full bg-white"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                }}
              />
            ))}
          </div>

          <Reveal className="relative z-10">
            <p className="text-sm text-muted">{cta.eyebrow}</p>
            <h2 className="mx-auto mt-3 max-w-[22ch] text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {cta.title}
            </h2>
          </Reveal>

          {/* Solar system */}
          <div className="relative mx-auto mt-6 h-[380px] w-full max-w-[720px] [perspective:1100px] sm:h-[420px]">
            <div
              className="absolute inset-0 [transform-style:preserve-3d]"
              style={{ transform: `rotateX(${TILT}deg)` }}
            >
              {/* Orbit rings */}
              {[150, 230, 310].map((r, i) => (
                <div
                  key={r}
                  aria-hidden
                  className="absolute left-1/2 top-1/2 rounded-full border"
                  style={{
                    width: r * 2,
                    height: r * 2,
                    marginLeft: -r,
                    marginTop: -r,
                    borderColor: `rgb(255 255 255 / ${0.16 - i * 0.04})`,
                    borderStyle: i === 1 ? "dashed" : "solid",
                  }}
                />
              ))}

              {/* Planets */}
              {planets.map((p) => (
                <div
                  key={p.id}
                  className="orbit absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                  style={{
                    animationDuration: `${p.duration}s`,
                    animationDelay: `${-(p.start / 360) * p.duration}s`,
                  }}
                >
                  {/* Counter-spins with the orbit and un-tilts, so the planet stays a round disc */}
                  <a
                    href={`#${p.id}`}
                    aria-label={`Go to ${labelOf(p.id)}`}
                    title={labelOf(p.id)}
                    className="planet absolute block rounded-full"
                    style={{
                      width: p.size,
                      height: p.size,
                      top: -p.radius - p.size / 2,
                      left: -p.size / 2,
                      animationDuration: `${p.duration}s`,
                      animationDelay: `${-(p.start / 360) * p.duration}s`,
                      // Lit from the sun in the middle: highlight faces inward
                      background: `radial-gradient(circle at 50% 70%, ${p.color} 0%, color-mix(in oklab, ${p.color} 55%, #000) 60%, #000 100%)`,
                      boxShadow: `0 0 ${p.size}px color-mix(in oklab, ${p.color} 40%, transparent)`,
                    }}
                  >
                    {p.ring && (
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-1/2 rounded-full border-2"
                        style={{
                          width: p.size * 2,
                          height: p.size * 0.7,
                          marginLeft: -p.size,
                          marginTop: -p.size * 0.35,
                          borderColor: `color-mix(in oklab, ${p.color} 70%, #fff)`,
                          transform: "rotate(-18deg)",
                        }}
                      />
                    )}
                    <span className="sr-only">{labelOf(p.id)}</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Sun: the call to action */}
            <a
              href={cta.href}
              className="sun absolute left-1/2 top-1/2 z-10 flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-semibold text-accent-fg transition-transform duration-500 ease-out-expo hover:scale-110 focus-visible:scale-110 sm:size-32"
            >
              <span aria-hidden className="sun-ring absolute inset-[-14%] rounded-full border border-accent/60" />
              <span className="relative">{cta.label}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
