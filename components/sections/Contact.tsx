import { ArrowUpRight, FileText, MapPin, Phone } from "lucide-react";
import { hero, site, socials, type IconType } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CopyButton } from "@/components/contact/CopyButton";
import { Icon3D } from "@/components/ui/Icon3D";
import { BrickButtonIcon } from "@/components/brickwall/BrickMark";
import styles from "@/components/brickwall/brickwall.module.css";

type ContactRow = {
  label: string;
  value: string;
  href: string;
  icon: IconType;
  color: string;
  /** Copyable rows get a copy button; the rest open in a new tab. */
  copy?: boolean;
};

const byLabel = (label: string) => socials.find((s) => s.label === label);

/** Email and phone first (copyable), then the profiles. */
function contactRows(): ContactRow[] {
  const rows: ContactRow[] = [];
  const email = byLabel("Email");
  if (email) {
    rows.push({ ...email, value: site.email, copy: true });
  }
  rows.push({
    label: "Phone",
    value: site.phone,
    href: `tel:${site.phone.replace(/\s+/g, "")}`,
    icon: Phone,
    color: "var(--color-accent)",
    copy: true,
  });
  for (const s of socials) {
    if (s.label === "Email") continue;
    rows.push({ ...s, value: s.href.replace(/^https?:\/\/(www\.)?/, "") });
  }
  return rows;
}

/**
 * Closing block: contact details and site footer in one. Left column says
 * how to reach me and offers the two actions; right column lists every
 * channel in the same label/value rhythm as the About facts.
 */
export function Contact() {
  const year = new Date().getFullYear();
  const rows = contactRows();

  return (
    <footer
      id="contact"
      className="pointer-events-none relative scroll-mt-24 pt-20 sm:pt-28 lg:pt-32"
    >
      <div className="mx-auto w-full max-w-6xl px-gutter">
        <div className="glass pointer-events-auto rounded-2xl p-6 sm:p-10 lg:p-12">
          <SectionHeading
            index="05"
            path="contact"
            title="Let's build something."
          />

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16">
            {/* Pitch + actions */}
            <Reveal className="flex flex-col items-start gap-7">
              {hero.showAvailability && (
                <p className="liquid-glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm">
                  <span
                    aria-hidden="true"
                    className={`${styles.pulse} block h-[7px] w-[14px] flex-none rounded-[1px] bg-accent`}
                  />
                  {hero.availability}
                </p>
              )}

              <p className="max-w-[34ch] text-pretty text-xl leading-snug text-fg sm:text-2xl">
                Hiring for a frontend or full-stack role, or just want to say
                hi? Email is fastest. I usually reply{" "}
                <span className="text-accent">within a day</span>.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className={`${styles.btnPrimary} inline-flex min-h-12 items-center gap-2.5 rounded-[6px] px-5 font-medium`}
                >
                  <BrickButtonIcon />
                  Email me
                </a>
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.btnSecondary} liquid-glass inline-flex min-h-12 items-center gap-2 rounded-[6px] px-5 font-medium`}
                >
                  <FileText aria-hidden className="size-4" />
                  Résumé
                </a>
              </div>

              <p className="inline-flex items-center gap-2 text-sm text-faint">
                <MapPin aria-hidden className="size-4 text-accent" />
                {site.location}
              </p>
            </Reveal>

            {/* Every channel, one row each */}
            <Reveal delay={0.1}>
              <ul className="divide-y divide-line-soft border-y border-line-soft">
                {rows.map((row, i) => (
                  <li
                    key={row.label}
                    className="group flex items-center gap-4 py-3.5"
                  >
                    <Icon3D
                      render={(p) => <row.icon {...p} />}
                      depth={3}
                      duration={6 + i}
                      delay={-i * 1.4}
                      className="size-5 flex-none"
                      style={{ color: row.color }}
                    />
                    <span className="hidden w-20 flex-none text-sm text-faint sm:block">
                      {row.label}
                    </span>
                    <a
                      href={row.href}
                      {...(!row.copy && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                      className="min-w-0 flex-1 truncate text-sm font-medium text-fg transition-colors hover:text-accent"
                    >
                      {row.value}
                    </a>
                    {row.copy ? (
                      <CopyButton
                        value={row.value}
                        label={`Copy ${row.label.toLowerCase()}`}
                      />
                    ) : (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${row.label}`}
                        className="inline-flex size-8 flex-none items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-accent/60 hover:text-accent"
                      >
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Colophon */}
          <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <a href="#top" className="font-mono text-sm">
                <span className="text-accent">~/</span>
                <span className="text-fg">{site.handle}</span>
                <span className="text-accent">_</span>
              </a>
              <p className="text-sm text-muted">
                Designed &amp; built from scratch with Next.js, TypeScript, and
                Tailwind CSS.
              </p>
            </div>
            <p className="text-xs text-faint">
              © {year} {site.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
