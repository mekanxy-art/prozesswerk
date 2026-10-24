import { test, expect } from "@playwright/test";

test("security headers restrict executable content and rotate nonces", async ({
  request,
}) => {
  const first = await request.get("/");
  const second = await request.get("/");
  const csp = first.headers()["content-security-policy"];
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("form-action 'self'");
  const script = csp
    .split(";")
    .find((v) => v.trim().startsWith("script-src "))!;
  const style = csp.split(";").find((v) => v.trim().startsWith("style-src "))!;
  expect(script).not.toMatch(/unsafe-inline|unsafe-eval/);
  expect(style).not.toContain("unsafe-inline");
  expect(csp).toContain("style-src-attr 'unsafe-hashes'");
  expect(first.headers()["x-content-type-options"]).toBe("nosniff");
  expect(first.headers()["x-frame-options"]).toBe("DENY");
  expect(first.headers()["x-powered-by"]).toBeUndefined();
  expect(csp.match(/nonce-([^']+)/)?.[1]).not.toBe(
    second.headers()["content-security-policy"].match(/nonce-([^']+)/)?.[1],
  );
});

test("account and configuration files cannot be fetched anonymously", async ({
  request,
}) => {
  for (const path of [
    "/.env",
    "/.env.local",
    "/.git/config",
    "/package-lock.json",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    expect(await response.text()).not.toContain("postgresql://");
  }
  for (const token of ["", "malformed"]) {
    const response = await request.get("/api/admin/export", {
      headers: token ? { Cookie: `pw_session=${token}` } : {},
    });
    expect(response.status()).toBe(401);
    expect(await response.text()).not.toContain("Herausforderung");
  }
  const admin = await request.get("/admin", { maxRedirects: 0 });
  expect(admin.status()).toBe(307);
  expect(admin.headers().location).toBe("/admin/login");
});

test("confirmation links exclude paths and tokens from referrers and are not indexed or cached", async ({
  request,
}) => {
  for (const path of [
    "/einwilligung?token=" + "a".repeat(64),
    "/einstellungen?id=test&token=" + "a".repeat(64),
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["referrer-policy"]).toBe("strict-origin");
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
  }
});

test("malformed preference links do not produce an actionable form or execute markup", async ({
  page,
}) => {
  const payload = '"><img src=x onerror="window.__securityXss=1">';
  await page.goto(
    "/einstellungen?id=" +
      encodeURIComponent(payload) +
      "&token=" +
      "a".repeat(64),
  );
  await expect(page.locator("main form")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => (window as unknown as { __securityXss?: number }).__securityXss,
    ),
  ).toBeUndefined();
});

test("strict styles preserve page rendering, concept pages and workflow controls", async ({
  page,
}) => {
  const violations: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") violations.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator(".hero-mascot")).toBeVisible();
  await page
    .getByRole("button", { name: "Heute manuell", exact: true })
    .click();
  await expect(
    page.getByText("Kontakt ins CRM abtippen", { exact: true }),
  ).toBeVisible();
  for (const path of ["/konzepte/website.html", "/konzepte/shop.html"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("header strong")).toHaveCSS("font-size", "23px");
  }
  expect(violations).toEqual([]);
});

test("prototype property names are not treated as content routes", async ({
  request,
}) => {
  for (const path of ["/constructor", "/__proto__", "/toString"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
  }
});
