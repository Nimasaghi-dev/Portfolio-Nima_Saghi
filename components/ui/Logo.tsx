import { site } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Wordmark: the first name with its last letter swapped for three stacked
 * orange bars, echoing the "Cod≡r" mark in the reference.
 */
export function Logo({ className }: { className?: string }) {
  const first = site.name.split(" ")[0];
  return (
    <a
      href="#top"
      aria-label={`${site.name}, back to top`}
      className={cn(
        "group inline-flex items-center text-2xl font-bold tracking-tight text-fg",
        className,
      )}
    >
      <span aria-hidden>{first}</span>
      <span
        aria-hidden
        className="ml-1 inline-flex h-[0.72em] w-[0.5em] flex-col justify-between"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-[3px] rounded-[1px] bg-accent transition-[width] duration-300 group-hover:w-full"
            style={{ width: `${100 - i * 18}%` }}
          />
        ))}
      </span>
    </a>
  );
}
