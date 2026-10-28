/* ==================================================================
 *  PORTFOLIO CONTENT — single source of truth
 *  ------------------------------------------------------------------
 *  Edit THIS file to customise the whole site. Nothing else needs to
 *  be touched for copy, links, projects, skills, or experience.
 * ================================================================== */

import type { ComponentType, SVGProps } from "react";
import {
  Accessibility,
  ArrowLeftRight,
  CheckCheck,
  Code2,
  FlaskConical,
  Layers,
  Mail,
  Network,
  ShieldCheck,
} from "lucide-react";
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
    "I build production-grade web apps with React, TypeScript, and service-oriented backends. Clean, testable, and accessible.",
  email: "nimasaghi.dev@gmail.com",
  phone: "+31 6 23 10 23 17",
  location: "Nieuw-Vennep, Netherlands",
  /** Replace /public/resume.pdf with your real CV (keep this path). */
  resumeUrl: "/resume.pdf",
  /** Production URL — used for SEO, Open Graph and the sitemap. Update after deploy. */
  url: "https://nima-saghi.vercel.app",
} as const;

/* ------------------------------------------------------------------ *
 * Hero — every string in the brick-wall hero                          *
 * ------------------------------------------------------------------ */
export const hero = {
  /** Orange speech tag above the name. */
  greeting: "Hello, I am",
  /** Big name line. */
  name: "Nima Saghi",
  /** One-liner under the name. `accent` is highlighted in orange. */
  subtitle: "Frontend & Full-Stack Engineer building interfaces for maps that think.",
  accent: "maps that think",
  /** Set to false to hide the availability pill. */
  showAvailability: true,
  availability: "Open to frontend & full-stack roles · NL",
  primaryCta: { label: "Download CV", href: "/resume.pdf" },
  secondaryCta: { label: "My Work", href: "#work" },
} as const;

/* ------------------------------------------------------------------ *
 * Navigation — `id` must match each <section id="…">                  *
 * ------------------------------------------------------------------ */
