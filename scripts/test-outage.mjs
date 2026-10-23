import "dotenv/config";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const server = spawn(process.execPath, [".next/standalone/server.js"], {
  stdio: "ignore",
  env: {
    ...process.env,
    HOSTNAME: "127.0.0.1",
    PORT: "3001",
    APP_ORIGIN: "http://localhost:3001",
    DATABASE_URL:
      "postgresql://test:invalid@127.0.0.1:59999/unreachable?connect_timeout=1&pool_timeout=1",
  },
});
let browser;
try {
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      if ((await fetch("http://localhost:3001/")).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Retry until the isolated test server is ready. */
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  assert.ok(ready, "outage test server must start");
  assert.equal((await fetch("http://localhost:3001/api/health")).status, 503);
  browser = await chromium.launch({
    channel: process.env.CI ? "chromium" : "msedge",
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:3001/kontakt");
  await page.getByLabel("Ihr Name").fill("BEISPIEL Ausfalltest");
  await page.getByLabel("Unternehmen *", { exact: true }).fill("BEISPIEL Test");
  await page
    .getByLabel("Geschäftliche E-Mail-Adresse")
    .fill("outage@example.invalid");
  await page.getByLabel("Unternehmensgröße").selectOption("1–9");
  await page
    .getByLabel("Welchen Prozess möchten Sie verbessern?")
    .selectOption("Onboarding");
  await page
    .getByLabel("Ihre aktuelle Herausforderung")
    .fill("Dies ist ein Test einer nicht verfügbaren Datenbankverbindung.");
  await page.locator('input[name="privacy"]').check();
  await page.waitForTimeout(1700);
  await page
    .getByRole("button", { name: "Kostenlose Prozessanalyse anfragen" })
    .click();
  await page.waitForURL(/fehler=technik/);
  assert.ok(
    (await page.locator('.notice[role="alert"]').textContent()).includes(
      "nicht gespeichert",
    ),
  );
  assert.ok(
    !(await page.locator("body").textContent()).includes("PrismaClient"),
  );
  console.log(
    "PASS: DB outage returns health 503, safe form error, no false success and no internal error details.",
  );
} finally {
  await browser?.close();
  server.kill();
}
