"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Header from "../components/Header";

/** ENV */
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? ""; // <-- put your UnflakeOps booking URL in .env
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@unflakeops.com";
const BADGE =
  process.env.NEXT_PUBLIC_REGION_BADGE ??
  "Read-only access • PR-based changes • You own everything";
const HERO_ASSURANCE = process.env.NEXT_PUBLIC_HERO_ASSURANCE ?? "line"; // "line" | "bullets"

/** -------------------------------
 *  Currency helpers
 *  ------------------------------- */
type Currency = "GBP" | "EUR" | "USD";
const CURRENCY: Record<Currency, { symbol: string }> = {
  GBP: { symbol: "£" },
  EUR: { symbol: "€" },
  USD: { symbol: "$" },
};

/** -------------------------------
 *  Calculator types & defaults
 *  ------------------------------- */
type Inputs = {
  pipelinesPerWeek: number; // Pipelines per week
  failureRatePct: number; // % of pipelines that fail
  pctFlaky: number; // % of failures that are flaky
  triageMinutes: number; // Avg triage minutes per flaky failure
  rerunMinutes: number; // Minutes spent per flaky failure on reruns
  engineersAffected: number; // Engineers pulled in per flaky incident
  loadedHourly: number; // Loaded hourly cost per engineer
  currency: Currency;
  sprintPrice: number; // One-off Sprint price
  coreMonthly: number; // Core monthly price
};

const DEFAULTS: Inputs = {
  pipelinesPerWeek: 150,
  failureRatePct: 20,
  pctFlaky: 35,
  triageMinutes: 15,
  rerunMinutes: 20,
  engineersAffected: 2,
  loadedHourly: 100,
  currency: "GBP",
  sprintPrice: 4000,
  coreMonthly: 8000,
};

/** -------------------------------
 *  Calculator core
 *  ------------------------------- */
function useCalc(i: Inputs) {
  const out = useMemo(() => {
    const failuresPerWeek = i.pipelinesPerWeek * (i.failureRatePct / 100);
    const flakyPerWeek = failuresPerWeek * (i.pctFlaky / 100);

    const minutesPerFlaky =
      (i.triageMinutes + i.rerunMinutes) * i.engineersAffected;
    const minutesTotal = flakyPerWeek * minutesPerFlaky;

    const weeklyHours = minutesTotal / 60;
    const weeklyCost = weeklyHours * i.loadedHourly;
    const annualCost = weeklyCost * 52;

    const monthlySavings50 = (annualCost * 0.5) / 12; // if we cut FFR by 50%
    const sprintPaybackDays =
      monthlySavings50 > 0 ? (i.sprintPrice / monthlySavings50) * 30 : Infinity;

    const coreRoiMultiplier =
      i.coreMonthly > 0 ? monthlySavings50 / i.coreMonthly : 0;

    const plan =
      coreRoiMultiplier >= 1.3
        ? "Sprint + Core"
        : coreRoiMultiplier >= 0.7
        ? "Sprint → trial Core"
        : "Sprint only (or DIY Pack)";

    return {
      weeklyHours,
      weeklyCost,
      annualCost,
      monthlySavings50,
      sprintPaybackDays,
      coreRoiMultiplier,
      plan,
      failuresPerWeek,
      flakyPerWeek,
    };
  }, [i]);

  return out;
}

/** -------------------------------
 *  Calculator UI
 *  ------------------------------- */
function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) {
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      <div className="form-input-group">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
          className="form-input"
        />
        {suffix ? <span className="form-suffix">{suffix}</span> : null}
      </div>
    </label>
  );
}

function Calculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [ci, setCi] = useState("GitHub Actions");
  const [teamSize, setTeamSize] = useState("10-25");
  const [sending, setSending] = useState(false);

  const r = useCalc(inputs);
  const { symbol } = CURRENCY[inputs.currency];

  async function submitLead() {
    setSending(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          ci,
          teamSize,
          source: "calculator",
          inputs,
          results: r,
        }),
      });
      window.location.href = "/thanks";
    } catch {
      alert("Sorry—couldn’t send just now. Try again?");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="calc" className="calculator-section">
      <div className="calculator-grid">
        {/* Inputs card */}
        <div className="calculator-inputs">
          <h3 className="card-title">Flake-Rate Calculator</h3>
          <p style={{ color: "#cbd5e1", marginBottom: 16, fontSize: 12 }}>
            How much is flakiness costing you? Enter a few numbers, see
            estimated waste &amp; payback. ex VAT
          </p>
          <div className="card-grid-2">
            <NumberField
              label="Pipelines per week"
              value={inputs.pipelinesPerWeek}
              onChange={(v) => setInputs({ ...inputs, pipelinesPerWeek: v })}
            />
            <NumberField
              label="Failure rate"
              suffix="%"
              value={inputs.failureRatePct}
              onChange={(v) => setInputs({ ...inputs, failureRatePct: v })}
            />
            <NumberField
              label="% of failures that are flaky"
              suffix="%"
              value={inputs.pctFlaky}
              onChange={(v) => setInputs({ ...inputs, pctFlaky: v })}
            />
            <NumberField
              label="Triage minutes per flaky failure"
              value={inputs.triageMinutes}
              onChange={(v) => setInputs({ ...inputs, triageMinutes: v })}
            />
            <NumberField
              label="Re-run minutes per flaky failure"
              value={inputs.rerunMinutes}
              onChange={(v) => setInputs({ ...inputs, rerunMinutes: v })}
            />
            <NumberField
              label="Engineers affected per failure"
              value={inputs.engineersAffected}
              onChange={(v) => setInputs({ ...inputs, engineersAffected: v })}
            />
            <NumberField
              label="Loaded hourly cost"
              value={inputs.loadedHourly}
              onChange={(v) => setInputs({ ...inputs, loadedHourly: v })}
            />
            <label className="form-field">
              <span className="form-label">Currency</span>
              <select
                value={inputs.currency}
                onChange={(e) =>
                  setInputs({ ...inputs, currency: e.target.value as Currency })
                }
                className="form-select"
              >
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </label>

            <NumberField
              label="Sprint price (one-off)"
              value={inputs.sprintPrice}
              onChange={(v) => setInputs({ ...inputs, sprintPrice: v })}
            />
            <NumberField
              label="Core monthly price"
              value={inputs.coreMonthly}
              onChange={(v) => setInputs({ ...inputs, coreMonthly: v })}
            />
          </div>
        </div>

        {/* Results card */}
        <div className="calculator-results">
          <h3 className="card-title">Results</h3>

          <div className="results-grid">
            <Row
              label="Weekly engineer hours wasted (current)"
              value={`${r.weeklyHours.toFixed(1)} hrs / week`}
            />
            <Row
              label="Weekly cost wasted (current)"
              value={`${symbol}${r.weeklyCost.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })} / week`}
            />
            <Row
              label="Annual waste (current)"
              value={`${symbol}${r.annualCost.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })} / year`}
            />
            <Row
              label="Estimated monthly savings @ 50% reduction"
              value={`${symbol}${r.monthlySavings50.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })} / month`}
            />
            <Row
              label="Estimated payback on Sprint"
              value={
                Number.isFinite(r.sprintPaybackDays)
                  ? `${Math.max(
                      1,
                      Math.round(r.sprintPaybackDays)
                    )} days (est.)`
                  : "—"
              }
            />
            <Row
              label="ROI multiplier on Core (annualised)"
              value={`${r.coreRoiMultiplier.toFixed(2)}x`}
            />
            <Row label="Recommended plan" value={r.plan} />
          </div>

          {/* Lead capture */}
          <div className="lead-capture">
            <label className="form-field">
              <span className="form-label">Email me these results</span>
              <input
                type="email"
                required
                placeholder="work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </label>

            <div className="lead-inputs">
              <input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="form-input"
              />
              <input
                placeholder="CI (e.g., GitHub Actions)"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                className="form-input"
              />
              <input
                placeholder="Team size (e.g., 10-25)"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              onClick={submitLead}
              disabled={!email || sending}
              className="lead-button"
            >
              {sending ? "Sending…" : "Email me the results"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0b1323",
  border: "1px solid #1f2937",
  color: "#e5e7eb",
  borderRadius: 10,
  padding: "10px 12px",
};

/** simple row */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="result-row">
      <div className="result-label">{label}</div>
      <div className="result-value">{value}</div>
    </div>
  );
}

