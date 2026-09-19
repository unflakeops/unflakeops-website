import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "UnflakeOps — Power Platform automation for UK charities";

const logoUrl =
  "https://raw.githubusercontent.com/unflakeops/unflakeops-website/phoenix-logo-preview/public/unflakeops-symbol.png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #111126 0%, #1b1742 55%, #30165a 100%)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 560,
          height: 560,
          borderRadius: 999,
          right: -80,
          top: -100,
          background: "radial-gradient(circle, rgba(255,111,49,.34) 0%, rgba(116,63,255,.16) 48%, rgba(17,17,38,0) 72%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 290,
          height: 290,
          borderRadius: 999,
          left: -130,
          bottom: -150,
          background: "#6b3df4",
          opacity: 0.22,
        }}
      />

      <div
        style={{
          width: 760,
          padding: "58px 0 48px 68px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: "2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fffaf2",
            }}
          >
            <img src={logoUrl} alt="" width="50" height="50" />
          </div>
          <span style={{ fontSize: 31, fontWeight: 800, letterSpacing: "-0.035em" }}>
            UnflakeOps
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 720 }}>
          <span
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 13px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.2)",
              background: "rgba(255,255,255,.08)",
              color: "#ffc36b",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: ".12em",
            }}
          >
            POWER PLATFORM · UK CHARITIES
          </span>
          <span
            style={{
              marginTop: 20,
              fontSize: 67,
              lineHeight: 0.98,
              fontWeight: 850,
              letterSpacing: "-0.055em",
            }}
          >
            Spend less time assembling reports.
          </span>
          <span
            style={{
              marginTop: 20,
              maxWidth: 680,
              color: "#cbc8e2",
              fontSize: 23,
              lineHeight: 1.35,
            }}
          >
            Automate one recurring workflow without replacing the systems you already use.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#a9a4c6", fontSize: 17 }}>
          <span style={{ width: 28, height: 3, borderRadius: 9, background: "linear-gradient(90deg,#ff5a50,#ffb02e)" }} />
          unflakeops.com
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "72px 42px 58px 0",
          zIndex: "1",
        }}
      >
        <img src={logoUrl} alt="" width="410" height="410" style={{ objectFit: "contain" }} />
      </div>
    </div>,
    size
  );
}
