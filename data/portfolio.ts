/* ==================================================================
 *  PORTFOLIO CONTENT — single source of truth
 *  ------------------------------------------------------------------
 *  Edit THIS file to customise the whole site. Nothing else needs to
 *  be touched for copy, links, projects, skills, or experience.
 * ================================================================== */

import type { ComponentType, SVGProps } from "react";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";

/** Any icon that renders an SVG accepting a className (lucide or brand). */
export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/* ------------------------------------------------------------------ *
 * Site / identity                                                     *
 * ------------------------------------------------------------------ */
export const site = {
  name: "Nima Saghi",
  /** First name used in the terminal prompt logo. */
  handle: "nima",
  /** Cycled by the hero typewriter. Keep them short. */
  roles: [
    "Frontend Engineer",
    "Full-Stack Engineer",
    "React Developer",
    "TypeScript Engineer",
  ],
  tagline:
    "I build production-grade web apps with React, TypeScript, and service-oriented backends — clean, testable, and accessible.",
  email: "nimasaghi.dev@gmail.com",
  phone: "+31 6 23 10 23 17",
  location: "Nieuw-Vennep, Netherlands",
  /** Replace /public/resume.pdf with your real CV (keep this path). */
  resumeUrl: "/resume.pdf",
  /** Production URL — used for SEO, Open Graph and the sitemap. Update after deploy. */
  url: "https://nima-saghi.vercel.app",
} as const;

/* ------------------------------------------------------------------ *
 * Navigation — `id` must match each <section id="…">                  *
 * ------------------------------------------------------------------ */
export const nav = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "work", label: "work" },
  { id: "experience", label: "experience" },
  { id: "contact", label: "contact" },
] as const;

/* ------------------------------------------------------------------ *
 * About                                                               *
 * ------------------------------------------------------------------ */
export const about = {
  /** Replace with a real photo in /public (see README). */
  avatar: "/avatar.svg",
  paragraphs: [
    "I'm a frontend engineer with a full-stack mindset. I build production-grade web apps with React, TypeScript, and service-oriented backends — right now I'm shipping Spectra, a multi-tenant geospatial AI SaaS, at MaviSoft.",
    "I care about clean, testable, maintainable code and treat testability as a design constraint, not an afterthought. I'm comfortable in distributed, microservice-based architectures and I'm growing into cloud-native and event-driven systems.",
    "I graduated HackYourFuture's intensive full-stack program and hold a BSc in Computer Software Engineering. Fluent in English, working proficiency in Dutch, native Farsi. I use AI-assisted tooling (Claude Code, Cursor) daily — with critical judgment, not blind trust.",
  ],
  stats: [
    { value: 12, suffix: "+", label: "UI panels shipped on production SaaS" },
    { value: 3, suffix: "", label: "production apps delivered" },
    { value: 15, suffix: "+", label: "technologies in daily use" },
    { value: 3, suffix: "", label: "languages spoken · EN / NL / FA" },
  ],
} as const;

/* ------------------------------------------------------------------ *
 * Skills — grouped by category                                        *
 * ------------------------------------------------------------------ */
export type SkillGroup = {
  category: string;
  /**
   * `note` shows on hover. `slug` links to a brand mark in TechIcons; items
   * without one render as a text pill (concepts, not products).
   */
  items: { name: string; note?: string; slug?: string }[];
};

