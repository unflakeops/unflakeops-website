# Build Plan: Icons & Shareables (code-generated brand assets)

**Feature name:** `icons-and-shareables`
**Discovery level:** 1 (Quick verify — Next.js metadata file conventions)
**Spin Jit Su stream:** B (independent — see "Parallel safety")
**Status:** READY

---

## Problem

Every icon asset in the repo is the **same 3729-byte placeholder file** (identical MD5
`9e909db13b0178930683eeb670a6a450`):

- `public/favicon.ico`
- `public/favicon-192x192.png`
- `public/favicon-512x512.png`
- `public/apple-touch-icon.png`
- `public/og-image.png` (social share image)
- `public/brand/unflakeops_icon_dots_dark_400.png` (used as **header logo** AND the OG/Twitter share image in `app/layout.tsx`)

So the browser-tab favicon, the PWA/home-screen icon, the social-share card, and the
site logo are all one tiny low-res placeholder.

---

## Planning answers

1. **Goal** — Replace the placeholder icon set with crisp, on-brand, code-generated
   assets: a real SVG brand mark, favicon, Apple touch icon, and proper Open Graph /
   Twitter share cards. Give the header a sharp inline-SVG logo.
2. **Scope** — `app/icon.svg`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`,
   `app/twitter-image.tsx`, `components/Logo.tsx` (new); edit `app/layout.tsx`,
   `components/Header.tsx`, `public/manifest.json`; delete the 6 placeholder assets.
3. **Approach** — Use **Next.js App Router metadata file conventions** (Next 14.2.5).
   Next auto-injects `icon`, `apple-icon`, `opengraph-image`, and `twitter-image` files
   into `<head>` and the metadata graph. Dynamic images are generated with `next/og`
   (`ImageResponse`) — **built into Next 14, no new dependency, no binary tooling**.
   Alternative considered: hand-authored PNGs via sharp/imagemagick — rejected (needs
   binary tooling + produces static raster we'd have to re-export on every brand tweak).
4. **Edge cases** —
   - `ImageResponse` needs a font; default font is fine. If Hanken Grotesk is fetched for
     brand match, wrap the fetch in try/catch and fall back to the default font so a
     network failure at build never breaks the route.
   - Removing `public/favicon.ico` means very old browsers that hard-request `/favicon.ico`
     get nothing — acceptable in 2026 (Next injects `<link rel="icon" href="/icon.svg">`).
   - PWA manifest: modern Chrome accepts SVG icons; reference `app/icon.svg` with
     `"sizes": "any"`, `"type": "image/svg+xml"`. (Maskable PNG is a possible follow-up.)
   - `app/layout.tsx` currently hard-codes `icons`, `openGraph.images`, and
     `twitter.images`. These **must be removed** so the file-convention assets take over —
     otherwise the manual entries win and still point at the deleted placeholders.
5. **Trade-offs** — Gain: sharp assets at every size, single source of truth (the SVG
   mark + the OG route), zero binary deps. Give up: a pixel-perfect hand-designed raster
   (the generated OG is layout/code-driven, which is the intent here).
6. **Dependencies** — None. `next/og` ships with Next 14.2.5. **Do not touch
   `package.json`** (keeps this stream merge-safe).
7. **Testing** — `npm run build` succeeds; `npm run dev` then verify:
   `/icon.svg` renders the mark, `/apple-icon` is 180×180, `/opengraph-image` and
   `/twitter-image` are 1200×630 PNGs, header shows the new logo, view-source shows the
   injected `<link rel="icon">` / `og:image` / `twitter:image` tags pointing at the
   generated routes (not `/brand/...` or `/og-image.png`).
8. **Rollback** — `git revert` the stream's commits, or `git checkout main -- app/layout.tsx
   components/Header.tsx public/`. The deletions and new files are all in this stream's
   branch.

---

## Brand mark spec (so the executor has a concrete default)

Palette (from `styles/globals.css`): surface `#06080c`, ink `#f4f7fb`,
green `#34e2ad`, green-strong `#5cf6c4`, green-deep `#0e8f6a`. Fonts: Hanken Grotesk + JetBrains Mono.

