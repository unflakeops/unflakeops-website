# Website source of truth

The public website is intentionally served from the static files under `public/`.

- `/` → `public/index.html`
- `/insights` → `public/insights/index.html`
- `/insights/before-automating-charity-report` → `public/insights/before-automating-charity-report/index.html`
- `/privacy` → `public/privacy/index.html`
- `/terms` → `public/terms/index.html`

These mappings are defined in `next.config.mjs`. The previous React homepage, privacy page, terms page and homepage CSS were removed because they duplicated or contradicted pages that visitors actually received. New website copy and design work must be made in the routed `public/` files. The Next application remains responsible for API routes, generated metadata assets, redirects, robots and the sitemap.

When content changes, update that page's explicit `lastModified` date in `app/sitemap.ts`. Do not replace it with the build time because that would claim every page changed on every deployment.
