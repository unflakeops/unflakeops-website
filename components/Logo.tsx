interface LogoProps {
  size?: number;
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(size * 0.3),
        textDecoration: "none",
      }}
    >
      {/* Brand mark: reliability sparkline tile */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Rounded-square tile */}
        <rect
          width="32"
          height="32"
          rx="6"
          fill="#06080c"
          stroke="rgba(148,168,196,0.26)"
          strokeWidth="1"
        />
        {/* Sparkline: rises then flattens to steady plateau (flaky to stable) */}
        <polyline
          points="4,24 8,20 12,15 16,11 20,10 24,10 28,10"
          fill="none"
          stroke="#34e2ad"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Soft glow halo */}
        <circle cx="28" cy="10" r="4" fill="#5cf6c4" opacity="0.25" />
        {/* Terminal node dot at plateau end */}
        <circle
          cx="28"
          cy="10"
          r="2.5"
          fill="#5cf6c4"
          filter="url(#logo-glow)"
        />
      </svg>

      {/* Wordmark */}
      <span
        style={{
          fontFamily: "var(--font-sans, 'Hanken Grotesk', sans-serif)",
          fontWeight: 700,
          fontSize: Math.round(size * 0.5625),
          lineHeight: 1,
          color: "var(--ink, #f4f7fb)",
          letterSpacing: "-0.01em",
          userSelect: "none",
        }}
      >
        {"Unflake"}
        <span style={{ color: "var(--green, #34e2ad)" }}>Ops</span>
      </span>
    </span>
  );
}
