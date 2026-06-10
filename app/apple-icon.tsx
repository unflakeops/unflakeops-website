import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#06080c",
          borderRadius: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(148,168,196,0.26)",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            points="4,24 8,20 12,15 16,11 20,10 24,10 28,10"
            fill="none"
            stroke="#34e2ad"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="28" cy="10" r="4" fill="#5cf6c4" opacity="0.25" />
          <circle cx="28" cy="10" r="2.5" fill="#5cf6c4" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
