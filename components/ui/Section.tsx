import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Removes the default max-width container (for full-bleed sections). */
  bleed?: boolean;
};

/** Consistent vertical rhythm + container + nav scroll offset. */
export function Section({ id, children, className, bleed }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28 lg:py-32",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto w-full px-gutter",
          !bleed && "max-w-6xl",
        )}
      >
        {children}
      </div>
    </section>
  );
}
