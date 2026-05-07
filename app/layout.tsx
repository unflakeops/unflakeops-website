import "../styles/globals.css";
import CookiesBanner from "../components/CookiesBanner";

export const metadata = {
  title: "UnflakeOps — AI Reliability, RAG Evaluation & Data Maturity",
  description:
    "AI reliability and data maturity services for RAG systems, hallucination control, deterministic LLM outputs, LLM-ready data, and data pipelines.",
  keywords:
    "AI reliability, RAG evaluation, hallucination control, deterministic LLM outputs, data maturity, LLM-ready data, data pipelines, retrieval quality",
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
    title: "UnflakeOps — AI Reliability, RAG Evaluation & Data Maturity",
    description:
      "AI reliability and data maturity services for RAG systems, hallucination control, deterministic LLM outputs, LLM-ready data, and data pipelines.",
    images: [
      {
        url: "https://www.unflakeops.com/brand/unflakeops_icon_dots_dark_400.png",
        width: 400,
        height: 400,
        alt: "UnflakeOps - AI reliability, RAG evaluation, and data maturity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UnflakeOps — AI Reliability, RAG Evaluation & Data Maturity",
    description:
      "AI reliability and data maturity services for RAG systems, hallucination control, deterministic LLM outputs, LLM-ready data, and data pipelines.",
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
