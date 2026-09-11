"use client";

import Image from "next/image";
import { ArrowUpRight, ExternalLink, Maximize2 } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { TiltCard } from "@/components/ui/TiltCard";
import { Tag } from "@/components/ui/Tag";

/* lucide has no brand Github mark — reuse the local one for the repo link. */
import { GithubIcon } from "@/components/icons/BrandIcons";

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const [a0, a1] = project.accent;
  return (
    <TiltCard className="group h-full rounded-xl" max={6}>
      <div className="surface-card flex h-full flex-col overflow-hidden rounded-xl">
        {/* Clickable cover + body opens the detail modal */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View details for ${project.title}`}
          className="group/btn block text-left outline-none"
        >
          {/* Real cover when the project has one, generated gradient otherwise */}
          <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
            {project.image ? (
              <>
                <Image
                  src={project.image}
                  alt={`${project.title} cover`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Scrim keeps the corner meta readable over a photo */}
                <div className="absolute inset-0 bg-linear-to-t from-bg/95 via-bg/20 to-bg/50" />
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${a0}2b, ${a1}14 55%, transparent)`,
                  }}
                />
                <div className="bg-grid absolute inset-0 opacity-20" />
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    background: `radial-gradient(340px circle at 78% 20%, ${a0}22, transparent 70%)`,
                  }}
                />
              </>
            )}
            {/* Corner meta */}
            <span className="absolute right-3 top-3 rounded-md border border-line bg-bg/50 px-1.5 py-0.5 font-mono text-[10px] text-muted backdrop-blur">
              {project.year}
            </span>
            <span className="absolute bottom-3 left-3 font-mono text-xs text-muted">
              ~/work/{project.slug}
            </span>
            {project.featured && (
              <span className="absolute left-3 top-3 rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                featured
              </span>
            )}
            {/* Expand hint on hover */}
            <span className="absolute right-3 bottom-3 inline-flex size-7 items-center justify-center rounded-md border border-line bg-bg/60 text-muted opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
              <Maximize2 className="size-3.5" />
            </span>
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight text-fg transition-colors group-hover:text-accent">
                {project.title}
              </h3>
              <ArrowUpRight className="size-4 shrink-0 text-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
              {project.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 4).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </button>

        {/* Footer links (outside the modal-open button) */}
        <div className="mt-auto flex items-center gap-4 border-t border-line px-5 py-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              <ExternalLink className="size-3.5" />
              live
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              <GithubIcon className="size-3.5" />
              code
            </a>
          )}
          <button
            type="button"
            onClick={onOpen}
            className="ml-auto font-mono text-xs text-faint transition-colors hover:text-accent"
          >
            details
          </button>
        </div>
      </div>
    </TiltCard>
  );
}
