import { useId } from "react";
import { site } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/** Full orbit, starting at its right end and running through the front. */
const ORBIT = "M37 20A17 6.2 0 1 1 3 20A17 6.2 0 1 1 37 20Z";

/**
 * Logo: the galaxy's sun in miniature, seen at the same tilt as the 3D scene,
 * with one planet on its orbit, plus a tracked Jost logotype.
 *
 * The planet is drawn twice. One copy sits under the sun; the other sits
 * over it but is clipped to the front half of the orbit. Together they let
 * the planet pass behind the sun and in front of it as it goes around.
 */
export function Logo({ className }: { className?: string }) {
  const id = useId();
  const sun = `${id}sun`;
  const corona = `${id}corona`;
  const planet = `${id}planet`;
  const front = `${id}front`;
  const planetStyle = { offsetPath: `path("${ORBIT}")` };
  const [first, ...rest] = site.name.split(" ");

  return (
    <a
      href="#top"
      aria-label={`${site.name}, back to top`}
      className={cn("logo group inline-flex items-center gap-3 text-fg", className)}
    >
      <svg aria-hidden viewBox="0 0 40 40" className="size-10 flex-none overflow-visible">
        <defs>
          <radialGradient id={sun} cx="0.42" cy="0.4" r="0.62">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="0.35" stopColor="#ffd6a8" />
            <stop offset="0.75" stopColor="#ff8a4a" />
            <stop offset="1" stopColor="#e2541a" />
          </radialGradient>
          <radialGradient id={corona}>
            <stop offset="0.35" stopColor="#ff8a4a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff8a4a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={planet} cx="0.35" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#dce8ff" />
            <stop offset="1" stopColor="#4f7fd8" />
          </radialGradient>
          <clipPath id={front}>
            <rect x="0" y="20" width="40" height="20" />
          </clipPath>
        </defs>

        <g transform="rotate(-20 20 20)">
          <circle className="logo-corona" cx="20" cy="20" r="13" fill={`url(#${corona})`} />
          {/* back half of the orbit, then the planet when it is behind */}
          <path
            d="M37 20A17 6.2 0 0 0 3 20"
            fill="none"
            stroke="var(--color-secondary)"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <circle className="logo-planet" r="2.6" fill={`url(#${planet})`} style={planetStyle} />

          <circle cx="20" cy="20" r="7.25" fill={`url(#${sun})`} />

          {/* front half of the orbit and the planet when it passes in front */}
          <path
            d="M3 20A17 6.2 0 0 0 37 20"
            fill="none"
            stroke="var(--color-secondary)"
            strokeOpacity="0.75"
            strokeWidth="1"
          />
          <g clipPath={`url(#${front})`}>
            <circle className="logo-planet" r="2.6" fill={`url(#${planet})`} style={planetStyle} />
          </g>
        </g>
      </svg>

      <span aria-hidden className="font-brand text-[0.95rem] leading-none tracking-[0.3em] uppercase">
        <span className="font-semibold">{first}</span>{" "}
        <span className="font-light">{rest.join(" ")}</span>
      </span>
    </a>
  );
}
