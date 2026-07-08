"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Send, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "w-full rounded-lg border border-line bg-elevated/40 px-4 py-3 text-sm text-fg " +
  "placeholder:text-faint outline-none transition-colors focus:border-accent/60 " +
  "focus:ring-1 focus:ring-accent/40";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card flex flex-col items-center justify-center gap-4 rounded-xl p-10 text-center"
        role="status"
      >
        <span className="grid size-12 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
          <Check className="size-6" />
        </span>
        <div>
          <p className="text-lg font-semibold">Message sent.</p>
          <p className="mt-1 text-sm text-muted">
            Thanks for reaching out, I&apos;ll get back to you soon.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-mono text-xs text-accent transition-colors hover:text-accent-bright"
        >
          ← send another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface-card rounded-xl p-6 sm:p-7">
      {/* Honeypot — hidden from users, catches bots */}
      <div aria-hidden className="hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-mono text-xs text-muted">
              name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Ada Lovelace"
              className={field}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-mono text-xs text-muted">
              email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ada@example.com"
              className={field}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="font-mono text-xs text-muted">
            message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            maxLength={5000}
            placeholder="Tell me about the role, or just say hi."
            className={`${field} resize-y`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" iconRight={Send} disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send message"}
          </Button>

          <AnimatePresence>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
                className="inline-flex items-center gap-1.5 text-sm text-[#ff6b6b]"
              >
                <AlertCircle className="size-4" />
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}
