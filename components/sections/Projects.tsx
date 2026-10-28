import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";

export function Projects() {
  return (
    <section id="work" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-gutter">
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected work"
          intro="Things I've designed, built and shipped. Pick a filter, or open any card for the full story."
        />
        <div className="mt-12">
          <ProjectsGrid />
        </div>
      </div>
    </section>
  );
}
