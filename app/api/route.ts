export const runtime = "nodejs"; // ensure Node runtime (not edge)

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic shape (kept simple on purpose)
    const name = body?.name || "there";
    const email = body?.email;
    if (!email) throw new Error("Missing email");

    const company = body?.company || "";
    const ci = body?.ci || "";
    const inputs = body?.inputs || {};
    const outputs = body?.outputs || {};

    // Compose a minimal HTML summary
    const rows: Array<[string, any]> = [
      ["Pipelines/week", inputs.pipelinesPerWeek],
      ["Failure rate", `${inputs.failureRate}%`],
      ["% flaky of failures", `${inputs.percentFlaky}%`],
      ["Rerun minutes per flaky failure", inputs.rerunMins],
      ["Engineers affected", inputs.engineersAffected],
      ["Hourly cost", `${inputs.currency} ${inputs.hourlyCost}`],
      ["Weekly engineer hours wasted", Number(outputs.weeklyHours).toFixed(1)],
      [
        "Weekly cost wasted",
        `${inputs.currency} ${Number(
          outputs.weeklyCost || 0
        ).toLocaleString()}`,
      ],
      [
        "Annual waste",
        `${inputs.currency} ${Number(
          outputs.annualWaste || 0
        ).toLocaleString()}`,
      ],
      [
        "Monthly savings @50%",
        `${inputs.currency} ${Number(
          outputs.monthlySavings || 0
        ).toLocaleString()}`,
      ],
      ["Sprint payback (days)", outputs.sprintPaybackDays],
      [
        "ROI multiplier on Core (annualised)",
        Number(outputs.coreROI || 0).toFixed(2),
      ],
      ["Recommended plan", outputs.recommendedPlan || "—"],
    ];

    const html = `
      <div style="font-family: ui-sans-serif, system-ui; color:#e5e7eb; background:#0b0b0f; padding:24px;">
        <h2 style="color:#fff; margin:0 0 8px 0;">Your UnflakeOps calculator results</h2>
        <p style="margin:0 0 16px 0; color:#a1a1aa;">Hi ${name}${
      company ? ` from <b>${company}</b>` : ""
    }. CI: ${ci || "(not specified)"}.</p>
        <table style="border-collapse:collapse; width:100%;">
          ${rows
            .map(
              ([k, v]) => `
                <tr>
                  <td style="border:1px solid #27272a; padding:8px; color:#a1a1aa;">${k}</td>
                  <td style="border:1px solid #27272a; padding:8px; color:#fff;">${
                    v ?? "—"
                  }</td>
                </tr>`
            )
            .join("")}
        </table>
        <p style="margin-top:16px; color:#a1a1aa;">We'll reach out to baseline and outline a 30‑day plan.</p>
        <p style="margin-top:24px; color:#a1a1aa;">— UnflakeOps</p>
      </div>`;

    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "RESEND_API_KEY not set — skipping email send. Returning payload for debugging."
      );
      return NextResponse.json({ ok: true, skippedEmail: true });
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "UnflakeOps <hello@unflakeops.com>",
      to: email,
      bcc: process.env.EMAIL_BCC_LEADS
        ? [process.env.EMAIL_BCC_LEADS]
        : undefined,
      subject: `Your calculator results — ${
        outputs.recommendedPlan || "UnflakeOps"
      }`,
      html,
      replyTo: "hello@unflakeops.com",
    });

    // Optional lightweight PostHog capture (no library)
    if (process.env.POSTHOG_KEY) {
      const host =
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";
      await fetch(`${host}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.POSTHOG_KEY,
          event: "calculator_results_emailed",
          distinct_id: email,
          properties: { company, ci, ...inputs, ...outputs },
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("/api/email-results error", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Invalid request" },
      { status: 400 }
    );
  }
}
