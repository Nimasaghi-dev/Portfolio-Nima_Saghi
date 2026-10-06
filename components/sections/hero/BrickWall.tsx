import { memo, type CSSProperties } from "react";
import styles from "./hero.module.css";

const ROWS = 34;
const COLS = 31;
const LATTICE_STEP = 14;

const WALL_TONES = ["#172040", "#1a2347", "#141b38", "#1d2650"] as const;
const LATTICE = "#1d3550";
const HOT = "#4fd1c1";
const GOLD = "#e2b04a";
const LAPIS = "#5b86e5";

type Brick = { key: string; style: CSSProperties; ambient: boolean };

/** Always-non-negative modulo. */
const mod = (a: number, n: number) => ((a % n) + n) % n;

const onLattice = (v: number, y: number) =>
  mod(v + y, LATTICE_STEP) === 0 || mod(v - y, LATTICE_STEP) === 0;

/**
 * Deterministic — no Math.random(), so server and client draw the same
 * wall and hydration matches. Built once at module load.
 */
const WALL: Brick[][] = Array.from({ length: ROWS }, (_, y) =>
  Array.from({ length: COLS }, (_, x) => {
    const odd = y % 2 === 1;
    // Position in half-brick units, accounting for the running-bond offset.
    const u = 2 * x - (odd ? 1 : 0);
    const lattice = onLattice(u, y) || onLattice(u + 1, y);
    const n = (x * 73 + y * 151) % 97;
    const hover = n % 7 === 0 ? GOLD : n % 5 === 0 ? LAPIS : HOT;
    const ambient = n % 37 === 3;

    const style: Record<string, string> = {
      "--b": lattice ? LATTICE : WALL_TONES[(x * 3 + y * 5) % 4],
      "--h": hover,
    };
    if (ambient) {
      style["--dur"] = `${5 + (n % 5)}s`;
      style["--del"] = `-${n % 9}s`;
    }
    return { key: `${x}-${y}`, style: style as CSSProperties, ambient };
  }),
);

/** The decorative brick wall. Static after mount — hover is pure CSS. */
export const BrickWall = memo(function BrickWall() {
  return (
    <span aria-hidden="true" className={styles.wall}>
      {WALL.map((row, y) => (
        <span key={y} className={styles.row}>
          {row.map((b) => (
            <span
              key={b.key}
              className={b.ambient ? `${styles.brick} ${styles.amb}` : styles.brick}
              style={b.style}
            />
          ))}
        </span>
      ))}
    </span>
  );
});
