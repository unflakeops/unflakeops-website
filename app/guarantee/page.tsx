import Header from "../../components/Header";

export default function Page() {
  return (
    <main className="main-container">
      <Header />

      {/* Page Header */}
      <header className="hero-section">
        <div className="hero-content">
          <div>
            <div className="brand-row">
              <span className="brand-name">Guarantee</span>
            </div>
            <h1 className="hero-title">
              Cut flaky CI failures by{" "}
              <span style={{ color: "#10b981" }}>50%+</span> in 30 days — or we
              continue Core at no additional core fee (cap 60 days).
            </h1>
            <p className="hero-subtitle">
              Measurable, unambiguous, and transparent — here's exactly how we
              define FFR, baseline, success, prerequisites, and exclusions.
            </p>
          </div>
        </div>
      </header>

      {/* Two quick cards */}
      <section className="card-grid-2" style={{ gap: "24px" }}>
        <div className="card">
          <h2
            className="card-title"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            Who this is for
          </h2>
          <ul className="plan-list" style={{ color: "#cbd5e1" }}>
            <li>B2B SaaS teams with 15–150 engineers</li>
            <li>GitHub Actions or GitLab CI as primary CI</li>
            <li>≥ 500 pipelines in the last 28 days (or equivalent)</li>
          </ul>
        </div>
        <div className="card">
          <h2
            className="card-title"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            Outcome we guarantee
          </h2>
          <p className="text-secondary" style={{ marginTop: "12px" }}>
            A{" "}
            <span style={{ fontWeight: "600", color: "var(--text)" }}>
              ≥ 50% reduction
            </span>{" "}
            in your flaky‑failure rate (FFR) by Day 30 — otherwise we continue
            our Core service at{" "}
            <span style={{ fontWeight: "600", color: "var(--text)" }}>
              no additional core fee
            </span>{" "}
            for up to 60 days until we do.
          </p>
        </div>
      </section>

      {/* Definitions */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Definitions
        </h2>
        <div className="card-grid-2" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Flaky Test
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              A test/job that can pass and fail with{" "}
              <em>no code or environment change</em> between runs.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Flaky Failure Event (FFE)
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              A pipeline failure attributable to flakiness or unstable CI,
              confirmed by rerun/pass or known fingerprints.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Flaky Failure Rate (FFR)
            </h3>
            <div
              style={{
                marginTop: "12px",
                background: "#0b1323",
                padding: "12px",
                borderRadius: "8px",
                color: "#cbd5e1",
                fontSize: "14px",
              }}
            >
              FFR = FFEs ÷ total pipelines
            </div>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Computed daily and aggregated over the window.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Baseline Window
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Last{" "}
              <span style={{ fontWeight: "600", color: "var(--text)" }}>
                28 days
              </span>{" "}
              prior to Day 1, or the most recent{" "}
              <span style={{ fontWeight: "600", color: "var(--text)" }}>
                500 pipelines
              </span>
              , whichever is longer.
            </p>
          </div>
        </div>
      </section>

      {/* Success criteria */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          Success criteria
        </h2>
        <ul className="plan-list" style={{ color: "#cbd5e1" }}>
          <li>
            Any{" "}
            <span style={{ fontWeight: "600", color: "var(--text)" }}>
              7‑day window
            </span>{" "}
            within Day 1–30 has FFR ≤{" "}
            <span style={{ fontWeight: "600", color: "var(--text)" }}>
              50% of baseline
            </span>
            , or
          </li>
          <li>
            The{" "}
            <span style={{ fontWeight: "600", color: "var(--text)" }}>
              Day 1–30 average FFR
            </span>{" "}
            ≤ 50% of baseline
          </li>
          <li>Dashboards + CSV/JSON export provided at handover</li>
        </ul>
      </section>

      {/* Prereqs & Exclusions */}
      <section className="card-grid-2 section">
        <div className="card">
          <h2
            className="card-title"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            Prerequisites
          </h2>
          <ul className="plan-list" style={{ color: "#cbd5e1" }}>
            <li>Least‑privilege access (read + PRs for changes)</li>
            <li>
              PR reviews within{" "}
              <span style={{ fontWeight: "600", color: "var(--text)" }}>
                2 business days
              </span>
            </li>
            <li>No planned CI migrations/outages during sprint</li>
            <li>1–2 hours/week from your engineering contact(s)</li>
          </ul>
        </div>
        <div className="card">
          <h2
            className="card-title"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            Exclusions
          </h2>
          <ul className="plan-list" style={{ color: "#cbd5e1" }}>
            <li>Legitimate regressions introduced by code changes</li>
            <li>Provider/infra incidents (CI, cloud, quota, region)</li>
            <li>Major framework rewrites started during sprint</li>
            <li>Org policies blocking gates/quarantines rollout</li>
          </ul>
        </div>
      </section>

      {/* What we deliver */}
      <section className="card section">
        <h2
          className="card-title"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          What we deliver
        </h2>
        <div className="card-grid-3" style={{ marginTop: "16px" }}>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>Week‑1</h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Baseline & Readiness Index;{" "}
              <span style={{ fontWeight: "600", color: "var(--text)" }}>
                PASS/WARN/FAIL
              </span>{" "}
              gate on PRs; Top‑5 fixes prepped; telemetry online.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>Week‑2</h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Fingerprints; quarantines; rules for noisy suites/jobs; coaching.
            </p>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <h3 style={{ fontWeight: "600", color: "var(--text)" }}>
              Week‑3/4
            </h3>
            <p className="text-secondary" style={{ marginTop: "8px" }}>
              Fixes & adoption; enforce; SOPs; 30‑/90‑day plan; handover.
            </p>
          </div>
        </div>
        <div
          style={{
            marginTop: "24px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "#6ee7b7" }}>
            <span style={{ fontWeight: "600", color: "#a7f3d0" }}>
              You keep everything
            </span>{" "}
            — rules, scripts, dashboards, SOPs — in your repos.
          </p>
        </div>
      </section>

      {/* Visuals with inline SVGs */}
      <section className="card-grid-2 section">
        <div className="card">
          <h2
            className="card-title"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            How we measure
          </h2>
          <div
            style={{
              marginTop: "12px",
              background: "#0b1323",
              padding: "16px",
              borderRadius: "12px",
              color: "#cbd5e1",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#9ca3af",
              }}
            >
              Formula
            </div>
            <div
              style={{
                marginTop: "4px",
                fontSize: "18px",
                fontWeight: "600",
                color: "var(--text)",
              }}
            >
              FFR = FFEs ÷ total pipelines
            </div>
            <ul
              style={{
                marginTop: "12px",
                paddingLeft: "24px",
                color: "#cbd5e1",
                fontSize: "14px",
              }}
            >
              <li>
                <span style={{ fontWeight: "500", color: "var(--text)" }}>
                  FFEs
                </span>
                : confirmed by rerun/pass or fingerprint
              </li>
              <li>
                Baseline = last 28 days or 500 pipelines (whichever is longer)
              </li>
              <li>
                Success = any 7‑day window ≤ 50% baseline, or Day1–30 average ≤
                50%
              </li>
            </ul>
          </div>
        </div>
        <div className="card">
          <h2
            className="card-title"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            Process (at a glance)
          </h2>
          <div style={{ marginTop: "16px" }}>
            {/* Gate Score flow (inline SVG) */}
            <svg
              viewBox="0 0 760 160"
              style={{ width: "100%", height: "auto", marginTop: "16px" }}
              role="img"
              aria-label="Gate Score on PRs"
            >
              <rect x="0" y="0" width="760" height="160" rx="12" fill="none" />
              <rect
                x="20"
                y="50"
                width="110"
                height="60"
                rx="10"
                fill="#0b0b0f"
                stroke="#27272a"
              />
              <text
                x="75"
                y="85"
                textAnchor="middle"
                fill="#e5e7eb"
                fontSize="14"
              >
                Dev
              </text>
              <path d="M130 80 H190" stroke="#71717a" strokeWidth="2" />
              <polygon points="190,80 182,76 182,84" fill="#71717a" />
              <rect
                x="190"
                y="40"
                width="140"
                height="80"
                rx="10"
                fill="#0b0b0f"
                stroke="#27272a"
              />
              <text
                x="260"
                y="75"
                textAnchor="middle"
                fill="#e5e7eb"
                fontSize="14"
              >
                Pull Request
              </text>
              <path d="M330 80 H400" stroke="#71717a" strokeWidth="2" />
              <polygon points="400,80 392,76 392,84" fill="#71717a" />
              <rect
                x="400"
                y="20"
                width="160"
                height="120"
                rx="12"
                fill="#0b0b0f"
                stroke="#10b981"
              />
              <text
                x="480"
                y="55"
                textAnchor="middle"
                fill="#a7f3d0"
                fontSize="14"
                fontWeight="600"
              >
                Gate Score
              </text>
              <text
                x="480"
                y="75"
                textAnchor="middle"
                fill="#d1d5db"
                fontSize="12"
              >
                PASS · WARN · FAIL
              </text>
              <path d="M560 60 H620" stroke="#71717a" strokeWidth="2" />
              <polygon points="620,60 612,56 612,64" fill="#71717a" />
              <rect
                x="620"
                y="45"
                width="120"
                height="30"
                rx="8"
                fill="#052e1a"
                stroke="#10b981"
              />
              <text
                x="680"
                y="64"
                textAnchor="middle"
                fill="#a7f3d0"
                fontSize="12"
              >
                Merge
              </text>
              <path d="M560 100 H620" stroke="#71717a" strokeWidth="2" />
              <polygon points="620,100 612,96 612,104" fill="#71717a" />
              <rect
                x="620"
                y="85"
                width="120"
                height="30"
                rx="8"
                fill="#3f2d00"
                stroke="#f59e0b"
              />
              <text
                x="680"
                y="104"
                textAnchor="middle"
                fill="#fde68a"
                fontSize="12"
              >
                Quarantine/Coach
              </text>
            </svg>

            {/* 30‑day timeline (inline SVG) */}
            <svg
              viewBox="0 0 760 120"
              style={{ width: "100%", height: "auto" }}
              role="img"
              aria-label="30‑day sprint timeline"
            >
              <rect x="0" y="0" width="760" height="120" rx="12" fill="none" />
              <rect
                x="20"
                y="40"
                width="170"
                height="40"
                rx="8"
                fill="#052e1a"
                stroke="#10b981"
              />
              <text
                x="105"
                y="60"
                textAnchor="middle"
                fill="#a7f3d0"
                fontSize="12"
              >
                Week‑1
              </text>
              <text
                x="105"
                y="74"
                textAnchor="middle"
                fill="#d1d5db"
                fontSize="11"
              >
                Baseline + Gates
              </text>
              <rect
                x="200"
                y="40"
                width="170"
                height="40"
                rx="8"
                fill="#0b1022"
                stroke="#60a5fa"
              />
              <text
                x="285"
                y="60"
                textAnchor="middle"
                fill="#dbeafe"
                fontSize="12"
              >
                Week‑2
              </text>
              <text
                x="285"
                y="74"
                textAnchor="middle"
                fill="#d1d5db"
                fontSize="11"
              >
                Fingerprints + Quarantine
              </text>
              <rect
                x="380"
                y="40"
                width="170"
                height="40"
                rx="8"
                fill="#1f0a21"
                stroke="#e879f9"
              />
              <text
                x="465"
                y="60"
                textAnchor="middle"
                fill="#f5d0fe"
                fontSize="12"
              >
                Week‑3
              </text>
              <text
                x="465"
                y="74"
                textAnchor="middle"
                fill="#d1d5db"
                fontSize="11"
              >
                Fixes + Adoption
              </text>
              <rect
                x="560"
                y="40"
                width="170"
                height="40"
                rx="8"
                fill="#2a1900"
                stroke="#f59e0b"
              />
              <text
                x="645"
                y="60"
                textAnchor="middle"
                fill="#fde68a"
                fontSize="12"
              >
                Week‑4
              </text>
              <text
                x="645"
                y="74"
                textAnchor="middle"
                fill="#d1d5db"
                fontSize="11"
              >
                Enforce + Handover
              </text>
            </svg>
          </div>
        </div>
      </section>

      <footer className="main-footer">
        <p>
          Pricing is exclusive of VAT. UK clients: +20% VAT. EU VAT‑registered:
          reverse charge. Non‑EU: no UK VAT.
        </p>
        <p style={{ marginTop: "8px" }}>
          GDPR/UK‑GDPR. DPA/IDTA/SCCs on request. Least‑privilege access. All
          changes land via PRs.
        </p>
      </footer>
    </main>
  );
}
