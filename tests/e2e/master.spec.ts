import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pages, articles } from "../../src/lib/content";

test("public routes, metadata, assets, headers and internal links work", async ({
  page,
  request,
}) => {
  const paths = [
    "/",
    ...Object.keys(pages).map((p) => "/" + p),
    "/kontakt",
    "/faq",
    "/wissen",
    "/termin",
    ...articles.map((a) => "/wissen/" + a.slug),
  ];
  const titles = new Set<string>();
  const urls = new Set<string>();
  const externalRequests: string[] = [];
  page.on("request", (r) => {
    if (
      new URL(r.url()).origin !==
      new URL(process.env.TEST_BASE_URL || "http://localhost:3000").origin
    )
      externalRequests.push(r.url());
  });
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(titles.has(title), title).toBe(false);
    titles.add(title);
    await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")!)))
      urls.add(href.split("#")[0]);
    for (const raw of await page
      .locator('script[type="application/ld+json"]')
      .allTextContents())
      expect(JSON.parse(raw)["@context"]).toBe("https://schema.org");
  }
  for (const url of urls)
    expect((await request.get(url)).status(), url).toBeLessThan(400);
  expect((await request.get("/nicht-vorhanden")).status()).toBe(404);
  expect((await request.get("/api/admin/export")).status()).toBe(401);
  const home = await request.get("/");
  expect(home.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(externalRequests).toEqual([]);
  const social = await request.get("/opengraph-image");
  expect(social.status()).toBe(200);
  expect(social.headers()["content-type"]).toContain("image/png");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});

test("main tasks fit 320, 390, tablet and desktop; preview form is honest", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const url of ["/", "/leistungen", "/kontakt"]) {
      await page.goto(url);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        url + " " + width,
      ).toBe(true);
      if (width === 390 || width === 1440) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          url + " " + width,
        ).toEqual([]);
      }
    }
  }
  await expect(
    page.getByRole("button", { name: "Kostenloses Erstgespräch anfragen" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("status").filter({ hasText: "Lokale Vorschau" }),
  ).toBeVisible();
  await expect(
    page.locator("input[required],textarea[required],select[required]"),
  ).toHaveCount(3);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({
    path: "../master-start-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await page.screenshot({ path: "../master-start-mobil.png", fullPage: true });
  await page.goto("/kontakt");
  await page.screenshot({
    path: "../master-kontakt-mobil.png",
    fullPage: true,
  });
});

test("native navigation, modal focus and text reflow remain usable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Websites.",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
    "opacity",
    "1",
  );
  await page.locator(".hero-primary").click();
  await expect(page).toHaveURL(/\/kontakt$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole("button", { name: "Menü", exact: true }).click();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(page.locator("main")).not.toHaveAttribute("inert");
  await expect(
    page.getByRole("button", { name: "Menü", exact: true }),
  ).toBeFocused();
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/kontakt");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