export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      { name: "React", note: "Hooks, RSC, Suspense", slug: "react" },
      { name: "Next.js", note: "App Router · SSR/ISR", slug: "nextdotjs" },
      { name: "TypeScript", note: "Everyday driver", slug: "typescript" },
      { name: "Tailwind CSS", note: "Design systems", slug: "tailwindcss" },
      { name: "JavaScript", note: "ES2022+", slug: "javascript" },
      { name: "Accessibility", note: "WCAG-minded" },
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      { name: "Node.js", note: "Runtime & tooling", slug: "nodedotjs" },
      { name: "Express", note: "REST APIs", slug: "express" },
      { name: "Python", note: "FastAPI services", slug: "python" },
      { name: "gRPC", note: "Typed service contracts" },
      { name: "REST", note: "API-first design" },
      { name: "PostgreSQL", note: "PostGIS geospatial", slug: "postgresql" },
    ],
  },
  {
    category: "Testing & Security",
    items: [
      { name: "Jest", note: "Unit & integration", slug: "jest" },
      { name: "Cypress", note: "End-to-end", slug: "cypress" },
      { name: "RBAC", note: "Authorization patterns" },
      { name: "OWASP", note: "Top 10 awareness", slug: "owasp" },
      { name: "Input validation", note: "Defense in depth" },
    ],
  },
  {
    category: "Cloud & Tooling",
    items: [
      { name: "Docker", note: "Containers", slug: "docker" },
      { name: "Redis", note: "Cache & pub/sub", slug: "redis" },
      { name: "MinIO", note: "S3-compatible storage", slug: "minio" },
      { name: "AWS", note: "Lambda · learning" },
      { name: "Git / GitLab", note: "Reviews & CI", slug: "git" },
      { name: "Claude Code", note: "AI-assisted dev", slug: "claude" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Projects                                                            *
 * ------------------------------------------------------------------ */
export type Project = {
  slug: string;
  title: string;
  /** Short line for the card. */
  summary: string;
  /** Longer copy shown in the detail modal. */
  description: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  year: string;
  featured?: boolean;
  /**
   * Optional cover image in /public/projects. When omitted, a
   * generated gradient cover is used. See README to add real images.
   */
  image?: string;
  /** Two accent hex stops for the generated cover. */
  accent: [string, string];
};

export const projects: Project[] = [
  {
    slug: "mavisoft-website",
    title: "MaviSoft Website",
    summary:
      "Company production site — sole engineer from design handoff to deploy.",
    description:
      "The MaviSoft company website, built and deployed solo from design handoff to production. Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Framer Motion — fully responsive, performant, and accessible.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://mavisoft.vercel.app",
    repoUrl: "https://github.com/Nimasaghi-dev/Mavisoft",
    year: "2025",
    featured: true,
    accent: ["#22c55e", "#3b82f6"],
  },
  {
    slug: "nomnom-food-app",
    title: "Nom Nom",
    summary: "Full-stack MERN food-ordering app with live order tracking.",
    description:
      "A MERN-stack food ordering application with JWT authentication, live order tracking, Jest unit tests, Cypress end-to-end tests, and a GitHub Actions CI/CD pipeline — built with a focus on clean architecture and maintainability.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Jest", "Cypress"],
    repoUrl: "https://github.com/Nimasaghi-dev/NOMNOM-Food-app",
    year: "2025",
    accent: ["#f59e0b", "#3b82f6"],
  },
  {
    slug: "cocktail-explorer",
    title: "Cocktail Explorer",
    summary: "Recipe search app consuming a public cocktails REST API.",
    description:
      "A responsive cocktail search app that consumes a public REST API — live search, detail views, and careful loading/empty states, with an emphasis on clean CSS and UX.",
    tags: ["React", "JavaScript", "REST API", "CSS"],
    repoUrl: "https://github.com/Nimasaghi-dev/cocktail-explorer",
    year: "2024",
    accent: ["#14b8a6", "#3b82f6"],
  },
];

/* ------------------------------------------------------------------ *
 * Experience / timeline                                               *
 * ------------------------------------------------------------------ */
export type ExperienceEntry = {
  /** Splits the timeline into Work vs Education groups. */
  kind: "work" | "education";
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experience: ExperienceEntry[] = [
  {
    kind: "work",
    role: "Frontend Engineer",
    company: "MaviSoft",
    period: "11/2025 — Present",
    summary:
      "Primary frontend engineer on Spectra, a multi-tenant geospatial AI SaaS, in a small cross-functional team.",
    highlights: [
      "Own frontend modules end to end across 12 UI panels; built a TypeScript constants system as the single source of truth for layout, eliminating a class of cross-component bugs.",
      "Integrate multiple Python gRPC microservices (auth, datasets, reports, AI pipelines) with typed contracts and resilient loading, error, and empty UI states.",
      "Built a streaming report pipeline (React → gRPC → WeasyPrint PDF → MinIO → presigned URL) and fixed a production expiry bug by generating URLs at read-time.",
      "Implemented application-level RBAC with a usePermissions hook and a <PermissionGate> component across every UI surface.",
    ],
    stack: ["React", "TypeScript", "Next.js", "gRPC", "Redis", "PostGIS"],
  },
  {
    kind: "education",
    role: "Full-Stack Web Development Trainee",
    company: "HackYourFuture",
    period: "06/2024 — 06/2025",
    summary:
      "Intensive 9-month program building full-stack applications in Agile teams.",
    highlights: [
      "Delivered full-stack apps using Git-based workflows, formal code reviews, and pair programming.",
      "Wrote unit and integration tests with Jest and end-to-end tests with Cypress — treating testability as a design constraint.",
      "Practiced the collaborative, feedback-driven engineering culture central to professional teams.",
    ],
    stack: ["React", "Node.js", "Express", "Jest", "Cypress"],
  },
  {
    kind: "education",
    role: "BSc, Computer Software Engineering",
    company: "Azad University of Tehran",
    period: "2010 — 2014",
    summary:
      "Bachelor's degree in Computer Software Engineering.",
    highlights: [
      "Foundations in algorithms, data structures, and software engineering principles.",
    ],
    stack: [],
  },
];

/* ------------------------------------------------------------------ *
 * Socials                                                             *
 * ------------------------------------------------------------------ */
export type Social = { label: string; href: string; icon: IconType };

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/Nimasaghi-dev", icon: GithubIcon },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/nima-saghi-dev",
    icon: LinkedinIcon,
  },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
];