/** -------------------------------
 *  Pricing Explainers Component
 *  ------------------------------- */
function PricingExplainers() {
  const card: React.CSSProperties = {
    border: "1px solid #1f2937",
    background: "rgba(2,6,23,.4)",
    borderRadius: 14,
    padding: 16,
  };

  const summaryStyle: React.CSSProperties = {
    cursor: "pointer",
    color: "#e5e7eb",
    fontWeight: 700,
    listStyle: "none",
    outline: "none",
  };

  return (
    <section
      id="pricing-explainers"
      style={{ marginTop: 10, display: "grid", gap: 10 }}
    >
      {/* The three tiers — plain English */}
      <details style={card} open={true}>
        <summary style={summaryStyle}>The three tiers (plain English)</summary>
        <div style={{ marginTop: 10, color: "#cbd5e1" }}>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>
              <strong>Sprint — one-off setup (7 days)</strong>
              <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                <li>
                  <strong>Price range:</strong> £3k–£5k / €3.5k–€5.8k /
                  $4k–$6.5k <em>(ex VAT/tax)</em>
                </li>
                <li>
                  <strong>What you get:</strong> Baseline &amp; Readiness Index,{" "}
                  <strong>PASS/WARN/FAIL</strong> merge gates live on PRs, Top-5
                  fixes prepped as PRs, and a dashboard + 30/90-day plan.
                </li>
                <li>
                  <strong>Use it when:</strong> You want the system stood up
                  fast and immediate wins.
                </li>
              </ul>
            </li>

            <li style={{ marginTop: 10 }}>
              <strong>RRaaS Core — ongoing monthly</strong>
              <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                <li>
                  <strong>Price range:</strong> £6k–£12k/mo / €7k–€14k/mo /
                  $8k–$15k/mo <em>(ex VAT/tax)</em>
                </li>
                <li>
                  <strong>What you get:</strong> We keep fingerprints/rules
                  updated, ship weekly fixes &amp; coaching, maintain telemetry,
                  and compound the savings.
                </li>
                <li>
                  <strong>Use it when:</strong> You want flakiness to keep
                  trending down and gates to stay healthy.
                </li>
              </ul>
            </li>

            <li style={{ marginTop: 10 }}>
              <strong>RRaaS Plus — monthly (higher touch)</strong>
              <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                <li>
                  <strong>Price range:</strong> £15k–£25k/mo / €17.5k–€29k/mo{" "}
                  <em>(ex VAT/tax)</em>
                </li>
                <li>
                  <strong>What you get (Core +):</strong>{" "}
                  Performance/incident-aware gates, SLI/SLO advisory, exec
                  reporting, and deeper enablement.
                </li>
                <li>
                  <strong>Use it when:</strong> Larger orgs, strict
                  SLOs/compliance, or multiple repos/teams.
                </li>
              </ul>
            </li>
          </ul>

          <p style={{ marginTop: 10, color: "#94a3b8" }}>
            <em>RRaaS = Release Readiness as a Service.</em>
          </p>
        </div>
      </details>

      {/* What's included in each plan */}
      <details style={card} open={false}>
        <summary style={summaryStyle}>What's included in each plan</summary>
        <div style={{ marginTop: 10, color: "#cbd5e1" }}>
          <p>
            <strong>Sprint (one-off, 7 days)</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Baseline &amp; Readiness Index</li>
            <li>PASS / WARN / FAIL merge gates live on PRs</li>
            <li>Top-5 fixes prepared as PRs</li>
            <li>Dashboard + 30/90-day plan</li>
          </ul>

          <p style={{ marginTop: 10 }}>
            <strong>RRaaS Core (monthly)</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Fingerprint/signature updates; rule tuning</li>
            <li>Weekly fixes &amp; coaching</li>
            <li>Telemetry &amp; trend reporting</li>
            <li>Compounding savings month over month</li>
          </ul>

          <p style={{ marginTop: 10 }}>
            <strong>RRaaS Plus (monthly)</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Everything in Core</li>
            <li>Performance/incident-aware gates</li>
            <li>SLI/SLO advisory &amp; exec reporting</li>
            <li>Higher-touch enablement across teams</li>
          </ul>
        </div>
      </details>

      {/* How pricing works */}
      <details style={card}>
        <summary style={summaryStyle}>
          How pricing works (anchors & ranges)
        </summary>
        <div style={{ marginTop: 10, color: "#cbd5e1" }}>
          <p>
            Cards show simple <strong>anchors</strong> for each region
            (GBP/EUR/USD) to make buying easy. The
            <strong> ranges</strong> reflect scope differences.
          </p>
          <p>
            <strong>What moves you up or down the range</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Size/complexity (repos, jobs, suites, runners)</li>
            <li>Baseline noise (flake rate, reruns, timeouts)</li>
            <li>Compliance/security overhead (on-prem, reviews, DPAs)</li>
            <li>Speed/coverage expectations (perf/incident gates, SLOs)</li>
          </ul>
          <p style={{ marginTop: 10, color: "#94a3b8" }}>
            <strong>All prices ex VAT.</strong> UK clients: +20% VAT. EU
            VAT-registered: <strong>reverse charge (no UK VAT)</strong>. Non-EU:{" "}
            <strong>no UK VAT</strong>. See{" "}
            <a href="/terms" style={{ textDecoration: "underline" }}>
              Terms
            </a>
            .
          </p>
        </div>
      </details>

      {/* Glossary */}
      <details style={card}>
        <summary style={summaryStyle}>Glossary (plain English)</summary>
        <div style={{ marginTop: 10, color: "#cbd5e1" }}>
          <dl style={{ margin: 0 }}>
            <dt>
              <strong>FFR (Flaky Failure Rate)</strong>
            </dt>
            <dd style={{ margin: "4px 0 10px 0" }}>
              Share of failed runs caused by non-deterministic issues (flakes).
              We target ≥50% reduction in 30 days.
            </dd>

            <dt>
              <strong>Merge gates (PASS / WARN / FAIL)</strong>
            </dt>
            <dd style={{ margin: "4px 0 10px 0" }}>
              Rules that decide whether a PR can merge based on test health and
              signals.
            </dd>

            <dt>
              <strong>Quarantine</strong>
            </dt>
            <dd style={{ margin: "4px 0 10px 0" }}>
              Temporarily isolating known flaky tests so they don't block good
              code.
            </dd>

            <dt>
              <strong>Fingerprints / signatures</strong>
            </dt>
            <dd style={{ margin: "4px 0 10px 0" }}>
              Patterns that identify recurring failures across jobs/suites
              (e.g., same error stack, timeout, resource).
            </dd>

            <dt>
              <strong>Telemetry</strong>
            </dt>
            <dd style={{ margin: "4px 0 10px 0" }}>
              Dashboards showing FFR trend, rerun/triage minutes saved, and ROI.
            </dd>

            <dt>
              <strong>SLI/SLO</strong>
            </dt>
            <dd style={{ margin: "4px 0 0 0" }}>
              Service Level Indicator/Objective—targets for
              reliability/performance used in Plus.
            </dd>
          </dl>
        </div>
      </details>
    </section>
  );
}

