"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { projectFilters, projects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

type Filter = (typeof projectFilters)[number];

export function ProjectsGrid() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const shown =
    filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <LayoutGroup>
      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Filter projects"
        className="flex flex-wrap justify-center gap-2"
      >
        {projectFilters.map((f) => {
          const on = f === filter;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setFilter(f)}
              className={cn(
                "relative rounded-[4px] px-4 py-2 text-sm transition-colors",
                on ? "text-accent" : "text-muted hover:text-fg",
              )}
            >
              {f}
              {on && (
                <motion.span
                  layoutId="filter-underline"
                  className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <motion.ul layout className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((project, i) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.9, rotateY: -25 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 25 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1000 }}
              className="h-full"
            >
              <ProjectCard project={project} onOpen={() => setSelected(project)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {shown.length === 0 && (
        <p className="mt-10 text-center text-muted">No projects with that tag yet.</p>
      )}

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </LayoutGroup>
  );
}
