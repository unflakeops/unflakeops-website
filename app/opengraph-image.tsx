import { ImageResponse } from "next/og";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "UnflakeOps — Power Platform automation for UK charities";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: 1200, height: 630, background: "#fbf8f2", color: "#171526", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 78px", fontFamily: "sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 420, height: 420, borderRadius: 999, right: -100, top: -160, background: "linear-gradient(135deg,#6b3df4,#ff5a50)", opacity: .18 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}><img src="https://raw.githubusercontent.com/unflakeops/unflakeops-website/phoenix-logo-preview/public/unflakeops-symbol.png" alt="" width="74" height="74" /><span style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.04em" }}>UnflakeOps</span></div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 950 }}><span style={{ color: "#6b3df4", fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Power Platform automation for UK charities</span><span style={{ marginTop: 24, fontSize: 68, lineHeight: 1.02, fontWeight: 800, letterSpacing: "-0.05em" }}>Spend less time assembling reports.</span><span style={{ marginTop: 22, color: "#625f70", fontSize: 26 }}>Start with one recurring workflow and the systems you already use.</span></div>
    </div>,
    size
  );
}
