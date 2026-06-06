"use client";

import { useEffect, type CSSProperties } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? "/call";
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@unflakeops.com";

const SERVICE_TRACKS = [
  {
    kicker: "Track A",
    title: "LLM Reliability, RAG, and Deterministic Output",
    description:
      "Design and harden AI workflows so answers stay grounded, repeatable, and useful in production operations.",
    bullets: [
      "RAG quality audits and retrieval evaluation",
      "Hallucination controls and refusal strategy",
      "Structured outputs and deterministic response checks",
      "Regression test packs for AI workflow changes",
    ],
  },
  {
    kicker: "Track B",
    title: "Data Maturity and AI-Ready Data Pipelines",
    description:
      "Assess if your data is fit for AI decisions, then implement the data foundations required for reliable outcomes.",
    bullets: [
      "Data maturity assessment and readiness scorecards",
      "Lineage, quality, freshness, and ownership checks",
      "Pipeline design for transformation and validation",
      "Monitoring and controls for ongoing data reliability",
    ],
  },
];

const CAPABILITIES = [
  "RAG architecture and retrieval tuning",
  "Evaluation datasets and scoring frameworks",
  "Hallucination detection and mitigation",
  "Deterministic output schema design",
  "Data maturity assessment and roadmap",
  "Data quality, lineage, and governance baselines",
  "AI pipeline instrumentation and observability",
  "Production handover with runbooks and controls",
];

const APPROACH = [
  {
    step: "01",
    title: "Prioritise Decisions",
    body: "Define the workflows where AI output quality directly impacts risk, speed, and revenue.",
  },
  {
    step: "02",
    title: "Assess Ground Truth",
    body: "Audit retrieval and source data quality to expose where poor evidence drives weak outputs.",
  },
  {
    step: "03",
    title: "Engineer Reliability",
    body: "Implement evaluation harnesses, controls, and deterministic contracts for stable behavior.",
  },
  {
    step: "04",
    title: "Operationalise",
    body: "Ship with ownership, alerting, and documented operating standards for sustained performance.",
  },
];

const CONSOLE_CHECKS = [
  { label: "RAG retrieval grounding", state: "pass" },
  { label: "Hallucination guardrails", state: "pass" },
  { label: "Deterministic output schema", state: "pass" },
  { label: "Regression eval suite", state: "run" },
];

// 12 release points, reliability trending up
const RELIABILITY_SERIES = [62, 58, 67, 71, 69, 78, 83, 81, 88, 92, 95, 98.7];

function sparkPath(series: number[], w: number, h: number) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * w;
    const y = h - ((v - min) / span) * h;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return { line, area };
}

const OFFERS = [
  {
    label: "Discovery",
    title: "Reliability & Data Audit",
    desc: "A fixed-scope review of one AI workflow. We map where output quality breaks and where your data undermines it, then hand back a prioritised roadmap.",
    items: [
      "RAG and retrieval quality assessment",
      "Data readiness scorecard",
      "Prioritised reliability roadmap",
    ],
    meta: "1–2 weeks · Fixed scope",
    featured: false,
  },
  {
    label: "Build",
    title: "Reliability Sprint",
    desc: "We implement the controls: evaluation harnesses, deterministic output contracts, and the data quality checks your models depend on.",
    items: [
      "Eval harness and regression packs",
      "Hallucination and schema guardrails",
      "Pipeline validation and monitoring",
    ],
    meta: "4–8 weeks · Per workflow",
    featured: true,
  },
  {
    label: "Operate",
    title: "Embedded Reliability Practice",
    desc: "Ongoing ownership. We keep reliability and data quality high as your AI systems and data change in production.",
    items: [
      "Continuous evaluation and alerting",
      "Data governance and lineage upkeep",
      "Production operating standards",
    ],
    meta: "Monthly retainer",
    featured: false,
  },
];

