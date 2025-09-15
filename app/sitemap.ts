import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://unflakeops.com";
  const urls = ["", "/guarantee", "/privacy", "/terms", "/case-study"].map(
    (p) => ({
      url: `${base}${p}`,
      changeFrequency: "weekly",
      priority: p === "" ? 1 : 0.7,
    })
  );
  return urls;
}
