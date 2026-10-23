import "dotenv/config";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { db } from "../../src/lib/db";
import { hashPassword, digest } from "../../src/lib/security";
import { preferenceToken } from "../../src/lib/delivery";
import { pages, articles } from "../../src/lib/content";
import { rateKey } from "../../src/lib/rate-limit";
const testsAllowed = process.env.ALLOW_DATABASE_TESTS === "true";
const email = "e2e-admin@example.invalid";
const password = "e2e-password-only-for-tests-2026";
test.beforeAll(async () => {
  if (!testsAllowed)
    throw new Error(
      "Dedicated test database required: ALLOW_DATABASE_TESTS=true",
    );
  await db.rateBucket.deleteMany({
    where: {
      key: {
        in: [
          rateKey("lead", "shared", 3600000),
          ...["e2e@example.invalid", "e2e-nojs@example.invalid"].map((v) =>
            rateKey("email", v, 3600000),
          ),
        ],
      },
    },
  });
  await db.admin.upsert({
    where: { email },
    create: { email, passwordHash: hashPassword(password) },
    update: { passwordHash: hashPassword(password) },
  });
});
test.afterAll(async () => {
  if (!testsAllowed) return;
  await db.lead.deleteMany({ where: { requestKey: "e2e-doi-only" } });
  await db.lead.deleteMany({
    where: {
      email: { in: ["e2e@example.invalid", "e2e-nojs@example.invalid"] },
    },
  });
  await db.admin.deleteMany({ where: { email } });
  await db.$disconnect();
});
test("invalid form proof fails visibly without saving data", async ({
  page,
}) => {
  await page.goto("/kontakt");
  await fillLead(page, "invalid-proof@example.invalid");
  await page.locator('input[name="formToken"]').evaluate((el) => {
    (el as HTMLInputElement).value = "tampered";
  });
  await page
    .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
    .click();
  await expect(page.locator('.notice[role="alert"]')).toContainText("erneuert");
  expect(
    await db.lead.count({ where: { email: "invalid-proof@example.invalid" } }),
  ).toBe(0);
});
test("marketing requires explicit confirmation and supports withdrawal", async ({
  page,
}) => {
  const token = "a".repeat(64);
  const lead = await db.lead.create({
    data: {
      requestKey: "e2e-doi-only",
      name: "BEISPIEL DOI",
      company: "BEISPIEL Test",
      email: "doi@example.invalid",
      size: "1–9",
      process: "Onboarding",
      challenge: "Test der optionalen Einwilligung",
      contactWay: "E-Mail",
      source: "Test",
      marketingRequested: true,
      marketingTokenHash: digest(token),
      marketingTokenExpires: new Date(Date.now() + 600000),
    },
  });
  await page.goto("/einwilligung?token=" + token);
  expect(
    (await db.lead.findUniqueOrThrow({ where: { id: lead.id } }))
      .marketingConfirmedAt,
  ).toBeNull();
  await page
    .getByRole("button", { name: "E-Mail-Impulse verbindlich bestätigen" })
    .click();
  await expect(page).toHaveURL(/fertig=ja/);
  expect(
    (await db.lead.findUniqueOrThrow({ where: { id: lead.id } }))
      .marketingConfirmedAt,
  ).not.toBeNull();
  await page.goto(
    `/einstellungen?id=${lead.id}&token=${preferenceToken(lead.id)}`,
  );
  await page.getByRole("button", { name: "Einwilligung widerrufen" }).click();
  await expect(page).toHaveURL(/fertig=ja/);
  const updated = await db.lead.findUniqueOrThrow({ where: { id: lead.id } });
  expect(updated.suppressed).toBe(true);
  expect(updated.objectionAt).not.toBeNull();
  expect(updated.marketingConfirmedAt).toBeNull();
});
test("public pages, unique metadata, structured data, internal links and 404", async ({
  page,
  request,
}) => {
  const paths = [
    "/",
    ...Object.keys(pages).map((p) => "/" + p),
    "/kontakt",
    "/termin",
    "/faq",
    "/wissen",
    "/danke",
    ...articles.map((a) => "/wissen/" + a.slug),
  ];
  const titles = new Set();
  const internal = new Set<string>();
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(titles.has(title), title).toBe(false);
    titles.add(title);
    await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    for (const raw of await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()) {
      const data = JSON.parse(raw);
      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBeTruthy();
    }
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")!)))
      internal.add(href.split("#")[0]);
  }
  for (const href of internal) {
    const response = await request.get(href);
    expect(response.status(), href).toBeLessThan(400);
  }
  expect((await request.get("/nicht-vorhanden")).status()).toBe(404);
  expect((await request.get("/api/admin/export")).status()).toBe(401);
  const admin = await request.get("/admin");
  expect(admin.url()).toContain("/admin/login");
  const home = await request.get("/");
  expect(home.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  const social = await request.get("/opengraph-image");
  expect(social.status()).toBe(200);
  expect(social.headers()["content-type"]).toContain("image/png");
  expect((await social.body()).subarray(1, 4).toString()).toBe("PNG");
});
test("responsive layout, screenshots and accessibility", async ({ page }) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `overflow ${width}`,
    ).toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    if (width === 1440 || width === 390) {
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    }
  }
  await page.goto("/kontakt");
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
});
async function fillLead(page: import("@playwright/test").Page, email: string) {
  await page.getByLabel("Ihr Name").fill("E2E Testperson");
  await page
    .getByLabel("Unternehmen", { exact: false })
    .fill("BEISPIEL – E2E Test");
  await page.getByLabel("E-Mail-Adresse", { exact: false }).fill(email);
  await page
    .getByLabel("Worum geht es bei Ihrem Vorhaben?")
    .selectOption("Onboarding");
  await page
    .getByLabel("Ihr Vorhaben *", { exact: true })
    .fill(
      "Wir möchten unsere Übergaben beim Projektstart verlässlich organisieren.",
    );
  await page.waitForTimeout(1700);
}
test("lead submission stores data; authenticated admin edits and exports", async ({
  page,
}) => {
  await page.goto("/kontakt?utm_source=organic");
  await fillLead(page, "e2e@example.invalid");
  await page
    .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
    .click();
  await expect(page).toHaveURL(/\/danke/);
  const lead = await db.lead.findFirstOrThrow({
    where: { email: "e2e@example.invalid" },
  });
  expect(lead.source).toBe("organic");
  expect(await db.outbox.count({ where: { leadId: lead.id } })).toBe(2);
  await page.goto("/admin/login");
  await page.getByLabel("E-Mail", { exact: true }).fill(email);
  await page.getByLabel("Passwort").fill(password);
  await page.getByRole("button", { name: "Sicher anmelden" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin?lead=" + lead.id);
  await page
    .locator('.admin-form select[name="status"]')
    .selectOption("QUALIFIED");
  await page
    .getByLabel("Neue interne Notiz")
    .fill("E2E: Rückruf nach Prozessprüfung.");
  await page.getByRole("button", { name: "Änderungen speichern" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Änderungen gespeichert",
  );
  expect(
    (await db.lead.findUniqueOrThrow({ where: { id: lead.id } })).status,
  ).toBe("QUALIFIED");
  const exported = await page.request.get("/api/admin/export");
  expect(exported.status()).toBe(200);
  expect(await exported.text()).toContain("BEISPIEL – E2E Test");
  await page.getByRole("button", { name: "Abmelden" }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
});
test("central content and lead submission work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto((process.env.TEST_BASE_URL || "http://localhost:3000") + "/");
  await expect(page.locator("h1")).toContainText("Websites.");
  await page.goto(
    (process.env.TEST_BASE_URL || "http://localhost:3000") + "/kontakt",
  );
  await fillLead(page, "e2e-nojs@example.invalid");
  await page
    .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
    .click();
  await expect(page).toHaveURL(/\/danke/);
  expect(
    await db.lead.count({ where: { email: "e2e-nojs@example.invalid" } }),
  ).toBe(1);
  await context.close();
});
