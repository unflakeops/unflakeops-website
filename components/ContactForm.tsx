"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

interface FormState {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string; // honeypot — must stay empty
}

type Status = "idle" | "pending" | "success" | "error";

const INITIAL: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("pending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };

      if (res.ok && data.ok) {
        setStatus("success");
        setForm(INITIAL);
      } else {
        setStatus("error");
        setErrorMsg(
          data.error ?? "Something went wrong. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  const isPending = status === "pending";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: "grid", gap: "16px" }}
      aria-label="Contact form"
    >
      {/* Honeypot — visually hidden, should stay empty */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          name="website"
          type="text"
          value={form.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Name */}
      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-name">
          Name
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          className="cf-input"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          maxLength={200}
          disabled={isPending}
          autoComplete="name"
        />
      </div>

      {/* Email */}
      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-email">
          Email <span style={{ color: "var(--green)" }}>*</span>
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          className="cf-input"
          value={form.email}
          onChange={handleChange}
          placeholder="you@company.com"
          maxLength={320}
          required
          disabled={isPending}
          autoComplete="email"
        />
      </div>

      {/* Company */}
      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-company">
          Company
        </label>
        <input
          id="cf-company"
          name="company"
          type="text"
          className="cf-input"
          value={form.company}
          onChange={handleChange}
          placeholder="Your organisation"
          maxLength={300}
          disabled={isPending}
          autoComplete="organization"
        />
      </div>

      {/* Message */}
      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-message">
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          className="cf-input cf-textarea"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us briefly about your AI workflow or data reliability challenge."
          maxLength={5000}
          rows={4}
          disabled={isPending}
        />
      </div>

      {/* Error state */}
      {status === "error" && (
        <p className="cf-feedback cf-feedback--error" role="alert">
          {errorMsg}
        </p>
      )}

      {/* Success state */}
      {status === "success" && (
        <p className="cf-feedback cf-feedback--success" role="status">
          Message received. We&apos;ll be in touch within one business day.
        </p>
      )}

      <button
        type="submit"
        className="contact-button"
        disabled={isPending || status === "success"}
        style={{ justifySelf: "start" }}
      >
        {isPending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
