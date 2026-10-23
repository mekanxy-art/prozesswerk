import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("process explorer switches examples and keeps a useful next step", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-mascot")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Vertrieb & CRM" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Angebote & Dokumente" }).click();
  await expect(
    page.getByRole("heading", { name: "Einmal erfassen. Sauber weitergeben." }),
  ).toBeVisible();
  await expect(page.locator(".explorer-content .text-link")).toHaveAttribute(
    "href",
    "/leistungen/prozessautomatisierung",
  );
  await page.getByRole("button", { name: "Kunden-Onboarding" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Der Auftrag steht. Der Ablauf auch." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Kunden-Onboarding" }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("service, solution and example layouts work at desktop and mobile sizes", async ({
  page,
}) => {
  for (const width of [1440, 390, 320])
    for (const path of [
      "/leistungen",
      "/loesungen",
      "/beispiele",
      "/kontakt",
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} at ${width}`,
      ).toBe(true);
      if (width === 390) {
        await expect(page.locator(".page-enter")).toHaveCSS("opacity", "1");
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        ).toEqual([]);
      }
    }
  await page.goto("/beispiele");
  await expect(page.locator(".case-card")).toHaveCount(3);
  await expect(page.locator(".case-copy-part h3").first()).toHaveText(
    "Ausgangslage",
  );
});

