"use client";

import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { TiltCard } from "@/components/ui/TiltCard";
import { GithubIcon } from "@/components/icons/BrandIcons";

/**
 * Grayscale cover that blooms into color on hover while an orange panel
 * slides up with the title, as in the reference's highlighted tile.
 */
export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const [a0, a1] = project.accent;
  return (
    <TiltCard className="group h-full rounded-[10px]" max={7}>
      <article className="relative flex h-full flex-col overflow-hidden rounded-[10px] border border-line-soft bg-surface">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View details for ${project.title}`}
          className="relative block aspect-[4/3] overflow-hidden text-left outline-none"
        >
          {project.image ? (
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-focus-within:grayscale-0"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `linear-gradient(135deg, ${a0}, ${a1})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />

          {/* Orange reveal panel */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-[calc(100%-4.25rem)] flex-col bg-accent/95 p-5 text-accent-fg backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-within:translate-y-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="truncate text-lg font-semibold">{project.title}</h3>
              <span className="inline-flex size-8 flex-none items-center justify-center rounded-full bg-accent-fg text-accent transition-transform duration-500 group-hover:rotate-90">
                <Plus aria-hidden className="size-4" />
              </span>
            </div>
            <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <p className="mt-2 text-sm leading-relaxed text-accent-fg/80">{project.summary}</p>
              <p className="mt-3 text-xs font-medium tracking-wider uppercase text-accent-fg/70">
                {project.tags.slice(0, 3).join(" · ")}
              </p>
            </div>
          </div>
        </button>

        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <span className="text-xs tracking-wider text-faint uppercase">{project.year}</span>
          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source on GitHub`}
                className="inline-flex size-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <GithubIcon className="size-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live site`}
                className="inline-flex size-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
