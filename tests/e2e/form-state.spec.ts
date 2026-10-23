import { test, expect } from "@playwright/test";

const base = "http://127.0.0.1:3101";
async function fill(page: import("@playwright/test").Page) {
  await page
    .getByLabel("Ihr Name", { exact: false })
    .fill("BEISPIEL Testperson");
  await page
    .getByLabel("E-Mail-Adresse", { exact: false })
    .fill("qa@example.invalid");
  await page
    .locator('textarea[name="challenge"]')
    .fill("Wir möchten unsere bestehende Website übersichtlicher gestalten.");
}
test("inline errors preserve values and link to the invalid field", async ({
  page,
}) => {
  await page.goto(base + "/kontakt");
  await fill(page);
  await page.getByLabel("E-Mail-Adresse", { exact: false }).fill("invalid");
  await page
    .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
    .click();
  await expect(page.locator("#formular").getByRole("alert")).toContainText(
    "markierten Angaben",
  );
  await expect(page.locator(".form-error-summary")).toBeFocused();
  await expect(page.locator("#lead-email")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator("#lead-email")).toHaveValue("invalid");
  await expect(page.locator("#lead-name")).toHaveValue("BEISPIEL Testperson");
  await page.locator("#formular").getByRole("alert").getByRole("link").click();
  await expect(page.locator("#lead-email")).toBeFocused();
});
test("storage outage never reports success and keeps the message", async ({
  page,
}) => {
  await page.goto(base + "/kontakt");
  await fill(page);
  await page.waitForTimeout(1700); // Exercise the real anti-bot minimum age.
  await page
    .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
    .click();
  await expect(page.locator("#formular").getByRole("alert")).toContainText(
    "nicht gespeichert",
  );
  await expect(page).toHaveURL(/\/kontakt$/);
  await expect(page.locator("#lead-challenge")).toHaveValue(/übersichtlicher/);
  await expect(
    page.getByRole("button", { name: "Kostenloses Erstgespräch anfragen" }),
  ).toBeEnabled();
});
test("no-JavaScript validation retains typed fields", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(base + "/kontakt");
  await fill(page);
  await page.getByLabel("E-Mail-Adresse", { exact: false }).fill("invalid");
  await page
    .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
    .click();
  await expect(page.locator("#formular").getByRole("alert")).toContainText(
    "markierten Angaben",
  );
  await expect(page.locator("#lead-name")).toHaveValue("BEISPIEL Testperson");
  await expect(page.locator("#lead-email")).toHaveValue("invalid");
  await context.close();
});

test("expired or altered session is renewed without clearing the request", async ({
  page,
}) => {
  await page.goto(base + "/kontakt");
  await fill(page);
  await page.locator('input[name="formToken"]').evaluate((element) => {
    (element as HTMLInputElement).value = "tampered";
  });
  await page
    .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
    .click();
  await expect(page.locator("#formular").getByRole("alert")).toContainText(
    "erneuert",
  );
  await expect(page.locator("#lead-email")).toHaveValue("qa@example.invalid");
  await expect(page.locator('input[name="formToken"]')).not.toHaveValue(
    "tampered",
  );
  await page.waitForTimeout(1700);
  await page
    .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
    .click();
  await expect(page.locator("#formular").getByRole("alert")).toContainText(
    "nicht gespeichert",
  );
});
