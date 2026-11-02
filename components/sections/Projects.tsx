import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";

export function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-gutter">
        <SectionHeading
          eyebrow="Projects"
          title="Featured projects"
          intro="Personal projects with public code or live demos. Pick a filter, or open any card for details."
        />
        <div className="mt-12">
          <ProjectsGrid />
        </div>
      </div>
    </section>
  );
}
