"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/** Copies `value` to the clipboard and shows a brief confirmation. */
export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ?? `Copy ${value}`}
      className="inline-flex size-8 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-accent/60 hover:text-accent"
    >
      {copied ? (
        <Check className="size-4 text-accent" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
}
