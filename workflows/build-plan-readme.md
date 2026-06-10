# Build Plan: Detailed README + .env.example

**Feature name:** `readme`
**Discovery level:** 1
**Spin Jit Su stream:** A (independent — see "Parallel safety")
**Status:** READY

---

## Problem

There is **no README anywhere in the repo** and **no `.env.example`**, despite the app
depending on ~11 environment variables across Resend, Telegram, PostHog, HubSpot, booking,
and site config. A new contributor (or future you) has no map of the project, the lead
flow, the env vars, or how it deploys.

---

## Planning answers

1. **Goal** — Write a detailed, accurate `README.md` and a complete `.env.example` so the
   project is self-documenting: what it is, how to run it, every env var, the lead-capture
   flow, the icon/branding setup, and how it deploys.
2. **Scope** — Create `README.md` and `.env.example` at repo root. **No code files.**
3. **Approach** — Document the **target post-merge state** (this stream lands alongside the
   icons + HubSpot streams), so the README describes code-generated icons and HubSpot lead
   capture as the intended system. README is prose — it imports nothing, so it can describe
   sibling streams' output without a merge conflict.
4. **Edge cases** —
   - Don't invent env vars. Use the real set found in code (below) plus the HubSpot vars
     the contact stream will consume.
   - Be honest about production state: **unflakeops.com is on Vercel serving the OLD
     design**; the redesign lives on branch `preview-numetix-style-services` and reaches a
     preview via Woodpecker/penfold (Docker standalone). Don't claim the redesign is live.
   - Note the lead-flow reality: the redesigned homepage's contact path is a booking link +
     mailto today; the HubSpot stream adds a real form. Legacy `app/api/lead/route.ts` and
     `app/api/route.ts` are from an old flaky-test ROI calculator and are not wired into the
     current page.
5. **Trade-offs** — Documentation-only; no runtime risk. Cost is keeping it in sync later.
6. **Dependencies** — None. **Do not touch `package.json`.**
7. **Testing** — Render the README locally / on GitHub; confirm links resolve, the dir
   tree matches `find app components`, and every `process.env.*` in code appears in
   `.env.example`.
8. **Rollback** — Delete the two files; nothing else references them.

---

## Real environment variables (from the codebase — use these verbatim)

Server-side:
- `RESEND_API_KEY` — Resend API key (lead/result emails). If unset, email is skipped.
- `EMAIL_FROM` — From address, default `UnflakeOps <hello@unflakeops.com>`.
- `EMAIL_BCC_LEADS` — internal address that receives lead notifications.
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — optional Telegram lead alerts.
- `POSTHOG_KEY` — optional server-side event capture.

Public (`NEXT_PUBLIC_*`):
- `NEXT_PUBLIC_POSTHOG_HOST` — default `https://eu.posthog.com`.
- `NEXT_PUBLIC_REGION_BADGE` — header badge text.
- `NEXT_PUBLIC_BOOKING_URL` — discovery-call URL (defaults to `/call`, which redirects to
  the Google Calendar booking link).
- `NEXT_PUBLIC_CONTACT_EMAIL` — default `hello@unflakeops.com`.
- `NEXT_PUBLIC_SITE_URL` — canonical site URL.

HubSpot (consumed by the `hubspot-lead-capture` stream — document them here so that
stream never has to edit `.env.example`):
- `HUBSPOT_PRIVATE_APP_TOKEN` — HubSpot Private App token (CRM scope) for contact upsert.
  If unset, HubSpot sync is skipped gracefully.
- `HUBSPOT_PORTAL_ID` — optional, for reference/links.

`.env.example` must include all of the above with placeholder values and a one-line
comment each, grouped by section, with a note that `NEXT_PUBLIC_*` are exposed to the
browser.

---

## README outline (sections)

1. **Title + one-liner** — UnflakeOps marketing site (AI reliability, RAG evaluation, data maturity).
2. **Tech stack** — Next.js 14.2.5 (App Router), React 18, TypeScript, Resend, `next/font`
   (Hanken Grotesk + JetBrains Mono), CSS in `styles/globals.css` (single-source design tokens).
3. **Project structure** — directory tree from `find app components public styles` with a
   one-line note per route/file (`app/page.tsx` homepage, `app/ci-audit`, `app/case-study`,
   `app/call` calendar redirect, `app/api/lead` + `app/api/route` legacy calculator lead
   routes, `app/sitemap.ts`, `app/robots.txt`, `components/Header`, `components/CookiesBanner`).
4. **Local development** — `npm install`, `npm run dev` (port 3000), `npm run build`,
   `npm run start`, `npm run lint`. Node version note.
5. **Environment variables** — table of every var above (name · required? · purpose ·
   default), pointing to `.env.example`.
6. **Lead capture & contact flow** — how a visitor's contact is handled: booking link +
   mailto, the contact form → HubSpot contact upsert + Resend notify + optional Telegram +
   optional PostHog. Call out the legacy calculator routes.
7. **Branding & icons** — assets are **code-generated** via Next.js metadata conventions
   (`app/icon.svg`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`)
   and `components/Logo.tsx`; no binary icon files to maintain.
8. **Deployment** — Production on **Vercel** (currently the old design). Preview via
   self-hosted **Woodpecker CI (penfold)** using the `Dockerfile` (Next standalone, port 80)
   and `.woodpecker.yml`; preview URL pattern `preview-<branch>.unflakeops.com`. Current
   redesign branch: `preview-numetix-style-services`.
9. **Contributing / conventions** — atomic commits (`type(scope): desc`), plans live in
   `workflows/build-plan-*.md`.

---

## Tasks (2)

### Task 1 — `.env.example`
- Create root `.env.example` with every var grouped (Email/Resend, Telegram, PostHog,
  HubSpot, Public/site), placeholder values, one-line comments, and the `NEXT_PUBLIC_*`
  browser-exposure note.
- Cross-check: every `process.env.*` referenced in `app/` and `components/` appears.
- Commit: `docs(env): add .env.example documenting all runtime variables`

### Task 2 — `README.md`
- Write the README per the outline above. Generate the dir tree from the actual repo.
- Verify internal links and that the tree matches reality.
- Commit: `docs(readme): add detailed project README`

---

## Parallel safety (Spin Jit Su)
Touches only `README.md` and `.env.example` (both new). **Zero overlap** with Stream B
(icons) or Stream C (page/api/form). This stream is the sole owner of `.env.example`,
including the HubSpot vars, so Stream C never edits it. Does **not** modify `package.json`.

## Verification criteria
- [ ] `README.md` and `.env.example` exist at repo root.
- [ ] Every `process.env.*` in `app/` + `components/` is present in `.env.example`.
- [ ] Dir tree in README matches `find app components`.
- [ ] Production/preview/lead-flow statements are accurate (no "redesign is live" claim).
