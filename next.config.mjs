/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  async headers() {
    const securityHeaders = [
      { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; upgrade-insecure-requests" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        { source: "/privacy", destination: "/privacy/index.html" },
        { source: "/terms", destination: "/terms/index.html" },
        { source: "/insights", destination: "/insights/index.html" },
        { source: "/insights/before-automating-charity-report", destination: "/insights/before-automating-charity-report/index.html" },
      ],
    };
  },
  async redirects() {
    return [
      { source: "/call", destination: "/#contact", permanent: true },
      { source: "/case-study", destination: "/#sector-stories", permanent: true },
      { source: "/ci-audit", destination: "/", permanent: true },
      { source: "/guarantee", destination: "/", permanent: true },
      { source: "/thanks", destination: "/", permanent: true },
    ];
  },
};
export default nextConfig;
