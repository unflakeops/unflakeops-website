"use client";

import Image from "next/image";
import Header from "../components/Header";

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

export default function HomePage() {
  return (
    <main className="landing-page">
      <Header />

      <section className="hero-section consulting-hero">
        <div className="site-shell consulting-hero__content">
          <div className="hero-copy">
            <p className="eyebrow">UNFLAKEOPS</p>
            <h1 className="hero-title">AI reliability + data maturity, delivered as one practice.</h1>
            <p className="hero-subtitle">
              We combine LLM reliability engineering with data maturity and pipeline execution so
              your AI systems make consistent decisions from trustworthy data.
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
              <span>RAG and QA reliability</span>
              <span>Data maturity and pipelines</span>
              <span>Shared delivery across both tracks</span>
            </div>
          </div>

          <aside className="hero-visual" aria-label="Core operating focus">
            <div className="visual-topline">
              <div className="visual-brand">
                <Image
                  src="/brand/unflakeops_icon_dots_dark_400.png"
                  alt="UnflakeOps brand mark"
                  width={32}
                  height={32}
                />
                <div>
                  <strong>UnflakeOps</strong>
                  <span>Reliability + Data Practice</span>
                </div>
              </div>
              <div className="status-pill">Production Focus</div>
            </div>

            <div className="signal-grid">
              <div className="signal-card signal-card--green">
                <span>Reliability layer</span>
                <strong>LLM outputs</strong>
                <p>Grounded answers, deterministic formatting, and regression-safe release cycles.</p>
              </div>
              <div className="signal-card signal-card--blue">
                <span>Data layer</span>
                <strong>Decision data</strong>
                <p>Data maturity, contracts, and pipeline confidence for AI-driven operations.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="services" className="landing-section section-panel">
        <div className="site-shell">
          <div className="section-heading">
            <p className="eyebrow">SERVICE TRACKS</p>
            <h2>Two specialist tracks, one coordinated delivery model.</h2>
          </div>
          <div className="grid-2 service-track-grid">
            {SERVICE_TRACKS.map((track) => (
              <article className="service-track-card" key={track.title}>
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
          <div className="section-heading section-heading--dark">
            <p className="eyebrow">CAPABILITIES</p>
            <h2>Full skills coverage across reliability and data foundations.</h2>
          </div>
          <div className="grid-3 capability-grid">
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
          <div className="section-heading">
            <p className="eyebrow">APPROACH</p>
            <h2>How we execute from first audit to production adoption.</h2>
          </div>
          <div className="grid-4 approach-grid">
            {APPROACH.map((step) => (
              <article className="approach-card" key={step.step}>
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
          <div className="section-heading section-heading--dark">
            <p className="eyebrow">TEAM</p>
            <h2>One front, two core disciplines.</h2>
          </div>
          <div className="grid-2 team-grid">
            <article className="card team-card">
              <div className="team-initial">M</div>
              <div>
                <h3>Muhammad</h3>
                <p>LLM reliability, RAG evaluation, output controls, and QA-driven production hardening.</p>
              </div>
            </article>
            <article className="card team-card">
              <div className="team-initial team-initial--green">A</div>
              <div>
                <h3>Abbad</h3>
                <p>Data maturity, data pipeline design, quality governance, and AI-ready data architecture.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="book" className="landing-section contact-section">
        <div className="site-shell contact-grid">
          <div>
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
          <aside className="contact-card">
            <h3>Contact</h3>
            <p className="contact-email">{EMAIL}</p>
            <p>Response window: usually same business day.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
