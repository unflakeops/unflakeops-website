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
  pipelinesPerWeek: 200,
  failureRatePct: 15,
  pctFlaky: 60,
  triageMinutes: 10,
  rerunMinutes: 15,
  engineersAffected: 2,
  loadedHourly: 75,
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
          <p style={{ 
            color: "#94a3b8", 
            marginBottom: 16, 
            fontSize: 11,
            fontStyle: "italic"
          }}>
            Pre-filled with typical values for B2B SaaS teams (50-100 engineers). 
            Adjust to match your setup.
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
                flake-rate &amp; CI health score
              </li>
              <li>
                <strong>PASS/WARN/FAIL merge gates</strong> — live on PRs, 
                enforced and configured
              </li>
              <li>
                <strong>Top-5 fixes as PRs</strong> — ready to merge, 
                targeting your worst flakes
              </li>
              <li>
                <strong>Telemetry dashboard</strong> — track FFR trends, 
                savings, and ROI over time
              </li>
              <li>
                <strong>30/90-day improvement plan</strong> — roadmap for 
                continued reliability gains
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

      {/* ICP FILTER */}
      <section className="section" style={{ 
        background: "rgba(59, 130, 246, 0.05)", 
        border: "1px solid rgba(59, 130, 246, 0.2)",
        borderRadius: "12px",
        padding: "16px 20px",
        marginTop: "24px"
      }}>
        <p style={{ 
          margin: 0, 
          color: "#93c5fd", 
          fontSize: "14px",
          textAlign: "center"
        }}>
          <strong>Built for B2B SaaS engineering teams with 15-150 engineers across UK/EU.</strong>
          {" "}Outside this scope? We can recommend alternatives.
        </p>
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
            "Rules & fingerprint