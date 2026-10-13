import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Removes the default max-width container (for full-bleed sections). */
  bleed?: boolean;
};

/**
 * Consistent vertical rhythm + nav scroll offset. The page-wide brick wall
 * shows through; content sits on an `.over-wall` panel. The section itself
 * is transparent to the pointer so the wall's hover trail works in the
 * gutters — only the panel takes pointer events.
 */
export function Section({ id, children, className, bleed }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "pointer-events-none relative scroll-mt-24 py-20 sm:py-28 lg:py-32",
        className,
      )}
    >
      <div className={cn("mx-auto w-full px-gutter", !bleed && "max-w-6xl")}>
        <div className="over-wall pointer-events-auto rounded-2xl p-6 sm:p-10 lg:p-12">
          {children}
        </div>
      </div>
    </section>
  );
}
