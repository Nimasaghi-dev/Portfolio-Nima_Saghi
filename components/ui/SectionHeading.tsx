import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Centered section title with a short orange rule and an optional intro
 * line, as in the reference layout.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const center = align === "center";
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        center ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-medium tracking-[0.2em] text-secondary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
      <span aria-hidden className="flex items-center gap-1.5">
        <span className="h-[3px] w-10 rounded-full bg-accent" />
        <span className="h-[3px] w-3 rounded-full bg-accent/60" />
        <span className="h-[3px] w-1.5 rounded-full bg-secondary" />
      </span>
      {intro && (
        <p
          className={cn(
            "max-w-2xl text-pretty leading-relaxed text-muted",
            center && "mx-auto",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
