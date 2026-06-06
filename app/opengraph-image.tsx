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

  const fonts: ConstructorParameters<typeof ImageResponse>[1]["fonts"] =
    fontData
      ? [{ name: "Hanken", data: fontData, weight: 700 as const }]
      : [];

  const fontFamily = fontData ? "Hanken" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#06080c",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial green glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 400,
            background:
              "radial-gradient(ellipse at center, rgba(52,226,173,0.18) 0%, rgba(52,226,173,0.04) 50%, transparent 75%)",
            borderRadius: "50%",
          }}
        />

        {/* Brand mark + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 32,
          }}
        >
          {/* Brand mark tile */}
          <div
            style={{
              width: 80,
              height: 80,
              background: "#06080c",
              borderRadius: 14,
              border: "1.5px solid rgba(148,168,196,0.26)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline
                points="4,24 8,20 12,15 16,11 20,10 24,10 28,10"
                fill="none"
                stroke="#34e2ad"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="28" cy="10" r="5" fill="#5cf6c4" opacity="0.25" />
              <circle cx="28" cy="10" r="3" fill="#5cf6c4" />
            </svg>
          </div>

          {/* Wordmark */}
          <span
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 64,
              color: "#f4f7fb",
              letterSpacing: "-0.02em",
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
            color: "rgba(244,247,251,0.65)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          AI Reliability · RAG Evaluation · Data Maturity
        </div>

        {/* Bottom sparkline echo */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <svg
            width="1200"
            height="80"
            viewBox="0 0 1200 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <polyline
              points="0,70 150,55 300,38 450,24 600,18 750,16 900,16 1050,16 1200,16"
              fill="none"
              stroke="#34e2ad"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.4"
            />
            <circle cx="1200" cy="16" r="5" fill="#5cf6c4" opacity="0.6" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