export default function HomePage() {
  useEffect(() => {
    // Count-up for console metrics. Markup already shows the final value, so
    // crawlers and no-JS renders are correct; JS only animates from 0 up.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const nums = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    const rafs: number[] = [];
    nums.forEach((el) => {
      const target = parseFloat(el.dataset.count ?? "0");
      const suffix = el.dataset.suffix ?? "";
      const decimals = (el.dataset.count ?? "").split(".")[1]?.length ?? 0;
      const duration = 1500;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) rafs.push(requestAnimationFrame(tick));
      };
      rafs.push(requestAnimationFrame(tick));
    });
    return () => rafs.forEach((id) => cancelAnimationFrame(id));
  }, []);

  const spark = sparkPath(RELIABILITY_SERIES, 132, 44);

  return (
    <main className="landing-page">
      <Header />

      <section className="hero-section consulting-hero">
        <div className="site-shell consulting-hero__content">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">AI reliability &amp; data maturity</p>
            <h1 className="hero-title">
              Make AI decisions you can <span className="accent-word">trust</span> in production.
            </h1>
            <p className="hero-subtitle">
              We pair LLM reliability engineering with data maturity and pipeline execution,
              so your AI systems stay grounded, repeatable, and defensible under real load.
            </p>
            <div className="hero-actions">
              <a className="hero-cta" href={BOOKING_URL}>
                Book discovery call
              </a>
              <a className="hero-cta-secondary" href="#services">
                View service tracks
              </a>
            </div>
            <div className="hero-proof-strip">
              <span>RAG &amp; QA reliability</span>
              <span>Data maturity &amp; pipelines</span>
              <span>One delivery team</span>
            </div>
          </div>

          <aside
            className="hero-visual reliability-console"
            aria-label="Reliability eval console"
            data-reveal
            data-reveal-delay="1"
          >
            <div className="console-top">
              <div className="console-id">
                <span className="console-live" />
                <span>eval&nbsp;·&nbsp;live</span>
              </div>
              <span className="console-run">workflow #1284</span>
            </div>

            <div className="console-metric">
              <div className="console-metric__figure">
                <span className="console-metric__label">Grounded answer rate</span>
                <strong data-count="98.7" data-suffix="%">98.7%</strong>
                <span className="console-metric__delta">▲ 2.3 pts vs last release</span>
              </div>
              <svg
                className="console-spark"
                viewBox="0 0 132 44"
                width="132"
                height="44"
                role="img"
                aria-label="Reliability trending up across releases"
              >
                <defs>
                  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(52,226,173,0.35)" />
                    <stop offset="100%" stopColor="rgba(52,226,173,0)" />
                  </linearGradient>
                </defs>
                <path className="console-spark__area" d={spark.area} fill="url(#sparkFill)" />
                <path
                  className="console-spark__line"
                  d={spark.line}
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                />
              </svg>
            </div>

            <ul className="console-checks">
              {CONSOLE_CHECKS.map((c) => (
                <li key={c.label} className={`console-check console-check--${c.state}`}>
                  <span className="console-check__icon" aria-hidden="true" />
                  <span className="console-check__label">{c.label}</span>
                  <span className="console-check__state">
                    {c.state === "pass" ? "passing" : "running"}
                  </span>
                </li>
              ))}
            </ul>

            <div className="console-foot">
              <span className="console-foot__label">Reliability by release</span>
              <div className="console-bars" aria-hidden="true">
                {RELIABILITY_SERIES.map((v, i) => (
                  <span
                    key={i}
                    className="console-bar"
                    style={{ "--h": `${Math.round(v)}%`, "--i": i } as CSSProperties}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="services" className="landing-section section-panel">
        <div className="site-shell">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">Service tracks</p>
            <h2>Two specialist tracks, one coordinated delivery model.</h2>
          </div>
          <div className="grid-2 service-track-grid">
            {SERVICE_TRACKS.map((track, i) => (
              <article
                className="service-track-card"
                key={track.title}
                data-reveal
                data-reveal-delay={i + 1}
              >
                <span className="service-track-meta">{track.kicker}</span>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <ul className="list">
                  {track.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section capability-section">
        <div className="site-shell">
          <div className="section-heading section-heading--dark" data-reveal>
            <h2>Full skills coverage across reliability and data foundations.</h2>
            <p>
              One engagement spans the entire path, from retrieval quality to the
              data contracts your models depend on.
            </p>
          </div>
          <div className="grid-3 capability-grid" data-reveal data-reveal-delay="1">
            {CAPABILITIES.map((item) => (
              <article className="capability-card" key={item}>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="landing-section section-panel section-panel--muted">
        <div className="site-shell">
          <div className="section-heading" data-reveal>
            <h2>How we execute, from first audit to production adoption.</h2>
          </div>
          <div className="grid-4 approach-grid">
            {APPROACH.map((step, i) => (
              <article
                className="approach-card"
                key={step.step}
                data-reveal
                data-reveal-delay={(i % 3) + 1}
              >
                <span>{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="landing-section team-section">
        <div className="site-shell">
          <div className="section-heading section-heading--dark" data-reveal>
            <h2>One front, two core disciplines.</h2>
          </div>
          <div className="grid-2 team-grid">
            <article className="card team-card" data-reveal data-reveal-delay="1">
              <div className="team-initial">R</div>
              <div>
                <h3>Reliability engineering</h3>
                <p>LLM reliability, RAG evaluation, output controls, and QA-driven production hardening.</p>
              </div>
            </article>
            <article className="card team-card" data-reveal data-reveal-delay="2">
              <div className="team-initial team-initial--green">D</div>
              <div>
                <h3>Data engineering</h3>
                <p>Data maturity, data pipeline design, quality governance, and AI-ready data architecture.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="offers" className="landing-section offers-section">
        <div className="site-shell">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">Ways to work with us</p>
            <h2>Engagements that fit where your AI stands today.</h2>
            <p>
              Start with a scoped audit, move into a build sprint, or embed us for the long run.
              Every engagement ends with documented ownership on your side.
            </p>
          </div>
          <div className="offer-grid">
            {OFFERS.map((offer, i) => (
              <article
                className={`offer-card${offer.featured ? " offer-card--featured" : ""}`}
                key={offer.title}
                data-reveal
                data-reveal-delay={i + 1}
              >
                {offer.featured && <span className="offer-badge">Most common</span>}
                <span className="offer-card__label">{offer.label}</span>
                <h3>{offer.title}</h3>
                <p className="offer-card__desc">{offer.desc}</p>
                <ul className="offer-card__list">
                  {offer.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="offer-card__foot">
                  <span className="offer-card__meta">{offer.meta}</span>
                  <a className="offer-card__cta" href={BOOKING_URL}>
                    Discuss this →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="landing-section contact-section">
        <div className="site-shell contact-grid">
          <div data-reveal>
            <h2>Bring us one workflow. We will show you what blocks reliable AI decisions.</h2>
            <p>
              We run a focused discovery, expose reliability and data gaps, and return a clear
              implementation path with ownership and delivery options.
            </p>
            <div className="hero-actions">
              <a className="contact-button" href={BOOKING_URL}>
                Book discovery call
              </a>
              <a className="hero-cta-secondary" href={`mailto:${EMAIL}`}>
                Email us
              </a>
            </div>
          </div>
          <aside className="contact-card" data-reveal data-reveal-delay="1">
            <h3>Contact</h3>
            <p className="contact-email">{EMAIL}</p>
            <p>Response window: usually same business day.</p>
            <div style={{ marginTop: "24px", borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
              <ContactForm />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
