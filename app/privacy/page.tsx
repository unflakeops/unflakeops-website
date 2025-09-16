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
              <span className="brand-name">Privacy Policy</span>
            </div>
            <h1 className="hero-title">Privacy Policy</h1>
            <p className="hero-subtitle">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Introduction
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          UnflakeOps ("we," "our," or "us") is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our services.
        </p>
      </section>

      {/* Information we collect */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Information We Collect
        </h2>
        <div className="card-grid-2" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Contact Information
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>Email addresses</li>
              <li>Company names</li>
              <li>Team size information</li>
              <li>CI system details</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              CI System Data
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>Pipeline execution data (read-only)</li>
              <li>Test results and failure patterns</li>
              <li>Repository metadata (names, branches)</li>
              <li>CI configuration information</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How we use information */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          How We Use Your Information
        </h2>
        <ul className="plan-list" style={{ color: "#cbd5e1" }}>
          <li>
            <strong>Service delivery:</strong> To provide CI optimization and
            flaky test reduction services
          </li>
          <li>
            <strong>Analysis:</strong> To analyze pipeline patterns and identify
            flaky tests
          </li>
          <li>
            <strong>Communication:</strong> To send service updates and respond
            to inquiries
          </li>
          <li>
            <strong>Improvement:</strong> To improve our services and develop
            new features
          </li>
          <li>
            <strong>Compliance:</strong> To comply with legal obligations and
            protect our rights
          </li>
        </ul>
      </section>

      {/* Data processing basis */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Legal Basis for Processing (GDPR)
        </h2>
        <div className="card-grid-2" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Contract Performance
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Processing necessary to perform our services under contract with
              you.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Legitimate Interests
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Processing necessary for our legitimate business interests in
              providing services.
            </p>
          </div>
        </div>
      </section>

      {/* Data sharing */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Information Sharing
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          We do not sell, trade, or rent your personal information. We may share
          information only:
        </p>
        <ul
          className="plan-list"
          style={{ color: "#cbd5e1", marginTop: "12px" }}
        >
          <li>With your explicit consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights and prevent fraud</li>
          <li>
            With service providers who assist in our operations (under strict
            confidentiality)
          </li>
        </ul>
      </section>

      {/* Data security */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Data Security
        </h2>
        <ul className="plan-list" style={{ color: "#cbd5e1" }}>
          <li>
            <strong>Encryption:</strong> All data encrypted in transit and at
            rest
          </li>
          <li>
            <strong>Access controls:</strong> Least-privilege access principles
          </li>
          <li>
            <strong>Monitoring:</strong> Continuous security monitoring and
            logging
          </li>
          <li>
            <strong>Updates:</strong> Regular security updates and patches
          </li>
          <li>
            <strong>Training:</strong> Staff security awareness training
          </li>
        </ul>
      </section>

      {/* Data retention */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Data Retention
        </h2>
        <div className="card-grid-2" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Service Data
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Retained for the duration of our service engagement plus 2 years
              for compliance and support purposes.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Contact Information
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Retained until you request deletion or withdraw consent, subject
              to legal retention requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Your rights */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Your Rights (GDPR)
        </h2>
        <ul className="plan-list" style={{ color: "#cbd5e1" }}>
          <li>
            <strong>Access:</strong> Request copies of your personal data
          </li>
          <li>
            <strong>Rectification:</strong> Correct inaccurate or incomplete
            data
          </li>
          <li>
            <strong>Erasure:</strong> Request deletion of your personal data
          </li>
          <li>
            <strong>Portability:</strong> Receive your data in a structured
            format
          </li>
          <li>
            <strong>Restriction:</strong> Limit how we process your data
          </li>
          <li>
            <strong>Objection:</strong> Object to processing based on legitimate
            interests
          </li>
          <li>
            <strong>Withdraw consent:</strong> Withdraw consent for
            consent-based processing
          </li>
        </ul>
      </section>

      {/* International transfers */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          International Data Transfers
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          We may transfer your data outside the EEA/UK. When we do, we ensure
          appropriate safeguards are in place, including:
        </p>
        <ul
          className="plan-list"
          style={{ color: "#cbd5e1", marginTop: "12px" }}
        >
          <li>Standard Contractual Clauses (SCCs)</li>
          <li>Adequacy decisions by the European Commission</li>
          <li>Binding Corporate Rules</li>
          <li>Certification schemes</li>
        </ul>
      </section>

      {/* Cookies */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Cookies and Tracking
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          We use minimal cookies and tracking technologies. We do not use
          advertising cookies or cross-site tracking. Any analytics are
          anonymized and used solely for service improvement.
        </p>
      </section>

      {/* Children's privacy */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Children's Privacy
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          Our services are not directed to individuals under 16. We do not
          knowingly collect personal information from children under 16. If we
          become aware of such collection, we will delete the information
          promptly.
        </p>
      </section>

      {/* Changes to policy */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Changes to This Policy
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          We may update this Privacy Policy periodically. We will notify you of
          any material changes by email or through our services. Your continued
          use of our services after changes constitutes acceptance of the
          updated policy.
        </p>
      </section>

      {/* Contact information */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Contact Us
        </h2>
        <p className="text-secondary" style={{ marginTop: "12px" }}>
          For questions about this Privacy Policy or to exercise your rights,
          contact us at:
        </p>
        <div
          style={{
            marginTop: "16px",
            background: "#0b1323",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <p style={{ color: "#cbd5e1", margin: "0" }}>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:privacy@unflakeops.com"
              style={{ textDecoration: "underline" }}
            >
              privacy@unflakeops.com
            </a>
          </p>
          <p style={{ color: "#cbd5e1", margin: "8px 0 0 0" }}>
            <strong>Data Protection Officer:</strong> dpo@unflakeops.com
          </p>
        </div>
      </section>

      <footer className="main-footer">
        <p>
          This Privacy Policy is effective as of{" "}
          {new Date().toLocaleDateString()} and applies to all information
          collected by UnflakeOps.
        </p>
      </footer>
    </main>
  );
}
