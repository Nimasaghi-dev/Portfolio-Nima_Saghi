import { Mail, MapPin, Phone } from "lucide-react";
import { nav, site, socials, type IconType } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CopyButton } from "@/components/contact/CopyButton";
import { Icon3D } from "@/components/ui/Icon3D";
import { Logo } from "@/components/ui/Logo";

type Row = {
  label: string;
  value: string;
  href?: string;
  icon: IconType;
  copy?: boolean;
};

const rows: Row[] = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: Mail,
    copy: true,
  },
  {
    label: "Phone",
    value: site.phone,
    href: `tel:${site.phone.replace(/\s+/g, "")}`,
    icon: Phone,
    copy: true,
  },
  { label: "Location", value: site.location, icon: MapPin },
];

/** Contact details, then the site footer. */
export function Contact() {
  const year = new Date().getFullYear();

  return (
    <>
      <section id="contact" className="relative scroll-mt-20 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something"
            intro="Hiring for a frontend or full-stack role, or just want to say hi? Email is fastest. I usually reply within a day."
          />

          <Reveal className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {rows.map((r, i) => (
              <div
                key={r.label}
                className="card group flex items-center gap-4 p-5"
              >
                <span className="inline-flex size-12 flex-none items-center justify-center rounded-md bg-accent/10">
                  <Icon3D
                    render={(p) => <r.icon {...p} />}
                    depth={3}
                    duration={7 + i}
                    delay={-i * 1.5}
                    className="size-5 text-accent"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs tracking-wider text-faint uppercase">
                    {r.label}
                  </p>
                  {r.href ? (
                    <a
                      href={r.href}
                      className="block truncate text-sm font-medium text-fg transition-colors hover:text-accent"
                    >
                      {r.value}
                    </a>
                  ) : (
                    <p className="truncate text-sm font-medium text-fg">
                      {r.value}
                    </p>
                  )}
                </div>
                {r.copy && (
                  <CopyButton
                    value={r.value}
                    label={`Copy ${r.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}

            <div className="card flex items-center justify-between gap-4 p-5">
              <p className="text-xs tracking-wider text-faint uppercase">
                Elsewhere
              </p>
              <ul className="flex gap-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="btn-icon"
                    >
                      <s.icon className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line-soft">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-gutter py-10 md:flex-row md:justify-between">
          <Logo />
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="transition-colors hover:text-accent"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-faint">
            © {year} {site.name}. Built with Next.js & Three.js.
          </p>
        </div>
      </footer>
    </>
  );
}
