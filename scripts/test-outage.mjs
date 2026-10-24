import { URL } from "node:url";
import "dotenv/config";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3101",
  ],
  {
    stdio: "ignore",
    env: {
      ...process.env,
      HOSTNAME: "127.0.0.1",
      PORT: "3101",
      APP_ORIGIN: "http://127.0.0.1:3101",
      FORM_SECRET: randomBytes(32).toString("hex"),
      RATE_LIMIT_SECRET: randomBytes(32).toString("hex"),
      DELIVERY_ENABLED: "false",
      TRUST_PROXY: "false",
      DATABASE_URL:
        "postgresql://test:invalid@127.0.0.1:59999/unreachable?connect_timeout=1&pool_timeout=1",
    },
  },
);
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null)
      throw new Error("Isolated outage server did not start");
    try {
      if ((await fetch("http://127.0.0.1:3101/")).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Retry until the isolated test server is ready. */
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  assert.ok(ready, "outage test server must start");
  assert.equal((await fetch("http://127.0.0.1:3101/api/health")).status, 503);
  browser = await chromium.launch({
    channel:
      process.env.TEST_BROWSER_CHANNEL ||
      (process.env.CI ? "chromium" : "msedge"),
  });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:3101/kontakt");
  await page
    .getByLabel("Ihr Name", { exact: false })
    .fill("BEISPIEL Ausfalltest");
  await page
    .getByLabel("E-Mail-Adresse", { exact: false })
    .fill("outage@example.invalid");
  await page
    .locator('[name="challenge"]')
    .fill("Dies ist ein Test einer nicht verfügbaren Datenbankverbindung.");
  await page.waitForTimeout(1700);
  await page
    .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
    .click();
  await page.locator('#formular [role="alert"]').waitFor();
  assert.equal(new URL(page.url()).pathname, "/kontakt");
  assert.equal(
    await page.locator('[name="email"]').inputValue(),
    "outage@example.invalid",
  );
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
