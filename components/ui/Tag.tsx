import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small tech-tag chip. */
export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border border-line bg-elevated px-2.5 py-1 text-xs text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
