/* ==================================================================
 *  PORTFOLIO CONTENT — single source of truth
 *  ------------------------------------------------------------------
 *  Edit THIS file to customise the whole site. Nothing else needs to
 *  be touched for copy, links, projects, skills, or experience.
 *
 *  Confidentiality: work done at Mavisoft is described only at a
 *  general engineering level. Do not add product names, internal
 *  numbers, service/API names, screenshots or code from that work.
 * ================================================================== */

import type { ComponentType, SVGProps } from "react";
import {
  Accessibility,
  ArrowLeftRight,
  Component,
  FileText,
  GitPullRequest,
  Gauge,
  KeyRound,
  Mail,
  ShieldCheck,
  TableProperties,
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
  /** Professional title, used in the page title and social card. */
  role: "Full-Stack Engineer",
  /** Core stack, shown under the title on the social card. */
  stack: "React · TypeScript · Next.js · Python",
  tagline:
    "Frontend-focused full-stack engineer. I build and improve enterprise web applications with React, TypeScript, Next.js and Python.",
  email: "nimasaghi.dev@gmail.com",
  phone: "+31 6 23 10 23 17",
  location: "Nieuw-Vennep, Netherlands",
  /** Replace /public/resume.pdf with your real CV (keep this path). */
  resumeUrl: "/resume.pdf",
  /** Production URL — used for SEO, Open Graph and the sitemap. Update after deploy. */
  url: "https://nima-saghi.vercel.app",
} as const;

/* ------------------------------------------------------------------ *
 * Hero                                                                *
 * ------------------------------------------------------------------ */
export const hero = {
  /** Orange speech tag above the name. */
  greeting: "Hello, I am",
  /** Big name line. */
  name: "Nima Saghi",
  /** Professional headline. `accent` is highlighted with the gradient. */
  headline: "Full-Stack Engineer focused on React, TypeScript & Python.",
  accent: "React, TypeScript & Python",
  /** Short supporting line under the headline. */
  intro:
    "I build and improve enterprise web applications at Mavisoft, combining interactive frontend development with practical backend engineering.",
  /** Set to false to hide the availability pill. */
  showAvailability: true,
  availability: "Open to frontend & full-stack roles · NL",
  ctas: {
    experience: { label: "View Experience", href: "#experience" },
    cv: { label: "Download CV", href: "/resume.pdf" },
    contact: { label: "Contact Me", href: "#contact" },
  },
} as const;

/* ------------------------------------------------------------------ *
 * Navigation — `id` must match each <section id="…">                  *
 * ------------------------------------------------------------------ */
export const nav = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------------ *
 * Professional experience                                             *
 * ------------------------------------------------------------------ */
export type Role = {
  title: string;
  /** Human-readable start / end shown on the page. */
  from: string;
  to: string;
  /** Machine-readable start / end (YYYY-MM) for <time>. Omit `end` if current. */
  start: string;
  end?: string;
  summary: string;
};

export type Employer = {
  company: string;
  location: string;
  /** Overall span with this employer. */
  period: string;
  about: string;
  /** Most recent role first. */
  roles: Role[];
  stack: string[];
};

export const employer: Employer = {
  company: "Mavisoft",
  location: "Rotterdam, Netherlands",
  period: "Nov 2025 – Present",
  about:
    "Mavisoft develops enterprise software that works with geospatial data and AI-assisted inspection.",
  roles: [
    {
      title: "Full-Stack Engineer",
      from: "May 2026",
      to: "Present",
      start: "2026-05",
      summary:
        "Work across the React and TypeScript frontend and Python backend services, including authentication, access control, reporting and performance.",
    },
    {
      title: "Frontend Developer Intern",
      from: "Nov 2025",
      to: "May 2026",
      start: "2025-11",
      end: "2026-05",
      summary:
        "Built and improved user interfaces with React, Next.js and TypeScript as part of the product team.",
    },
  ],
  stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Python", "gRPC", "PostgreSQL"],
};

/* ------------------------------------------------------------------ *
 * Selected engineering contributions (at Mavisoft)                    *
 * Keep these general: problem, approach, skills. No internal details. *
 * ------------------------------------------------------------------ */
export type Contribution = {
  area: string;
  icon: IconType;
  problem: string;
  contribution: string;
  skills: string[];
};

export const contributions: Contribution[] = [
  {
    area: "Frontend Performance",
    icon: Gauge,
    problem:
      "Some screens made unnecessary network requests, repeated calls and loaded images inefficiently.",
    contribution:
      "Investigated frontend performance, set up ways to measure it, improved image loading and removed redundant requests.",
    skills: ["React", "Next.js", "TypeScript", "Performance profiling", "Network optimization"],
  },
  {
    area: "Authentication & Sessions",
    icon: KeyRound,
    problem:
      "Enterprise applications need secure sign-in and reliable session handling.",
    contribution:
      "Implemented two-factor authentication workflows and trusted-device support, and improved session management.",
    skills: ["TypeScript", "Python", "Authentication", "TOTP", "Session management"],
  },
  {
    area: "Role-Based Access Control",
    icon: ShieldCheck,
    problem:
      "Different users and organisations need the right access restrictions.",
    contribution:
      "Implemented and improved role-based permission checks across frontend and backend services, and fixed authorization bugs.",
    skills: ["Python", "TypeScript", "RBAC", "Authorization", "Backend services"],
  },
  {
    area: "Dataset Interfaces",
    icon: TableProperties,
    problem:
      "Data-heavy interfaces must make loading, readiness, errors and available actions clear.",
    contribution:
      "Improved dataset exploration screens, simplified data-fetching responsibilities and made application states easier to understand and maintain.",
    skills: ["React", "TypeScript", "State management", "API integration", "Component design"],
  },
  {
    area: "Interactive UI & React Architecture",
    icon: Component,
    problem:
      "Complex interactive interfaces get hard to maintain when components take on too many responsibilities.",
    contribution:
      "Developed image-viewing interactions and refactored React components for clearer separation of concerns and state.",
    skills: ["React", "TypeScript", "Custom hooks", "Component architecture", "Refactoring"],
  },
  {
    area: "Reporting & Document Generation",
    icon: FileText,
    problem:
      "Generating reports from application data needs frontend requests and backend processing to work together.",
    contribution:
      "Contributed to a reporting workflow covering backend processing, document generation and the frontend report interactions.",
    skills: ["Python", "Backend services", "gRPC", "PDF generation", "Async processing"],
  },
];

