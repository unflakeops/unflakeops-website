import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="main-header">
      <div className="site-shell header-inner">
        <Link href="/" className="brand-row" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo size={38} />
        </Link>
        <nav className="header-nav" aria-label="Primary navigation">
          <a href="/#problem">The problem</a>
          <a href="/#pilot">The pilot</a>
          <a href="/#how">How it works</a>
          <a href="/#about">About</a>
          <a href="/#conversation">Contact</a>
        </nav>
      </div>
    </header>
  );
}
