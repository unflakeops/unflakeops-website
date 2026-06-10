import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "UnflakeOps — AI Reliability, RAG Evaluation & Data Maturity";

export default async function OgImage() {
  // Try to load Hanken Grotesk for brand match; fall back to default on network failure
  let fontData: ArrayBuffer | null = null;
  try {
    const res = await fetch(
      "https://fonts.gstatic.com/s/hankengrotesque/v6/4UaErEJDsxBrF37olUeDx63j5pN1MwI.woff2",
      { signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) fontData = await res.arrayBuffer();
  } catch {
    // Network failure — use default font
  }

  const fontFamily = fontData ? "Hanken" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          // Violet field, matching the homepage hero
          backgroundColor: "#13112a",
          backgroundImage:
            "radial-gradient(ellipse 110% 90% at 50% 8%, #5346b8 0%, #2a2266 42%, rgba(19,17,42,0) 78%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Brand mark + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 30,
          }}
        >
          {/* Purple logo mark — the bare damped trace, identical to the header logo */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 30 C 10 30, 11 9, 17 9 C 22 9, 22 23, 26 23 C 30 23, 30 18, 35 18"
              fill="none"
              stroke="#7c6cf0"
              stroke-width="3.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="35" cy="18" r="2.7" fill="#9e92ff" />
          </svg>

          {/* Wordmark */}
          <span
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 68,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Unflake
            <span style={{ color: "#34e2ad" }}>Ops</span>
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily,
            fontSize: 26,
            color: "#cdd5ff",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          AI Reliability · RAG Evaluation · Data Maturity
        </div>
      </div>
    ),
    {
      ...size,
      ...(fontData
        ? { fonts: [{ name: "Hanken", data: fontData, weight: 700 as const }] }
        : {}),
    }
  );
}