/* ------------------------------------------------------------------ *
 * Education (shown in About)                                          *
 * ------------------------------------------------------------------ */
export const education = [
  {
    title: "Full-Stack Web Development",
    school: "HackYourFuture, Amsterdam",
    period: "2024 – 2025",
  },
  {
    title: "BSc Computer Software Engineering",
    school: "Azad University of Tehran",
    period: "2010 – 2014",
  },
] as const;

/* ------------------------------------------------------------------ *
 * About                                                               *
 * ------------------------------------------------------------------ */
export const about = {
  /** Portrait used in the hero. */
  avatar: "/nima.png",
  title: "Frontend at heart, growing across the stack.",
  /** Large opening line. `leadAccent` is highlighted in the accent colour. */
  lead: "I'm a software engineer based in the Netherlands, building enterprise web applications at Mavisoft. Frontend engineering is where I'm strongest.",
  leadAccent: "Frontend engineering",
  paragraphs: [
    "In my current role I also work on Python backend services, and I'm deliberately broadening my full-stack skills.",
    "I care about maintainable code and interfaces that are clear to use. Before Mavisoft I completed HackYourFuture's full-stack programme, working in Agile teams with code review and pair programming. I still prefer building software that way.",
  ],
  facts: [
    { label: "Based in", value: "Nieuw-Vennep, NL" },
    { label: "Languages", value: "English · Dutch · Farsi" },
  ],
} as const;

/* ------------------------------------------------------------------ *
 * Technical skills — grouped by category, no ratings                  *
 * ------------------------------------------------------------------ */
export type SkillGroup = {
  category: string;
  /**
   * `slug` links to a brand mark in TechIcons (shown in brand color);
   * `logo` is an official logo file under /public for brands that have
   * no single-colour mark; `icon` is a generic mark for concepts that
   * have no logo (REST, accessibility, code review).
   */
  items: { name: string; slug?: string; logo?: string; icon?: IconType }[];
};

export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "TypeScript", slug: "typescript" },
      { name: "JavaScript", slug: "javascript" },
      { name: "HTML", slug: "html5" },
      { name: "CSS", slug: "css" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
      { name: "Accessibility", icon: Accessibility },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Python", slug: "python" },
      { name: "Node.js", slug: "nodedotjs" },
      { name: "Express", slug: "express" },
      { name: "REST APIs", icon: ArrowLeftRight },
      { name: "gRPC", logo: "/logos/grpc.svg" },
    ],
  },
  {
    category: "Data",
    items: [
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "MongoDB", slug: "mongodb" },
      { name: "Redis", slug: "redis" },
    ],
  },
  {
    category: "Tools & Practices",
    items: [
      { name: "Git", slug: "git" },
      { name: "GitLab", slug: "gitlab" },
      { name: "Docker", slug: "docker" },
      { name: "Jest", slug: "jest" },
      { name: "Cypress", slug: "cypress" },
      { name: "CI/CD (GitHub Actions)", slug: "githubactions" },
      { name: "Code review", icon: GitPullRequest },
      { name: "Claude Code", slug: "claude" },
      { name: "Cursor", slug: "cursor" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Projects — public / personal work only                              *
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
    slug: "nomnom-food-app",
    title: "Nom Nom",
    summary: "Full-stack MERN food-ordering app with live order tracking.",
    description:
      "A MERN-stack food ordering application with JWT authentication, cart and checkout, live order tracking, Jest unit tests, Cypress end-to-end tests, and a GitHub Actions CI/CD pipeline.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Jest", "Cypress"],
    repoUrl: "https://github.com/Nimasaghi-dev/NOMNOM-Food-app",
    year: "2025",
    featured: true,
    accent: ["#e2b04a", "#4fd1c1"],
    image: "/projects/nomnom-food-app.png",
  },
  {
    slug: "mavisoft-website",
    title: "Mavisoft Website",
    summary: "Responsive corporate website built with Next.js and Tailwind CSS.",
    description:
      "A corporate website for Mavisoft, built from scratch with Next.js 15, React 19, TypeScript, Tailwind CSS v4 and Framer Motion. Responsive, with scroll animations and a contact form.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://mavisoft.vercel.app",
    repoUrl: "https://github.com/Nimasaghi-dev/Mavisoft",
    year: "2025",
    featured: true,
    accent: ["#4fd1c1", "#5b86e5"],
    image: "/projects/mavisoft-website.png",
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
  /** Coordinates of home base (Nieuw-Vennep, NL), shown above the headline. */
  eyebrow: "52.26° N · 4.63° E",
  title: "Open to frontend & full-stack roles",
  /** Part of the title set in italic with the accent gradient. */
  accent: "full-stack",
  label: "Contact me",
  href: "#contact",
} as const;

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
