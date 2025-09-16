import Image from "next/image";
import Link from "next/link";

/** ENV */
const BADGE =
  process.env.NEXT_PUBLIC_REGION_BADGE ??
  "Read-only access • PR-based changes • You own everything";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      {/* brand row */}
      <Link
        href="/"
        className="brand-row"
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Image
          src="/brand/unflakeops_icon_dots_dark_400.png"
          alt="UnflakeOps"
          width={32}
          height={32}
          priority
        />
        <span className="brand-name">UnflakeOps</span>
      </Link>

      {/* top-right pill */}
      <div
        style={{
          fontSize: 12,
          color: "#cbd5e1",
          background: "rgba(2,6,23,.6)",
          border: "1px solid #334155",
          borderRadius: 999,
          padding: "4px 8px",
        }}
      >
        {BADGE}
      </div>
    </header>
  );
}
