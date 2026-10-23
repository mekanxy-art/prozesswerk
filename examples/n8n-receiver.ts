/** Reference receiver for a server in front of n8n; HTTPS and 64 KB body limit required.
 * Persist downstream operations inside the same transaction as the unique receipt.
 */
import { verifyWebhook } from "../src/lib/security";
import { db } from "../src/lib/db";
export async function receive(body: string, headers: Headers, secret: string) {
  if (Buffer.byteLength(body) > 65536) return { status: 413 };
  const timestamp = headers.get("x-timestamp") || "";
  const signature = (headers.get("x-signature") || "").replace(/^sha256=/, "");
  if (!verifyWebhook(body, timestamp, signature, secret))
    return { status: 401 };
  let payload: { eventId?: string; type?: string };
  try {
    payload = JSON.parse(body);
  } catch {
    return { status: 400 };
  }
  if (
    !payload.eventId ||
    payload.eventId !== headers.get("x-event-id") ||
    payload.type !== "lead.created"
  )
    return { status: 400 };
  const accepted = await db.$transaction(async (tx) => {
    const inserted = await tx.webhookReceipt.createMany({
      data: [{ eventId: payload.eventId! }],
      skipDuplicates: true,
    });
    if (!inserted.count) return false;
    await tx.activity.create({
      data: {
        actor: "n8n-receiver",
        type: `EVENT_ACCEPTED:${payload.eventId}`,
      },
    });
    return true;
  });
  return { status: 200, accepted };
}
