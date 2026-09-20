# Zoho CRM capture — delivery ledger

## Outcome

Connect the public charity-reporting enquiry form to UnflakeOps' Zoho CRM so each valid enquiry becomes a Lead. Keep the public form short, protect sensitive beneficiary information, and align the privacy notice with the actual data path.

## Revision

- Branch: `codex/zoho-crm-capture`
- Base: `5c6062f`
- Production: unchanged

## CRM configuration

- Zoho module: Leads
- Webform: `Website — Charity Reporting Enquiry`
- Redirect: `https://unflakeops.com/thanks`
- Fields used by the website: Company, First Name, Last Name, Email, Description
- Lead Source: present in Zoho's form builder but left unset because the account has no accurate Website option
- Owner notification: enabled
- Sample Zoho records: still present; deletion awaits Muhammad's confirmation

## Implementation

- `/api/contact` validates same-origin JSON submissions, actual encoded body size, email syntax, a honeypot, minimum completion time, and a small per-instance request limit.
- The server sends valid data to Zoho's generated Web-to-Lead endpoint and reports success only when Zoho redirects to the configured UnflakeOps thank-you URL.
- The public form asks for name, work email, organisation, and the recurring report that consumes the most time.
- The form warns users not to include beneficiary or special-category personal data.
- Privacy and terms pages describe the current enquiry route and avoid publishing an email address.

## Verification

- `node --check public/experience.js`: passed
- `npm run lint`: passed with four pre-existing warnings
- `npm run build`: passed
- API rejection checks: invalid fields 400; wrong origin 403; honeypot 200 without CRM write
- Browser matrix with reduced motion: 1440×900, 1280×800, 768×1024, 390×844, 375×667, 599/601×800, and 899/901×800
- Matrix result: form visible; privacy link present; no horizontal overflow, console error, or page error
- Privacy and terms routes: 200 with working enquiry links

## Final external checks

Before production release:

1. With Muhammad's confirmation, remove Zoho's generated sample records.
2. With Muhammad's confirmation, submit one clearly labelled synthetic test enquiry, verify the Lead in Zoho, and remove that test Lead.
3. Push this branch and publish a private preview for stakeholder review.
4. Merge and production deployment require separate explicit authority.
