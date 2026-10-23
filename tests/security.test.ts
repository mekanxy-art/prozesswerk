import test from "node:test";
import assert from "node:assert/strict";
import {
  csvCell,
  formToken,
  verifyFormToken,
  hashPassword,
  verifyPassword,
  signWebhook,
  verifyWebhook,
} from "../src/lib/security";
import { leadSchema, safeSource } from "../src/lib/validation";
import { retryDelay, fetchWithTimeout } from "../src/lib/delivery";
process.env.FORM_SECRET = "test-secret-with-at-least-thirty-two-characters";
test("form proof rejects early, expired and tampered submissions", () => {
  const now = Date.now();
  const token = formToken(now);
  assert.ok(verifyFormToken(token, now + 2000));
  assert.equal(verifyFormToken(token, now + 500), null);
  assert.equal(verifyFormToken(token, now + 7200001), null);
  assert.equal(verifyFormToken(token + "0", now + 2000), null);
  assert.equal(verifyFormToken("broken"), null);
});
test("scrypt password verification rejects incorrect passwords", () => {
  const hash = hashPassword("a-long-test-password-123");
  assert.ok(verifyPassword("a-long-test-password-123", hash));
  assert.equal(verifyPassword("wrong-password", hash), false);
  assert.equal(verifyPassword("x", "invalid"), false);
  assert.notEqual(hash, hashPassword("a-long-test-password-123"));
});
test("HMAC binds body and timestamp, rejecting replay outside window", () => {
  const ts = String(Math.floor(Date.now() / 1000));
  const body = '{"eventId":"test"}';
  const sig = signWebhook(body, ts, "secret");
  assert.ok(verifyWebhook(body, ts, sig, "secret"));
  assert.equal(verifyWebhook(body + " ", ts, sig, "secret"), false);
  assert.equal(verifyWebhook(body, ts, sig, "other"), false);
  assert.equal(
    verifyWebhook(body, ts, sig, "secret", Date.now() + 301000),
    false,
  );
});
test("CSV neutralizes spreadsheet formula injection and quotes", () => {
  assert.equal(csvCell("=SUM(A1)"), '"\'=SUM(A1)"');
  assert.equal(csvCell("  +cmd"), '"\'  +cmd"');
  assert.equal(csvCell('a"b'), '"a""b"');
  assert.equal(csvCell(null), '""');
});
test("attribution rejects email addresses, URLs and arbitrary query strings", () => {
  assert.equal(safeSource("organic-search"), "organic-search");
  for (const value of ["a@b.de", "https://a.de?q=x", "x".repeat(61)])
    assert.equal(safeSource(value), "Website");
});
const input = {
  name: "Test Person",
  company: "Test GmbH",
  email: "test@example.invalid",
  phone: "",
  size: "10–49",
  process: "Onboarding",
  challenge: "Wir möchten den Projektstart besser organisieren.",
  budget: "",
  contactWay: "E-Mail",
  privacy: "on",
  marketing: false,
  source: "Website",
};
test("lead validation requires privacy acknowledgment and phone for phone contact", () => {
  assert.ok(leadSchema.safeParse(input).success);
  assert.equal(
    leadSchema.safeParse({ ...input, privacy: undefined }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({ ...input, contactWay: "Telefon" }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({ ...input, challenge: "kurz" }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({ ...input, name: "Bad\u0000Name" }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({ ...input, challenge: "x".repeat(4001) }).success,
    false,
  );
});
test("bounded exponential retry delay", () => {
  assert.equal(retryDelay(1), 60000);
  assert.equal(retryDelay(100), 3600000);
});
test("timeout aborts a stalled HTTP operation", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () =>
        reject(new Error("aborted")),
      );
    });
  try {
    const keepAlive = setTimeout(() => {}, 100);
    await assert.rejects(
      fetchWithTimeout("https://example.invalid", {}, 10),
      /aborted/,
    );
    clearTimeout(keepAlive);
  } finally {
    globalThis.fetch = original;
  }
});

test("new website and analysis topics are accepted without weakening validation", () => {
  for (const process of [
    "Website erstellen",
    "Website optimieren",
    "SEO-Grundlagen",
    "Shopify-Shop erstellen",
    "Shopify-Migration",
    "Prozessanalyse & Optimierung",
  ]) {
    assert.ok(leadSchema.safeParse({ ...input, process }).success, process);
  }
  assert.equal(
    leadSchema.safeParse({ ...input, process: "Unbekanntes Angebot" }).success,
    false,
  );
});

test("minimal contact request allows optional business data and a privacy notice", () => {
  assert.ok(
    leadSchema.safeParse({ ...input, company: "", size: "", privacy: "notice" })
      .success,
  );
  assert.equal(
    leadSchema.safeParse({ ...input, email: "invalid" }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({ ...input, privacy: "consent-not-given" }).success,
    false,
  );
});
