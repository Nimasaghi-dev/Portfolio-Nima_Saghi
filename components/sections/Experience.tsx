import { Briefcase, MapPin } from "lucide-react";
import { contributions, employer } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";

/** Small uppercase label used inside cards. */
function Label({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.18em] text-faint uppercase">
      {children}
    </p>
  );
}

/** One employer, its roles as a short timeline (most recent first). */
function EmployerCard() {
  return (
    <Reveal>
      <article className="card grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div>
          <div className="flex items-center gap-4">
            <span className="inline-flex size-12 flex-none items-center justify-center rounded-md bg-accent/10 text-accent">
              <Briefcase aria-hidden className="size-5" />
            </span>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-fg">
                {employer.company}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                <MapPin aria-hidden className="size-3.5" />
                {employer.location}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-secondary">{employer.period}</p>
          <p className="mt-3 text-pretty leading-relaxed text-muted">{employer.about}</p>
          <ul aria-label="Technologies used" className="mt-6 flex flex-wrap gap-1.5">
            {employer.stack.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </div>

        <ol aria-label={`Roles at ${employer.company}`} className="relative flex flex-col gap-8">
          {employer.roles.map((role, i) => {
            const current = !role.end;
            return (
              <li key={role.title} className="relative pl-8">
                {/* Timeline rail + node */}
                {i < employer.roles.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[5px] top-4 -bottom-8 w-px bg-line"
                  />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-1.5 size-[11px] rounded-full border-2",
                    current ? "border-accent bg-accent" : "border-faint bg-surface",
                  )}
                />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h4 className="text-lg font-semibold text-fg">{role.title}</h4>
                  {current && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent-bright">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">
                  <time dateTime={role.start}>{role.from}</time>
                  {" – "}
                  {role.end ? <time dateTime={role.end}>{role.to}</time> : role.to}
                </p>
                <p className="mt-3 max-w-prose text-pretty text-sm leading-relaxed text-fg/85">
                  {role.summary}
                </p>
              </li>
            );
          })}
        </ol>
      </article>
    </Reveal>
  );
}

/** Compact, text-first summaries of work at the employer. Not a gallery. */
function Contributions() {
  return (
    <div id="contributions" className="mt-20 scroll-mt-24">
      <Reveal className="flex flex-col gap-3">
        <p className="text-sm font-medium tracking-[0.2em] text-secondary uppercase">
          At {employer.company}
        </p>
        <h3 className="text-balance text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Selected engineering contributions
        </h3>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted">
          A general summary of areas I&apos;ve worked on. The product is proprietary, so
          these describe the problem and my approach rather than internal details.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {contributions.map((c) => (
          <RevealItem key={c.area} className="h-full">
            <article className="card flex h-full flex-col p-6 transition-colors duration-300 hover:border-line">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-elevated text-accent">
                  <c.icon aria-hidden className="size-[18px]" />
                </span>
                <h4 className="text-base font-semibold leading-snug text-fg">{c.area}</h4>
              </div>

              <div className="mt-5">
                <Label>Problem</Label>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted">
                  {c.problem}
                </p>
              </div>

              <div className="mt-4">
                <Label>What I did</Label>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-fg/90">
                  {c.contribution}
                </p>
              </div>

              <ul aria-label="Skills" className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {c.skills.map((s) => (
                  <li key={s}>
                    <Tag className="px-2 py-0.5 text-[11px]">{s}</Tag>
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-gutter">
        <SectionHeading
          eyebrow="Experience"
          title="Professional experience"
          intro="Frontend-focused full-stack engineer, working on enterprise software with React, TypeScript and Python."
        />
        <div className="mt-14">
          <EmployerCard />
        </div>
        <Contributions />
      </div>
    </section>
  );
}
