"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

interface FormState { name: string; email: string; company: string; message: string; website: string; }
type Status = "idle" | "pending" | "success" | "error";
const INITIAL: FormState = { name: "", email: "", company: "", message: "", website: "" };

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((previous) => ({ ...previous, [e.target.name]: e.target.value }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus("pending"); setErrorMsg("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (response.ok && data.ok) { setStatus("success"); setForm(INITIAL); }
      else { setStatus("error"); setErrorMsg(data.error ?? "Something went wrong. Please try again."); }
    } catch { setStatus("error"); setErrorMsg("Network error. Please check your connection and try again."); }
  }

  const pending = status === "pending";
  return (
    <form className="charity-contact" onSubmit={handleSubmit} noValidate aria-label="Workflow conversation form">
      <div style={{ display: "none" }} aria-hidden="true"><label htmlFor="cf-website">Website</label><input id="cf-website" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" /></div>
      <div className="cf-field"><label className="cf-label" htmlFor="cf-name">Name</label><input id="cf-name" name="name" className="cf-input" value={form.name} onChange={handleChange} placeholder="Your name" maxLength={200} disabled={pending} autoComplete="name" /></div>
      <div className="cf-field"><label className="cf-label" htmlFor="cf-company">Charity or organisation</label><input id="cf-company" name="company" className="cf-input" value={form.company} onChange={handleChange} placeholder="Your organisation" maxLength={300} disabled={pending} autoComplete="organization" /></div>
      <div className="cf-field"><label className="cf-label" htmlFor="cf-email">Email *</label><input id="cf-email" name="email" type="email" className="cf-input" value={form.email} onChange={handleChange} placeholder="you@charity.org.uk" maxLength={320} required disabled={pending} autoComplete="email" /></div>
      <div className="cf-field"><label className="cf-label" htmlFor="cf-message">Which recurring report or process consumes the most time?</label><textarea id="cf-message" name="message" className="cf-input cf-textarea" value={form.message} onChange={handleChange} placeholder="Tell us what happened the last time your team produced it." maxLength={5000} rows={5} disabled={pending} /></div>
      {status === "error" && <p className="cf-feedback" role="alert">{errorMsg}</p>}
      {status === "success" && <p className="cf-feedback" role="status">Thank you. We&apos;ll reply within one business day.</p>}
      <button type="submit" className="contact-button" disabled={pending || status === "success"}>{pending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
