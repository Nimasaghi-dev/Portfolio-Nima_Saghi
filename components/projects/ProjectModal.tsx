"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, ExternalLink } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { GithubIcon } from "@/components/icons/BrandIcons";
import { Tag } from "@/components/ui/Tag";
import { useBodyScrollLock } from "@/lib/hooks";

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useBodyScrollLock(Boolean(project));

  useEffect(() => {
    if (!project) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            variants={{
              hidden: { opacity: 0, y: 32, scale: 0.98 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="surface-card relative z-10 flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl"
          >
            {/* Cover */}
            <div className="relative aspect-[2/1] shrink-0 overflow-hidden border-b border-line">
              {project.image ? (
                <>
                  <Image
                    src={project.image}
                    alt={`${project.title} cover`}
                    fill
                    sizes="(max-width: 672px) 100vw, 672px"
                    className="object-cover"
                  />
                  {/* Scrim keeps the caption and close button readable */}
                  <div className="absolute inset-0 bg-linear-to-t from-bg/95 via-bg/20 to-bg/50" />
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${project.accent[0]}33, ${project.accent[1]}15 55%, transparent)`,
                    }}
                  />
                  <div className="bg-grid absolute inset-0 opacity-20" />
                </>
              )}
              <span className="absolute bottom-3 left-4 font-mono text-xs text-muted">
                ~/work/{project.slug} / {project.year}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-lg border border-line bg-bg/60 text-fg backdrop-blur transition-colors hover:border-accent/60 hover:text-accent"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 sm:p-8">
              <h3
                id="project-modal-title"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                {project.title}
              </h3>
              <p className="mt-4 text-pretty leading-relaxed text-muted">
                {project.description}
              </p>

              <div className="mt-6">
                <span className="font-mono text-xs text-faint">{"// stack"}</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-bright"
                  >
                    <ExternalLink className="size-4" />
                    Visit live site
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface/40 px-4 py-2.5 text-sm text-fg transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    <GithubIcon className="size-4" />
                    View source
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
