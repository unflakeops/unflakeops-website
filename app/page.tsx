"use client";

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://calendar.google.com/";
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@unflakeops.com";

function Pill() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 999,
        padding: "6px 10px",
        border: "1px solid #374151",
        background: "rgba(2,6,23,.5)",
        color: "#cbd5e1",
        fontSize: 14,
      }}
    >
      <span>Global</span>
      <span>•</span>
      <span>privacy-first</span>
      <span>•</span>
      <span>no lock-in</span>
    </div>
  );
}

function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const base = {
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-block",
    marginRight: 12,
  } as React.CSSProperties;
  const styles =
    variant === "primary"
      ? { ...base, background: "#38bdf8", color: "#0b1220" }
      : {
          ...base,
          background: "rgba(2,6,23,.6)",
          color: "#e5e7eb",
          border: "1px solid #334155",
        };
  return (
    <a href={href} target="_blank" rel="noreferrer" style={styles}>
      {children}
    </a>
  );
}

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 16px" }}>
      {/* HERO */}
      <header
        style={{
          border: "1px solid #1f2937",
          background:
            "linear-gradient(180deg, rgba(30,41,59,.35) 0%, rgba(2,6,23,.35) 100%)",
          padding: 24,
          borderRadius: 16,
          marginBottom: 20,
        }}
      >
        <Pill />
        <h1
          style={{
            marginTop: 10,
            fontSize: 36,
            lineHeight: 1.2,
            fontWeight: 800,
            color: "#f1f5f9",
          }}
        >
          Cut Failed Builds by <span style={{ color: "#38bdf8" }}>50%+</span> in
          30 Days. Guaranteed.
        </h1>
        <p style={{ marginTop: 8, color: "#cbd5e1" }}>
          Ship with confidence: PASS/WARN/FAIL merge gates, fewer flaky tests,
          faster cycles for GitHub Actions &amp; GitLab CI.
        </p>
        <div style={{ marginTop: 12 }}>
          <Button href={BOOKING_URL}>Book a 15-min CI Teardown</Button>
          <a
            href="#calc"
            style={{ color: "#93c5fd", textDecoration: "underline" }}
          >
            Estimate Your Waste + Calculator
          </a>
        </div>

        {/* Week-1 deliverables */}
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>
              <strong>Baseline &amp; Readiness Index</strong> — your flake-rate
              &amp; CI health score.
            </li>
            <li>
              <strong>Gates live</strong> — PASS/WARN/FAIL on PRs.
            </li>
          </ul>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>
              <strong>Top-5 fixes prepared</strong> — PRs shipped.
            </li>
            <li>
              <strong>Telemetry dashboard</strong> — 30/90-day plan.
            </li>
          </ul>
        </div>
      </header>

      {/* PRICING (ex VAT beside numbers) */}
      <section
        id="pricing"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 14,
        }}
      >
        <div
          style={{
            border: "1px solid #1f2937",
            background: "rgba(2,6,23,.4)",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Sprint (Setup)</h3>
          <div style={{ fontSize: 28, fontWeight: 800 }}>
            £3,500
            <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
              one-off
            </span>
            <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
              ex VAT
            </span>
          </div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Baseline &amp; Readiness Index.</li>
            <li>Gates live + Top-5 fixes prepped.</li>
            <li>Dashboard + 30/90-day plan.</li>
          </ul>
        </div>

        <div
          style={{
            border: "1px solid #1f2937",
            background: "rgba(2,6,23,.4)",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Core (Monthly)</h3>
          <div style={{ fontSize: 28, fontWeight: 800 }}>
            £6,500
            <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
              /mo
            </span>
            <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
              ex VAT
            </span>
          </div>
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Rules &amp; fingerprint updates.</li>
            <li>Weekly fixes &amp; coaching.</li>
            <li>Telemetry + compounding savings.</li>
          </ul>
        </div>
      </section>

      {/* VAT footnote */}
      <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 14 }}>
        <strong>All prices ex VAT.</strong> UK clients: +20% VAT. EU
        VAT-registered:
        <strong> reverse charge (no UK VAT)</strong>. Non-EU:{" "}
        <strong>no UK VAT</strong>. See{" "}
        <a href="/terms" style={{ textDecoration: "underline" }}>
          Terms
        </a>
        .
      </p>

      {/* PROOF */}
      <section
        style={{
          border: "1px solid #1f2937",
          background: "rgba(2,6,23,.4)",
          borderRadius: 14,
          padding: 16,
          marginTop: 14,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Proof</h3>
        <p style={{ margin: 0 }}>
          “<strong>62%</strong> fewer flaky failures in 28 days; ~220 engineer
          hours/quarter reclaimed.”
          <span style={{ color: "#94a3b8" }}> — CTO, EU SaaS</span>
        </p>
        <p style={{ marginTop: 8 }}>
          <a href="/case-study" style={{ textDecoration: "underline" }}>
            See the case study
          </a>
          {" · "}
          <a href="/guarantee" style={{ textDecoration: "underline" }}>
            Read the guarantee
          </a>
        </p>
      </section>

      {/* BOOKING */}
      <section id="book" style={{ marginTop: 18 }}>
        <h2>Book a 15-min CI Teardown</h2>
        <p style={{ color: "#cbd5e1" }}>
          Pick a slot that suits you. We’ll baseline your flake-rate and show
          the 3 fastest wins.
        </p>
        <div
          style={{
            border: "1px solid #1f2937",
            borderRadius: 12,
            overflow: "hidden",
            background: "rgba(2,6,23,.5)",
          }}
        >
          <iframe
            src={BOOKING_URL}
            style={{ width: "100%", height: 620, border: "0" }}
            title="Booking"
          />
        </div>
        <p style={{ marginTop: 8 }}>
          If the embed doesn’t load,{" "}
          <a href={BOOKING_URL} target="_blank" rel="noreferrer">
            open the booking page in a new tab
          </a>
          . Or email{" "}
          <a href={`mailto:${EMAIL}`} style={{ textDecoration: "underline" }}>
            {EMAIL}
          </a>
          .
        </p>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: 28,
          paddingTop: 16,
          borderTop: "1px solid #1f2937",
          color: "#9ca3af",
          fontSize: 14,
        }}
      >
        <div>
          © {new Date().getFullYear()} UnflakeOps.{" "}
          <a href="/privacy" style={{ textDecoration: "underline" }}>
            Privacy
          </a>{" "}
          ·{" "}
          <a href="/terms" style={{ textDecoration: "underline" }}>
            Terms
          </a>{" "}
          ·{" "}
          <a href="/guarantee" style={{ textDecoration: "underline" }}>
            Guarantee
          </a>
        </div>
      </footer>
    </main>
  );
}
