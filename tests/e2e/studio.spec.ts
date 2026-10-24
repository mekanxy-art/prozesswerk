import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("studio navigation supports pages, history, keyboard and reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Menü", exact: true }).click();
  const menu = page.getByRole("dialog", { name: "Seitenmenü" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  await expect(
    menu.getByRole("link", { name: "Ihr nächster Schritt beginnt hier" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Menü", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Menü", exact: true }).click();
  await menu.getByRole("link", { name: /03 Lösungen/ }).click();
  await expect(page).toHaveURL(/\/loesungen$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Passende Abläufe",
  );
  await expect(page.locator("html")).not.toHaveClass(/page-leaving/);
  await expect(menu).not.toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Digital.Gut verbunden.",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .getByRole("navigation", { name: "Hauptnavigation", exact: true })
    .getByRole("link", { name: "Leistungen", exact: true })
    .click();
  await expect(page).toHaveURL(/\/leistungen$/);
});

test("studio home remains accessible and contained on narrow screens", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const overflow = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.right > innerWidth + 1 &&
            getComputedStyle(el).position !== "fixed"
          );
        })
        .map((el) => ({
          tag: el.tagName,
          cls: el.className,
          right: el.getBoundingClientRect().right,
        })),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      JSON.stringify(overflow),
    ).toBe(true);
    await expect(page.locator(".hero-mascot")).toBeVisible();
    if (width === 390) {
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      await page.screenshot({ path: "../vorschau-mobil.png", fullPage: true });
    }
    if (width === 1440)
      await page.screenshot({ path: "../vorschau-start.png" });
    if (width === 1440)
      await page.screenshot({
        path: "../vorschau-desktop.png",
        fullPage: true,
      });
  }
});

test("service page stays contained at 320 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/leistungen");
  const offenders = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
      .map((el) => ({
        tag: el.tagName,
        cls: el.className,
        text: el.textContent?.slice(0, 60),
        right: el.getBoundingClientRect().right,
      })),
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    JSON.stringify(offenders),
  ).toBe(true);
});
