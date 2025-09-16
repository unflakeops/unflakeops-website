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
              <span className="brand-name">Terms of Service</span>
            </div>
            <h1 className="hero-title">Terms of Service</h1>
            <p className="hero-subtitle">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      {/* Terms content */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          1. Services
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          UnflakeOps provides CI/CD optimization services including flaky test
          reduction, pipeline analysis, and engineering coaching. Our services
          are delivered through read-only access to your CI systems and pull
          request-based changes.
        </p>
      </section>

      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          2. Access and Permissions
        </h2>
        <ul className="plan-list" style={{ color: "#cbd5e1" }}>
          <li>We require least-privilege access to your CI systems</li>
          <li>All changes are delivered via pull requests for your review</li>
          <li>
            You maintain full ownership of all scripts, dashboards, and
            configurations
          </li>
          <li>We operate under read-only permissions by default</li>
        </ul>
      </section>

      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          3. Guarantee and Performance
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          Our guarantee is detailed in our{" "}
          <a href="/guarantee" style={{ textDecoration: "underline" }}>
            guarantee page
          </a>
          . We commit to reducing flaky failure rates by 50%+ within 30 days, or
          we continue our Core service at no additional fee for up to 60 days.
        </p>
      </section>

      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          4. Pricing and Payment
        </h2>
        <ul className="plan-list" style={{ color: "#cbd5e1" }}>
          <li>All prices are exclusive of VAT</li>
          <li>UK clients: +20% VAT</li>
          <li>EU VAT-registered clients: reverse charge (no UK VAT)</li>
          <li>Non-EU clients: no UK VAT</li>
          <li>Payment terms: Net 30 days</li>
        </ul>
      </section>

      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          5. Data Protection
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          We comply with GDPR and UK-GDPR. Data Processing Agreements (DPA),
          International Data Transfer Agreements (IDTA), and Standard
          Contractual Clauses (SCCs) are available on request. We use minimum
          necessary data access and implement appropriate security measures.
        </p>
      </section>

      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          6. Intellectual Property
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          You retain full ownership of all deliverables including scripts,
          dashboards, configurations, and documentation. We grant you a
          perpetual, non-exclusive license to use any tools or methodologies we
          develop during the engagement.
        </p>
      </section>

      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          7. Limitation of Liability
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          Our liability is limited to the total fees paid for the services. We
          are not liable for indirect, consequential, or punitive damages. This
          limitation does not apply to death, personal injury, or fraud.
        </p>
      </section>

      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          8. Termination
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          Either party may terminate with 30 days written notice. Upon
          termination, we will provide all deliverables and documentation. You
          retain all rights to materials created during the engagement.
        </p>
      </section>

      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          9. Governing Law
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          These terms are governed by English law. Any disputes will be subject
          to the exclusive jurisdiction of the English courts.
        </p>
      </section>

      <footer className="main-footer">
        <p>
          For questions about these terms, please contact us at{" "}
          <a
            href="mailto:legal@unflakeops.com"
            style={{ textDecoration: "underline" }}
          >
            legal@unflakeops.com
          </a>
        </p>
      </footer>
    </main>
  );
}
