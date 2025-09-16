import "../styles/globals.css";
import CookiesBanner from "../components/CookiesBanner";

export const metadata = {
  title: "UnflakeOps — Cut Failed Builds by 50%+ in 30 Days. Guaranteed.",
  description:
    "PASS/WARN/FAIL release gates, fewer flaky tests, faster cycles for GitHub Actions & GitLab CI. UK/EU GDPR-friendly.",
  keywords:
    "CI/CD, flaky tests, GitHub Actions, GitLab CI, test automation, DevOps, build reliability",
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
    title: "UnflakeOps — Cut Failed Builds by 50%+ in 30 Days. Guaranteed.",
    description:
      "PASS/WARN/FAIL release gates, fewer flaky tests, faster cycles for GitHub Actions & GitLab CI. UK/EU GDPR-friendly.",
    images: [
      {
        url: "https://www.unflakeops.com/brand/unflakeops_icon_dots_dark_400.png",
        width: 400,
        height: 400,
        alt: "UnflakeOps - Cut Failed Builds by 50%+ in 30 Days",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UnflakeOps — Cut Failed Builds by 50%+ in 30 Days. Guaranteed.",
    description:
      "PASS/WARN/FAIL release gates, fewer flaky tests, faster cycles for GitHub Actions & GitLab CI. UK/EU GDPR-friendly.",
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
const LOGO_URL = "/brand/unflakeops_icon_dots_dark_400.png"; // already fine
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