/** -------------------------------
 *  Page
 *  ------------------------------- */
export default function HomePage() {
  return (
    <main className="main-container">
      <Header />

      {/* HERO (original vibe) */}
      <section className="hero-section">
        <div className="hero-content">
          {/* LEFT */}
          <div>
            <h1 className="hero-title">
              Cut Failed Builds by{" "}
              <span style={{ color: "#38bdf8" }}>50%+</span> in 30 Days.
              Guaranteed.
            </h1>
            <p className="hero-subtitle">
              Ship with confidence: PASS/WARN/FAIL merge gates, fewer flaky
              tests, faster cycles for GitHub Actions &amp; GitLab CI.
            </p>
            <div className="hero-actions">
              <a
                href={BOOKING_URL || "#book"}
                target="_blank"
                rel="noreferrer"
                className="hero-cta"
                aria-label="Book a 15-minute rapid CI audit of your build pipeline"
              >
                Book a 15-min CI Audit
              </a>
              <a href="#calc" className="hero-cta-secondary">
                Estimate Your Waste → Calculator
              </a>
            </div>
            {HERO_ASSURANCE === "bullets" ? (
              <ul
                style={{
                  marginTop: 10,
                  paddingLeft: 18,
                  color: "#cbd5e1",
                  fontSize: 14,
                  display: "grid",
                  gap: 4,
                }}
              >
                <li>
                  <strong>Flexible</strong> — pick what you need
                </li>
                <li>
                  <strong>Secure</strong> — least-privilege access (read-only by
                  default)
                </li>
                <li>
                  <strong>Yours</strong> — you own all scripts &amp; dashboards
                </li>
              </ul>
            ) : (
              <p style={{ marginTop: 10, fontSize: 14, color: "#cbd5e1" }}>
                Flexible scope, backed by our{" "}
                <a href="/guarantee" style={{ textDecoration: "underline" }}>
                  guarantee
                </a>
                . We use minimum-access permissions, and everything we build
                (scripts, rules, dashboards) stays yours.
              </p>
            )}
          </div>

          {/* RIGHT — Week-1 */}
          <div className="week-deliverables">
            <strong className="week-title">WEEK-1 · DELIVERABLES</strong>
            <ul className="week-list">
              <li>
                <strong>Baseline &amp; Readiness Index</strong> — your
                flake-rate &amp; CI health score.
              </li>
              <li>
                <strong>Gates live</strong> — PASS/WARN/FAIL on PRs.
              </li>
              <li>
                <strong>Top-5 fixes prepared</strong> — PRs shipped.
              </li>
              <li>
                <strong>Telemetry dashboard</strong> — 30/90-day plan.
              </li>
            </ul>
            <div className="week-badges">
              {[
                "Outcome-based",
                "No day-rates",
                "Works with your repo via PRs",
              ].map((t) => (
                <span key={t} className="week-badge">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-grid">
        <PriceCard
          title="Sprint (Setup)"
          price={3500}
          unit="one-off"
          bullets={[
            "Baseline & Readiness Index.",
            "Gates live + Top-5 fixes prepped.",
            "Dashboard + 30/90-day plan.",
          ]}
        />
        <PriceCard
          title="Core (Monthly)"
          price={6500}
          unit="/mo"
          bullets={[
            "Rules & fingerprint updates.",
            "Weekly fixes & coaching.",
            "Telemetry + compounding savings.",
          ]}
        />
      </section>

      <section id="pricing-ranges" style={{ marginTop: 10 }}>
        <details
          style={{
            border: "1px solid #1f2937",
            background: "rgba(2,6,23,.4)",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              color: "#e5e7eb",
              fontWeight: 700,
              listStyle: "none",
              outline: "none",
            }}
          >
            See full pricing ranges (ex VAT)
          </summary>

          <div style={{ marginTop: 10, color: "#cbd5e1" }}>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              <li>
                <strong>Sprint:</strong> £3k–£5k / €3.5k–€5.8k / $4k–$6.5k —
                7-day audit, gates, Top-5 fixes, roadmap.
              </li>
              <li>
                <strong>RRaaS Core:</strong> £6k–£12k/mo / €7k–€14k/mo /
                $8k–$15k/mo — telemetry, weekly fixes, coaching.
              </li>
              <li>
                <strong>RRaaS Plus:</strong> £15k–£25k/mo / €17.5k–€29k/mo /
                $19.5k–$33k/mo — perf/incident gates, SLO advisory.
              </li>
            </ul>

            <p style={{ marginTop: 10, color: "#94a3b8" }}>
              Typical payback: <strong>weeks, not months</strong>, at
              moderate–high release volume.
            </p>
          </div>
        </details>
      </section>

      {/* Pricing ranges drawer (if you use it) */}
      {/* ...your existing ranges <details>... */}

      {/* Explanations */}
      <PricingExplainers />

      {/* PROOF */}
      <section className="proof-section">
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

      {/* Process (at a glance) */}
      <section className="card section">
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
      </section>

      {/* 30-DAY PLAN */}
      <ThirtyDayPlan />

      {/* CALCULATOR */}
      <Calculator />

      {/* How we measure */}
      <section className="card section">
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
      </section>

      {/* BOOKING (no Google iframe; opens new tab) */}
      <section id="book" className="booking-section">
        <h2>Book a 15-min CI Audit</h2>
        <p style={{ color: "#cbd5e1" }}>
          Pick a slot that suits you. We'll baseline your flake-rate and show
          the 3 fastest wins.
        </p>
        <div className="booking-card">
          <p style={{ marginTop: 0, color: "#94a3b8" }}>
            We use Google Calendar for scheduling. Google doesn’t allow
            embedding their booking page, so it opens in a new tab.
          </p>
          <a
            href={BOOKING_URL || "#"}
            target="_blank"
            rel="noreferrer"
            className={BOOKING_URL ? "booking-button" : "booking-button"}
            style={{
              background: BOOKING_URL ? "#38bdf8" : "#334155",
              pointerEvents: BOOKING_URL ? "auto" : "none",
            }}
          >
            {BOOKING_URL ? "Open booking page" : "Set NEXT_PUBLIC_BOOKING_URL"}
          </a>
        </div>
        <p style={{ marginTop: 8 }}>
          Or email{" "}
          <a href={`mailto:${EMAIL}`} style={{ textDecoration: "underline" }}>
            {EMAIL}
          </a>
          .
        </p>
      </section>

      {/* FOOTER */}
      <footer className="main-footer">
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
function ThirtyDayPlan() {
  const weeks = [
    {
      title: "Week 1 — Baseline & Gates",
      bullets: [
        "Read-only agent installed; Baseline & Readiness Index",
        "PASS/WARN/FAIL merge gates stood up on PRs",
        "Quarantine the worst flakes; auto-rerun policy for known flakies",
        "Top-5 fixes prepared as PRs; telemetry dashboard online",
      ],
    },
    {
      title: "Week 2 — Fingerprints & Quarantines",
      bullets: [
        "Fingerprint recurring failures across suites/jobs",
        "Expand quarantines; stabilise critical paths",
        "Ship PRs for Top-5 + quick wins; start team coaching",
        "Repo templates & SOPs introduced (rerun, quarantine, triage)",
      ],
    },
    {
      title: "Week 3 — Fix Sprint & Adoption",
      bullets: [
        "Close 10–20 targeted fixes; remove flaky patterns",
        "Tighten WARN gates on protected branches",
        "Update signatures and rules from fresh telemetry",
        "Weekly coaching + pairing to bake habits in",
      ],
    },
    {
      title: "Week 4 — Enforce & Handover",
      bullets: [
        "Move to PASS/FAIL gating on main (where safe)",
        "Handover playbooks, scripts, dashboards — you keep everything",
        "Confirm ≥50% FFR reduction on 7-day rolling window",
        "Agree next 90-day plan (or continue Core for compounding gains)",
      ],
    },
  ];

  return (
    <section className="section">
      <h3 style={{ marginTop: 0 }}>30-Day Plan</h3>
      <div className="plan-grid">
        {weeks.map((w) => (
          <div key={w.title} className="plan-card">
            <strong className="plan-title">{w.title}</strong>
            <ul className="plan-list">
              {w.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** price card */
function PriceCard({
  title,
  price,
  unit,
  bullets,
}: {
  title: string;
  price: number;
  unit: "/mo" | "one-off";
  bullets: string[];
}) {
  return (
    <div className="price-card">
      <h3 className="price-title">{title}</h3>
      <div className="price-amount">
        £{price.toLocaleString()}
        <span className="price-unit">{unit}</span>
        <span className="price-vat">ex VAT</span>
      </div>
      <ul style={{ marginTop: 8, paddingLeft: 18 }}>
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
