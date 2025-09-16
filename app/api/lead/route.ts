export const runtime = "nodejs"; // ensure Node runtime (not edge)

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extract data from the request
    const email = body?.email;
    if (!email) throw new Error("Missing email");

    const company = body?.company || "";
    const ci = body?.ci || "";
    const teamSize = body?.teamSize || "";
    const source = body?.source || "unknown";
    const inputs = body?.inputs || {};
    const results = body?.results || {};

    // Create a summary of the calculator results
    const summaryRows: Array<[string, any]> = [
      ["Pipelines per week", inputs.pipelinesPerWeek],
      ["Failure rate", `${inputs.failureRatePct}%`],
      ["% of failures that are flaky", `${inputs.pctFlaky}%`],
      ["Triage minutes per flaky failure", inputs.triageMinutes],
      ["Re-run minutes per flaky failure", inputs.rerunMinutes],
      ["Engineers affected per failure", inputs.engineersAffected],
      [
        "Loaded hourly cost",
        `${inputs.currency} ${Number(inputs.loadedHourly).toFixed(2)}`,
      ],
      [
        "Weekly engineer hours wasted",
        Number(results.weeklyHours || 0).toFixed(2),
      ],
      [
        "Weekly cost wasted",
        `${inputs.currency} ${Number(results.weeklyCost || 0).toFixed(2)}`,
      ],
      [
        "Annual waste",
        `${inputs.currency} ${Number(results.annualCost || 0).toFixed(2)}`,
      ],
      [
        "Monthly savings @ 50% reduction",
        `${inputs.currency} ${Number(results.monthlySavings50 || 0).toFixed(
          2
        )}`,
      ],
      [
        "Sprint payback (days)",
        Number(results.sprintPaybackDays || 0).toFixed(2),
      ],
      [
        "ROI multiplier on Core (annualised)",
        Number(results.coreRoiMultiplier || 0).toFixed(2),
      ],
      ["Recommended plan", results.plan || "—"],
    ];

    // Email to the lead
    const leadHtml = `
      <div style="font-family: ui-sans-serif, system-ui; color:#e5e7eb; background:#0b0b0f; padding:24px;">
        <h2 style="color:#fff; margin:0 0 8px 0;">Your UnflakeOps Calculator Results</h2>
        <p style="margin:0 0 16px 0; color:#a1a1aa;">Hi${
          company ? ` from <b>${company}</b>` : ""
        }. CI: ${ci || "(not specified)"}. Team size: ${
      teamSize || "(not specified)"
    }.</p>
        <table style="border-collapse:collapse; width:100%;">
          ${summaryRows
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
        <p style="margin-top:16px; color:#a1a1aa;">We'll reach out within 24 hours to discuss your specific situation and how we can help reduce your flaky failures.</p>
        <p style="margin-top:24px; color:#a1a1aa;">— UnflakeOps Team</p>
      </div>`;

    // Internal notification email
    const internalHtml = `
      <div style="font-family: ui-sans-serif, system-ui; color:#e5e7eb; background:#0b0b0f; padding:24px;">
        <h2 style="color:#fff; margin:0 0 8px 0;">New Lead from Calculator</h2>
        <p style="margin:0 0 16px 0; color:#a1a1aa;">Source: ${source}</p>
        <div style="background:#1a1a1a; padding:16px; border-radius:8px; margin:16px 0;">
          <h3 style="color:#fff; margin:0 0 8px 0;">Contact Information</h3>
          <p style="margin:4px 0; color:#a1a1aa;"><strong>Email:</strong> ${email}</p>
          <p style="margin:4px 0; color:#a1a1aa;"><strong>Company:</strong> ${
            company || "Not provided"
          }</p>
          <p style="margin:4px 0; color:#a1a1aa;"><strong>CI System:</strong> ${
            ci || "Not provided"
          }</p>
          <p style="margin:4px 0; color:#a1a1aa;"><strong>Team Size:</strong> ${
            teamSize || "Not provided"
          }</p>
        </div>
        <div style="background:#1a1a1a; padding:16px; border-radius:8px; margin:16px 0;">
          <h3 style="color:#fff; margin:0 0 8px 0;">Calculator Results</h3>
          <table style="border-collapse:collapse; width:100%;">
            ${summaryRows
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
        </div>
        <p style="margin-top:16px; color:#a1a1aa;">Please follow up within 24 hours.</p>
      </div>`;

    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "RESEND_API_KEY not set — skipping email send. Returning payload for debugging."
      );
      console.log("Lead data:", {
        email,
        company,
        ci,
        teamSize,
        source,
        inputs,
        results,
      });

      // Send Telegram notification even when email is skipped
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        const telegramMessage = `🚀 *New Lead from UnflakeOps Calculator* (Development Mode)

📧 *Email:* ${email}
🏢 *Company:* ${company || "Not provided"}
⚙️ *CI System:* ${ci || "Not provided"}
👥 *Team Size:* ${teamSize || "Not provided"}
📊 *Source:* ${source}

💰 *Potential Savings:*
• Weekly waste: ${inputs.currency} ${Number(results.weeklyCost || 0).toFixed(2)}
• Annual waste: ${inputs.currency} ${Number(results.annualCost || 0).toFixed(2)}
• Monthly savings: ${inputs.currency} ${Number(
          results.monthlySavings50 || 0
        ).toFixed(2)}
• Recommended plan: ${results.plan || "—"}

📈 *Calculator Results:*
• Pipelines/week: ${inputs.pipelinesPerWeek}
• Failure rate: ${inputs.failureRatePct}%
• Flaky failures: ${inputs.pctFlaky}%
• Engineers affected: ${inputs.engineersAffected}

⚠️ *Note: Email not sent (RESEND_API_KEY not configured)*
⏰ *Follow up within 24 hours*`;

        try {
          await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: "Markdown",
              }),
            }
          );
        } catch (error) {
          console.error("Failed to send Telegram notification:", error);
        }
      }

      return NextResponse.json({
        ok: true,
        skippedEmail: true,
        message:
          "Email skipped - RESEND_API_KEY not configured. Check server logs for lead data.",
      });
    }

    // Send email to the lead
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "UnflakeOps <hello@unflakeops.com>",
      to: email,
      subject: `Your calculator results — ${results.plan || "UnflakeOps"}`,
      html: leadHtml,
      replyTo: "hello@unflakeops.com",
    });

    // Send internal notification if BCC is configured
    if (process.env.EMAIL_BCC_LEADS) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "UnflakeOps <hello@unflakeops.com>",
        to: process.env.EMAIL_BCC_LEADS,
        subject: `New Lead: ${company || "Unknown Company"} - ${email}`,
        html: internalHtml,
        replyTo: email,
      });
    }

    // Send Telegram notification
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const telegramMessage = `🚀 *New Lead from UnflakeOps Calculator*

📧 *Email:* ${email}
🏢 *Company:* ${company || "Not provided"}
⚙️ *CI System:* ${ci || "Not provided"}
👥 *Team Size:* ${teamSize || "Not provided"}
📊 *Source:* ${source}

💰 *Potential Savings:*
• Weekly waste: ${inputs.currency} ${Number(results.weeklyCost || 0).toFixed(2)}
• Annual waste: ${inputs.currency} ${Number(results.annualCost || 0).toFixed(2)}
• Monthly savings: ${inputs.currency} ${Number(
        results.monthlySavings50 || 0
      ).toFixed(2)}
• Recommended plan: ${results.plan || "—"}

📈 *Calculator Results:*
• Pipelines/week: ${inputs.pipelinesPerWeek}
• Failure rate: ${inputs.failureRatePct}%
• Flaky failures: ${inputs.pctFlaky}%
• Engineers affected: ${inputs.engineersAffected}

⏰ *Follow up within 24 hours*`;

      try {
        await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: telegramMessage,
              parse_mode: "Markdown",
            }),
          }
        );
      } catch (error) {
        console.error("Failed to send Telegram notification:", error);
      }
    }

    // Optional lightweight PostHog capture (no library)
    if (process.env.POSTHOG_KEY) {
      const host =
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";
      await fetch(`${host}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.POSTHOG_KEY,
          event: "lead_submitted",
          distinct_id: email,
          properties: {
            company,
            ci,
            teamSize,
            source,
            ...inputs,
            ...results,
          },
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("/api/lead error", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Invalid request" },
      { status: 400 }
    );
  }
}
