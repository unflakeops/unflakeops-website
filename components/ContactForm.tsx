"use client";

import Link from "next/link";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

interface FormState { name: string; email: string; company: string; message: string; website: string; }
type FieldName = "name" | "company" | "email" | "message";
type Status = "idle" | "pending" | "success" | "error";
const INITIAL: FormState = { name: "", email: "", company: "", message: "", website: "" };

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const startedAt = useRef(Date.now());
  const fields = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement>>>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = event.target.name as keyof FormState;
    setForm((previous) => ({ ...previous, [name]: event.target.value }));
    if (name in fieldErrors) setFieldErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  function validate(): Partial<Record<FieldName, string>> {
    const errors: Partial<Record<FieldName, string>> = {};
    if (!form.name.trim()) errors.name = "Enter your name.";
    if (!form.company.trim()) errors.company = "Enter your charity or organisation.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid work email address.";
    if (!form.message.trim()) errors.message = "Tell us which recurring report or process takes the most time.";
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "success") {
      setStatus("idle");
      setErrorMsg("");
      startedAt.current = Date.now();
      fields.current.name?.focus();
      return;
    }
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors); setStatus("error"); setErrorMsg("Check the highlighted fields.");
      fields.current[(Object.keys(clientErrors) as FieldName[])[0]]?.focus();
      return;
    }

    setStatus("pending"); setErrorMsg(""); setFieldErrors({});
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, startedAt: startedAt.current }) });
      const data = (await response.json()) as { ok: boolean; error?: string; fieldErrors?: Partial<Record<FieldName, string>> };
      if (response.ok && data.ok) { setStatus("success"); setForm(INITIAL); }
      else {
        setStatus("error"); setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        if (data.fieldErrors) { setFieldErrors(data.fieldErrors); fields.current[(Object.keys(data.fieldErrors) as FieldName[])[0]]?.focus(); }
      }
    } catch { setStatus("error"); setErrorMsg("Network error. Check your connection and try again."); }
  }

  const pending = status === "pending";
  const fieldProps = (name: FieldName) => ({ "aria-invalid": Boolean(fieldErrors[name]), "aria-describedby": fieldErrors[name] ? `cf-${name}-error` : undefined });

  return (
    <form className="charity-contact" onSubmit={handleSubmit} noValidate aria-label="Workflow conversation form">
      <div className="cf-honeypot" aria-hidden="true"><label htmlFor="cf-website">Leave this field empty</label><input id="cf-website" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" /></div>
      <div className="cf-field"><label className="cf-label" htmlFor="cf-name">Name *</label><input ref={(element) => { fields.current.name = element ?? undefined; }} id="cf-name" name="name" className="cf-input" value={form.name} onChange={handleChange} placeholder="Your name" maxLength={120} required disabled={pending || status === "success"} autoComplete="name" {...fieldProps("name")} />{fieldErrors.name && <p id="cf-name-error" className="cf-field-error">{fieldErrors.name}</p>}</div>
      <div className="cf-field"><label className="cf-label" htmlFor="cf-company">Charity or organisation *</label><input ref={(element) => { fields.current.company = element ?? undefined; }} id="cf-company" name="company" className="cf-input" value={form.company} onChange={handleChange} placeholder="Your organisation" maxLength={200} required disabled={pending || status === "success"} autoComplete="organization" {...fieldProps("company")} />{fieldErrors.company && <p id="cf-company-error" className="cf-field-error">{fieldErrors.company}</p>}</div>
      <div className="cf-field"><label className="cf-label" htmlFor="cf-email">Work email *</label><input ref={(element) => { fields.current.email = element ?? undefined; }} id="cf-email" name="email" type="email" className="cf-input" value={form.email} onChange={handleChange} placeholder="you@charity.org.uk" maxLength={100} required disabled={pending || status === "success"} autoComplete="email" {...fieldProps("email")} />{fieldErrors.email && <p id="cf-email-error" className="cf-field-error">{fieldErrors.email}</p>}</div>
      <div className="cf-field"><label className="cf-label" htmlFor="cf-message">Which recurring funder, impact or trustee report takes the most time? *</label><textarea ref={(element) => { fields.current.message = element ?? undefined; }} id="cf-message" name="message" className="cf-input cf-textarea" value={form.message} onChange={handleChange} placeholder="What happened the last time your team produced it?" maxLength={3000} rows={5} required disabled={pending || status === "success"} {...fieldProps("message")} />{fieldErrors.message && <p id="cf-message-error" className="cf-field-error">{fieldErrors.message}</p>}</div>
      <p className="cf-safety">Please do not include beneficiary or special-category personal data. A redacted example is enough for an initial conversation.</p>
      <p className="cf-privacy">By sending this form, you agree that UnflakeOps may use these details to respond to your enquiry. See our <Link href="/privacy">Privacy Policy</Link>.</p>
      {status === "error" && <p className="cf-feedback cf-feedback-error" role="alert">{errorMsg}</p>}
      {status === "success" && <p className="cf-feedback cf-feedback-success" role="status" tabIndex={-1}>Thank you. Your enquiry is safely in our CRM and we&apos;ll reply within one business day.</p>}
      <button type="submit" className="contact-button" disabled={pending} aria-busy={pending}>{pending ? "Saving securely…" : status === "success" ? "Send another enquiry" : "Send enquiry"}</button>
    </form>
  );
}
