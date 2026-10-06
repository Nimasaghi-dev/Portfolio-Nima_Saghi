/* ------------------------------------------------------------------ *
 * Banna'i brick grid — pure, deterministic, no React.                 *
 * Everything derives from (x, Y) where Y = y + rowOffset, so stacked  *
 * walls continue one lattice instead of restarting it at each seam.   *
 * No Math.random(): server and client must produce identical output. *
 * ------------------------------------------------------------------ */

export const COLS = 31;
/** Row pitch: 26px brick + 4px gap. */
export const PITCH = 30;
/** Default wall top. Row k spans pageY = PITCH*k + WALL_TOP … + 26. */
export const WALL_TOP = -14;
const LATTICE_STEP = 14;

export const WALL_TONES = ["#172040", "#1a2347", "#141b38", "#1d2650"] as const;
export const LATTICE_TONE = "#1d3550";
export const HOT = "#4fd1c1";
export const GOLD = "#e2b04a";
export const LAPIS = "#5b86e5";

/** Always-non-negative modulo. */
export const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Per-brick pseudo-random seed in [0, 97). */
export const seed = (x: number, Y: number) => (x * 73 + Y * 151) % 97;

const onLattice = (v: number, Y: number) =>
  mod(v + Y, LATTICE_STEP) === 0 || mod(v - Y, LATTICE_STEP) === 0;

export function isLattice(x: number, Y: number) {
  // Position in half-brick units, accounting for the running-bond offset.
  const u = 2 * x - (Y % 2 === 1 ? 1 : 0);
  return onLattice(u, Y) || onLattice(u + 1, Y);
}

export const baseTone = (x: number, Y: number) =>
  isLattice(x, Y) ? LATTICE_TONE : WALL_TONES[(x * 3 + Y * 5) % 4];

export const hoverTone = (n: number) =>
  n % 7 === 0 ? GOLD : n % 5 === 0 ? LAPIS : HOT;

export const isAmbient = (n: number) => n % 37 === 3;

export type Brick = {
  key: string;
  /** CSS custom properties: --b, --h, --fd/--dx/--rot for the fall, and
   *  --dur/--del for ambient bricks. */
  vars: Record<string, string>;
  ambient: boolean;
};

/** `odd` is global parity (Y % 2), so the running bond survives any rowOffset. */
export type Row = { odd: boolean; bricks: Brick[] };

export type Wall = { rows: Row[] };

export function buildWall(rows: number, rowOffset: number): Wall {
  const grid = Array.from({ length: rows }, (_, y): Row => {
    const Y = y + rowOffset;
    return {
      odd: Y % 2 === 1,
      bricks: Array.from({ length: COLS }, (_, x): Brick => {
        const n = seed(x, Y);
        const ambient = isAmbient(n);
        const vars: Record<string, string> = {
          "--b": baseTone(x, Y),
          "--h": hoverTone(n),
          // Gentle bottom-up bias, wide per-brick scatter. The scatter spans ~22
          // row-bands, so bands overlap heavily and bricks arrive individually
          // while the wall still visibly builds upward. (73 is coprime with 97,
          // so the 31 bricks in a row get 31 distinct seeds across 0–96.)
          "--fd": `${(rows - 1 - y) * 26 + n * 6}ms`,
          "--dx": `${(n % 37) - 18}px`,
          "--rot": `${(n % 17) - 8}deg`,
        };
        if (ambient) {
          vars["--dur"] = `${5 + (n % 5)}s`;
          vars["--del"] = `-${n % 9}s`;
        }
        return { key: `${x}-${y}`, vars, ambient };
      }),
    };
  });
  return { rows: grid };
}
