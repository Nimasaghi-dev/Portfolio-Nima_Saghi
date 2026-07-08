"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Cycles through `words`, typing and deleting with a blinking caret. */
export function Typewriter({
  words,
  className,
}: {
  words: readonly string[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return; // reduced motion: render the first word statically
    const current = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      // Full word typed — pause, then start deleting.
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && text === "") {
      // Word cleared — pause, then advance to the next word.
      timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }, 400);
    } else {
      const next = deleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      timeout = setTimeout(() => setText(next), deleting ? 40 : 80);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, reduce, words]);

  return (
    <span
      className={cn("caret font-mono text-accent", className)}
      aria-label={words.join(", ")}
    >
      <span aria-hidden="true">{reduce ? words[0] : text}</span>
    </span>
  );
}
