import { GraduationCap } from "lucide-react";
import { about, education } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";

/** Lead line with the accent phrase highlighted. */
function Lead() {
  const { lead, leadAccent } = about;
  const i = leadAccent ? lead.indexOf(leadAccent) : -1;
  if (i === -1) return <>{lead}</>;
  return (
    <>
      {lead.slice(0, i)}
      <span className="text-accent-bright">{leadAccent}</span>
      {lead.slice(i + leadAccent.length)}
    </>
  );
}

export function About() {
  return (
    <section id="about" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 px-gutter lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        {/* Copy */}
        <div>
          <Reveal>
            <p className="text-sm font-medium tracking-[0.2em] text-secondary uppercase">
              About me
            </p>
            <h2 className="mt-4 max-w-[22ch] text-balance text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
              {about.title}
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-6 max-w-prose text-pretty text-lg leading-relaxed text-fg/90">
              <Lead />
            </p>
            {about.paragraphs.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="mt-4 max-w-prose text-pretty leading-relaxed text-muted"
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        {/* Facts + education */}
        <Reveal delay={0.1} className="card p-6 sm:p-8">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs tracking-wider text-faint uppercase">{f.label}</dt>
                <dd className="mt-1 text-sm font-medium text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-8 flex items-center gap-2 border-t border-line-soft pt-6 text-xs tracking-wider text-faint uppercase">
            <GraduationCap aria-hidden className="size-4" />
            Education
          </h3>
          <ul className="mt-4 flex flex-col gap-4">
            {education.map((e) => (
              <li key={e.title}>
                <p className="text-sm font-medium text-fg">{e.title}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {e.school} · {e.period}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
