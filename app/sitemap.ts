import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://unflakeops.com";

  // keep literal types
  const pages = [
    "",
    "/guarantee",
    "/privacy",
    "/terms",
    "/case-study",
  ] as const;

  const urls: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(), // optional but nice
    changeFrequency: "weekly", // literal, not generic string
    priority: p === "" ? 1 : 0.7,
  }));

  return urls;
}
