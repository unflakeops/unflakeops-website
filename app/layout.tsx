import "../styles/globals.css";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import CookiesBanner from "../components/CookiesBanner";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "UnflakeOps · AI Reliability, RAG Evaluation & Data Maturity",
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
    title: "UnflakeOps · AI Reliability, RAG Evaluation & Data Maturity",
    description:
      "AI reliability and data maturity services for RAG systems, hallucination control, deterministic LLM outputs, LLM-ready data, and data pipelines.",
    // images injected automatically by Next.js file convention (app/opengraph-image.tsx)
  },
  twitter: {
    card: "summary_large_image",
    title: "UnflakeOps · AI Reliability, RAG Evaluation & Data Maturity",
    description:
      "AI reliability and data maturity services for RAG systems, hallucination control, deterministic LLM outputs, LLM-ready data, and data pipelines.",
    // images injected automatically by Next.js file convention (app/twitter-image.tsx)
    creator: "@unflakeops",
  },
  // icons injected automatically by Next.js file conventions (app/icon.svg, app/apple-icon.tsx)
  manifest: "/manifest.json",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        {children}
        <CookiesBanner />
      </body>
    </html>
  );
}
