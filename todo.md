# UnflakeOps Website — Project State

## Current Goal
Three independent improvements, planned for **parallel Spin Jit Su execution**:
README, code-generated icons/shareables, and HubSpot contact capture.

## Active Plans (Spin Jit Su streams — ALL SHIPPED 2026-06-06, build green)
Ran via parallel worktree agents (Sonnet build / Opus orchestrate). All three merged onto
`preview-numetix-style-services`; `npm run build` passes (17/17 pages).
- [x] **Stream A — README + .env.example** → `workflows/build-plan-readme.md`
  - `385f7d6` .env.example (11 env vars + HubSpot), `b192e93` README.md.
- [x] **Stream B — Icons & shareables** → `workflows/build-plan-icons-and-shareables.md`
  - `a0f31e8` brand assets (icon.svg/apple-icon/og/twitter/Logo), `3ba1f60` wire + drop 6
    placeholders, `c0b06e7` TS/runtime fix. Also patched a dangling brand-png ref in
    `app/ci-audit/page.tsx`.
- [x] **Stream C — HubSpot lead capture** → `workflows/build-plan-hubspot-lead-capture.md`
  - `0e23af7` /api/contact route (HubSpot upsert + Resend/Telegram notify, no-ops without
    token), `8ce37dd` ContactForm wired into `#book`. Cherry-picked from its isolated
    branch (now deleted).

## Follow-ups
- [ ] **HubSpot go-live:** create a HubSpot Private App (scope `crm.objects.contacts.write`),
  set `HUBSPOT_PRIVATE_APP_TOKEN` (+ optional `HUBSPOT_PORTAL_ID`) in env. Until then the
  contact form works and notifies but skips CRM sync.
- [ ] Cosmetic: commit `a0f31e8` carries Stream B's icon files under a "docs(env)" message
  (parallel-staging artifact). Content is correct; nothing is pushed yet, so it can be
  reworded on a future rebase if desired. Harmless.
- [ ] Nothing is pushed — branch is ahead of `origin/preview-numetix-style-services` by 8.

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
