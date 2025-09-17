"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Header from "../components/Header";

/** ENV */
const BOOKING_URL = "/ci-audit"; // Use env var or fallback to ci-audit
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
 *  Page
 *  ------------------------------- */
export default function HomePage() {
  return (
    <main className="main-container">
      <Header />

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <div>
            <h1 className="hero-title">
              Cut Failed Builds by{" "}
              <span style={{ color: "#38bdf8" }}>50%+</span> in 30 Days.
              Guaranteed.
            </h1>
            <p className="hero-subtitle">
              Stop wasting engineering hours chasing flaky tests. In just 15
              minutes, we'll baseline your failure rate and show you the 3
              fastest fixes.
            </p>
            <div className="hero-actions">
              <a
                href={BOOKING_URL || "#book"}
                target="_blank"
                rel="noreferrer"
                className="hero-cta"
                aria-label="Book a 15-minute rapid CI audit of your build pipeline"
              >
                Book My Free CI Audit →
              </a>
              <a href="#calc" className="hero-cta-secondary">
                Estimate Your Waste → Calculator
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THIS MATTERS */}
      <section className="section">
        <h2 className="card-title">Why This Matters</h2>
        <p style={{ color: "#cbd5e1", fontSize: "18px", marginBottom: "20px" }}>
          Right now, your CI/CD isn't broken — but it's bleeding:
        </p>
        <ul
          style={{
            color: "#cbd5e1",
            fontSize: "16px",
            lineHeight: "1.6",
            paddingLeft: "20px",
          }}
        >
          <li>Engineers rerunning tests instead of shipping features.</li>
          <li>Builds failing for no reason, slowing releases.</li>
          <li>Teams firefighting instead of building.</li>
        </ul>
        <p style={{ color: "#cbd5e1", fontSize: "16px", marginTop: "20px" }}>
          Every week you're losing time, money, and trust in your pipelines.
        </p>
      </section>

      {/* WHO WE ARE */}
      <section className="section">
        <h2 className="card-title">Who We Are</h2>
        <p style={{ color: "#cbd5e1", fontSize: "16px", lineHeight: "1.6" }}>
          I'm Muhammad Qureshi. After 15+ years in QA and DevOps, I've seen
          every way builds can fail.
        </p>
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "16px",
            lineHeight: "1.6",
            marginTop: "16px",
          }}
        >
          What I discovered?
        </p>
        <blockquote
          style={{
            borderLeft: "4px solid #38bdf8",
            paddingLeft: "20px",
            margin: "20px 0",
            fontStyle: "italic",
            color: "#e5e7eb",
            fontSize: "18px",
          }}
        >
          60%+ of failed builds aren't "real" — they're flaky.
        </blockquote>
        <p style={{ color: "#cbd5e1", fontSize: "16px", lineHeight: "1.6" }}>
          That's why I built UnflakeOps: a system to fingerprint failures,
          enforce PASS/WARN/FAIL merge gates, and quarantine flakes
          automatically.
        </p>
      </section>

      {/* WHAT YOU'LL GET IN YOUR FREE AUDIT */}
      <section className="section">
        <h2 className="card-title">What You'll Get in Your Free Audit</h2>
        <p style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "20px" }}>
          In your 15-min CI Audit, we'll:
        </p>
        <ul
          style={{
            color: "#cbd5e1",
            fontSize: "16px",
            lineHeight: "1.6",
            paddingLeft: "20px",
            marginBottom: "20px",
          }}
        >
          <li>✅ Baseline your current flaky failure rate (FFR).</li>
          <li>✅ Show you the top 3 recurring failure fingerprints.</li>
          <li>✅ Outline a simple merge-gate + quarantine policy.</li>
        </ul>
        <p style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "20px" }}>
          You'll walk away with:
        </p>
        <ul
          style={{
            color: "#cbd5e1",
            fontSize: "16px",
            lineHeight: "1.6",
            paddingLeft: "20px",
            marginBottom: "20px",
          }}
        >
          <li>A clear waste number in hours & £££.</li>
          <li>A one-page 30-day plan.</li>
          <li>
            A decision: fix it yourself, or let us cut failures by 50% in 30
            days.
          </li>
        </ul>
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <a
            href={BOOKING_URL || "#book"}
            target="_blank"
            rel="noreferrer"
            className="hero-cta"
            style={{ display: "inline-block" }}
          >
            Book My Free CI Audit →
          </a>
        </div>
      </section>

      {/* PROOF */}
      <section className="proof-section">
        <h2 className="card-title">Proof</h2>
        <p style={{ color: "#cbd5e1", fontSize: "18px", marginBottom: "20px" }}>
          "62% fewer flaky failures in 28 days. +220 engineer hours reclaimed
          per quarter." — CTO, EU SaaS
        </p>
      </section>

      {/* PROCESS AT A GLANCE */}
      <section className="section">
        <h2 className="card-title">Process at a Glance</h2>
        <ol
          style={{
            color: "#cbd5e1",
            fontSize: "16px",
            lineHeight: "1.6",
            paddingLeft: "20px",
          }}
        >
          <li>Week 1: Baseline & Gates</li>
          <li>Week 2: Fingerprints & Quarantine</li>
          <li>Week 3: Fixes & Adoption</li>
          <li>Week 4: Enforce & Handover</li>
        </ol>
        <p style={{ color: "#cbd5e1", fontSize: "16px", marginTop: "20px" }}>
          Outcome: Fewer flakes, faster releases, happier engineers.
        </p>
      </section>

      {/* ROI CALCULATOR */}
      <section className="section">
        <h2 className="card-title">ROI Calculator</h2>
        <p style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "20px" }}>
          👉 Not ready to book yet? Estimate your waste:
        </p>
        <Calculator />
        <p style={{ color: "#cbd5e1", fontSize: "16px", marginTop: "20px" }}>
          We'll show you annual waste + payback period instantly.
        </p>
      </section>

      {/* SCARCITY */}
      <section className="section">
        <h2 className="card-title">⚠️ We only run 3 free audits per week.</h2>
        <p style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "20px" }}>
          If you want to stop firefighting and start shipping with confidence,
          grab your slot now.
        </p>
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <a
            href={BOOKING_URL || "#book"}
            target="_blank"
            rel="noreferrer"
            className="hero-cta"
            style={{ display: "inline-block" }}
          >
            Book My Free CI Audit →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="main-footer">
        <div>
          <p
            style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "10px" }}
          >
            UnflakeOps — Release Reliability as a Service.
          </p>
          <p
            style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "20px" }}
          >
            📧 hello@unflakeops.com
          </p>
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
        </div>
      </footer>
    </main>
  );
}
