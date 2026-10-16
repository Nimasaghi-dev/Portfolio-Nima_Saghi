/* Small brick pieces used around the hero. Glazes come from @theme; the
   dim (unglazed) brick is a wall-only colour. */
const HOT = "var(--color-accent)";
const GOLD = "var(--color-gold)";
const DIM = "#2a3866";

/** Logo mark: 2×3 bricks, middle row shifted left like a running bond. */
export function BrickLogo({ className = "" }: { className?: string }) {
  const rows = [
    [HOT, DIM],
    [DIM, GOLD],
    [DIM, HOT],
  ];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex flex-col gap-[3px] ${className}`}
    >
      {rows.map((row, i) => (
        <span
          key={i}
          className="flex gap-[3px]"
          style={i === 1 ? { marginLeft: -7 } : undefined}
        >
          {row.map((c, j) => (
            <span
              key={j}
              className="block h-[6px] w-[12px] rounded-[1px]"
              style={{ background: c }}
            />
          ))}
        </span>
      ))}
    </span>
  );
}

/** Primary-button icon: two 10×4 bricks in running bond. */
export function BrickButtonIcon() {
  return (
    <span aria-hidden="true" className="flex flex-col gap-[2px]">
      <span className="block h-[4px] w-[10px] rounded-[1px] bg-current" />
      <span className="ml-[3px] block h-[4px] w-[10px] rounded-[1px] bg-current opacity-50" />
    </span>
  );
}
