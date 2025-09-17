import Header from "../../components/Header";

export default function Page() {
  return (
    <main className="main-container">
      <Header />

      {/* Header */}
      <header className="hero-section">
        <div className="hero-content">
          <div>
            <h1 className="hero-title">
              <span style={{ color: "#10b981" }}>
                🎉 Thank You — Your Results Are On The Way
              </span>
            </h1>
            <p className="hero-subtitle">
              We've received your inputs. Check your inbox — your CI waste
              estimate and ROI report are waiting for you.
            </p>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          margin: "32px 0",
          fontSize: "24px",
          color: "#64748b",
        }}
      >
        ⸻
      </div>

      {/* What happens next */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          🔥 Here's What Happens Next
        </h2>
        <div style={{ marginTop: "16px" }}>
          <div
            className="card"
            style={{ padding: "16px", marginBottom: "16px" }}
          >
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              1. Email Confirmation
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Your calculator results are in your inbox.
            </p>
          </div>
          <div
            className="card"
            style={{ padding: "16px", marginBottom: "16px" }}
          >
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              2. Book Your Free CI Audit (Recommended)
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Numbers are just the start. In a 15-minute Audit we'll baseline
              your flaky failure rate live, show you the top 3 fingerprints, and
              outline your fastest fixes.
            </p>
            <div style={{ marginTop: "12px" }}>
              <a
                href="/ci-audit"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  background: "#10b981",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "600",
                }}
              >
                👉 Book My Free CI Audit →
              </a>
            </div>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              3. Sprint Option
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Most teams discover they're wasting £50k–£250k/year. That's why 8
              out of 10 go straight into our 7-Day Sprint:
            </p>
            <ul
              style={{
                color: "#cbd5e1",
                marginTop: "8px",
                paddingLeft: "20px",
              }}
            >
              <li>Gates live on PRs</li>
              <li>Top-5 fixes prepped as PRs</li>
              <li>Dashboard + 30-day plan</li>
              <li>50% fewer flaky failures in 30 days — guaranteed</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          margin: "32px 0",
          fontSize: "24px",
          color: "#64748b",
        }}
      >
        ⸻
      </div>

      {/* Proof */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          📊 Proof
        </h2>
        <div
          style={{
            marginTop: "16px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "#a7f3d0", margin: "0", fontStyle: "italic" }}>
            "62% fewer flaky failures in 28 days. +220 engineer hours reclaimed
            per quarter." — CTO, EU SaaS
          </p>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          margin: "32px 0",
          fontSize: "24px",
          color: "#64748b",
        }}
      >
        ⸻
      </div>

      {/* While you wait */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          ⚡ While You Wait
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          Want to be ready for your Audit?
        </p>
        <ul
          className="plan-list"
          style={{ color: "#cbd5e1", marginTop: "8px", paddingLeft: "20px" }}
        >
          <li>Gather recent CI failure reports</li>
          <li>Note your most problematic test suites</li>
          <li>Review your CI/CD config</li>
          <li>Jot down questions for our team</li>
        </ul>
      </section>

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          margin: "32px 0",
          fontSize: "24px",
          color: "#64748b",
        }}
      >
        ⸻
      </div>

      {/* Contact information */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          ❓ Questions?
        </h2>
        <div style={{ marginTop: "16px" }}>
          <p style={{ color: "#cbd5e1", margin: "0 0 8px 0" }}>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:hello@unflakeops.com"
              style={{ textDecoration: "underline" }}
            >
              hello@unflakeops.com
            </a>
          </p>
          <p style={{ color: "#cbd5e1", margin: "0" }}>
            <strong>Response time:</strong> &lt;24 hours
          </p>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          textAlign: "center",
          margin: "32px 0",
          fontSize: "24px",
          color: "#64748b",
        }}
      >
        ⸻
      </div>

      {/* CTA Button */}
      <section className="card section">
        <div style={{ textAlign: "center" }}>
          <a
            href="/ci-audit"
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#10b981",
              color: "#ffffff",
              padding: "16px 32px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            👉 Yes — Book My Free CI Audit Now →
          </a>
        </div>
      </section>

      <footer className="main-footer">
        <p>
          Thank you for your interest in UnflakeOps. We look forward to helping
          you reduce flaky failures and improve your CI reliability.
        </p>
      </footer>
    </main>
  );
}
