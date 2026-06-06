interface LogoProps {
  size?: number;
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(size * 0.34),
        textDecoration: "none",
      }}
    >
      {/* Brand mark: a damped step response settling to a steady state
          (control-systems signal = reliability). Dark tile / green trace. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
      >
        {/* Tile */}
        <rect
          width="40"
          height="40"
          rx="9"
          fill="#0b0f15"
          stroke="rgba(148,168,196,0.18)"
        />
        {/* Oscilloscope baseline */}
        <line
          x1="9"
          y1="20"
          x2="31"
          y2="20"
          stroke="rgba(148,168,196,0.16)"
          strokeWidth="1"
        />
        {/* Damped trace: overshoots once, settles flat */}
        <path
          d="M7 28 C 11 28, 12 11, 17 11 C 21 11, 21 22, 25 22 C 28 22, 28 18, 33 18"
          fill="none"
          stroke="#34e2ad"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Settled node */}
        <circle cx="33" cy="18" r="2.6" fill="#5cf6c4" />
      </svg>

      {/* Wordmark */}
      <span
        style={{
          fontFamily: "var(--font-sans, 'Hanken Grotesk', sans-serif)",
          fontWeight: 700,
          fontSize: Math.round(size * 0.6),
          lineHeight: 1,
          color: "var(--ink, #f4f7fb)",
          letterSpacing: "-0.022em",
          userSelect: "none",
        }}
      >
        {"Unflake"}
        <span style={{ color: "var(--green, #34e2ad)" }}>Ops</span>
      </span>
    </span>
  );
}
