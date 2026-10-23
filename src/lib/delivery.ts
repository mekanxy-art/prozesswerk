import { createHmac, randomUUID } from "node:crypto";
import type { Lead, Outbox } from "@prisma/client";
import { db } from "./db";
import { digest, requiredSecret, signWebhook } from "./security";
import { siteUrl } from "./config";
export const MAX_ATTEMPTS = 5;
export function retryDelay(attempt: number) {
  return Math.min(3600000, 30000 * 2 ** attempt);
}
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeout = 8000,
) {
  return fetch(url, {
    ...init,
    redirect: "error",
    signal: AbortSignal.timeout(timeout),
  });
}
export function preferenceToken(id: string) {
  return createHmac("sha256", requiredSecret("FORM_SECRET"))
    .update(`unsubscribe:${id}`)
    .digest("hex");
}
async function mail(job: Outbox & { lead: Lead }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const internal = process.env.MAIL_INTERNAL_TO;
  if (!key || !from || !internal) throw new Error("MAIL_CONFIG");
  const { lead } = job;
  let subject = "Ihre Anfrage zur Prozessanalyse";
  let text = `Guten Tag ${lead.name},\n\nwir haben Ihre Anfrage für ${lead.company} gespeichert. Wir prüfen Ihren Prozess und melden uns über den gewünschten Kontaktweg.\n\nBitte antworten Sie auf diese E-Mail, wenn Sie etwas ergänzen möchten.\n\n${process.env.COMPANY_NAME || "[FIRMENNAME]"}`;
  if (job.kind === "INTERNAL_MAIL") {
    subject = "Neue Prozessanalyse-Anfrage";
    text = `Eine neue Anfrage liegt vor. Bitte im geschützten Lead-Bereich prüfen: ${siteUrl}/admin?lead=${lead.id}`;
  }
  if (job.kind === "DOUBLE_OPT_IN") {
    if (lead.suppressed || lead.objectionAt || lead.marketingConfirmedAt)
      return;
    const token = createHmac("sha256", requiredSecret("FORM_SECRET"))
      .update(`doi:${job.id}`)
      .digest("hex");
    await db.lead.update({
      where: { id: lead.id },
      data: {
        marketingTokenHash: digest(token),
        marketingTokenExpires: new Date(job.createdAt.getTime() + 86400000),
      },
    });
    if (Date.now() > job.createdAt.getTime() + 86400000) return;
    subject = "Bitte bestätigen Sie Ihre optionalen Prozessimpulse";
    text = `Guten Tag ${lead.name},\n\nSie haben optionale E-Mail-Impulse angefragt. Bestätigen Sie dies innerhalb von 24 Stunden auf dieser Seite: ${siteUrl}/einwilligung?token=${token}\nOhne Bestätigung erhalten Sie keine Marketingnachrichten.\n\nWiderruf: ${siteUrl}/einstellungen?id=${lead.id}&token=${preferenceToken(lead.id)}`;
  }
  const response = await fetchWithTimeout("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": job.id,
    },
    body: JSON.stringify({
      from,
      to: job.kind === "INTERNAL_MAIL" ? internal : lead.email,
      reply_to: process.env.COMPANY_EMAIL,
      subject,
      text,
    }),
  });
  if (!response.ok) throw new Error(`MAIL_HTTP_${response.status}`);
}
async function webhook(job: Outbox & { lead: Lead }) {
  const target = new URL(process.env.N8N_WEBHOOK_URL || "");
  if (
    target.protocol !== "https:" &&
    !(
      process.env.ALLOW_LOCAL_WEBHOOK_TEST === "true" &&
      ["localhost", "127.0.0.1"].includes(target.hostname)
    )
  )
    throw new Error("WEBHOOK_HTTPS_REQUIRED");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const l = job.lead;
  const body = JSON.stringify({
    eventId: job.id,
    type: "lead.created",
    lead: {
      id: l.id,
      name: l.name,
      company: l.company,
      email: l.email,
      phone: l.phone,
      size: l.size,
      process: l.process,
      challenge: l.challenge,
      budget: l.budget,
      contactWay: l.contactWay,
      source: l.source,
      purpose: l.purpose,
      marketingConfirmedAt: l.marketingConfirmedAt,
      objectionAt: l.objectionAt,
      suppressed: l.suppressed,
    },
  });
  const response = await fetchWithTimeout(target.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Event-Id": job.id,
      "X-Timestamp": timestamp,
      "X-Signature": `sha256=${signWebhook(body, timestamp, requiredSecret("N8N_SIGNING_SECRET"))}`,
      "Idempotency-Key": job.id,
    },
    body,
  });
  if (!response.ok) throw new Error(`WEBHOOK_HTTP_${response.status}`);
}
export async function deliverBatch(leadId?: string) {
  if (process.env.DELIVERY_ENABLED !== "true")
    return { disabled: true, sent: 0, failed: 0 };
  const jobs = await db.outbox.findMany({
    where: {
      leadId,
      sentAt: null,
      failedAt: null,
      availableAt: { lte: new Date() },
      OR: [{ lockedUntil: null }, { lockedUntil: { lt: new Date() } }],
    },
    take: 20,
    orderBy: { createdAt: "asc" },
  });
  let sent = 0,
    failed = 0;
  for (const candidate of jobs) {
    const claimToken = randomUUID();
    const claim = await db.outbox.updateMany({
      where: {
        id: candidate.id,
        sentAt: null,
        failedAt: null,
        OR: [{ lockedUntil: null }, { lockedUntil: { lt: new Date() } }],
      },
      data: {
        lockedUntil: new Date(Date.now() + 60000),
        claimToken,
        attempts: { increment: 1 },
      },
    });
    if (claim.count !== 1) continue;
    const job = await db.outbox.findUniqueOrThrow({
      where: { id: candidate.id },
      include: { lead: true },
    });
    try {
      if (job.kind === "WEBHOOK") await webhook(job);
      else await mail(job);
      await db.outbox.updateMany({
        where: { id: job.id, claimToken },
        data: {
          sentAt: new Date(),
          lockedUntil: null,
          claimToken: null,
          errorCode: null,
        },
      });
      sent++;
    } catch (error) {
      const code =
        error instanceof Error && /^(MAIL_|WEBHOOK_)/.test(error.message)
          ? error.message
          : "DELIVERY_FAILED";
      await db.outbox.updateMany({
        where: { id: job.id, claimToken },
        data: {
          lockedUntil: null,
          claimToken: null,
          errorCode: code,
          availableAt: new Date(Date.now() + retryDelay(job.attempts)),
          failedAt: job.attempts >= MAX_ATTEMPTS ? new Date() : null,
        },
      });
      console.warn(
        JSON.stringify({ event: "delivery_failed", jobId: job.id, code }),
      );
      failed++;
    }
  }
  return { disabled: false, sent, failed };
}
