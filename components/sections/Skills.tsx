import type { CSSProperties } from "react";
import Image from "next/image";
import { skills, type SkillGroup } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechIcon, techIcons } from "@/components/icons/TechIcons";

/** Brand colour for the hover glow. gRPC uses its logo's teal; generic icons use the accent. */
const GRPC_TEAL = "#2DA6B0";

type SkillItem = SkillGroup["items"][number];

function SkillLogo({ item }: { item: SkillItem }) {
  const brand = item.slug ? techIcons[item.slug] : undefined;
  if (brand)
    return <TechIcon slug={item.slug!} className="size-[22px]" style={{ color: brand.hex }} />;
  if (item.logo)
    return (
      <Image src={item.logo} alt="" width={28} height={13} unoptimized className="h-auto w-7" />
    );
  if (item.icon) return <item.icon className="size-[22px] text-accent" />;
  return null;
}

function brandColor(item: SkillItem) {
  if (item.slug && techIcons[item.slug]) return techIcons[item.slug].hex;
  if (item.logo) return GRPC_TEAL;
  return "var(--color-accent)";
}

/** Skills grouped by category: four open columns of logos, no self-ratings. */
export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-gutter">
        <SectionHeading
          eyebrow="Skills"
          title="Technical skills"
          intro="Tools I use in professional work and personal projects."
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group) => (
            <RevealItem key={group.category}>
              <h3 className="flex items-center gap-3 text-sm font-semibold tracking-wider text-secondary uppercase">
                <span aria-hidden className="h-px w-6 bg-secondary/60" />
                {group.category}
              </h3>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 lg:flex-col lg:items-start">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="skill-item"
                    style={{ "--brand": brandColor(item) } as CSSProperties}
                  >
                    <span className="inline-flex items-center gap-3 py-1.5 text-[15px] font-medium whitespace-nowrap text-fg">
                      <span
                        aria-hidden
                        className="skill-logo inline-flex h-6 w-7 flex-none items-center justify-center"
                      >
                        <SkillLogo item={item} />
                      </span>
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
