import "dotenv/config";
import { db } from "../src/lib/db";
async function main() {
  const days = Number(process.env.RETENTION_DAYS || 180);
  if (!Number.isInteger(days) || days < 1)
    throw new Error("RETENTION_DAYS invalid");
  const cutoff = new Date(Date.now() - days * 86400000);
  const result = await db.lead.deleteMany({
    where: {
      status: "CLOSED",
      updatedAt: { lt: cutoff },
      suppressed: false,
      objectionAt: null,
    },
  });
  await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await db.rateBucket.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await db.webhookReceipt.deleteMany({
    where: { receivedAt: { lt: new Date(Date.now() - 86400000) } },
  });
  await db.activity.deleteMany({
    where: {
      leadId: null,
      createdAt: { lt: new Date(Date.now() - 90 * 86400000) },
    },
  });
  console.log(
    JSON.stringify({ event: "retention_complete", deleted: result.count }),
  );
}
main().finally(() => db.$disconnect());
