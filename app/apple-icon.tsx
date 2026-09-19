import { ImageResponse } from "next/og";
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function AppleIcon() { return new ImageResponse(<div style={{ width: 180, height: 180, borderRadius: 40, background: "#fbf8f2", display: "flex", alignItems: "center", justifyContent: "center" }}><img src="https://www.unflakeops.com/unflakeops-symbol.png" alt="" width="142" height="142" /></div>, size); }
