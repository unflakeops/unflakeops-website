import Header from "../../components/Header";

export const metadata = { title: "Terms of Service | UnflakeOps" };

const sections = [
  ["1. Services", "UnflakeOps provides workflow investigation, process improvement and automation services, including solutions built with Microsoft Power Platform. The exact scope, deliverables, timetable and fees for each engagement are agreed in a written proposal or statement of work."],
  ["2. Client responsibilities", "You will provide timely access to the people, systems and information reasonably required for the agreed work. You remain responsible for business decisions, source-data accuracy, user access and approval of changes before they enter production."],
  ["3. Access and data", "We use the minimum access needed for the engagement and agree access arrangements before work begins. Where we process personal data on your behalf, the parties will put an appropriate data-processing agreement in place."],
  ["4. Deliverables and intellectual property", "Unless a statement of work says otherwise, you own the bespoke deliverables created and paid for during the engagement. UnflakeOps retains ownership of its pre-existing tools, methods and reusable know-how, while granting you the rights needed to use the delivered solution."],
  ["5. Fees and payment", "Fees, VAT treatment, expenses and payment dates are set out in the relevant proposal or statement of work. Unless otherwise agreed, invoices are payable within 30 days."],
  ["6. Confidentiality", "Each party will protect the other's confidential information, use it only for the engagement and disclose it only to people who need it and are subject to appropriate confidentiality duties."],
  ["7. Warranties and liability", "We will provide the services with reasonable care and skill. Any specific success criteria or remedies must be written into the applicable statement of work. Liability is subject to the limitations agreed for that engagement and cannot exclude liability that the law does not permit us to exclude."],
  ["8. Termination", "Either party may terminate an engagement as stated in its proposal or statement of work. On termination, you will pay for work completed and authorised costs incurred up to the termination date."],
  ["9. Governing law", "These terms are governed by English law, and the courts of England and Wales have exclusive jurisdiction unless the parties agree otherwise in writing."],
];

export default function TermsPage() {
  return <main className="main-container"><Header /><header className="hero-section"><div className="hero-content"><div><div className="brand-row"><span className="brand-name">Legal</span></div><h1 className="hero-title">Terms of Service</h1><p className="hero-subtitle">Last updated: 20 September 2026</p></div></div></header>{sections.map(([title, body]) => <section className="card section" key={title}><h2 className="card-title" style={{ fontSize: 20, fontWeight: 600 }}>{title}</h2><p className="text-secondary" style={{ marginTop: 12 }}>{body}</p></section>)}<footer className="main-footer"><p>These general terms are supplemented by the proposal or statement of work for each engagement. Questions can be sent through the enquiry form on our home page.</p></footer></main>;
}
