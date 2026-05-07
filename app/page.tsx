"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Header from "../components/Header";

/** ENV */
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? ""; // <-- put your UnflakeOps booking URL in .env
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@unflakeops.com";

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

const SERVICE_TRACKS = [
  {
    kicker: "Muhammad / AI reliability",
    title: "RAG, Evaluation & Output Control",
    description:
      "Make AI systems answer from the right evidence, fail safely, and produce repeatable outputs your team can trust in real workflows.",
    bullets: [
      "RAG evaluation, retrieval quality checks, and answer-grounding tests",
      "Hallucination detection, deterministic output rules, and regression suites",
      "Prompt, tool, and workflow instrumentation so failures are measurable",
    ],
    metric: "AI reliability sprint",
  },
  {
    kicker: "Abbad / Data maturity",
    title: "LLM-Ready Data & Pipelines",
    description:
      "Assess whether the data is good enough for AI decisions, then build the pipelines, models, and governance needed to improve it.",
    bullets: [
      "Data maturity audits across sources, lineage, quality, and ownership",
      "Pipelines, transformations, analytics layers, and decision-ready datasets",
      "Data contracts and monitoring so AI workflows do not rely on guesswork",
    ],
    metric: "Data maturity engagement",
  },
];

const CAPABILITIES = [
  {
    title: "RAG Readiness",
    body: "Check whether retrieval is finding the right facts, ranking them correctly, and exposing enough context for useful answers.",
  },
  {
    title: "AI Evaluations",
    body: "Create test sets, scoring rules, regression checks, and evidence-based pass/fail gates for AI answers and workflows.",
  },
  {
    title: "Hallucination Control",
    body: "Design grounding, refusal, citation, and escalation behaviour so the system knows when it should not answer.",
  },
  {
    title: "Deterministic Outputs",
    body: "Turn vague prompt behaviour into schemas, constraints, validation, tool calls, and repeatable business outputs.",
  },
  {
    title: "Data Maturity",
    body: "Assess data quality, completeness, lineage, access, ownership, and freshness before building AI on top of it.",
  },
  {
    title: "Data Pipelines",
    body: "Build the ingestion, transformation, validation, and monitoring layers that make AI systems operationally useful.",
  },
];

