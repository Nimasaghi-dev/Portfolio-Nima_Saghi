import { nav, site, socials } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-gutter py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Identity */}
          <div className="max-w-xs">
            <a href="#top" className="font-mono text-sm">
              <span className="text-accent">~/</span>
              <span className="text-fg">{site.handle}</span>
              <span className="text-accent">_</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Designed &amp; built from scratch with Next.js, TypeScript, and
              Tailwind CSS.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer" className="flex flex-col gap-2">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="font-mono text-sm text-muted transition-colors hover:text-accent"
              >
                <span className="text-accent">#</span>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/60 hover:text-accent"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="font-mono text-xs text-faint">
            © {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
