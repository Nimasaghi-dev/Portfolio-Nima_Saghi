"use client";

import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  CHUNK,
  COL_PITCH,
  COLS,
  PITCH,
  WALL_TOP,
  WALL_WIDTH,
  getRow,
  visibleCols,
} from "./brickGrid";
import styles from "./brickwall.module.css";

/** Rows rendered on the server: enough to cover the hero at first paint. */
const SSR_ROWS = 40;

type Layout = {
  rows: number;
  x0: number;
  x1: number;
  /** Bands starting above this row are pre-built (the hero never animates). */
  staticRows: number;
};

const SSR_LAYOUT: Layout = {
  rows: SSR_ROWS,
  x0: 0,
  x1: COLS - 1,
  staticRows: SSR_ROWS,
};

const Wall = memo(function Wall({ rows, x0, x1, staticRows }: Layout) {
  const bands = Math.ceil(rows / CHUNK);
  return (
    <span
      className={styles.wall}
      // Neither the wall, the bands nor the rows ever move: trimmed columns
      // become a margin on each row's first brick (--x0), so bricks the
      // server drew keep their exact position when the client trims to the
      // viewport — no layout shift.
      style={
        {
          left: `calc(50% - ${WALL_WIDTH / 2}px)`,
          "--x0": `${x0 * COL_PITCH}px`,
        } as CSSProperties
      }
    >
      {Array.from({ length: bands }, (_, c) => {
        const first = c * CHUNK;
        const pending = first >= staticRows;
        return (
          <span
            key={c}
            className={styles.band}
            // data-p marks a band that still has to fall in. The observer
            // adds data-b on the DOM node; React never renders data-b, so a
            // re-render can't undo a build.
            data-p={pending ? "" : undefined}
          >
            {Array.from({ length: Math.min(CHUNK, rows - first) }, (_, i) => {
              const row = getRow(first + i);
              return (
                <span
                  key={row.Y}
                  className={
                    row.odd ? `${styles.row} ${styles.rowOdd}` : styles.row
                  }
                >
                  {row.bricks.slice(x0, x1 + 1).map((b) => (
                    <span
                      key={b.x}
                      className={
                        b.ambient
                          ? `${styles.brick} ${styles.amb}`
                          : styles.brick
                      }
                      style={b.vars as CSSProperties}
                    />
                  ))}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
});

/**
 * One continuous banna'i wall behind the whole page. There are no
 * per-section walls, so there are no boundaries to hide.
 *
 * The wall is cut into 4-row bands. One IntersectionObserver builds each
 * band once, as it enters the viewport, so bricks keep landing just at the
 * bottom edge as you scroll: the build front follows the scroll and knows
 * nothing about sections. Bands already scrolled past (reload mid-page)
 * are built instantly. Everything else is CSS.
 */
export function PageWall({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);
  const [layout, setLayout] = useState<Layout>(SSR_LAYOUT);

  // Size the wall to the real page: rows to its height, columns to the
  // viewport width. Re-measured whenever the page resizes.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const rows = Math.ceil((root.offsetHeight - WALL_TOP) / PITCH) + 1;
      const [x0, x1] = visibleCols(root.clientWidth);
      const hero = document.getElementById("top");
      const heroRows = hero
        ? Math.ceil((hero.offsetHeight - WALL_TOP) / PITCH)
        : 0;
      // Never demote a band the server already drew as built.
      const staticRows = Math.max(heroRows, SSR_ROWS);
      setLayout((l) =>
        l.rows === rows &&
        l.x0 === x0 &&
        l.x1 === x1 &&
        l.staticRows === staticRows
          ? l
          : { rows, x0, x1, staticRows },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  // One observer for every band; each band is built once, then unobserved.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const band = e.target as HTMLElement;
          if (e.isIntersecting) band.dataset.b = "1";
          else if (e.boundingClientRect.bottom <= 0) band.dataset.b = "0";
          else continue;
          io.unobserve(band);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );
    ioRef.current = io;
    return () => io.disconnect();
  }, []);

  // Observe bands that appeared since the last layout.
  useEffect(() => {
    const io = ioRef.current;
    const layer = layerRef.current;
    if (!io || !layer) return;
    layer
      .querySelectorAll<HTMLElement>("[data-p]:not([data-o]):not([data-b])")
      .forEach((band) => {
        band.dataset.o = "";
        io.observe(band);
      });
  }, [layout]);

  return (
    <div ref={rootRef} className="relative">
      <div ref={layerRef} aria-hidden="true" className={styles.layer}>
        <Wall {...layout} />
      </div>
      <div className={styles.scrim} />
      {children}
    </div>
  );
}
