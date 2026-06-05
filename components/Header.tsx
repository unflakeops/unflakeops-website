import Image from "next/image";
import Link from "next/link";

/** ENV */
const BADGE =
  process.env.NEXT_PUBLIC_REGION_BADGE ??
  "Senior-led delivery • Fixed scope • You own every deliverable";

export default function Header() {
  return (
    <header className="main-header">
      <div className="site-shell header-inner">
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

        <nav className="header-nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#approach">Approach</a>
          <a href="#team">Team</a>
          <a href="#offers">Offers</a>
          <a href="#book">Contact</a>
        </nav>

        <div className="header-badge">
          <div className="header-badge__content">
            <span className="header-badge__text">{BADGE}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
