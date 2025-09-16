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
              <span className="brand-name">Case Study</span>
            </div>
            <h1 className="hero-title">
              <span style={{ color: "#10b981" }}>62%</span> fewer flaky failures
              in 28 days
            </h1>
            <p className="hero-subtitle">
              How we helped a European SaaS company reclaim ~220 engineer hours
              per quarter
            </p>
          </div>
        </div>
      </header>

      {/* Client overview */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Client Overview
        </h2>
        <div className="card-grid-2" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>Company</h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              European B2B SaaS company with 45 engineers across 3 teams
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              CI System
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              GitHub Actions with 2,400+ pipelines per week across multiple
              repositories
            </p>
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          The Problem
        </h2>
        <ul className="plan-list" style={{ color: "#cbd5e1" }}>
          <li>
            <strong>High flaky failure rate:</strong> 28% of all pipeline
            failures were flaky
          </li>
          <li>
            <strong>Engineer time waste:</strong> 15-20 minutes per flaky
            failure for triage and reruns
          </li>
          <li>
            <strong>Release delays:</strong> Critical features blocked by
            unreliable CI
          </li>
          <li>
            <strong>Team frustration:</strong> Engineers losing confidence in CI
            system
          </li>
          <li>
            <strong>Cost impact:</strong> Estimated £180k+ annual waste on flaky
            failures
          </li>
        </ul>
      </section>

      {/* Baseline metrics */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Baseline Metrics (Pre-Intervention)
        </h2>
        <div className="card-grid-3" style={{ marginTop: "16px" }}>
          <div
            className="card"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#ef4444" }}
            >
              28%
            </div>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Flaky Failure Rate
            </p>
          </div>
          <div
            className="card"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#f59e0b" }}
            >
              2,400
            </div>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Pipelines per Week
            </p>
          </div>
          <div
            className="card"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#8b5cf6" }}
            >
              672
            </div>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Flaky Failures per Week
            </p>
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Our Approach
        </h2>
        <div className="card-grid-2" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Week 1: Foundation
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>Installed read-only monitoring agent</li>
              <li>Established baseline metrics and readiness index</li>
              <li>Deployed PASS/WARN/FAIL gates on all PRs</li>
              <li>Identified and quarantined top 5 flaky test patterns</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Week 2: Fingerprinting
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>Fingerprinted recurring failure patterns</li>
              <li>Expanded quarantine rules for noisy test suites</li>
              <li>Implemented auto-rerun policies for known flakies</li>
              <li>Started team coaching on flaky test patterns</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Week 3: Fixes
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>Delivered 15 targeted fixes via pull requests</li>
              <li>Removed flaky patterns from critical paths</li>
              <li>Tightened WARN gates on protected branches</li>
              <li>Updated signatures based on fresh telemetry</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Week 4: Handover
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>Moved to PASS/FAIL gating on main branch</li>
              <li>Delivered all scripts, dashboards, and playbooks</li>
              <li>Confirmed 62% FFR reduction achieved</li>
              <li>Established 90-day maintenance plan</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Results After 28 Days
        </h2>
        <div className="card-grid-3" style={{ marginTop: "16px" }}>
          <div
            className="card"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#10b981" }}
            >
              62%
            </div>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Reduction in Flaky Failures
            </p>
          </div>
          <div
            className="card"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#10b981" }}
            >
              11%
            </div>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              New Flaky Failure Rate
            </p>
          </div>
          <div
            className="card"
            style={{ padding: "16px", textAlign: "center" }}
          >
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#10b981" }}
            >
              220
            </div>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Engineer Hours Reclaimed/Quarter
            </p>
          </div>
        </div>
      </section>

      {/* Impact metrics */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Business Impact
        </h2>
        <div className="card-grid-2" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Time Savings
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>~220 engineer hours per quarter reclaimed</li>
              <li>
                15-minute average triage time eliminated per flaky failure
              </li>
              <li>Faster feature delivery with reliable CI</li>
              <li>Reduced context switching for engineers</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Cost Savings
            </h3>
            <ul
              className="plan-list"
              style={{ color: "#cbd5e1", marginTop: "8px" }}
            >
              <li>£110k+ annual cost reduction</li>
              <li>ROI of 8.5x on Sprint investment</li>
              <li>Reduced infrastructure costs from fewer reruns</li>
              <li>Improved team productivity and morale</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Client Testimonial
        </h2>
        <div
          style={{
            marginTop: "16px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "24px",
            borderRadius: "12px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              fontStyle: "italic",
              color: "#a7f3d0",
              margin: "0 0 16px 0",
            }}
          >
            "UnflakeOps delivered exactly what they promised. We went from 28%
            flaky failures to 11% in just 28 days. The team is more productive,
            releases are more reliable, and we've reclaimed hundreds of engineer
            hours. The ROI was immediate."
          </p>
          <p
            style={{
              color: "#6ee7b7",
              fontWeight: "600",
              margin: "0",
            }}
          >
            — CTO, European SaaS Company
          </p>
        </div>
      </section>

      {/* What they kept */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          What They Kept
        </h2>
        <ul className="plan-list" style={{ color: "#cbd5e1" }}>
          <li>
            <strong>Monitoring dashboards:</strong> Real-time flaky failure
            tracking
          </li>
          <li>
            <strong>Automated scripts:</strong> Fingerprinting and quarantine
            management
          </li>
          <li>
            <strong>Gate configurations:</strong> PASS/WARN/FAIL rules for all
            branches
          </li>
          <li>
            <strong>Team playbooks:</strong> SOPs for handling flaky failures
          </li>
          <li>
            <strong>Maintenance plan:</strong> 90-day roadmap for continued
            improvement
          </li>
        </ul>
      </section>

      <footer className="main-footer">
        <p>
          Ready to achieve similar results?{" "}
          <a href="/#book" style={{ textDecoration: "underline" }}>
            Book a 15-minute CI audit
          </a>{" "}
          to see your potential savings.
        </p>
      </footer>
    </main>
  );
}
