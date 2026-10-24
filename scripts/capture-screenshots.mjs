/* global document, window */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
const origin = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin))
  throw new Error("Use an isolated local preview");
await mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.TEST_BROWSER_CHANNEL || "chromium",
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  async function load(path) {
    const response = await page.goto(origin + path, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200);
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(async (e) => {
        if (!e.complete)
          await new Promise((r) => {
            e.onload = r;
            e.onerror = r;
          });
      });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await load("/");
  await page.screenshot({ path: "docs/screenshots/home-desktop.png" });
  await page
    .locator(".taste-explorer")
    .screenshot({ path: "docs/screenshots/process-comparison.png" });
  await load("/leistungen");
  await page
    .locator("main")
    .screenshot({ path: "docs/screenshots/services.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await load("/kontakt");
  assert.equal(
    await page.locator('#formular button[type="submit"]').isDisabled(),
    true,
    "Capture the public preview without enabled form or private data",
  );
  await page.screenshot({
    path: "docs/screenshots/contact-mobile.png",
    fullPage: true,
  });
  console.log("Four current public screenshots saved.");
} finally {
  await browser.close();
}
