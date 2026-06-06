export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";

// ── Types ────────────────────────────────────────────────────────────────────

interface ContactBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
}

interface HubSpotProperties {
  email: string;
  firstname: string;
  company: string;
  message: string;
  hs_lead_source: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function truncate(value: string, max: number): string {
  return value.slice(0, max);
}

async function upsertHubspotContact(props: HubSpotProperties): Promise<void> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) {
    console.warn(
      "[contact] HUBSPOT_PRIVATE_APP_TOKEN not set — skipping HubSpot upsert."
    );
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const body = JSON.stringify({ properties: props });

  // Try PATCH (upsert by email idProperty)
  const patchRes = await fetch(
    `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(props.email)}?idProperty=email`,
    { method: "PATCH", headers, body }
  );

  if (patchRes.ok) return;

  if (patchRes.status === 404) {
    // Contact does not exist yet — create it
    const postRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      { method: "POST", headers, body }
    );
    if (!postRes.ok) {
      const text = await postRes.text().catch(() => "");
      throw new Error(`HubSpot POST failed ${postRes.status}: ${text}`);
    }
    return;
  }

  const text = await patchRes.text().catch(() => "");
  throw new Error(`HubSpot PATCH failed ${patchRes.status}: ${text}`);
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request): Promise<Response> {
  let parsed: ContactBody;
  try {
    parsed = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Honeypot — silent drop (return 200, do nothing)
  if (parsed.website && String(parsed.website).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Validate + normalise fields
  const name =
    typeof parsed.name === "string" ? truncate(parsed.name.trim(), 200) : "";
  const rawEmail =
    typeof parsed.email === "string" ? parsed.email.trim() : "";
  const company =
    typeof parsed.company === "string"
      ? truncate(parsed.company.trim(), 300)
      : "";
  const message =
    typeof parsed.message === "string"
      ? truncate(parsed.message.trim(), 5000)
      : "";

  if (!rawEmail || !isValidEmail(rawEmail)) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required." },
      { status: 400 }
    );
  }

  const email = truncate(rawEmail, 320);

  // ── HubSpot upsert (never fatal to the user request) ─────────────────────
  try {
    await upsertHubspotContact({
      email,
      firstname: name,
      company,
      message,
      hs_lead_source: "website contact form",
    });
  } catch (err) {
    console.error("[contact] HubSpot upsert failed — continuing:", err);
  }

  // ── Resend internal notification ──────────────────────────────────────────
  const resendApiKey = process.env.RESEND_API_KEY;
  const bccLeads = process.env.EMAIL_BCC_LEADS;

  if (!resendApiKey) {
    console.warn(
      "[contact] RESEND_API_KEY not set — skipping Resend notification."
    );
  } else if (bccLeads) {
    try {
      const resend = new Resend(resendApiKey);
      const internalHtml = `
        <div style="font-family:ui-sans-serif,system-ui;color:#e5e7eb;background:#0b0b0f;padding:24px;">
          <h2 style="color:#fff;margin:0 0 8px 0;">New Contact Form Submission</h2>
          <div style="background:#1a1a1a;padding:16px;border-radius:8px;margin-top:16px;">
            <p style="margin:4px 0;color:#a1a1aa;"><strong>Name:</strong> ${name || "Not provided"}</p>
            <p style="margin:4px 0;color:#a1a1aa;"><strong>Email:</strong> ${email}</p>
            <p style="margin:4px 0;color:#a1a1aa;"><strong>Company:</strong> ${company || "Not provided"}</p>
            <p style="margin:4px 0;color:#a1a1aa;"><strong>Message:</strong></p>
            <p style="margin:4px 0 0 12px;color:#d1d5db;white-space:pre-wrap;">${message || "(no message)"}</p>
          </div>
          <p style="margin-top:16px;color:#a1a1aa;">Please follow up within one business day.</p>
        </div>`;

      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "UnflakeOps <hello@unflakeops.com>",
        to: bccLeads,
        subject: `New contact: ${name || email}${company ? ` — ${company}` : ""}`,
        html: internalHtml,
        replyTo: email,
      });
    } catch (err) {
      console.error("[contact] Resend notification failed:", err);
    }
  }

  // ── Telegram notification (optional) ─────────────────────────────────────
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    const tgMessage = `📬 *New Contact Form Submission*

👤 *Name:* ${name || "Not provided"}
📧 *Email:* ${email}
🏢 *Company:* ${company || "Not provided"}
💬 *Message:*
${message ? message.slice(0, 400) : "(no message)"}`;

    try {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChat,
          text: tgMessage,
          parse_mode: "Markdown",
        }),
      });
    } catch (err) {
      console.error("[contact] Telegram notification failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
