"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Lenis from "lenis";
import ContactForm from "../components/ContactForm";
import ShaderField from "../components/ShaderField";
import Cursor from "../components/Cursor";

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
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scroll reveal. The hidden start-state is scoped to `.ux-js`, which only
    // exists once this runs — so no-JS / crawler renders stay fully visible.
    document.documentElement.classList.add("ux-js");
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".ux-reveal"));
    let io: IntersectionObserver | undefined;
    if (reduced || typeof IntersectionObserver === "undefined") {
      reveals.forEach((el) => el.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              obs.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      reveals.forEach((el) => io!.observe(el));
    }

    // Count-up for console metrics. Markup already shows the final value, so
    // crawlers and no-JS renders are correct; JS only animates from 0 up.
    const rafs: number[] = [];
    if (!reduced) {
      const nums = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
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
    }

    // Hero reveal is CSS-driven (.sf-line / ux-rise animations with
    // animation-fill-mode: backwards) so the start state applies on first
    // paint — no flash of visible-then-hidden, and never left blank.

    // Lenis smooth scroll
    let lenis: Lenis | undefined;
    let lenisRaf = 0;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const lraf = (time: number) => {
        lenis!.raf(time);
        lenisRaf = requestAnimationFrame(lraf);
      };
      lenisRaf = requestAnimationFrame(lraf);
    }

    return () => {
      io?.disconnect();
      rafs.forEach((id) => cancelAnimationFrame(id));
      cancelAnimationFrame(lenisRaf);
      lenis?.destroy();
    };
  }, []);

  const spark = sparkPath(RELIABILITY_SERIES, 132, 44);

  return (
    <main className="landing-page ux-light">
      <Cursor />
      <section className="sf-hero" aria-label="UnflakeOps overview">
        <ShaderField />
        <div className="sf-orb sf-orb--a" aria-hidden="true" />
        <div className="sf-orb sf-orb--b" aria-hidden="true" />
        <header className="sf-nav">
          <a className="sf-lock" href="/">
            <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
              <path
                className="sf-mark__trace"
                d="M5 30 C 10 30, 11 9, 17 9 C 22 9, 22 23, 26 23 C 30 23, 30 18, 35 18"
                fill="none"
                stroke="#7c6cf0"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
              />
              <circle cx="35" cy="18" r="2.7" fill="#9e92ff" />
            </svg>
            <span>
              Unflake<i>Ops</i>
            </span>
          </a>
          <nav className="sf-navlinks" aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#approach">Approach</a>
            <a href="#team">Team</a>
            <a href="#offers">Pricing</a>
            <a className="sf-book" href={BOOKING_URL} data-magnetic>
              Book a call
            </a>
          </nav>
        </header>

        <div className="sf-hero__inner">
          <div className="sf-copy">
            <h1 className="sf-h1">
              <span className="sf-line-wrap">
                <span className="sf-line">Make AI decisions</span>
              </span>
              <span className="sf-line-wrap">
                <span className="sf-line">
                  you can <span className="hl">trust</span>
                </span>
              </span>
              <span className="sf-line-wrap">
                <span className="sf-line">in production.</span>
              </span>
            </h1>
            <p className="sf-sub">
              RAG reliability, hallucination control, and data maturity, engineered
              and measured under real production load, not in a demo.
            </p>
            <div className="sf-cta">
              <a className="sf-btn" href={BOOKING_URL} data-magnetic>
                Book a discovery call
              </a>
              <a className="sf-btn2" href="#approach">
                See the eval method →
              </a>
            </div>
            <div className="sf-proof">
              <span>
                <b>98.7%</b> grounded answers
              </span>
              <span>
                <b>0</b> non-deterministic outputs
              </span>
              <span>
                <b>30d</b> to baseline
              </span>
            </div>
          </div>

          <aside className="reliability-console" aria-label="Live reliability eval console">
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
                <strong data-count="98.7" data-suffix="%">
                  98.7%
                </strong>
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
                    <stop offset="0%" stopColor="rgba(124,108,240,0.35)" />
                    <stop offset="100%" stopColor="rgba(124,108,240,0)" />
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

      {/* SERVICES — two editorial tracks, not cards */}
      <section id="services" className="ux-sec">
        <div className="ux-wrap">
          <div className="ux-sechead ux-reveal">
            <h2 className="ux-h2">
              Two specialist tracks, one delivery team.
            </h2>
            <p className="ux-lead">
              One engagement spans the whole path, from retrieval quality to the
              data contracts your models depend on.
            </p>
          </div>
          <div className="ux-tracks">
            {SERVICE_TRACKS.map((track) => (
              <div className="ux-track ux-reveal" key={track.title}>
                <span className="ux-tag">{track.kicker}</span>
                <div className="ux-track__body">
                  <h3 className="ux-h3">{track.title}</h3>
                  <p className="ux-muted-p">{track.description}</p>
                </div>
                <ul className="ux-ticklist">
                  {track.bullets.map((item) => (
                    <li key={item}>
                      <span className="ux-tick" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES — instrument spec sheet */}
      <section id="capabilities" className="ux-sec ux-sec--tint">
        <div className="ux-wrap">
          <div className="ux-sechead ux-reveal">
            <h2 className="ux-h2">
              Full coverage, retrieval to data contract.
            </h2>
          </div>
          <ol className="ux-spec ux-reveal">
            {CAPABILITIES.map((item, i) => (
              <li key={item}>
                <span className="ux-spec__n">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* APPROACH — stepped sequence (numbers earned) */}
      <section id="approach" className="ux-sec">
        <div className="ux-wrap">
          <div className="ux-sechead ux-reveal">
            <h2 className="ux-h2">How we execute, audit to adoption.</h2>
          </div>
          <div className="ux-steps">
            {APPROACH.map((step) => (
              <div className="ux-step ux-reveal" key={step.step}>
                <span className="ux-step__n">{step.step}</span>
                <h3 className="ux-step__t">{step.title}</h3>
                <p className="ux-step__b">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM — two disciplines */}
      <section id="team" className="ux-sec ux-sec--tint">
        <div className="ux-wrap">
          <div className="ux-sechead ux-reveal">
            <h2 className="ux-h2">One front, two disciplines.</h2>
          </div>
          <div className="ux-disc">
            <div className="ux-disc__col ux-reveal">
              <svg className="ux-disc__mark" width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
                <path d="M5 30 C 10 30, 11 9, 17 9 C 22 9, 22 23, 26 23 C 30 23, 30 18, 35 18" fill="none" stroke="#5142d4" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="35" cy="18" r="2.7" fill="#5142d4" />
              </svg>
              <h3 className="ux-h3">Reliability engineering</h3>
              <p className="ux-muted-p">
                LLM reliability, RAG evaluation, output controls, and QA-driven
                production hardening.
              </p>
            </div>
            <div className="ux-disc__col ux-reveal">
              <svg className="ux-disc__mark" width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
                <path d="M5 30 C 10 30, 11 9, 17 9 C 22 9, 22 23, 26 23 C 30 23, 30 18, 35 18" fill="none" stroke="#5142d4" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="35" cy="18" r="2.7" fill="#5142d4" />
              </svg>
              <h3 className="ux-h3">Data engineering</h3>
              <p className="ux-muted-p">
                Data maturity, pipeline design, quality governance, and AI-ready
                data architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS — pricing, featured drenched */}
      <section id="offers" className="ux-sec">
        <div className="ux-wrap">
          <div className="ux-sechead ux-reveal">
            <h2 className="ux-h2">
              Engagements that fit where your AI stands.
            </h2>
            <p className="ux-lead">
              Start with a scoped audit, move into a build sprint, or embed us for
              the long run. Every engagement ends with documented ownership on your
              side.
            </p>
          </div>
          <div className="ux-plans">
            {OFFERS.map((offer) => (
              <article
                className={`ux-plan ux-reveal${offer.featured ? " ux-plan--feat" : ""}`}
                key={offer.title}
              >
                {offer.featured && <span className="ux-plan__badge">Most common</span>}
                <span className="ux-plan__label">{offer.label}</span>
                <h3 className="ux-plan__t">{offer.title}</h3>
                <p className="ux-plan__d">{offer.desc}</p>
                <ul className="ux-ticklist">
                  {offer.items.map((item) => (
                    <li key={item}>
                      <span className="ux-tick" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="ux-plan__foot">
                  <span className="ux-plan__meta">{offer.meta}</span>
                  <a className="ux-plan__cta" href={BOOKING_URL}>
                    Discuss this →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT — cobalt drench bookend */}
      <section id="book" className="ux-contact">
        <div className="ux-wrap ux-contact__grid">
          <div className="ux-reveal">
            <h2 className="ux-contact__h">
              Bring us one workflow. We will show you what blocks reliable AI.
            </h2>
            <p className="ux-contact__p">
              A focused discovery exposes the reliability and data gaps, then hands
              back a clear implementation path with ownership and delivery options.
            </p>
            <div className="ux-contact__cta">
              <a className="ux-contact__btn" href={BOOKING_URL}>
                Book a discovery call
              </a>
              <a className="ux-contact__mail" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>
          </div>
          <aside className="ux-contact__card ux-reveal">
            <ContactForm />
          </aside>
        </div>
      </section>
    </main>
  );
}
