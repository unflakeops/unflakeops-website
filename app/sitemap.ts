import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.unflakeops.com";
  return [
    { path: "", lastModified: "2026-09-27", priority: 1, changeFrequency: "monthly" as const },
    { path: "/insights", lastModified: "2026-09-25", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/insights/before-automating-charity-report", lastModified: "2026-09-25", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/privacy", lastModified: "2026-09-20", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/terms", lastModified: "2026-09-20", priority: 0.4, changeFrequency: "yearly" as const },
  ].map(({ path, lastModified, priority, changeFrequency }) => ({ url: `${base}${path}`, lastModified: new Date(`${lastModified}T00:00:00Z`), changeFrequency, priority }));
}
