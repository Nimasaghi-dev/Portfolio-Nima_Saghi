import type { ComponentType } from "react";

type Dir = "down" | "right" | "up-right";

/**
 * Dark round icon chip that sits inside a `.btn-primary`. The icon is drawn
 * twice: on hover the first copy slides out in `dir` and the second slides
 * in behind it, so the icon looks like it travels through the chip.
 */
export function BtnChip({
  icon: Icon,
  dir = "right",
}: {
  icon: ComponentType<{ className?: string }>;
  dir?: Dir;
}) {
  return (
    <span aria-hidden className="btn-chip" data-dir={dir}>
      <Icon className="btn-chip-a" />
      <Icon className="btn-chip-b" />
    </span>
  );
}
