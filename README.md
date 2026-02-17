# stack-rx

Research directory for bioactive peptides. Browse, compare, and get recommendations.

## Pages

- `/` — Filterable directory of 22 peptides with stats, categories, and research status
- `/peptide/:id` — Detail page per peptide (stats, benefits, properties, sources)
- `/quiz` — Recommendation quiz (4 questions, email-gated results, server-side scoring)
- `/calculator` — Dosing calculator with reconstitution, titration chart, syringe visual
- `/blog` — Community highlights from r/peptides, r/biohackers, r/retatrutide

## Stack

- **React 19** + **TypeScript** + **Vite**
- **react-router-dom v7** — BrowserRouter (no hash)
- **react-helmet-async** — Per-page SEO/OG meta tags
- **recharts** — Titration chart in calculator
- **satori** + **@resvg/resvg-js** — Build-time OG image generation (25 PNGs)
- **Vercel** — Hosting + serverless functions (`api/subscribe.js`)

## SEO

Every page gets: `<title>`, `<meta description>`, OG tags, Twitter Card, canonical URL, and JSON-LD structured data. All routes are pre-rendered to static HTML at build time. Sitemap and robots.txt are auto-generated.

## Build

```
npm run dev              # Dev server
npm run build            # Full pipeline: OG images → Vite build → prerender → sitemap
npm run build:quick      # Vite build only (skip OG/prerender)
npm run generate:og      # Regenerate OG images
```

## Deploy

Vercel. Set `VITE_BASE_URL` env var to your domain. The `api/` directory is auto-detected as serverless functions.

## Quiz email gate

Scoring runs server-side in `api/subscribe.js`. Results are not sent to the client until after name + email submission. The blurred preview is decorative — there's no data in the DOM to inspect.

To wire up storage, uncomment one of the options in `api/subscribe.js` (Vercel KV, Supabase, or Resend).
