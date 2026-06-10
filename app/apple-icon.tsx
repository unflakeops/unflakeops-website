import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Violet tile + white damped-trace, matching the favicon (app/icon.svg)
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#5142d4",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="132"
          height="132"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 30 C 10 30, 11 9, 17 9 C 22 9, 22 23, 26 23 C 30 23, 30 18, 35 18"
            fill="none"
            stroke="#ffffff"
            stroke-width="3.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="35" cy="18" r="2.9" fill="#ffffff" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
