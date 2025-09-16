import Image from "next/image";
import Link from "next/link";

/** ENV */
const BADGE =
  process.env.NEXT_PUBLIC_REGION_BADGE ??
  "Read-only access • PR-based changes • You own everything";

export default function Header() {
  return (
    <header className="main-header">
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

      {/* top-right badge */}
      <div className="header-badge">
        <div className="header-badge__content">
          <span className="header-badge__text">{BADGE}</span>
        </div>
      </div>
    </header>
  );
}
