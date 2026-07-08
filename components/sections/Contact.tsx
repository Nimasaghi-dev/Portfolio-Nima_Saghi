import { site, socials } from "@/data/portfolio";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyButton } from "@/components/contact/CopyButton";

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading
        index="05"
        path="contact"
        title="Let's build something."
        description="Hiring for a frontend or full-stack role, or just want to say hi? My inbox is open."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left — direct contact + socials */}
        <Reveal className="flex flex-col gap-8">
          <div>
            <p className="font-mono text-sm text-accent">{"// direct line"}</p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="text-lg font-medium text-fg transition-colors hover:text-accent sm:text-xl"
              >
                {site.email}
              </a>
              <CopyButton value={site.email} label="Copy email address" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="font-mono text-sm text-muted transition-colors hover:text-accent"
              >
                {site.phone}
              </a>
              <CopyButton value={site.phone} label="Copy phone number" />
            </div>
            <p className="mt-3 font-mono text-xs text-muted">
              {site.location}. Usually replies within a day
            </p>
          </div>

          <div>
            <p className="font-mono text-sm text-accent">{"// elsewhere"}</p>
            <ul className="mt-3 flex flex-col gap-1">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-lg px-2 py-2 text-muted transition-colors hover:text-accent"
                  >
                    <span className="grid size-9 place-items-center rounded-lg border border-line transition-colors group-hover:border-accent/50">
                      <s.icon className="size-4" />
                    </span>
                    <span className="text-sm">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Right — form */}
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
