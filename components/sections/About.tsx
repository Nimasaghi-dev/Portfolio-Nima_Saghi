import Image from "next/image";
import { about, site } from "@/data/portfolio";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Splits the lead around `leadAccent` so that word can take the accent colour. */
function Lead() {
  const [before, after] = about.lead.split(about.leadAccent);
  return (
    <p className="text-pretty text-xl leading-snug text-fg sm:text-2xl">
      {before}
      <span className="text-accent">{about.leadAccent}</span>
      {after}
    </p>
  );
}

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        index="01"
        path="about"
        title="From the screen to the service."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
        {/* Portrait */}
        <Reveal className="mx-auto w-full max-w-[300px] lg:mx-0">
          <div className="liquid-glass overflow-hidden rounded-xl">
            <div className="flex items-center gap-2 liquid-glass border-b border-line px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-muted">
                portrait.jpg
              </span>
            </div>
            <div className="relative overflow-hidden">
              <Image
                src={about.avatar}
                alt={`${site.name} portrait`}
                width={480}
                height={480}
                unoptimized
                className="h-auto w-full"
              />
            </div>
          </div>
        </Reveal>

        {/* Bio */}
        <div className="flex max-w-[65ch] flex-col">
          <RevealGroup className="flex flex-col gap-5" stagger={0.1}>
            <RevealItem>
              <Lead />
            </RevealItem>
            {about.paragraphs.map((p, i) => (
              <RevealItem key={i}>
                <p className="text-pretty text-base leading-relaxed text-muted">
                  {p}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.2}>
            <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line-soft pt-6 sm:grid-cols-3">
              {about.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-faint">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-fg">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
