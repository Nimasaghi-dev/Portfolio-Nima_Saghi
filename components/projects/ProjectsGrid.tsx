"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/portfolio";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

export function ProjectsGrid() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <RevealGroup
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.09}
      >
        {projects.map((project) => (
          <RevealItem key={project.slug} className="h-full">
            <ProjectCard project={project} onOpen={() => setSelected(project)} />
          </RevealItem>
        ))}
      </RevealGroup>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
