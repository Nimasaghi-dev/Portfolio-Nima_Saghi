# Nima Saghi Portfolio

Personal developer portfolio. Dark, terminal-inspired, content-driven.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

## Run

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Content

All copy lives in one file: [data/portfolio.ts](data/portfolio.ts). Design tokens (colors, fonts) live in the `@theme` block of [app/globals.css](app/globals.css).

## Deploy

Vercel-ready. Import the repo at [vercel.com/new](https://vercel.com/new) and set `site.url` in [data/portfolio.ts](data/portfolio.ts) to your domain so SEO and Open Graph use the right URL.
