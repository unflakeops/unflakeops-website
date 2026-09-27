# UnflakeOps website

Marketing and enquiry site for UnflakeOps: focused Microsoft Power Platform automation for recurring reporting workflows in UK charities.

Production: [unflakeops.com](https://unflakeops.com), deployed on Vercel from `main`.

## Technology

- Next.js 16 and React 19
- TypeScript
- Static visitor-facing pages under `public/`
- Next.js API route for validated Zoho CRM lead capture
- Vercel hosting

## Source of truth

The public website is served from the static pages under `public/`. `next.config.mjs` maps the clean public URLs to those files:

- `/` → `public/index.html`
- `/insights` → `public/insights/index.html`
- `/insights/before-automating-charity-report` → `public/insights/before-automating-charity-report/index.html`
- `/privacy` → `public/privacy/index.html`
- `/terms` → `public/terms/index.html`

The Next.js application supplies `/api/contact`, redirects, robots, sitemap, icons and social-preview images. See [`workflows/site-architecture.md`](workflows/site-architecture.md) before changing page structure or copy.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

The local site runs at `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
npm audit
```

Visual or interactive changes also require integrated browser checks at mobile, tablet, breakpoint boundaries and desktop. Scroll-driven work must be tested through every phase and into the following section, with a separate reduced-motion pass. Store release evidence under a dated folder in `qa/`.

## Enquiry flow

The homepage form posts JSON to `POST /api/contact`. The server validates the request, applies origin, timing, size, honeypot and rate-limit controls, then creates a lead through Zoho CRM’s Web-to-Lead endpoint. No public email address is required on the page.

## SEO and AEO

The site includes canonical URLs, `robots.txt`, a sitemap with explicit content dates, social metadata and structured data. When a page changes, update its corresponding `lastModified` value in `app/sitemap.ts`; do not use the build time.

## Deployment

Pull requests receive a Vercel preview. Production deploys from `main` after review and merge. Confirm the exact release commit and run anonymous production checks after deployment.
