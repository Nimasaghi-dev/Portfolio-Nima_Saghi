import type { ReactNode } from "react";
import { WallSection } from "@/components/brickwall/WallSection";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Removes the default max-width container (for full-bleed sections). */
  bleed?: boolean;
  /** Brick rows in this section's wall: ceil(height / 30) + 3. */
  rows: number;
  /** Running total of rows in the walls above, so the lattice is continuous. */
  rowOffset: number;
};

/**
 * Consistent vertical rhythm + nav scroll offset, over a brick wall. Content
 * sits on an `.over-wall` panel so the wall can run at full strength.
 */
export function Section({
  id,
  children,
  className,
  bleed,
  rows,
  rowOffset,
}: SectionProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-24", className)}>
      <WallSection
        rows={rows}
        rowOffset={rowOffset}
        className="py-20 sm:py-28 lg:py-32"
      >
        <div className={cn("mx-auto w-full px-gutter", !bleed && "max-w-6xl")}>
          <div className="over-wall rounded-2xl p-6 sm:p-10 lg:p-12">
            {children}
          </div>
        </div>
      </WallSection>
    </section>
  );
}