const APPROACH = [
  {
    step: "01",
    title: "Find the Decision",
    body: "Start with the business decision or workflow the AI system is meant to improve, not with a model or tool choice.",
  },
  {
    step: "02",
    title: "Audit Data & Retrieval",
    body: "Inspect source quality, retrieval behaviour, answer evidence, edge cases, and where hallucination or ambiguity appears.",
  },
  {
    step: "03",
    title: "Instrument & Improve",
    body: "Add pipelines, evaluation sets, scoring, structured output checks, and feedback loops so progress is visible.",
  },
  {
    step: "04",
    title: "Operationalise",
    body: "Move the workflow into production with monitoring, ownership, documentation, and clear handover for the team.",
  },
];

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
    <main className="main-container landing-page">
      <Header />

      <section className="hero-section consulting-hero">
        <div className="site-shell hero-content consulting-hero__content">
          <div className="hero-copy">
            <p className="eyebrow">AI reliability + data maturity</p>
            <h1 className="hero-title">
              Make AI useful by fixing the data and the answers.
            </h1>
            <p className="hero-subtitle">
              UnflakeOps is the front door for Muhammad and Abbad's combined
              work: reliable RAG systems, hallucination control, deterministic
              AI outputs, data maturity, and the pipelines that make LLMs worth
              trusting.
            </p>
            <div className="hero-actions">
              <a
                href={BOOKING_URL || "#book"}
                target={BOOKING_URL ? "_blank" : undefined}
                rel={BOOKING_URL ? "noreferrer" : undefined}
                className="hero-cta"
                aria-label="Book a discovery call"
              >
                Book a discovery call
              </a>
              <a href="#services" className="hero-cta-secondary">
                View services
              </a>
            </div>
            <div className="hero-proof-strip" aria-label="Delivery principles">
              <span>RAG grounded in evidence</span>
              <span>Data ready for decisions</span>
              <span>Outputs you can regression test</span>
            </div>
          </div>

          <aside className="hero-visual" aria-label="Delivery signal preview">
            <div className="visual-topline">
              <div className="visual-brand">
                <Image
                  src="/brand/unflakeops_icon_dots_dark_400.png"
                  alt="UnflakeOps"
                  width={38}
                  height={38}
                  priority
                />
                <div>
                  <strong>AI readiness cockpit</strong>
                  <span>Data, retrieval, and output signals</span>
                </div>
              </div>
              <span className="status-pill">Measured</span>
            </div>
            <div className="signal-grid">
              <div className="signal-card signal-card--green">
                <span>Retrieval</span>
                <strong>Grounded</strong>
                <p>Answers trace back to the right sources and context.</p>
              </div>
              <div className="signal-card signal-card--blue">
                <span>Data maturity</span>
                <strong>Ready</strong>
                <p>Freshness, ownership, lineage, and quality are visible.</p>
              </div>
              <div className="signal-card signal-card--amber">
                <span>Outputs</span>
                <strong>Stable</strong>
                <p>Structured responses are validated before they reach users.</p>
              </div>
            </div>
            <div className="visual-metrics">
              <div>
                <span>RAG</span>
                <p>Eval and grounding</p>
              </div>
              <div>
                <span>2 tracks</span>
                <p>AI + data</p>
              </div>
              <div>
                <span>Pipelines</span>
                <p>Decision-ready data</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="services" className="landing-section section-panel">
        <div className="site-shell">
          <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Two tracks that need each other.</h2>
          <p>
            AI reliability fails when the data is weak. Data work fails when it
            is not tied to a real decision. This offer joins both sides.
          </p>
          </div>
          <div className="service-track-grid">
          {SERVICE_TRACKS.map((track) => (
            <article className="service-track-card" key={track.title}>
              <div className="service-track-meta">{track.kicker}</div>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <ul>
                {track.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <span className="service-track-chip">{track.metric}</span>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section className="landing-section capability-section">
        <div className="site-shell">
          <div className="section-heading section-heading--dark">
          <p className="eyebrow">Capability map</p>
          <h2>Start with the AI decision, then work backwards.</h2>
          <p>
            The question is not "which LLM should we use?" It is whether the
            system has the right data, retrieves the right evidence, and gives a
            dependable answer when it matters.
          </p>
          </div>
          <div className="capability-grid">
          {CAPABILITIES.map((item) => (
            <article className="capability-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section id="approach" className="landing-section section-panel section-panel--muted">
        <div className="site-shell">
          <div className="section-heading">
          <p className="eyebrow">Approach</p>
          <h2>A practical AI-readiness rhythm.</h2>
          <p>
            We audit the decision, the data, the retrieval, and the output
            behaviour before building more automation on shaky foundations.
          </p>
          </div>
          <div className="approach-grid">
          {APPROACH.map((item) => (
            <article className="approach-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section id="team" className="landing-section team-section">
        <div className="site-shell">
          <div className="section-heading section-heading--dark">
          <p className="eyebrow">Who you work with</p>
          <h2>AI output reliability and data maturity under one roof.</h2>
          <p>
            Muhammad leads the reliability, evaluation, and output-control side.
            Abbad leads the data maturity, modelling, and pipeline side. Both
            learn enough of the other's lane to deliver joined-up work.
          </p>
          </div>
          <div className="team-grid">
          <article className="team-card">
            <div className="team-initial">M</div>
            <div>
              <h3>Muhammad</h3>
              <p>
                RAG evaluation, hallucination checks, deterministic output
                design, AI workflow instrumentation, and reliability-minded
                implementation.
              </p>
            </div>
          </article>
          <article className="team-card">
            <div className="team-initial team-initial--green">A</div>
            <div>
              <h3>Abbad</h3>
              <p>
                Data maturity, data engineering, analytics models, pipelines,
                quality checks, and preparing business data for LLM use cases.
              </p>
            </div>
          </article>
          </div>
        </div>
      </section>

      <section id="engagements" className="landing-section engagement-section">
        <div className="site-shell">
          <div className="section-heading section-heading--dark">
          <p className="eyebrow">Engagements</p>
          <h2>Lead with a problem, not a generic AI promise.</h2>
          <p>
            The lead-generation motion can open doors around concrete pains:
            hallucinating assistants, unreliable RAG answers, poor data quality,
            and pipelines that are not ready for AI decisions.
          </p>
          </div>
          <div id="offers" className="offer-grid">
            <div className="offer-card">
              <span>01</span>
              <h3>AI / RAG Reliability Audit</h3>
              <p>
                Review retrieval quality, hallucination risk, prompts, tools,
                citations, and output determinism. Leave with a scored gap list
                and a delivery plan.
              </p>
            </div>
            <div className="offer-card">
              <span>02</span>
              <h3>Data Maturity for LLMs</h3>
              <p>
                Assess whether the organisation's data is complete, fresh,
                governed, traceable, and structured enough for AI workflows to
                make the right decisions.
              </p>
            </div>
            <div className="offer-card">
              <span>03</span>
              <h3>Build & Operationalise</h3>
              <p>
                Improve the pipelines, add eval harnesses, wire monitoring, and
                turn the use case into a workflow that can survive real users.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="book" className="landing-section contact-section">
        <div className="site-shell contact-grid">
          <div>
            <p className="eyebrow">Get started</p>
            <h2>Bring us the AI workflow that cannot be trusted yet.</h2>
            <p>
              We will look at the decision, the data behind it, how retrieval
              works, where the answer can go wrong, and what needs to change
              before the system is safe to scale.
            </p>
          </div>
          <div className="contact-card">
            <a
              href={BOOKING_URL || `mailto:${EMAIL}`}
              target={BOOKING_URL ? "_blank" : undefined}
              rel={BOOKING_URL ? "noreferrer" : undefined}
              className="hero-cta contact-button"
            >
              {BOOKING_URL ? "Book a discovery call" : "Email the team"}
            </a>
            <a href={`mailto:${EMAIL}`} className="contact-email">
              {EMAIL}
            </a>
            <p>
              Send the use case, the data sources, what the AI system currently
              gets wrong, and what a reliable answer would unlock.
            </p>
          </div>
        </div>
      </section>

      <footer className="main-footer">
        <div className="site-shell footer-inner">
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
