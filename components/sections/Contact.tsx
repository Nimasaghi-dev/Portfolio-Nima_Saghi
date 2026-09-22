import { site, socials } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CopyButton } from "@/components/contact/CopyButton";

/**
 * Closing block: contact details and site footer in one. The page ends on a
 * single call to action instead of repeating the same links twice.
 */
export function Contact() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative scroll-mt-24 border-t border-line pt-20 sm:pt-28 lg:pt-32"
    >
      <div className="mx-auto w-full max-w-6xl px-gutter">
        <SectionHeading
          index="05"
          path="contact"
          title="Let's build something."
          description="Hiring for a frontend or full-stack role, or just want to say hi? My inbox is open."
        />

        {/* Direct line — the one thing this block is for. */}
        <Reveal className="mt-12">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="text-2xl font-semibold tracking-tight text-fg transition-colors hover:text-accent sm:text-3xl lg:text-4xl"
            >
              {site.email}
            </a>
            <CopyButton value={site.email} label="Copy email address" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <a
              href={`tel:${site.phone.replace(/\s+/g, "")}`}
              className="font-mono text-sm text-muted transition-colors hover:text-accent"
            >
              {site.phone}
            </a>
            <CopyButton value={site.phone} label="Copy phone number" />
            <span className="font-mono text-xs text-faint">
              {site.location}. Usually replies within a day
            </span>
          </div>
        </Reveal>

        {/* Elsewhere */}
        <Reveal delay={0.1} className="mt-10">
          <p className="font-mono text-sm text-accent">{"// elsewhere"}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-lg border border-line px-4 py-2.5 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <s.icon className="size-4" />
                  <span className="text-sm">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Colophon */}
        <div className="mt-16 flex flex-col gap-4 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
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
          <p className="font-mono text-xs text-faint">
            © {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
