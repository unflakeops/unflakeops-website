import Header from "../../components/Header";

export default function Page() {
  return (
    <main className="main-container">
      <Header />

      {/* Header */}
      <header className="hero-section">
        <div className="hero-content">
          <div>
            <div className="brand-row">
              <span className="brand-name">Thank You</span>
            </div>
            <h1 className="hero-title">
              <span style={{ color: "#10b981" }}>Thank you!</span>
            </h1>
            <p className="hero-subtitle">
              We've received your information and will be in touch soon.
            </p>
          </div>
        </div>
      </header>

      {/* What happens next */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          What Happens Next
        </h2>
        <div className="card-grid-2" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              1. Email Confirmation
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              You'll receive an email with your calculator results and next
              steps within the next few minutes.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              2. Initial Review
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Our team will review your information and prepare a customized
              proposal based on your specific situation.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              3. Follow-up
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              We'll reach out within 24 hours to schedule your 15-minute CI
              audit or answer any questions you may have.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              4. Next Steps
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              If you're ready to proceed, we can start with a Sprint engagement
              to achieve 50%+ flaky failure reduction in 30 days.
            </p>
          </div>
        </div>
      </section>

      {/* Immediate actions */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          While You Wait
        </h2>
        <div className="card-grid-2" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Learn More
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>
                <a href="/case-study" style={{ textDecoration: "underline" }}>
                  Read our case study
                </a>{" "}
                — 62% reduction in 28 days
              </li>
              <li>
                <a href="/guarantee" style={{ textDecoration: "underline" }}>
                  Review our guarantee
                </a>{" "}
                — 50%+ reduction or we continue at no cost
              </li>
              <li>
                <a href="/terms" style={{ textDecoration: "underline" }}>
                  Check our terms
                </a>{" "}
                — transparent pricing and conditions
              </li>
            </ul>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Prepare for Success
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>Gather recent CI failure reports</li>
              <li>Identify your most problematic test suites</li>
              <li>Review your current CI configuration</li>
              <li>Prepare questions about our approach</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact information */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Questions?
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          If you have any immediate questions or need to reach us:
        </p>
        <div
          style={{
            marginTop: "16px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "#a7f3d0", margin: "0 0 8px 0" }}>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:hello@unflakeops.com"
              style={{ textDecoration: "underline" }}
            >
              hello@unflakeops.com
            </a>
          </p>
          <p style={{ color: "#a7f3d0", margin: "0" }}>
            <strong>Response time:</strong> Within 24 hours
          </p>
        </div>
      </section>

      {/* Back to calculator */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Want to Try Again?
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          You can always recalculate your potential savings with different
          parameters:
        </p>
        <div style={{ marginTop: "16px" }}>
          <a
            href="/#calc"
            className="hero-cta"
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#38bdf8",
              color: "#0b1323",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            Back to Calculator
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
