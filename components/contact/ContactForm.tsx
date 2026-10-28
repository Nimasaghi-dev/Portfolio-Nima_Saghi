"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { site } from "@/data/portfolio";

const field =
  "w-full rounded-md border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-faint transition-colors focus:border-accent focus:outline-none";

/**
 * No backend: submitting opens the visitor's email app with the message
 * prefilled, addressed to the site owner.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `Hello from ${name || "your portfolio"}`;
    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-muted">
          Name
          <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="flex flex-col gap-2 text-sm text-muted">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={field}
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm text-muted">
        Message
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell me about the role or project…"
          className={`${field} resize-y`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary">
          <Send aria-hidden className="size-4" />
          Send message
        </button>
        <p className="text-xs text-faint" aria-live="polite">
          {sent ? "Your email app should be open. Hit send there." : "Opens your email app."}
        </p>
      </div>
    </form>
  );
}
