import "../styles/globals.css";
import CookiesBanner from "../components/CookiesBanner";

export const metadata = {
  title:
    "UnflakeOps — CI Reliability, Web Platforms, Data & Integration Delivery",
  description:
    "Senior delivery services for CI reliability, flaky-test reduction, web platforms, data engineering, integrations, automation, and quality-led launches.",
  keywords:
    "CI/CD, flaky tests, GitHub Actions, GitLab CI, web development, data engineering, integrations, QA, delivery leadership",
  authors: [{ name: "UnflakeOps" }],
  creator: "UnflakeOps",
  publisher: "UnflakeOps",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.unflakeops.com",
    siteName: "UnflakeOps",
    title:
      "UnflakeOps — CI Reliability, Web Platforms, Data & Integration Delivery",
    description:
      "Senior delivery services for CI reliability, web platforms, data engineering, integrations, automation, and quality-led launches.",
    images: [
      {
        url: "https://www.unflakeops.com/brand/unflakeops_icon_dots_dark_400.png",
        width: 400,
        height: 400,
        alt: "UnflakeOps - CI reliability, web, data, and integration delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "UnflakeOps — CI Reliability, Web Platforms, Data & Integration Delivery",
    description:
      "Senior delivery services for CI reliability, web platforms, data engineering, integrations, automation, and quality-led launches.",
    images: [
      "https://www.unflakeops.com/brand/unflakeops_icon_dots_dark_400.png",
    ],
    creator: "@unflakeops",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookiesBanner />
      </body>
    </html>
  );
}
