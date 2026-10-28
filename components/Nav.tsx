"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav, site, socials } from "@/data/portfolio";
import { useActiveSection, useScrolled, useBodyScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

// "top" (the hero) is observed too, so no link stays lit back at the top.
const navIds = ["top", ...nav.map((n) => n.id)];

export function Nav() {
  const scrolled = useScrolled(24);
  const active = useActiveSection(navIds);
  const [open, setOpen] = useState(false);
  // Portal target exists only on the client; false during SSR + hydration.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  useBodyScrollLock(open);

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
          ? "border-b border-line-soft bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-gutter transition-[height] duration-300",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative z-10 inline-block rounded-[4px] px-4 py-2 text-sm transition-colors",
                    isActive ? "text-accent-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-[4px] bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            );
          })}
          <li className="ml-3">
            <a
              href="#contact"
              className="btn-primary min-h-10! px-5! text-sm"
            >
              Hire Me!
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex size-11 items-center justify-center rounded-md border border-line text-fg lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </nav>

      {/* Portaled to <body>: the header's backdrop-filter would otherwise
          clip this fixed overlay to the header box. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-50 lg:hidden"
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                />
                <motion.div
                  id="mobile-menu"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menu"
                  variants={{ open: { x: 0 }, closed: { x: "100%" } }}
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                  className="absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col border-l border-line bg-surface p-6"
                >
                  <div className="flex items-center justify-between">
                    <Logo className="text-xl" />
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close menu"
                      className="inline-flex size-11 items-center justify-center rounded-md border border-line text-fg"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <ul className="mt-10 flex flex-col gap-1">
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
                            "flex items-center rounded-md px-4 py-3 text-lg transition-colors",
                            active === item.id
                              ? "bg-accent text-accent-fg"
                              : "text-muted hover:bg-elevated hover:text-fg",
                          )}
                        >
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
                    className="btn-outline mt-6"
                  >
                    Download CV
                  </a>

                  <div className="mt-auto flex gap-2 pt-8">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="inline-flex size-11 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        <s.icon className="size-4" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
