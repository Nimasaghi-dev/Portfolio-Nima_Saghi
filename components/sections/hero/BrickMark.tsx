import styles from "./hero.module.css";

/* Small brick pieces used around the hero. Colours read the --hero-*
   vars from the section, with fallbacks so they also render elsewhere. */
const HOT = "var(--hero-hot, #4fd1c1)";
const GOLD = "var(--hero-gold, #e2b04a)";
const DIM = "var(--hero-dim, #2a3866)";

/** Logo mark: 2×3 bricks, middle row shifted left like a running bond. */
export function BrickLogo({ className = "" }: { className?: string }) {
  const rows = [
    [HOT, DIM],
    [DIM, GOLD],
    [DIM, HOT],
  ];
  return (
    <span aria-hidden="true" className={`inline-flex flex-col gap-[3px] ${className}`}>
      {rows.map((row, i) => (
        <span key={i} className="flex gap-[3px]" style={i === 1 ? { marginLeft: -7 } : undefined}>
          {row.map((c, j) => (
            <span key={j} className="block h-[6px] w-[12px] rounded-[1px]" style={{ background: c }} />
          ))}
        </span>
      ))}
    </span>
  );
}

/** Scroll cue: three stacked bricks fading in sequence. */
export function BrickScrollCue() {
  return (
    <span aria-hidden="true" className="flex flex-col gap-[3px]">
      {[0, 0.2, 0.4].map((delay, i) => (
        <span
          key={i}
          className={`block h-[5px] w-[12px] rounded-[1px] ${styles.cueBrick}`}
          style={{ background: HOT, animationDelay: `${delay}s`, marginLeft: i === 1 ? 4 : 0 }}
        />
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

/** Chip bullet: a single 10×5 brick, accent or gold. */
export function BrickBullet({ gold = false }: { gold?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="block h-[5px] w-[10px] flex-none rounded-[1px]"
      style={{ background: gold ? GOLD : HOT }}
    />
  );
}
