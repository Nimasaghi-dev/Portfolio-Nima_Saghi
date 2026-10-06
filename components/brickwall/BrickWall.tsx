import { memo, type CSSProperties } from "react";
import { buildWall, type Wall } from "./brickGrid";
import styles from "./brickwall.module.css";

type Props = {
  rows: number;
  /** Running total of rows in the walls above — keeps the lattice continuous. */
  rowOffset: number;
  /** When true, bricks start hidden and fall in once `.building` is applied. */
  animate: boolean;
};

/* Walls are built once per (rows, rowOffset) pair and cached for the
   lifetime of the module — no per-render work. */
const cache = new Map<string, Wall>();
function getWall(rows: number, rowOffset: number): Wall {
  const key = `${rows}:${rowOffset}`;
  let wall = cache.get(key);
  if (!wall) {
    wall = buildWall(rows, rowOffset);
    cache.set(key, wall);
  }
  return wall;
}

/** Decorative wall of banna'i bricks. Static after mount — hover is CSS. */
export const BrickWall = memo(function BrickWall({
  rows,
  rowOffset,
  animate,
}: Props) {
  const wall = getWall(rows, rowOffset);
  return (
    <span
      aria-hidden="true"
      className={animate ? `${styles.wall} ${styles.animate}` : styles.wall}
      style={{ "--rows": rows } as CSSProperties}
    >
      {wall.rows.map((row, y) => (
        <span
          key={y}
          className={row.odd ? `${styles.row} ${styles.rowOdd}` : styles.row}
        >
          {row.bricks.map((b) => (
            <span
              key={b.key}
              className={
                b.ambient ? `${styles.brick} ${styles.amb}` : styles.brick
              }
              style={b.vars as CSSProperties}
            />
          ))}
        </span>
      ))}
    </span>
  );
});