**Mark concept** — echo the hero's "reliability trending up" sparkline so the favicon
ties to the live-console motif:
- Rounded-square tile, fill `#06080c`, ~6px corner radius on a 32×32 viewBox, 1px
  border `rgba(148,168,196,0.26)`.
- Inside: a green polyline that rises then **flattens to a steady plateau** (flaky →
  stable), stroke `#34e2ad`, width 2, round caps/joins.
- A terminal node dot at the plateau end in `#5cf6c4` with a soft glow.

**`components/Logo.tsx`** — renders the inline-SVG tile + the wordmark "UnflakeOps"
(Hanken Grotesk 700; "Ops" or a trailing dot in `--green`). Accepts a `size` prop;
used by `Header.tsx` at 32px. No raster, scales perfectly.

**OG / Twitter card (1200×630)** — dark `#06080c` background with a subtle
green radial glow, the brand mark + "UnflakeOps" wordmark, the tagline
"AI Reliability · RAG Evaluation · Data Maturity", and a thin sparkline echo along the
bottom. `export const size = { width: 1200, height: 630 }`, `contentType = 'image/png'`,
`alt` set. `twitter-image.tsx` may re-export the opengraph image to stay DRY.

---

## Tasks (2)

### Task 1 — Generate the brand mark, favicon, app icon, and share cards
- Create `app/icon.svg` (the mark above, standalone).
- Create `components/Logo.tsx` (inline-SVG tile + wordmark, `size` prop).
- Create `app/apple-icon.tsx` (`ImageResponse`, 180×180, mark on surface).
- Create `app/opengraph-image.tsx` (`ImageResponse`, 1200×630, card spec above).
- Create `app/twitter-image.tsx` (re-export or thin wrapper of the OG card).
- Commit: `feat(brand): add code-generated icon + share-card assets`

### Task 2 — Wire them in and remove the placeholders
- `app/layout.tsx`: **remove** the manual `icons`, `openGraph.images`, and
  `twitter.images` entries (let file conventions inject them). Keep `manifest`, titles,
  descriptions, robots.
- `components/Header.tsx`: replace the `<Image src="/brand/...png">` logo with `<Logo />`.
- `public/manifest.json`: point `icons` at `/icon.svg` (`"type":"image/svg+xml"`,
  `"sizes":"any"`); keep name/colors.
- Delete: `public/favicon.ico`, `public/favicon-192x192.png`,
  `public/favicon-512x512.png`, `public/apple-touch-icon.png`, `public/og-image.png`,
  `public/brand/unflakeops_icon_dots_dark_400.png` (and the now-empty `public/brand/`).
- Verify no remaining references to the deleted paths:
  `grep -rn "brand/unflakeops\|og-image.png\|favicon-192\|favicon-512\|apple-touch-icon" app components public`
- Commit: `feat(brand): wire generated assets, drop placeholder icons`

---

## Parallel safety (Spin Jit Su)
Touches: `app/icon.svg`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`,
`app/twitter-image.tsx`, `components/Logo.tsx`, `app/layout.tsx`, `components/Header.tsx`,
`public/manifest.json`, `public/*` deletions. **No overlap** with Stream A (README/.env)
or Stream C (page.tsx / api / ContactForm). Does **not** modify `package.json`.

## Verification criteria
- [ ] `npm run build` passes.
- [ ] `/icon.svg`, `/apple-icon`, `/opengraph-image`, `/twitter-image` all render.
- [ ] View-source `og:image` + `twitter:image` point at the generated routes.
- [ ] Header renders `<Logo />`; no placeholder PNG referenced anywhere.
- [ ] All 6 placeholder files removed.
