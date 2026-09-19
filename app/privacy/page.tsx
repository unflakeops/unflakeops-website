import Header from "../../components/Header";

export const metadata = { title: "Privacy Policy | UnflakeOps" };

const sections = [
  ["Information we collect", "When you contact us, we may collect your name, work email, organisation, role and the information you choose to provide about a reporting or administrative workflow. During a contracted engagement, we may also process system, workflow and service data required for the agreed work."],
  ["How we use information", "We use information to respond to enquiries, arrange conversations, scope and deliver services, maintain client relationships, improve our services, secure our systems and meet legal obligations."],
  ["Legal bases", "Depending on the context, we process personal data to take steps at your request before entering a contract, perform a contract, comply with legal obligations, and pursue legitimate interests such as responding to business enquiries and operating our services."],
  ["Service providers and sharing", "We do not sell personal information. We may share information with service providers that support hosting, email, customer-relationship management, scheduling and analytics, subject to appropriate contractual and security safeguards. We may also disclose information where required by law."],
  ["Client data", "For client engagements, access to systems and data is agreed before work begins and limited to what is reasonably necessary. Where UnflakeOps acts as a processor of personal data, processing terms will be documented in a data-processing agreement."],
  ["Retention", "We retain enquiry and client information only for as long as needed for the purposes described above, to provide support and to meet legal, accounting and contractual requirements."],
  ["Your rights", "Under UK data-protection law, you may have rights to access, correct, erase or restrict your personal data, object to certain processing, and receive portable data. You can also complain to the Information Commissioner's Office."],
  ["Contact", "For privacy questions or requests, email privacy@unflakeops.com."],
];

export default function PrivacyPage() {
  return <main className="main-container"><Header /><header className="hero-section"><div className="hero-content"><div><div className="brand-row"><span className="brand-name">Legal</span></div><h1 className="hero-title">Privacy Policy</h1><p className="hero-subtitle">Last updated: 19 September 2026</p></div></div></header>{sections.map(([title, body]) => <section className="card section" key={title}><h2 className="card-title" style={{ fontSize: 20, fontWeight: 600 }}>{title}</h2><p className="text-secondary" style={{ marginTop: 12 }}>{body}</p></section>)}</main>;
}
