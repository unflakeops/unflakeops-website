interface LogoProps { size?: number; }

export default function Logo({ size = 40 }: LogoProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.25), color: "currentColor" }}>
      <img src="/unflakeops-symbol.png" alt="" width={size} height={size} style={{ display: "block", objectFit: "contain" }} />
      <span style={{ fontFamily: "var(--font-sans), sans-serif", fontWeight: 800, fontSize: Math.round(size * 0.55), lineHeight: 1, letterSpacing: "-0.035em", whiteSpace: "nowrap" }}>
        UnflakeOps
      </span>
    </span>
  );
}
