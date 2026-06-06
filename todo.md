# UnflakeOps Website — Project State

## Current Goal
Three independent improvements, planned for **parallel Spin Jit Su execution**:
README, code-generated icons/shareables, and HubSpot contact capture.

## Active Plans (Spin Jit Su streams — independent, merge-safe)
- [ ] **Stream A — README + .env.example** → `workflows/build-plan-readme.md`
  - Owns `README.md` + `.env.example` (incl. HubSpot vars). Docs only.
- [ ] **Stream B — Icons & shareables** → `workflows/build-plan-icons-and-shareables.md`
  - Code-generated brand mark, favicon, apple-icon, OG/Twitter cards via Next.js
    metadata conventions + `next/og`. Edits `layout.tsx`, `Header.tsx`, `manifest.json`;
    deletes 6 placeholder assets.
- [ ] **Stream C — HubSpot lead capture** → `workflows/build-plan-hubspot-lead-capture.md`
  - New contact form + `/api/contact` route upserting to HubSpot (REST/fetch), with
    Resend/Telegram notify. Edits `app/page.tsx` `#book` only. Ships behind
    `HUBSPOT_PRIVATE_APP_TOKEN` (no-ops cleanly until the token is set).

### Parallel-safety matrix (no two streams touch the same file)
| File | A | B | C |
|---|---|---|---|
| `README.md`, `.env.example` | ✅ owns | | |
| `app/layout.tsx`, `components/Header.tsx`, `public/manifest.json`, `public/*` | | ✅ | |
| new `app/icon.svg` / `app/apple-icon.tsx` / `app/opengraph-image.tsx` / `app/twitter-image.tsx` / `components/Logo.tsx` | | ✅ | |
| `app/page.tsx`, new `components/ContactForm.tsx` / `app/api/contact/route.ts` | | | ✅ |
| `package.json` | — | — | — (no stream touches it) |

## Known facts / context
- Branch: `preview-numetix-style-services`. Production = Vercel (OLD design); redesign is
  branch-only, preview via Woodpecker/penfold.
- All current icon assets are the same 3729-byte placeholder (MD5 `9e909db…`).
- HubSpot integration does not exist yet; live page has no form (booking link + mailto only).
- Legacy lead routes `app/api/lead/route.ts` + `app/api/route.ts` = old calculator flow,
  not wired into the current homepage.

## Handoff
Plans are finalized. Launch with Spin Jit Su (auto-detects `workflows/build-plan-*.md`),
one worktree/branch per stream, build on Sonnet, verify on Opus, merge A+B+C.

## Known Issues
- (none yet)
