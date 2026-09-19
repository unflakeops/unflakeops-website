import "../styles/globals.css";
import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import CookiesBanner from "../components/CookiesBanner";

const sans = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.unflakeops.com"),
  title: "Power Platform Automation for UK Charities | UnflakeOps",
  description: "UnflakeOps helps UK charities investigate and automate recurring funder, impact and trustee reporting using Microsoft Power Platform.",
  keywords: ["Power Platform automation for charities", "charity reporting automation", "Microsoft Power Automate charities", "impact reporting", "funder reporting"],
  authors: [{ name: "UnflakeOps" }], creator: "UnflakeOps", publisher: "UnflakeOps",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", locale: "en_GB", url: "/", siteName: "UnflakeOps", title: "Power Platform Automation for UK Charities | UnflakeOps", description: "Start with one recurring report. Understand the manual work, automate the useful parts and keep the systems you already use." },
  twitter: { card: "summary_large_image", title: "Power Platform Automation for UK Charities | UnflakeOps", description: "Start with one recurring report. Understand the manual work, automate the useful parts and keep the systems you already use." },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-GB" className={`${sans.variable} ${mono.variable}`}><body>{children}<CookiesBanner /></body></html>;
}
