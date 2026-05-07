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
    kicker: "Muhammad / UnflakeOps",
    title: "CI Reliability & Release Assurance",
    description:
      "Reduce flaky failures, stabilise GitHub Actions and GitLab CI, and add practical release gates your team can keep using after handover.",
    bullets: [
      "Flake-rate baselines, PASS/WARN/FAIL gates, and pipeline telemetry",
      "Top failing suites fingerprinted, quarantined, fixed, or routed",
      "Developer workflow coaching, repo templates, and handover playbooks",
    ],
    metric: "30-day reliability sprint",
  },
  {
    kicker: "Abbad / Numetix",
    title: "Web, Data & Integration Delivery",
    description:
      "Ship customer-facing platforms, data pipelines, dashboards, and integrations with delivery discipline from discovery through launch.",
    bullets: [
      "React/Next.js platforms, internal tools, portals, and web products",
      "Data engineering, analytics, system integration, and workflow automation",
      "Quality engineering, release planning, stakeholder coordination, and delivery leadership",
    ],
    metric: "Scoped delivery engagement",
  },
];

const CAPABILITIES = [
  {
    title: "Reliability Engineering",
    body: "CI/CD audits, flaky-test reduction, merge gates, observability, release readiness, and engineering coaching.",
  },
  {
    title: "Web Platforms",
    body: "Responsive applications, dashboards, SaaS workflows, marketing sites, internal tools, and production support.",
  },
  {
    title: "Data & Analytics",
    body: "Pipelines, warehouse modelling, reporting, KPI instrumentation, migration assurance, and operational dashboards.",
  },
  {
    title: "Integration & Automation",
    body: "API integrations, healthcare and enterprise interoperability, workflow automation, test data, and monitoring.",
  },
  {
    title: "Quality & Testing",
    body: "Functional, regression, integration, performance, UAT, and release validation across product and data stacks.",
  },
  {
    title: "Delivery Leadership",
    body: "Discovery, scope framing, programme governance, stakeholder alignment, delivery cadence, and launch planning.",
  },
];

