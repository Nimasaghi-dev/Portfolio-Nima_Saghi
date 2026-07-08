import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";

export function Projects() {
  return (
    <Section id="work">
      <SectionHeading
        index="03"
        path="work"
        title="Selected work."
        description="A handful of things I've designed and shipped. Click any card for the full story."
      />
      <div className="mt-14">
        <ProjectsGrid />
      </div>
    </Section>
  );
}
