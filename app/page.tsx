import Link from "next/link";
import ContactForm from "../components/ContactForm";
import Logo from "../components/Logo";
import styles from "./home.module.css";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? "/call";

const REPORT_TYPES = [
  "Funder reporting",
  "Impact reporting",
  "Trustee and board reporting",
  "Recurring operational administration",
];

const STEPS = [
  {
    number: "01",
    title: "Walk through the last report",
    body: "Show us how it was actually produced, including the systems, spreadsheets and people involved.",
  },
  {
    number: "02",
    title: "Find the manual work",
    body: "We identify exports, repeated data entry, reconciliation, chasing and avoidable hand-offs.",
  },
  {
    number: "03",
    title: "Automate the useful parts",
    body: "We build a controlled solution around the tools you already use, without forcing a wholesale replacement.",
  },
  {
    number: "04",
    title: "Verify and hand over",
    body: "We test the workflow, document it clearly and leave your team able to operate it.",
  },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.shell}>
          <Link href="/" className={styles.brand} aria-label="UnflakeOps home">
            <Logo size={42} />
          </Link>
          <nav className={styles.nav} aria-label="Primary navigation">
            <a href="#problem">The problem</a>
            <a href="#pilot">The pilot</a>
            <a href="#how">How it works</a>
            <a href="#about">About</a>
          </nav>
          <a className={styles.headerCta} href="#conversation">
            Talk through a workflow
          </a>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Microsoft Power Platform automation for UK charities</p>
            <h1>Spend less time assembling reports. Give more time to your mission.</h1>
            <p className={styles.heroLead}>
              UnflakeOps helps UK charities investigate and automate recurring
              funder, impact and trustee reporting—starting with one workflow
              and working with the systems you already use.
            </p>
            <div className={styles.actions}>
              <a className={styles.primaryButton} href="#conversation">
                Tell us about your last report
              </a>
              <a className={styles.secondaryButton} href="#pilot">
                See how the pilot works
              </a>
            </div>
            <p className={styles.heroNote}>
              One recurring workflow · Fixed scope · Clear handover
            </p>
          </div>

          <div className={styles.workflowCard} aria-label="A typical manual reporting workflow">
            <div className={styles.cardTopline}>
              <span>YOUR LAST REPORT</span>
              <span>Where did the time go?</span>
            </div>
            <div className={styles.workflow}>
              <div className={styles.workflowStep}><span>01</span><strong>Different systems</strong></div>
              <div className={styles.arrow}>↓</div>
              <div className={styles.workflowStep}><span>02</span><strong>Spreadsheets</strong></div>
              <div className={styles.arrow}>↓</div>
              <div className={styles.workflowStep}><span>03</span><strong>Chasing teams</strong></div>
              <div className={styles.arrow}>↓</div>
              <div className={`${styles.workflowStep} ${styles.workflowStepFinal}`}><span>04</span><strong>Final report</strong></div>
            </div>
            <p className={styles.cardCaption}>
              When systems do not connect, people become the integration layer.
            </p>
          </div>
        </div>
      </section>

      <section id="problem" className={styles.problemSection}>
        <div className={`${styles.shell} ${styles.twoCol}`}>
          <div>
            <p className={styles.sectionLabel}>THE PROBLEM</p>
            <h2>Your reporting process should not depend on copying, reconciling and chasing.</h2>
          </div>
          <div className={styles.problemCopy}>
            <p>
              Many charities have capable people and workable systems, but a
              recurring report still requires someone to pull information from
              several places and turn it into one trustworthy answer.
            </p>
            <p>
              We start with the real process, not a technology pitch. If a small
              Power Automate, Power BI or Power Apps solution can remove useful
              manual work, we show you where and how.
            </p>
          </div>
        </div>
      </section>

      <section id="pilot" className={styles.pilotSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>A FIXED-SCOPE START</p>
            <h2>Begin with one recurring report.</h2>
            <p>
              A focused pilot gives both sides something concrete to assess
              before anyone commits to a larger transformation programme.
            </p>
          </div>
          <div className={styles.pilotGrid}>
            <article className={styles.pilotCard}>
              <span className={styles.cardKicker}>WHAT WE EXAMINE</span>
              <h3>The workflow as it works today</h3>
              <ul>
                <li>Where information comes from</li>
                <li>What gets exported or copied</li>
                <li>Where figures are reconciled</li>
                <li>Who has to chase or approve updates</li>
              </ul>
            </article>
            <article className={styles.pilotCard}>
              <span className={styles.cardKicker}>WHAT YOU RECEIVE</span>
              <h3>A useful change with ownership</h3>
              <ul>
                <li>A map of the current process</li>
                <li>Prioritised automation opportunities</li>
                <li>One agreed Power Platform implementation</li>
                <li>Testing, documentation and handover</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="how" className={styles.howSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>HOW IT WORKS</p>
            <h2>Understand first. Automate second.</h2>
          </div>
          <div className={styles.steps}>
            {STEPS.map((step) => (
              <article key={step.number} className={styles.step}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.useCasesSection}>
        <div className={`${styles.shell} ${styles.useCasesGrid}`}>
          <div>
            <p className={styles.sectionLabel}>ONE WORKFLOW AT A TIME</p>
            <h2>Where could we start?</h2>
          </div>
          <ul className={styles.useCases}>
            {REPORT_TYPES.map((item, index) => (
              <li key={item}><span>0{index + 1}</span>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className={styles.aboutSection}>
        <div className={`${styles.shell} ${styles.aboutGrid}`}>
          <div className={styles.experienceFigure}>
            <strong>17</strong>
            <span>years building and testing systems where reliability matters</span>
          </div>
          <div>
            <p className={styles.sectionLabel}>SENIOR-LED DELIVERY</p>
            <h2>Built with reliability in mind.</h2>
            <p>
              Founder Muhammad Qureshi has spent 17 years building and testing
              systems where reliability matters, with experience including HMRC,
              MAG Airports, Wayfair and Equal Experts.
            </p>
            <p>
              That experience shapes how UnflakeOps approaches automation:
              understand the process, measure the problem, make a controlled
              change and verify the result.
            </p>
          </div>
        </div>
      </section>

      <section id="conversation" className={styles.contactSection}>
        <div className={`${styles.shell} ${styles.contactGrid}`}>
          <div>
            <p className={styles.sectionLabel}>A RESEARCH CONVERSATION</p>
            <h2>How was your last report produced?</h2>
            <p>
              We are speaking with UK charity leaders to understand how
              reporting and administrative work happens in practice. Bring us
              one recurring workflow and tell us where the effort went.
            </p>
            <a className={styles.bookingLink} href={BOOKING_URL}>
              Prefer to choose a time? Book a conversation →
            </a>
          </div>
          <div className={styles.formCard}>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerTop}>
            <Logo size={38} />
            <p>Microsoft Power Platform automation for UK charities.</p>
          </div>
          <div className={styles.footerBottom}>
            <span>© {new Date().getFullYear()} UnflakeOps</span>
            <nav aria-label="Legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <a href="mailto:hello@unflakeops.com">hello@unflakeops.com</a>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
