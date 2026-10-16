import type { CSSProperties, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

/** Stacked copies of the glyph along Z that give the icon its thickness. */
const LAYERS = 7;

/**
 * An icon extruded into a 3D coin that spins on a slow loop. The front and
 * back copies are the lit faces (in the current text color), the copies in
 * between form a darker rim. Inside a `group`, hovering adds a glow.
 *
 * Pass `duration`/`delay` derived from an index (not random) so server and
 * client render identically; a negative delay starts the icon mid-turn. The
 * spin is a CSS animation, so the global reduced-motion rule stops it
 * face-on.
 */
export function Icon3D({
  render,
  className,
  style,
  depth = 4.8,
  duration = 8,
  delay = 0,
}: {
  /** Renders one layer of the icon; spread the props onto its <svg>. */
  render: (props: SVGProps<SVGSVGElement>) => ReactNode;
  /** Sets the box size (and color, via text-*). */
  className?: string;
  style?: CSSProperties;
  /** Total thickness in px. */
  depth?: number;
  duration?: number;
  delay?: number;
}) {
  const gap = depth / (LAYERS - 1);
  return (
    <span
      aria-hidden="true"
      className={cn("icon-3d relative block", className)}
      style={style}
    >
      <span
        className="icon-3d-spin absolute inset-0"
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      >
        {Array.from({ length: LAYERS }, (_, k) => {
          const face = k === 0 || k === LAYERS - 1;
          return (
            <span
              key={k}
              className={cn(
                "absolute inset-0",
                face ? "icon-3d-face" : "icon-3d-side",
              )}
              style={{ transform: `translateZ(${((LAYERS - 1) / 2 - k) * gap}px)` }}
            >
              {render({ className: "size-full" })}
            </span>
          );
        })}
      </span>
    </span>
  );
}
