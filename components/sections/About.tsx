import Image from "next/image";
import { MapPin } from "lucide-react";
import { about, site } from "@/data/portfolio";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        index="01"
        path="about"
        title="Building for the web, end to end."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
        {/* Avatar card */}
        <Reveal className="mx-auto w-full max-w-[300px] lg:mx-0">
          <div className="surface-card group overflow-hidden rounded-xl">
            <div className="flex items-center gap-2 border-b border-line bg-elevated/60 px-4 py-2.5">
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
                alt={`${site.name} — portrait`}
                width={480}
                height={480}
                unoptimized
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex items-center gap-2 border-t border-line px-4 py-2.5 font-mono text-xs text-muted">
              <MapPin className="size-3.5 text-accent" />
              {site.location}
            </div>
          </div>
        </Reveal>

        {/* Bio + stats */}
        <div className="flex flex-col">
          <RevealGroup className="flex flex-col gap-4" stagger={0.1}>
            {about.paragraphs.map((p, i) => (
              <RevealItem key={i}>
                <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
                  {p}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup
            className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4"
            stagger={0.08}
          >
            {about.stats.map((stat) => (
              <RevealItem key={stat.label} className="bg-surface p-5">
                <div className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                  <span className="text-accent">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs leading-snug text-muted">
                  {stat.label}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