const APPROACH = [
  {
    step: "01",
    title: "Discover & Frame",
    body: "Understand the business goal, current stack, constraints, stakeholders, and the few metrics that prove progress.",
  },
  {
    step: "02",
    title: "Baseline & Architect",
    body: "Map risks, define the delivery path, instrument the right signals, and create a plan your team can actually execute.",
  },
  {
    step: "03",
    title: "Build, Fix & Assure",
    body: "Ship in short cycles with PR-based changes, automation, test coverage, quality checks, and visible weekly progress.",
  },
  {
    step: "04",
    title: "Launch, Handover & Improve",
    body: "Move the work into production, hand over playbooks and dashboards, then iterate from real adoption and reliability data.",
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
            <p className="eyebrow">UnflakeOps + Numetix delivery services</p>
            <h1 className="hero-title">
              Delivery precision for teams that need software to ship.
            </h1>
            <p className="hero-subtitle">
              CI reliability, web platforms, data pipelines, integrations, and
              QA-led delivery from two senior operators. Less theatre, more
              shipped work, cleaner handover.
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
              <span>PR-based delivery</span>
              <span>Measured outcomes</span>
              <span>Clean handover</span>
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
                  <strong>Delivery cockpit</strong>
                  <span>Reliability, build, and launch signals</span>
                </div>
              </div>
              <span className="status-pill">Live</span>
            </div>
            <div className="signal-grid">
              <div className="signal-card signal-card--green">
                <span>CI gates</span>
                <strong>PASS</strong>
                <p>Known flakies routed, merge confidence restored.</p>
              </div>
              <div className="signal-card signal-card--blue">
                <span>Product build</span>
                <strong>Scoped</strong>
                <p>Platform, dashboard, or integration mapped to launch.</p>
              </div>
              <div className="signal-card signal-card--amber">
                <span>Delivery risk</span>
                <strong>Visible</strong>
                <p>Dependencies, quality, and handover tracked weekly.</p>
              </div>
            </div>
            <div className="visual-metrics">
              <div>
                <span>30 days</span>
                <p>CI reliability sprint</p>
              </div>
              <div>
                <span>2 tracks</span>
                <p>Reliability + delivery</p>
              </div>
              <div>
                <span>0 lock-in</span>
                <p>You own the work</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="services" className="landing-section section-panel">
        <div className="site-shell">
          <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Two tracks. One clean delivery story.</h2>
          <p>
            Choose the lane that matches the problem in front of you, then
            bring both skill sets together when reliability, product, data, and
            delivery overlap.
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
          <h2>Start with the business problem, not the buzzwords.</h2>
          <p>
            Start with a concrete pain: blocked releases, a platform that needs
            shipping, a data workflow that keeps breaking, or a delivery plan
            that needs senior hands-on execution.
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
          <h2>A simple delivery rhythm.</h2>
          <p>
            The same rhythm works for fixed reliability sprints and broader
            delivery projects: frame the outcome, instrument the work, ship in
            short cycles, then hand over cleanly.
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
          <h2>Senior operators, not a faceless agency layer.</h2>
          <p>
            You work directly with people who can diagnose, build, coordinate,
            test, and launch. That keeps scope honest and delivery moving.
          </p>
          </div>
          <div className="team-grid">
          <article className="team-card">
            <div className="team-initial">M</div>
            <div>
              <h3>Muhammad</h3>
              <p>
                CI reliability, release engineering, flaky-test reduction,
                developer workflow automation, and measurable delivery
                improvement.
              </p>
            </div>
          </article>
          <article className="team-card">
            <div className="team-initial team-initial--green">A</div>
            <div>
              <h3>Abbad</h3>
              <p>
                Web platforms, data engineering, integrations, quality
                assurance, delivery governance, and complex programme execution.
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
          <h2>Start narrow. Expand only where it earns trust.</h2>
          <p>
            CI work can start with a measurable cost baseline. Broader web,
            data, and integration delivery starts with a scoped discovery call.
          </p>
          </div>
          <div id="pricing" className="pricing-grid">
            <PriceCard
              title="CI Reliability Sprint"
              price={3500}
              unit="one-off"
              bullets={[
                "Baseline & Readiness Index.",
                "Gates live + Top-5 fixes prepped.",
                "Dashboard + 30/90-day plan.",
              ]}
            />
            <PriceCard
              title="Reliability Core"
              price={6500}
              unit="/mo"
              bullets={[
                "Rules & fingerprint updates.",
                "Weekly fixes & coaching.",
                "Telemetry + compounding savings.",
              ]}
            />
            <div className="price-card price-card--quote">
              <h3 className="price-title">Web, Data & Integration Delivery</h3>
              <div className="quote-price">Scoped after discovery</div>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                <li>Platform builds, dashboards, and internal tools.</li>
                <li>Data pipelines, integrations, and automation.</li>
                <li>Delivery leadership, QA, and launch support.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section calculator-wrap">
        <div className="site-shell">
          <div className="section-heading section-heading--dark">
            <p className="eyebrow">CI cost calculator</p>
            <h2>Make flaky delivery visible in pounds and hours.</h2>
            <p>
              The calculator stays as a focused conversion tool for teams with
              an immediate CI reliability problem.
            </p>
          </div>
          <Calculator />
        </div>
      </section>

      <section id="book" className="landing-section contact-section">
        <div className="site-shell contact-grid">
          <div>
            <p className="eyebrow">Get started</p>
            <h2>Bring the problem. We will shape the first useful step.</h2>
            <p>
              CI reliability, web build, data pipeline, integration, QA, or
              delivery leadership. We will tell you where we can help and where
              we should not.
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
              Send a short version of the problem, the stack, and what outcome
              would make the next 30 days worthwhile.
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
