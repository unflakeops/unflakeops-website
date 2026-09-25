import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.unflakeops.com";
  return [
    { path: "", priority: 1, changeFrequency: "monthly" as const },
    { path: "/insights", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/insights/before-automating-charity-report", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency, priority }));
}
