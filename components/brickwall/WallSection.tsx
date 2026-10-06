"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { BrickWall } from "./BrickWall";
import { PITCH, WALL_TOP } from "./brickGrid";
import styles from "./brickwall.module.css";

type Props = {
  rows: number;
  /** SSR estimate of the global row index; corrected after layout. */
  rowOffset: number;
  children: ReactNode;
  /** Applied to the clipping root (padding goes here so the wall covers it). */
  className?: string;
};

/* One document-level ResizeObserver shared by every WallSection: when the
   page's height changes (fonts swap, viewport resize), every wall re-snaps. */
const listeners = new Set<() => void>();
let ro: ResizeObserver | null = null;
function subscribe(fn: () => void) {
  listeners.add(fn);
  if (!ro && typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => listeners.forEach((l) => l()));
    ro.observe(document.documentElement);
  }
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && ro) {
      ro.disconnect();
      ro = null;
    }
  };
}

/**
 * A section backdrop: wall + scrim + content layer.
 *
 * Seamlessness: every wall is snapped onto one page-wide grid of 30px rows
 * anchored at the hero (row k spans pageY = 30k - 14 … 30k + 12). After
 * layout we read the section's pageY, pick the row that straddles its top
 * edge, and shift the wall so that row lands exactly there. That row index
 * is also the pattern offset, so the brick straddling a boundary is the
 * same brick in both sections — same column, tone, bond — and the boundary
 * is invisible once both walls are built.
 *
 * Owns one one-shot IntersectionObserver that adds `.building` to the wall
 * the first time the section scrolls into view, then disconnects.
 */
export function WallSection({ rows, rowOffset, children, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ offset: rowOffset, top: WALL_TOP });

  // Snap to the global grid before first paint on the client, and again
  // whenever the document's height changes.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const snap = () => {
      const pageY = root.getBoundingClientRect().top + window.scrollY;
      const k = Math.floor((pageY - WALL_TOP) / PITCH);
      const top = k * PITCH + WALL_TOP - pageY;
      setGrid((g) =>
        g.offset === k && g.top === top ? g : { offset: k, top },
      );
    };
    snap();
    return subscribe(snap);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const wall = root?.firstElementChild as HTMLElement | null;
    if (!root || !wall) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        wall.classList.add(styles.building);
        io.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(root);

    // Dev guard: the wall may be shifted up to one row to snap to the grid,
    // so it must still reach the section's bottom edge after the shift.
    let raf = 0;
    if (process.env.NODE_ENV !== "production") {
      raf = requestAnimationFrame(() => {
        const short = root.offsetHeight - (wall.scrollHeight + grid.top);
        if (short > 0) {
          console.warn(
            `[brickwall] wall (rows=${rows}, offset=${grid.offset}) is ${short}px shorter than its section — add ${Math.ceil(short / PITCH)} row(s)`,
          );
        }
      });
    }

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rows, grid]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ "--wall-top": `${grid.top}px` } as CSSProperties}
    >
      <BrickWall rows={rows} rowOffset={grid.offset} animate />
      <div className={styles.scrimSection} />
      <div className="relative">{children}</div>
    </div>
  );
}
