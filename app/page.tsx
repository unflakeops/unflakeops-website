"use client";
import { useMemo, useState } from "react";

type Ccy = "GBP" | "EUR";
function fmtCurrency(v: number, ccy: Ccy) {
  const symbol = ccy === "EUR" ? "€" : "£";
  const f = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
    Math.round(v)
  );
  return symbol + f;
}

export default function Page() {
  const [pipelines, setPipelines] = useState(150);
  const [failrate, setFailrate] = useState(20);
  const [pctflaky, setPctflaky] = useState(35);
  const [rerun, setRerun] = useState(15);
  const [triage, setTriage] = useState(15);
  const [engs, setEngs] = useState(2);
  const [hourly, setHourly] = useState(100);
  const [ccy, setCcy] = useState<Ccy>("GBP");
  const [sprint, setSprint] = useState(4000);
  const [core, setCore] = useState(8000);

  const res = useMemo(() => {
    const failed_per_week = pipelines * (failrate / 100);
    const flake_failures = failed_per_week * (pctflaky / 100);
    const minutes_lost = (rerun + triage) * engs;
    const hours_lost_per_week = flake_failures * (minutes_lost / 60);
    const cost_lost_per_week = hours_lost_per_week * hourly;
    const annual_waste = cost_lost_per_week * 52;
    const monthly_savings = (annual_waste * 0.5) / 12;
    const payback_days =
      monthly_savings > 0
        ? Math.max(1, Math.round((sprint / monthly_savings) * 30))
        : null;
    const roi_core = core > 0 ? (annual_waste * 0.5) / (12 * core) : null;
    let rec = "Sprint → RRaaS Core";
    if (annual_waste < 60000) rec = "Sprint only (or DIY Pack)";
    else if (annual_waste > 250000) rec = "Sprint → RRaaS Plus";
    return {
      hours_lost_per_week,
      cost_lost_per_week,
      annual_waste,
      monthly_savings,
      payback_days,
      roi_core,
      rec,
    };
  }, [
    pipelines,
    failrate,
    pctflaky,
    rerun,
    triage,
    engs,
    hourly,
    sprint,
    core,
  ]);

  return (
    <div className="wrap">
      <header>
        <div className="logo">
          🧪 <strong>UnflakeOps</strong>
        </div>
        <div className="pill">UK/EU • ex VAT • GDPR-friendly</div>
      </header>

      <section className="hero">
        <div>
          <h1>
            Cut Failed Builds by <span className="mono">50%+</span> in 30 Days.
            Guaranteed.
          </h1>
          <p className="sub">
            Ship with confidence: <span className="mono">PASS/WARN/FAIL</span>{" "}
            release gates, fewer flaky tests, faster cycles for GitHub Actions &
            GitLab CI.
          </p>
          <div className="cta-row">
            <a className="btn" href="#book">
              Book a 15-min CI Teardown
            </a>
            <a className="btn alt" href="#calc">
              Estimate Your Waste → Calculator
            </a>
          </div>
          <div className="trust">
            ¹ Significant conditions apply. See{" "}
            <a href="#guarantee">Guarantee</a>. Security: least-privilege
            access; you keep all scripts & dashboards.
          </div>
        </div>
        <div className="card">
          <div className="kicker">Week-1 Deliverables</div>
          <ul className="list">
            <li>
              <strong>Baseline & Readiness Index</strong> — your flake-rate & CI
              health score
            </li>
            <li>
              <strong>Gates live</strong> —{" "}
              <span className="mono">PASS/WARN/FAIL</span> wired in
            </li>
            <li>
              <strong>Top-5 fixes merged</strong> — PRs shipped
            </li>
            <li>
              <strong>Telemetry dashboard</strong> — 30/90-day plan
            </li>
          </ul>
          <div className="divider"></div>
          <div className="money-strip">
            <span className="badge">Outcome-based</span>
            <span className="badge">No day-rates</span>
            <span className="badge">Works with your repo via PRs</span>
          </div>
        </div>
      </section>

      <section className="section grid-2" id="calc">
        <div className="card">
          <div className="kicker">Flake-Rate Calculator</div>
          <p className="small">
            How much is flakiness costing you? Enter a few numbers, see
            estimated waste & payback. <em>ex VAT</em>
          </p>
          <div className="grid-2">
            <div>
              <label>Pipelines per week</label>
              <input
                type="number"
                value={pipelines}
                min={1}
                onChange={(e) => setPipelines(parseInt(e.target.value || "0"))}
              />
            </div>
            <div>
              <label>Failure rate (%)</label>
              <input
                type="number"
                value={failrate}
                min={0}
                max={100}
                step={0.1}
                onChange={(e) => setFailrate(parseFloat(e.target.value || "0"))}
              />
            </div>
            <div>
              <label>% of failures that are flaky</label>
              <input
                type="number"
                value={pctflaky}
                min={0}
                max={100}
                step={0.1}
                onChange={(e) => setPctflaky(parseFloat(e.target.value || "0"))}
              />
            </div>
            <div>
              <label>Re-run minutes (avg)</label>
              <input
                type="number"
                value={rerun}
                min={0}
                onChange={(e) => setRerun(parseInt(e.target.value || "0"))}
              />
            </div>
            <div>
              <label>Triage minutes (avg)</label>
              <input
                type="number"
                value={triage}
                min={0}
                onChange={(e) => setTriage(parseInt(e.target.value || "0"))}
              />
            </div>
            <div>
              <label>Engineers affected per failure</label>
              <input
                type="number"
                value={engs}
                min={0}
                step={0.1}
                onChange={(e) => setEngs(parseFloat(e.target.value || "0"))}
              />
            </div>
            <div>
              <label>Loaded hourly cost</label>
              <input
                type="number"
                value={hourly}
                min={1}
                onChange={(e) => setHourly(parseInt(e.target.value || "0"))}
              />
            </div>
            <div>
              <label>Currency</label>
              <select
                value={ccy}
                onChange={(e) => setCcy(e.target.value as Ccy)}
              >
                <option value="GBP">£ GBP</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
            <div>
              <label>Sprint price (one-off)</label>
              <input
                type="number"
                value={sprint}
                min={1000}
                step={100}
                onChange={(e) => setSprint(parseInt(e.target.value || "0"))}
              />
            </div>
            <div>
              <label>Core monthly price</label>
              <input
                type="number"
                value={core}
                min={1000}
                step={100}
                onChange={(e) => setCore(parseInt(e.target.value || "0"))}
              />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="kicker">Results</div>
          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <label>Weekly engineer hours wasted (current)</label>
              <div className="out">
                {res.hours_lost_per_week.toFixed(1)} hrs / week
              </div>
            </div>
            <div>
              <label>Weekly cost wasted (current)</label>
              <div className="out">
                {fmtCurrency(res.cost_lost_per_week, ccy)} / week
              </div>
            </div>
            <div>
              <label>Annual waste (current)</label>
              <div className="out">
                {fmtCurrency(res.annual_waste, ccy)} / year
              </div>
            </div>
            <div>
              <label>Estimated monthly savings @ 50% reduction</label>
              <div className="out">
                {fmtCurrency(res.monthly_savings, ccy)} / month
              </div>
            </div>
            <div>
              <label>Estimated payback on Sprint</label>
              <div className="out">
                {res.payback_days ? `${res.payback_days} days (est.)` : "—"}
              </div>
            </div>
            <div>
              <label>ROI multiplier on Core (annual)</label>
              <div className="out">
                {res.roi_core ? `${res.roi_core.toFixed(1)}×` : "—"}
              </div>
            </div>
            <div>
              <label>Recommended plan</label>
              <div className="out">{res.rec}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section grid-3">
        <div className="card">
          <div className="kicker">How it works</div>
          <ol className="list">
            <li>
              <strong>Install Agent</strong> — read-only data collection via
              GitHub App / GitLab token.
            </li>
            <li>
              <strong>Activate Gates</strong> — drop-in{" "}
              <span className="mono">PASS/WARN/FAIL</span> templates.
            </li>
            <li>
              <strong>Fix Credits & Coaching</strong> — PRs + weekly
              optimisation. Outcome tracked by FFR.
            </li>
          </ol>
        </div>
        <div className="card">
          <div className="kicker">Plans & Pricing (ex VAT)</div>
          <ul className="list">
            <li>
              <strong>Sprint</strong>: £3k–£5k / €3.5k–€5.8k — 7-day audit,
              gates, Top-5 fixes, roadmap.
            </li>
            <li>
              <strong>RRaaS Core</strong>: £6k–£12k/mo / €7k–€14k/mo —
              telemetry, weekly fixes, coaching.
            </li>
            <li>
              <strong>RRaaS Plus</strong>: £15k–£25k/mo / €17.5k–€29k/mo —
              perf/incident gates, SLO advisory.
            </li>
          </ul>
          <div className="divider"></div>
          <div className="small">
            Typical payback: weeks, not months, at moderate–high release volume.
          </div>
        </div>
        <div className="card">
          <div className="kicker">Our Money Model</div>
          <p>
            Attraction (Free Teardown) → Upsell (7-Day Sprint) → Downsell (DIY
            Gates Pack) → Continuity (RRaaS). Designed for short payback and
            compounding savings.
          </p>
        </div>
      </section>

      <section className="section grid-2">
        <div className="card">
          <div className="kicker">Proof</div>
          <p>
            “62% fewer flaky failures in 28 days; ~220 engineer hours/quarter
            reclaimed.” — CTO, EU SaaS
          </p>
          <div className="small">
            Add your anonymised case study + before/after chart here.
          </div>
        </div>
        <div className="card" id="book">
          <div className="kicker">Book a 15-min CI Teardown</div>
          <p className="small">
            Pick a slot (BST/CET). We’ll run the 7-point teardown and show your
            Readiness Index & 30-day plan.
          </p>
          <div className="out">Embed your Calendly/Cal.com here.</div>
        </div>
      </section>

      <section className="section" id="guarantee">
        <div className="card">
          <div className="kicker">Guarantee</div>
          <p>
            <strong>Results Guarantee:</strong> If we don’t reduce your Flaky
            Failure Rate (FFR) by <strong>50%+</strong> within 30 days of
            implementation start (vs the agreed baseline), we continue the Core
            service <strong>at no additional service fee</strong> until we do,
            for up to 60 additional days.
          </p>
          <details>
            <summary>Definitions & conditions</summary>
            <ul className="list">
              <li>
                <em>Flaky test</em>: passes and fails on the same code (no
                relevant changes).
              </li>
              <li>
                <em>Flaky Failure Event (FFE)</em>: a pipeline failure cleared
                by a re-run with no code change, or auto-labelled “flaky” by
                detector.
              </li>
              <li>
                <em>FFR</em>: #FFEs ÷ #pipelines × 100.
              </li>
              <li>
                <em>Baseline</em>: average FFR over last 28 days or 500
                pipelines pre-start.
              </li>
              <li>
                <em>Success</em>: any 7-day window ≤ 50% of baseline, or Day1–30
                average ≤ 50%.
              </li>
              <li>
                Client enables gates/instrumentation and reviews PRs within 2
                business days.
              </li>
              <li>
                Excludes genuine code regressions, infra incidents, third-party
                outages.
              </li>
            </ul>
          </details>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="kicker">Security & Compliance (UK/EU)</div>
          <ul className="list">
            <li>
              GDPR / UK-GDPR: data minimisation, least-privilege,
              purpose-limited processing.
            </li>
            <li>
              DPA available (UK IDTA / EU SCCs if needed); UK/EEA data residency
              on request.
            </li>
            <li>
              Access model: read-only tokens; changes via PRs for auditability.
            </li>
            <li>
              Standards-friendly: controls aligned to ISO 27001 / SOC 2 style
              practices.
            </li>
          </ul>
        </div>
      </section>

      <footer>
        <div>
          © UnflakeOps Ltd. All rights reserved.{" "}
          <span className="small">Privacy • DPA • Terms • Cookies</span>
        </div>
        <div className="small">Registered in the UK. VAT: GB•••••.</div>
      </footer>
    </div>
  );
}
