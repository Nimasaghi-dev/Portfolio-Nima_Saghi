import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Monospace tech-tag chip. */
export function Tag({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-line bg-elevated/60 px-2 py-0.5",
        "font-mono text-xs text-muted",
        interactive &&
          "transition-colors duration-200 hover:border-accent/50 hover:text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
