import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { db } from "../../src/lib/db";
import { saveLead } from "../../src/lib/leads";
import { leadSchema } from "../../src/lib/validation";
import { consumeRate } from "../../src/lib/rate-limit";
import { deliverBatch } from "../../src/lib/delivery";
import { receive } from "../../examples/n8n-receiver";
const prefix = "integration-" + randomUUID();
const input = leadSchema.parse({
  name: "Integration Test",
  company: "BEISPIEL – Integrationstest",
  email: "integration@example.invalid",
  phone: "",
  size: "10–49",
  process: "Onboarding",
  challenge:
    "Ein ausdrücklich gekennzeichneter Integrationstest für die Datenbank.",
  budget: "",
  contactWay: "E-Mail",
  privacy: "on",
  marketing: true,
  source: "Test",
});
test("database transaction, deduplication, atomic limits, delivery retries and replay protection", async (t) => {
  if (process.env.ALLOW_DATABASE_TESTS !== "true")
    throw new Error(
      "Dedicated test database required: ALLOW_DATABASE_TESTS=true",
    );
  process.env.N8N_WEBHOOK_URL = "https://n8n.example.invalid/webhook";
  process.env.N8N_SIGNING_SECRET =
    "integration-secret-at-least-thirty-two-chars";
  const original = globalThis.fetch;
  const oldDelivery = process.env.DELIVERY_ENABLED;
  try {
    const lead = await saveLead(input, prefix);
    await t.test("lead and all delivery jobs persist atomically", async () => {
      assert.equal(await db.outbox.count({ where: { leadId: lead.id } }), 4);
      assert.equal(
        await db.activity.count({
          where: { leadId: lead.id, type: "LEAD_CREATED" },
        }),
        1,
      );
    });
    await t.test("same request key cannot create a second lead", async () => {
      const again = await saveLead(input, prefix);
      assert.equal(again.id, lead.id);
      assert.equal(await db.lead.count({ where: { requestKey: prefix } }), 1);
    });
    await t.test(
      "parallel rate requests obey the shared database limit",
      async () => {
        const result = await Promise.all(
          Array.from({ length: 8 }, () =>
            consumeRate("integration", prefix, 3, 10000),
          ),
        );
        assert.equal(result.filter(Boolean).length, 3);
      },
    );
    await t.test("disabled delivery sends nothing", async () => {
      process.env.DELIVERY_ENABLED = "false";
      const result = await deliverBatch(lead.id);
      assert.equal(result.disabled, true);
      assert.equal(
        (await db.outbox.findFirstOrThrow({ where: { leadId: lead.id } }))
          .attempts,
        0,
      );
    });
    // Isolate only this lead's webhook; mail jobs remain queued and are never sent to a real service.
    await db.outbox.updateMany({
      where: { leadId: lead.id, kind: { not: "WEBHOOK" }, sentAt: null },
      data: { availableAt: new Date(Date.now() + 86400000) },
    });
    process.env.DELIVERY_ENABLED = "true";
    let capturedBody = "";
    let capturedHeaders = new Headers();
    await t.test(
      "failed delivery keeps the lead and schedules retry",
      async () => {
        globalThis.fetch = async () =>
          new Response("unavailable", { status: 503 });
        const result = await deliverBatch(lead.id);
        assert.equal(result.failed, 1);
        const job = await db.outbox.findFirstOrThrow({
          where: { leadId: lead.id, kind: "WEBHOOK" },
        });
        assert.equal(job.errorCode, "WEBHOOK_HTTP_503");
        assert.equal(job.sentAt, null);
        assert.equal(job.attempts, 1);
        assert.ok(job.availableAt.getTime() > Date.now());
        assert.ok(await db.lead.findUnique({ where: { id: lead.id } }));
      },
    );
    await t.test(
      "signed retry succeeds and receiver rejects duplicate processing",
      async () => {
        await db.outbox.updateMany({
          where: { leadId: lead.id, kind: "WEBHOOK" },
          data: { availableAt: new Date() },
        });
        globalThis.fetch = async (_url, init) => {
          capturedBody = String(init?.body);
          capturedHeaders = new Headers(init?.headers);
          return new Response("{}", { status: 200 });
        };
        const result = await deliverBatch(lead.id);
        assert.equal(result.sent, 1);
        const accepted = await receive(
          capturedBody,
          capturedHeaders,
          process.env.N8N_SIGNING_SECRET!,
        );
        assert.equal(accepted.accepted, true);
        assert.equal(
          (
            await receive(
              capturedBody,
              capturedHeaders,
              process.env.N8N_SIGNING_SECRET!,
            )
          ).accepted,
          false,
        );
        assert.equal(
          (
            await receive(
              capturedBody + " ",
              capturedHeaders,
              process.env.N8N_SIGNING_SECRET!,
            )
          ).status,
          401,
        );
      },
    );
    await t.test("max attempts moves job to visible failed queue", async () => {
      await db.outbox.updateMany({
        where: { leadId: lead.id, kind: "WEBHOOK" },
        data: { sentAt: null, attempts: 4, availableAt: new Date() },
      });
      globalThis.fetch = async () => {
        throw new Error(
          "network error with sensitive data must never be logged",
        );
      };
      await deliverBatch(lead.id);
      const job = await db.outbox.findFirstOrThrow({
        where: { leadId: lead.id, kind: "WEBHOOK" },
      });
      assert.ok(job.failedAt);
      assert.equal(job.errorCode, "DELIVERY_FAILED");
    });
    await t.test(
      "receipt, internal notification and DOI use the mail provider contract",
      async () => {
        process.env.RESEND_API_KEY = "test-only";
        process.env.MAIL_FROM = "test@example.invalid";
        process.env.MAIL_INTERNAL_TO = "internal@example.invalid";
        const messages: { to: string; text: string; subject: string }[] = [];
        globalThis.fetch = async (_url, init) => {
          messages.push(JSON.parse(String(init?.body)));
          assert.ok(new Headers(init?.headers).get("Idempotency-Key"));
          return new Response("{}", { status: 200 });
        };
        await db.outbox.updateMany({
          where: { leadId: lead.id, kind: { not: "WEBHOOK" } },
          data: { availableAt: new Date() },
        });
        assert.equal((await deliverBatch(lead.id)).sent, 3);
        assert.equal(messages.filter((m) => m.to === input.email).length, 2);
        assert.ok(
          messages
            .find((m) => m.to === "internal@example.invalid")
            ?.text.includes("/admin?lead="),
        );
        assert.ok(
          !messages
            .find((m) => m.to === "internal@example.invalid")
            ?.text.includes(input.challenge),
        );
        assert.ok(
          messages
            .find((m) => m.subject.includes("bestätigen"))
            ?.text.includes("/einwilligung?token="),
        );
        const updated = await db.lead.findUniqueOrThrow({
          where: { id: lead.id },
        });
        assert.equal(updated.marketingConfirmedAt, null);
        assert.equal(updated.marketingTokenHash?.length, 64);
      },
    );
  } finally {
    globalThis.fetch = original;
    process.env.DELIVERY_ENABLED = oldDelivery;
    await db.webhookReceipt.deleteMany({
      where: {
        eventId: {
          in: (
            await db.outbox.findMany({
              where: { lead: { requestKey: prefix } },
            })
          ).map((j) => j.id),
        },
      },
    });
    await db.lead.deleteMany({ where: { requestKey: prefix } });
    await db.$disconnect();
  }
});
