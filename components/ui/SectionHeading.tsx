import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Two-digit section number, e.g. "01". */
  index: string;
  /** Path-style slug shown after the number, e.g. "about". */
  path: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

/** Terminal-flavoured section header: `// 01  ~/about` + title. */
export function SectionHeading({
  index,
  path,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        className,
      )}
    >
      <Reveal>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-accent">{`// ${index}`}</span>
          <span className="text-faint">~/{path}</span>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-pretty text-base leading-relaxed text-muted",
              centered && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
