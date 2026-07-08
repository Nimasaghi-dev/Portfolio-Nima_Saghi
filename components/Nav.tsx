"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, FileText } from "lucide-react";
import { nav, site, socials } from "@/data/portfolio";
import { useActiveSection, useScrolled, useBodyScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const navIds = nav.map((n) => n.id);

export function Nav() {
  const scrolled = useScrolled(24);
  const active = useActiveSection(navIds);
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  // Close mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line/80 bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-gutter"
      >
        {/* Logo — terminal prompt */}
        <a
          href="#top"
          className="group font-mono text-sm font-medium tracking-tight"
        >
          <span className="text-accent">~/</span>
          <span className="text-fg transition-colors group-hover:text-accent">
            {site.handle}
          </span>
          <span className="text-accent">_</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative inline-block px-3 py-2 font-mono text-sm transition-colors",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <span className="text-accent">#</span>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-px h-px bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
          <li className="ml-2">
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/40 px-3 py-1.5 font-mono text-xs text-fg transition-colors hover:border-accent/60 hover:text-accent"
            >
              <FileText className="size-3.5" />
              resume
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-fg md:hidden"
        >
          <Menu className="size-5" />
        </button>
      </nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              variants={{
                open: { x: 0 },
                closed: { x: "100%" },
              }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[78%] max-w-xs flex-col border-l border-line bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">
                  <span className="text-accent">~/</span>
                  {site.handle}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-fg"
                >
                  <X className="size-5" />
                </button>
              </div>

              <ul className="mt-8 flex flex-col gap-1">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-3 font-mono text-lg transition-colors",
                        active === item.id
                          ? "bg-elevated text-fg"
                          : "text-muted hover:text-fg",
                      )}
                    >
                      <span className="text-accent">#</span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-mono text-sm text-white transition-colors hover:bg-accent-bright"
              >
                <FileText className="size-4" />
                resume.pdf
              </a>

              <div className="mt-auto flex gap-2 pt-8">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
