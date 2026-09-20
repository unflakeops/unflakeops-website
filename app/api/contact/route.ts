export const runtime = "nodejs";

import { NextResponse } from "next/server";

interface ContactBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
}

interface RateLimitEntry { count: number; resetAt: number; }

const ZOHO_FORM_URL = "https://crm.zoho.com/crm/WebToLeadForm";
const ZOHO_FORM_ID = "8445b69e38509cb3b56fd762bb029dc20a932356853585177b955fc2e461d0df";
const ZOHO_FORM_TOKEN = "46c45abff8c75cea79bc70e5b6148253177cd574f3cee547cf756cca30338a0156f1030f02a17761ff5f1dbc740b3c85";
const MAX_BODY_BYTES = 16_000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;
const MIN_FORM_TIME_MS = 1_500;
const rateLimits = new Map<string, RateLimitEntry>();

function isValidEmail(value: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

function sameSiteRequest(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try { return new URL(origin).host === new URL(req.url).host; } catch { return false; }
}

export async function POST(req: Request): Promise<Response> {
  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false, error: "That message is too large." }, { status: 413 });
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return NextResponse.json({ ok: false, error: "Unsupported request format." }, { status: 415 });
  if (!sameSiteRequest(req)) return NextResponse.json({ ok: false, error: "Request origin could not be verified." }, { status: 403 });
  let parsed: ContactBody;
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return NextResponse.json({ ok: false, error: "That message is too large." }, { status: 413 });
    parsed = JSON.parse(raw) as ContactBody;
  }
  catch { return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 }); }

  if (typeof parsed.website === "string" && parsed.website.trim() !== "") return NextResponse.json({ ok: true });
  const startedAt = typeof parsed.startedAt === "number" ? parsed.startedAt : 0;
  if (!startedAt || Date.now() - startedAt < MIN_FORM_TIME_MS) return NextResponse.json({ ok: false, error: "Please wait a moment and try again." }, { status: 400 });

  const name = typeof parsed.name === "string" ? parsed.name.trim().slice(0, 120) : "";
  const company = typeof parsed.company === "string" ? parsed.company.trim().slice(0, 200) : "";
  const email = typeof parsed.email === "string" ? parsed.email.trim().toLowerCase().slice(0, 100) : "";
  const message = typeof parsed.message === "string" ? parsed.message.trim().slice(0, 3_000) : "";
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Enter your name.";
  if (!company) fieldErrors.company = "Enter your charity or organisation.";
  if (!email || !isValidEmail(email)) fieldErrors.email = "Enter a valid work email address.";
  if (!message) fieldErrors.message = "Tell us which recurring report or process takes the most time.";
  if (Object.keys(fieldErrors).length > 0) return NextResponse.json({ ok: false, error: "Check the highlighted fields.", fieldErrors }, { status: 400 });
  if (isRateLimited(clientKey(req))) return NextResponse.json({ ok: false, error: "Too many attempts. Please wait 15 minutes and try again." }, { status: 429 });

  const parts = name.split(/\s+/);
  const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : "";
  const lastName = parts.length > 1 ? parts.at(-1)! : name;
  const form = new URLSearchParams({
    xnQsjsdp: ZOHO_FORM_ID,
    zc_gad: "",
    xmIwtLD: ZOHO_FORM_TOKEN,
    actionType: "TGVhZHM=",
    returnURL: "https://unflakeops.com/thanks",
    Company: company,
    "First Name": firstName,
    "Last Name": lastName,
    Email: email,
    Description: `Website charity-reporting enquiry\n\n${message}`,
    aG9uZXlwb3Q: "",
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const zoho = await fetch(ZOHO_FORM_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }, body: form.toString(), redirect: "manual", signal: controller.signal, cache: "no-store" });
    const location = zoho.headers.get("location") || "";
    const accepted = zoho.status >= 300 && zoho.status < 400 && location.startsWith("https://unflakeops.com/thanks");
    if (!accepted) {
      console.error("[contact] Zoho rejected the enquiry", { status: zoho.status });
      return NextResponse.json({ ok: false, error: "We could not save your enquiry. Please try again." }, { status: 502 });
    }
  } catch (error) {
    console.error("[contact] Zoho delivery failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ ok: false, error: "We could not save your enquiry. Please try again." }, { status: 502 });
  } finally { clearTimeout(timeout); }
  return NextResponse.json({ ok: true });
}
