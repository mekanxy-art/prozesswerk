import { test, expect } from "@playwright/test";

test("scroll decoration never hides content and keyboard focus remains usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto("/leistungen");
  const first = page.locator(".offering-group").first();
  await expect(first).toHaveAttribute("data-reveal", "");
  await expect(first).toHaveCSS("opacity", "1");
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("data-revealed", "true");
  await expect(first).toHaveCSS("opacity", "1");
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("data-revealed", "true");
  await page.reload();
  const second = page.locator(".offering-group").last();
  await expect(second).toHaveAttribute("data-reveal", "");
  await second
    .getByRole("link", { name: "Prozesse verbessern & automatisieren" })
    .focus();
  await expect(second).toHaveAttribute("data-revealed", "true");
  await expect(second).toHaveCSS("opacity", "1");
});

test("reduced motion clears pending reveals and the workflow comparison stays usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto("/leistungen");
  const first = page.locator(".offering-group").first();
  await expect(first).toHaveAttribute("data-reveal", "");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(first).not.toHaveAttribute("data-reveal");
  await expect(first).toHaveCSS("opacity", "1");
  await page.goto("/");
  await expect(page.locator("[data-reveal]")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Heute manuell", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Heute manuell", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByText("Kontakt ins CRM abtippen", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Verbunden", exact: true }).click();
  await expect(
    page.getByText("Kontakt & Aufgabe anlegen", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".explorer-diagram")).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("service content and links remain readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/leistungen");
  await expect(
    page.getByRole("link", { name: "Prozesse verbessern & automatisieren" }),
  ).toBeVisible();
  await expect(page.locator(".offering-group").last()).toHaveCSS(
    "opacity",
    "1",
  );
  await page
    .getByRole("link", { name: "Prozesse verbessern & automatisieren" })
    .click();
  await expect(page.locator(".process-usecase")).toHaveCount(3);
  await expect(page.locator("[data-reveal]")).toHaveCount(0);
  await context.close();
});