export const nav = [
  { id: "about", label: "About Me" },
  { id: "services", label: "Services" },
  { id: "work", label: "Portfolio" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------------ *
 * About                                                               *
 * ------------------------------------------------------------------ */
export const about = {
  /** Replace with a real photo in /public (see README). */
  avatar: "/nima.png",
  /** Section title next to the code window. */
  title: "From messy data to interfaces that feel simple.",
  /** Badge pinned to the code window. */
  badge: { value: "12", label: "UI panels owned on Spectra" },
  /**
   * Bars under the bio. Self-rated, 0–100 — edit to taste, or empty the
   * array to hide the bars.
   */
  levels: [
    { name: "React / Next.js", level: 90 },
    { name: "TypeScript", level: 88 },
    { name: "Node.js / APIs", level: 75 },
    { name: "Testing (Jest, Cypress)", level: 80 },
  ],
  /** Large, bright opening line. `leadAccent` is highlighted in the accent colour. */
  lead: "I like frontend work where the data is messy, the services are many, and the interface still has to be easy to use.",
  leadAccent: "easy to use",
  /** Supporting paragraphs, rendered smaller and muted under the lead. */
  paragraphs: [
    "On Spectra I own 12 UI panels end to end: typed contracts for Python gRPC services, permission-aware UI on every surface, and a report pipeline that streams from React to PDF. Loading, error, and empty states are part of the feature, not an afterthought.",
    "I treat testability as a design constraint, a habit from HackYourFuture, where we shipped in Agile teams with code review, pair programming, Jest, and Cypress. Next, I'm growing into cloud-native and event-driven systems. I use Claude Code and Cursor daily and review their output like any other pull request.",
  ],
  /** Short facts shown in a row under the bio. */
  facts: [
    { label: "Based in", value: "Nieuw-Vennep, NL" },
    { label: "Education", value: "BSc + HackYourFuture" },
    { label: "Languages", value: "Farsi · English · Dutch" },
  ],
} as const;

/* ------------------------------------------------------------------ *
 * Services — "What I do" grid. The first card is highlighted.         *
 * ------------------------------------------------------------------ */
export type Service = { title: string; body: string; icon: IconType };

export const services: Service[] = [
  {
    title: "Frontend Engineering",
    body: "React and Next.js apps with typed state, solid loading / error / empty states, and UI that stays fast.",
    icon: Code2,
  },
  {
    title: "Full-Stack Apps",
    body: "Node.js and Express services, MongoDB or PostgreSQL, wired end to end with auth and CI.",
    icon: Layers,
  },
  {
    title: "API & gRPC Integration",
    body: "Typed contracts for REST and gRPC microservices, so the frontend and backend never drift apart.",
    icon: Network,
  },
  {
    title: "Testing & Quality",
    body: "Unit and integration tests with Jest, end-to-end flows with Cypress, reviews on every change.",
    icon: FlaskConical,
  },
  {
    title: "Access Control",
    body: "Permission-aware UI with RBAC hooks and gates on every surface, backed by input validation.",
    icon: ShieldCheck,
  },
  {
    title: "Accessible UI",
    body: "Keyboard-friendly, screen-reader-aware interfaces that respect motion and contrast settings.",
    icon: Accessibility,
  },
];

/* ------------------------------------------------------------------ *
 * Stats row. `value` counts up on scroll; `highlight` fills orange.  *
 * ------------------------------------------------------------------ */
export const stats: { value: number; suffix?: string; label: string; highlight?: boolean }[] = [
  { value: 12, label: "UI panels owned" },
  { value: 4, label: "gRPC services integrated", highlight: true },
  { value: 3, label: "Projects shipped" },
  { value: 20, suffix: "+", label: "Technologies" },
];

/* ------------------------------------------------------------------ *
 * Skills — grouped by category                                        *
 * ------------------------------------------------------------------ */
export type SkillGroup = {
  category: string;
  /**
   * `note` shows on hover. `slug` links to a brand mark in TechIcons (shown in
   * brand color); `icon` is a generic mark for concepts (shown in the accent
   * color). Items with neither render as a text label.
   */
  items: { name: string; note?: string; slug?: string; icon?: IconType }[];
};

export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      { name: "React", note: "Hooks, RSC, Suspense", slug: "react" },
      { name: "Next.js", note: "App Router, SSR/ISR", slug: "nextdotjs" },
      { name: "TypeScript", note: "Everyday driver", slug: "typescript" },
      { name: "Tailwind CSS", note: "Design systems", slug: "tailwindcss" },
      { name: "JavaScript", note: "ES2022+", slug: "javascript" },
      { name: "Accessibility", note: "WCAG-minded", icon: Accessibility },
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      { name: "Node.js", note: "Runtime & tooling", slug: "nodedotjs" },
      { name: "Express", note: "REST APIs", slug: "express" },
      { name: "Python", note: "FastAPI services", slug: "python" },
      { name: "gRPC", note: "Typed service contracts", icon: Network },
      { name: "REST", note: "API-first design", icon: ArrowLeftRight },
      { name: "PostgreSQL", note: "PostGIS geospatial", slug: "postgresql" },
    ],
  },
  {
    category: "Testing & Security",
    items: [
      { name: "Jest", note: "Unit & integration", slug: "jest" },
      { name: "Cypress", note: "End-to-end", slug: "cypress" },
      { name: "RBAC", note: "Authorization patterns", icon: ShieldCheck },
      { name: "OWASP", note: "Top 10 awareness", slug: "owasp" },
      { name: "Input validation", note: "Defense in depth", icon: CheckCheck },
    ],
  },
  {
    category: "Cloud & Tooling",
    items: [
      { name: "Docker", note: "Containers", slug: "docker" },
      { name: "Redis", note: "Cache & pub/sub", slug: "redis" },
      { name: "MinIO", note: "S3-compatible storage", slug: "minio" },
      // { name: "AWS", note: "Lambda, learning" },
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
   * Optional cover image, as a path under /public — e.g. a file at
   * public/projects/foo.png is referenced as "/projects/foo.png".
   * Cards crop it to 16:10 and the modal to 2:1, so a 16:10 source
   * works for both. Omit it to keep the generated gradient cover.
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
      "Company production site, sole engineer from design handoff to deploy.",
    description:
      "The MaviSoft company website, built and deployed solo from design handoff to production. Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Framer Motion. Fully responsive, performant, and accessible.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://mavisoft.vercel.app",
    repoUrl: "https://github.com/Nimasaghi-dev/Mavisoft",
    year: "2025",
    featured: true,
    accent: ["#4fd1c1", "#5b86e5"],
    image: "/projects/mavisoft-website.png",
  },
  {
    slug: "nomnom-food-app",
    title: "Nom Nom",
    summary: "Full-stack MERN food-ordering app with live order tracking.",
    description:
      "A MERN-stack food ordering application with JWT authentication, live order tracking, Jest unit tests, Cypress end-to-end tests, and a GitHub Actions CI/CD pipeline, built with a focus on clean architecture and maintainability.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Jest", "Cypress"],
    repoUrl: "https://github.com/Nimasaghi-dev/NOMNOM-Food-app",
    year: "2025",
    accent: ["#e2b04a", "#4fd1c1"],
    image: "/projects/nomnom-food-app.png",
  },
  {
    slug: "cocktail-explorer",
    title: "Cocktail Explorer",
    summary: "Recipe search app consuming a public cocktails REST API.",
    description:
      "A responsive cocktail search app that consumes a public REST API: live search, detail views, and careful loading/empty states, with an emphasis on clean CSS and UX.",
    tags: ["React", "JavaScript", "REST API", "CSS"],
    repoUrl: "https://github.com/Nimasaghi-dev/cocktail-explorer",
    year: "2024",
    accent: ["#5b86e5", "#4fd1c1"],
    image: "/projects/cocktail-explorer.png",
  },
];

