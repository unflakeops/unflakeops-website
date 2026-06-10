# UnflakeOps — Marketing Site

Marketing and lead-capture site for **UnflakeOps**: AI reliability, RAG evaluation, and data maturity services for teams building production AI systems.

Live: [unflakeops.com](https://unflakeops.com) (Vercel, currently serving the old design).
Redesign preview: branch `preview-numetix-style-services` — reachable via Woodpecker/penfold at `preview-preview-numetix-style-services.unflakeops.com`.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14.2.5 (App Router) |
| UI library | React 18.3.1 |
| Language | TypeScript 5.4.5 |
| Fonts | `next/font/google` — Hanken Grotesk (sans) + JetBrains Mono (mono) |
| Styling | Single `styles/globals.css` with CSS custom properties as design tokens |
| Email | Resend |
| CRM | HubSpot Private App (contact upsert) |
| Analytics | PostHog (server-side capture + client-side) |
| Alerts | Telegram Bot API |

---

## Project structure

```
app/
├── layout.tsx                  # Root layout: fonts, metadata, CookiesBanner
├── page.tsx                    # Homepage — service tracks, approach, contact CTA
├── ci-audit/
│   └── page.tsx                # CI/flaky-test audit landing page
├── case-study/
│   └── page.tsx                # Customer case study page
├── guarantee/
│   └── page.tsx                # Service guarantee / risk reversal page
├── privacy/
│   └── page.tsx                # Privacy policy
├── terms/
│   └── page.tsx                # Terms of service
├── thanks/
│   └── page.tsx                # Post-submission thank-you page
├── call/
│   └── page.tsx                # Redirects to Google Calendar booking link
├── sitemap.ts                  # Dynamic XML sitemap (uses NEXT_PUBLIC_SITE_URL)
├── robots.txt/
│   └── route.ts                # robots.txt response (uses NEXT_PUBLIC_SITE_URL)
├── icon.svg                    # Favicon source — served by Next.js metadata API
├── apple-icon.tsx              # Apple touch icon — code-generated via Next.js metadata
├── opengraph-image.tsx         # OG image — code-generated via Next.js metadata
├── twitter-image.tsx           # Twitter card image — code-generated via Next.js metadata
└── api/
    ├── contact/
    │   └── route.ts            # Contact form handler: HubSpot upsert + Resend + Telegram
    ├── lead/
    │   └── route.ts            # Legacy calculator lead route (not wired to current page)
    └── route.ts                # Legacy ROI calculator result route (not wired to current page)

components/
├── Header.tsx                  # Site header with nav, booking CTA, region badge
├── Logo.tsx                    # SVG logo component
├── ContactForm.tsx             # Contact form (wired to /api/contact)
└── CookiesBanner.tsx           # EU cookie consent banner

public/
└── manifest.json               # Web app manifest

styles/
└── globals.css                 # Design tokens (CSS vars), resets, shared utilities
```

---

## Local development

**Prerequisites:** Node.js 20+, npm.

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Start dev server (http://localhost:3000)
npm run dev
```

Other scripts:

```bash
npm run build    # Production build
npm run start    # Start production build locally
npm run lint     # ESLint
```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. Variables marked **required** will cause visible failures if absent. Optional variables degrade gracefully (delivery skipped, logged).

| Variable | Required | Purpose | Default |
|---|---|---|---|
| `RESEND_API_KEY` | No | Resend API key for outbound email | Email skipped if unset |
| `EMAIL_FROM` | No | Sender address for all emails | `UnflakeOps <hello@unflakeops.com>` |
| `EMAIL_BCC_LEADS` | No | Internal address for lead copies | Disabled if unset |
| `TELEGRAM_BOT_TOKEN` | No | Telegram bot token for lead alerts | Disabled if unset |
| `TELEGRAM_CHAT_ID` | No | Telegram chat/channel ID | Disabled if unset |
| `POSTHOG_KEY` | No | Server-side PostHog write key | Capture skipped if unset |
| `HUBSPOT_PRIVATE_APP_TOKEN` | No | HubSpot Private App token (CRM Contacts) | Sync skipped if unset |
| `HUBSPOT_PORTAL_ID` | No | HubSpot Portal ID (reference/links) | — |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL | `https://unflakeops.com` |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog ingestion host | `https://eu.posthog.com` |
| `NEXT_PUBLIC_REGION_BADGE` | No | Header badge label | — |
| `NEXT_PUBLIC_BOOKING_URL` | No | Discovery-call booking URL | `/call` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Contact email shown in UI | `hello@unflakeops.com` |

> **Browser exposure:** `NEXT_PUBLIC_*` variables are inlined into the browser bundle at build time and are visible to all users. Never put secrets in these variables.

---

## Lead capture and contact flow

### Current contact path (redesign branch)

1. A visitor on the homepage clicks the booking CTA — the `NEXT_PUBLIC_BOOKING_URL` (defaulting to `/call`) redirects them to Google Calendar.
2. Alternatively, the **contact form** (`components/ContactForm.tsx`) posts to `POST /api/contact`:
   - Validates input and checks a honeypot field.
   - Upserts a contact in HubSpot via the Private App API (if `HUBSPOT_PRIVATE_APP_TOKEN` is set).
   - Sends an internal lead notification email via Resend (if `RESEND_API_KEY` is set).
   - Sends an optional Telegram alert (if `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` are set).
   - Triggers an optional server-side PostHog event (if `POSTHOG_KEY` is set).
3. On success, the visitor is redirected to `/thanks`.

### Legacy routes (not wired to current pages)

- `POST /api/lead` — from the old flaky-test ROI calculator: accepts calculator results, emails them to the lead and to `EMAIL_BCC_LEADS`, and fires Telegram + PostHog. Not linked from any current page.
- `POST /api/route` — a further legacy route from the same calculator era. Not linked from any current page.

---

## Branding and icons

All icon assets are **code-generated** — there are no binary icon files to maintain for the favicon or social preview. Assets are produced via Next.js metadata file conventions:

| File | Output |
|---|---|
| `app/icon.svg` | Favicon (served by Next.js metadata API) |
| `app/apple-icon.tsx` | Apple touch icon (180×180, code-generated) |
| `app/opengraph-image.tsx` | OG image (1200×630, code-generated) |
| `app/twitter-image.tsx` | Twitter card image (code-generated) |
| `components/Logo.tsx` | Inline SVG logo rendered in Header and pages |

The `public/manifest.json` references the web app manifest for PWA metadata.

---

## Deployment

### Production — Vercel

**unflakeops.com** is deployed on Vercel from the `main` branch. The live site currently serves the **old design** — the redesign has not yet been merged to main.

Environment variables are set in the Vercel project dashboard. The `NEXT_PUBLIC_*` vars are baked into the build at deploy time.

### Preview — Woodpecker CI (penfold)

The `preview-numetix-style-services` redesign branch is visible on a self-hosted **Woodpecker CI** instance (penfold) at:

```
https://preview-preview-numetix-style-services.unflakeops.com
```

The pipeline (`.woodpecker.yml`) builds a Docker image using the `Dockerfile` (Next.js standalone mode, port 80), runs it on penfold's `deployed-apps-network`, and registers a Cloudflare DNS record + reverse-proxy entry for the preview URL. It also posts a preview link as a comment on the open GitHub PR for the branch.

To build the image manually:

```bash
docker build -t unflakeops-site .
docker run -p 3000:80 --env-file .env.local unflakeops-site
```

---

## Contributing

- Commits follow **Conventional Commits**: `type(scope): short description`
  - Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`
- Build plans for significant changes live in `workflows/build-plan-*.md`.
- For multi-stream parallel work, see `workflows/build-plan-*.md` files and the Spin Jit Su protocol.
