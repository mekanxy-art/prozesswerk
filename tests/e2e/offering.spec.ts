import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { serviceGroups } from "../../src/lib/offering";

test("two service areas lead to their offers and the updated enquiry form", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/leistungen");
  await expect(page.locator(".offering-group")).toHaveCount(2);
  for (const group of serviceGroups) {
    const card = page
      .locator(".offering-group")
      .filter({ hasText: group.title });
    await card
      .getByRole("link", {
        name:
          group === serviceGroups[0]
            ? "Websites & Shops erstellen und verbessern"
            : "Prozesse verbessern & automatisieren",
      })
      .click();
    await expect(page).toHaveURL(new RegExp(group.href + "$"));
    if (group === serviceGroups[0]) {
      await expect(page.locator(".service-detail-grid>section")).toHaveCount(
        group.links.length,
      );
      for (const [href] of group.links)
        await expect(
          page.locator('.service-detail-grid a[href="' + href + '"]'),
        ).toBeVisible();
    } else {
      await expect(page.locator(".process-usecase")).toHaveCount(3);
      await expect(page.locator(".process-method li")).toHaveCount(4);
      await expect(
        page.getByRole("link", { name: "Mehr zur Prozessanalyse" }),
      ).toHaveAttribute("href", "/leistungen/prozessanalyse-optimierung");
    }
    await page.goto("/leistungen");
  }
  await page.goto("/kontakt");
  await page
    .getByLabel("Worum geht es bei Ihrem Vorhaben?")
    .selectOption("Website erstellen");
  await expect(page.locator('select[name="process"]')).toHaveValue(
    "Website erstellen",
  );
  for (const topic of ["Shopify-Shop erstellen", "Shopify-Migration"]) {
    await page
      .getByLabel("Worum geht es bei Ihrem Vorhaben?")
      .selectOption(topic);
    await expect(page.locator('select[name="process"]')).toHaveValue(topic);
  }
  await expect(
    page.getByRole("button", { name: "Kostenloses Erstgespräch anfragen" }),
  ).toBeVisible();
});

test("new service pages fit mobile and desktop and have accessible layouts", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const paths = [
    "/leistungen",
    ...serviceGroups.map((g) => g.href),
    ...serviceGroups[0].links.map(([href]) => href),
    "/leistungen/prozessanalyse-optimierung",
  ];
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const url of paths) {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        url + " at " + width,
      ).toBe(true);
      if (width === 390) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            targets: v.nodes.map((n) => n.target),
          })),
          url,
        ).toEqual([]);
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/leistungen");
  await page
    .locator(".offering-overview")
    .screenshot({ path: "../leistungen-struktur.png" });
  await page.screenshot({
    path: "../leistungen-zwei-bereiche.png",
    fullPage: true,
  });
});