/** Portfolio filter tabs. Each matches projects whose `tags` include it. */
export const projectFilters = ["All", "Next.js", "React", "Node.js", "REST API"] as const;

/* ------------------------------------------------------------------ *
 * Call-to-action band before the contact section                      *
 * ------------------------------------------------------------------ */
export const cta = {
  eyebrow: "Have a role or project in mind?",
  title: "I'm available for frontend & full-stack work",
  label: "Hire Me",
  href: "#contact",
} as const;

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
    period: "11/2025 - Present",
    summary:
      "Primary frontend engineer on Spectra, a multi-tenant geospatial AI SaaS, in a small cross-functional team.",
    highlights: [
      "Own frontend modules end to end across 12 UI panels; built a TypeScript constants system as the single source of truth for layout, eliminating a class of cross-component bugs.",
      "Integrate multiple Python gRPC microservices (auth, datasets, reports, AI pipelines) with typed contracts and resilient loading, error, and empty UI states.",
      "Built a streaming report pipeline (React to gRPC to WeasyPrint PDF to MinIO to presigned URL) and fixed a production expiry bug by generating URLs at read-time.",
      "Implemented application-level RBAC with a usePermissions hook and a <PermissionGate> component across every UI surface.",
    ],
    stack: ["React", "TypeScript", "Next.js", "gRPC", "Redis", "PostGIS"],
  },
  {
    kind: "education",
    role: "Full-Stack Web Development Trainee",
    company: "HackYourFuture",
    period: "06/2024 - 06/2025",
    summary:
      "Intensive 9-month program building full-stack applications in Agile teams.",
    highlights: [
      "Delivered full-stack apps using Git-based workflows, formal code reviews, and pair programming.",
      "Wrote unit and integration tests with Jest and end-to-end tests with Cypress, treating testability as a design constraint.",
      "Practiced the collaborative, feedback-driven engineering culture central to professional teams.",
    ],
    stack: ["React", "Node.js", "Express", "Jest", "Cypress"],
  },
  {
    kind: "education",
    role: "BSc, Computer Software Engineering",
    company: "Azad University of Tehran",
    period: "2010 - 2014",
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
/** `color` is the brand color its icon renders in. */
export type Social = {
  label: string;
  href: string;
  icon: IconType;
  color: string;
};

export const socials: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/Nimasaghi-dev",
    icon: GithubIcon,
    color: "#FFFFFF",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/nima-saghi-dev",
    icon: LinkedinIcon,
    color: "#0A66C2",
  },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail, color: "#EA4335" },
];
