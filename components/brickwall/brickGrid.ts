/* ------------------------------------------------------------------ *
 * Banna'i brick grid — pure, deterministic, no React.                 *
 * Everything derives from the brick's column x and its page-wide row  *
 * Y, so the whole page is one lattice with no seams.                  *
 * No Math.random(): server and client must produce identical output. *
 * ------------------------------------------------------------------ */

export const COLS = 31;
/** Row pitch: 26px brick + 4px gap. */
export const PITCH = 30;
/** Column pitch: 64px brick + 4px gap. */
export const COL_PITCH = 68;
/** Full wall width (31 columns, cropped to the viewport, never scaled). */
export const WALL_WIDTH = 2060;
/** Wall top. Row Y spans pageY = PITCH*Y + WALL_TOP … + 26. */
export const WALL_TOP = -14;
/** Rows per build band. Small, so the build edge tracks the scroll. */
export const CHUNK = 4;
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
  x: number;
  /** CSS custom properties: --b, --h, --fd/--dx/--rot for the fall, and
   *  --dur/--del for ambient bricks. */
  vars: Record<string, string>;
  ambient: boolean;
};

/** `odd` is page-wide parity, so the running bond never breaks. */
export type Row = { Y: number; odd: boolean; bricks: Brick[] };

const rowCache = new Map<number, Row>();

/** All 31 bricks of page row Y, built once and cached. */
export function getRow(Y: number): Row {
  let row = rowCache.get(Y);
  if (row) return row;
  const inBand = Y % CHUNK;
  row = {
    Y,
    odd: Y % 2 === 1,
    bricks: Array.from({ length: COLS }, (_, x): Brick => {
      const n = seed(x, Y);
      const ambient = isAmbient(n);
      const vars: Record<string, string> = {
        "--b": baseTone(x, Y),
        "--h": hoverTone(n),
        // Slight bottom-up bias inside the band, wide per-brick scatter: the
        // band's bricks land one by one over ~0.6s. (73 is coprime with 97,
        // so the 31 bricks of a row get 31 distinct seeds.)
        "--fd": `${(CHUNK - 1 - inBand) * 40 + n * 5}ms`,
        "--dx": `${(n % 37) - 18}px`,
        "--rot": `${(n % 17) - 8}deg`,
      };
      if (ambient) {
        vars["--dur"] = `${5 + (n % 5)}s`;
        vars["--del"] = `-${n % 9}s`;
      }
      return { x, vars, ambient };
    }),
  };
  rowCache.set(Y, row);
  return row;
}

/** Columns that can be seen in a viewport `width` px wide (wall centred). */
export function visibleCols(width: number): [number, number] {
  const half = width / 2;
  const left = WALL_WIDTH / 2; // centre → wall's left edge
  // Odd rows sit 34px further left, so they set the leftmost column needed.
  const x0 = Math.max(0, Math.floor((left - half - 64 - 34) / COL_PITCH));
  const x1 = Math.min(COLS - 1, Math.ceil((left + half) / COL_PITCH));
  return [x0, x1];
}
