# Build Plan: HubSpot Lead Capture (contact form → HubSpot)

**Feature name:** `hubspot-lead-capture`
**Discovery level:** 2 (HubSpot CRM API behaviour — create vs upsert)
**Spin Jit Su stream:** C (independent — see "Parallel safety")
**Status:** READY (code ships behind an env flag; goes live when the token is set)

---

## Problem

Nothing is saved to HubSpot anywhere — there are **zero HubSpot references** in the
codebase. Worse, the redesigned homepage has **no contact form at all**: the `#book`
section is only a "Book discovery call" button (Google Calendar redirect) and a `mailto:`
link. So a visitor who wants to leave their details has no structured capture, and nothing
reaches a CRM. (Legacy `app/api/lead/route.ts` / `app/api/route.ts` send Resend email +
Telegram + optional PostHog, but they're from an old calculator and aren't wired into the
current page.)

---

## Planning answers

1. **Goal** — Add a real contact form to the homepage and persist each submission as a
   **HubSpot contact** (upsert by email), while also firing the existing notification
   channels (Resend email + optional Telegram). Submissions must succeed for the user even
   if HubSpot is momentarily unavailable.
2. **Scope** — New `components/ContactForm.tsx` (client) and `app/api/contact/route.ts`
   (server). Edit `app/page.tsx` `#book` section to render the form (keep the booking +
   mailto CTAs). No other files.
3. **Approach** —
   - **HubSpot via REST + `fetch`** (no SDK → no `package.json` change → merge-safe).
     Upsert a contact: `PATCH https://api.hubapi.com/crm/v3/objects/contacts/{email}?idProperty=email`
     with `Authorization: Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}`. If that 404s (contact
     doesn't exist), `POST https://api.hubapi.com/crm/v3/objects/contacts` to create.
     Properties: `email`, `firstname`, `company`, `message`, plus a `hs_lead_source` /
     custom note describing source = "website contact form".
   - **Graceful degradation** mirroring the existing Resend pattern: if
     `HUBSPOT_PRIVATE_APP_TOKEN` is unset, skip HubSpot and log a warning — the submission
     still succeeds and still notifies.
   - **Notify**: reuse the Resend pattern (internal email to `EMAIL_BCC_LEADS`) + optional
     Telegram (`TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`), copied/adapted from
     `app/api/lead/route.ts` — keep it lean (name/email/company/message, no calculator rows).
   - Alternative considered: HubSpot Forms embed (iframe/script). Rejected — off-brand
     styling, extra third-party script, less control over the notify side.
4. **Edge cases** —
   - **Validation**: require a valid email; trim/limit field lengths; reject empty body.
     Return 400 with a useful message on bad input.
   - **Spam**: include a hidden honeypot field; if filled, return 200 but drop silently.
   - **HubSpot down / 5xx / network error**: catch, log, continue — the endpoint still
     returns success if the notify path worked, so the user isn't penalised for a CRM blip.
   - **Duplicate contact**: handled by the PATCH-then-POST upsert (idempotent by email).
   - **Client UX**: disable submit while pending; show success and error states; clear the
     form on success. No raw error objects leaked to the client.
   - **Runtime**: `export const runtime = "nodejs"` (matches the other API routes).
5. **Trade-offs** — Gain: real CRM capture + on-brand form. Give up: a hosted HubSpot form's
   built-in spam/analytics (we add a honeypot + reuse PostHog if desired later).
6. **Dependencies** — `HUBSPOT_PRIVATE_APP_TOKEN` (and optional `HUBSPOT_PORTAL_ID`),
   documented by the **README stream's `.env.example`** — this stream must **not** edit
   `.env.example`. A HubSpot Private App with CRM `crm.objects.contacts.write` scope is
   required for live sync; until the token exists the code path no-ops cleanly.
7. **Testing** —
   - Without token: submit the form → 200, contact NOT sent to HubSpot, warning logged,
     notify path attempted. Form shows success.
   - With token (manual, when available): submit → new contact appears in HubSpot; submit
     again same email → same contact updated, not duplicated.
   - Honeypot filled → silent 200, no contact created.
   - Invalid email → 400, friendly client error.
8. **Rollback** — Revert this stream's commits; the `#book` section returns to booking +
   mailto only. New files (`ContactForm.tsx`, `api/contact/route.ts`) are self-contained.

---

## API contract

`POST /api/contact`
Request JSON: `{ name, email, company?, message?, website? /* honeypot */ }`
Responses: `200 { ok: true }` on success; `400 { ok: false, error }` on validation failure.
Server order: validate → (honeypot? silent 200) → HubSpot upsert (skip if no token, never
fatal) → Resend notify to `EMAIL_BCC_LEADS` (if configured) → optional Telegram → 200.

---

## Tasks (2)

### Task 1 — Server route `app/api/contact/route.ts`
- `runtime = "nodejs"`. Parse + validate body (email required, honeypot drop, length caps).
- `upsertHubspotContact()`: PATCH-by-email-idProperty, fall back to POST on 404; bearer
  token from `HUBSPOT_PRIVATE_APP_TOKEN`; skip + warn if unset; wrap in try/catch so a
  HubSpot failure never fails the request.
- Notify via Resend to `EMAIL_BCC_LEADS` (reuse the pattern in `app/api/lead/route.ts`) and
  optional Telegram. Keep the email minimal (name/email/company/message).
- Commit: `feat(contact): add /api/contact route with HubSpot upsert + notify`

### Task 2 — Form component + wire into the homepage
- `components/ContactForm.tsx` (`"use client"`): name, email, company, message, hidden
  honeypot. Pending/disabled state, success + error UI, posts to `/api/contact`. Style with
  the existing design tokens / contact-card classes so it matches the dark system.
- `app/page.tsx` `#book` section: render `<ContactForm />` (e.g. inside or beside the
  `contact-card` aside). **Keep** the "Book discovery call" button and "Email us" mailto.
- Commit: `feat(contact): add on-brand contact form to homepage #book section`

---

## Parallel safety (Spin Jit Su)
Touches: `components/ContactForm.tsx` (new), `app/api/contact/route.ts` (new),
`app/page.tsx` (`#book` section only). **No overlap** with Stream A (README/.env — owns
`.env.example`; this stream must not touch it) or Stream B (icons — touches `layout.tsx`,
`Header.tsx`, not `page.tsx`). Does **not** modify `package.json` (HubSpot via `fetch`).

## Verification criteria
- [ ] `npm run build` passes; `/api/contact` responds 200 to a valid POST with no token set
      (HubSpot skipped, warning logged).
- [ ] Honeypot-filled submission returns 200 and creates nothing.
- [ ] Invalid email returns 400; client shows a friendly error.
- [ ] Homepage `#book` shows the form plus the existing booking + mailto CTAs.
- [ ] (When token available) contact upserts in HubSpot without duplicating on resubmit.
