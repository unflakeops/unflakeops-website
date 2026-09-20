/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        { source: "/privacy", destination: "/privacy/index.html" },
        { source: "/terms", destination: "/terms/index.html" },
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
