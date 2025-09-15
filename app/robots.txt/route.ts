export function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: ${
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://unflakeops.com"
  }/sitemap.xml\n`;
  return new Response(body, { headers: { "content-type": "text/plain" } });
}
