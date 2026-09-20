# UnflakeOps website — current state

## Active release

- Production candidate base: `5c6062f`
- CRM integration branch: `codex/zoho-crm-capture`
- CRM: Zoho CRM Leads via the generated Web-to-Lead endpoint
- Public form: name, work email, organisation, and one recurring-report question
- Live production is unchanged until Muhammad explicitly approves merge and deployment.

## Remaining release checks

- Completed: removed Zoho's generated sample records.
- Completed: created, verified and removed one labelled synthetic Zoho Lead.
- Publish a private branch preview for stakeholder review.
- Merge and production deployment need separate explicit authority.

## Historical plans

The HubSpot plans under `workflows/` are retained as history and marked superseded. They are not deployment instructions. The current implementation and evidence are recorded in `workflows/zoho-crm-capture.md`.
