import { test, expect, type Page } from "@playwright/test";
import { randomBytes, randomUUID } from "node:crypto";
import { db } from "../../src/lib/db";
import { digest, hashPassword, formToken } from "../../src/lib/security";
import { deliverBatch } from "../../src/lib/delivery";

const enabled = process.env.ALLOW_DATABASE_TESTS === "true";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3114";
const prefix = "security-e2e-" + randomUUID();
const email = process.env.TEST_ADMIN_EMAIL || "admin@security.example.invalid";
const password =
  process.env.TEST_ADMIN_PASSWORD || randomBytes(24).toString("hex");
let adminId = "";
let serial = 0;

async function lead() {
  return db.lead.create({
    data: {
      requestKey: prefix + "-" + serial++,
      name: "BEISPIEL Sicherheitstest",
      company: "BEISPIEL Testbetrieb",
      email: "test@security.example.invalid",
      size: "",
      process: "Noch offen",
      challenge: "Nur künstliche Daten für die lokale Sicherheitsprüfung.",
      contactWay: "E-Mail",
      source: "Lokaler Sicherheitstest",
      marketingRequested: true,
    },
  });
}
async function fields(page: Page, selector = "form") {
  return page
    .locator(selector)
    .evaluate((form) =>
      Object.fromEntries(
        Array.from(new FormData(form as HTMLFormElement), ([key, value]) => [
          key,
          String(value),
        ]),
      ),
    );
}
async function login(page: Page) {
  await page.goto(base + "/admin/login");
  await page.getByLabel("E-Mail", { exact: true }).fill(email);
  await page.getByLabel("Passwort", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sicher anmelden" }).click();
  await expect(page).toHaveURL(base + "/admin");
}

test.describe("isolated database security flows", () => {
  test.skip(
    !enabled,
    "Requires a dedicated local test database and ALLOW_DATABASE_TESTS=true",
  );
  test.beforeAll(async () => {
    const url = new URL(process.env.DATABASE_URL || "");
    if (
      !["127.0.0.1", "localhost"].includes(url.hostname) ||
      url.pathname !== "/pw_security_test" ||
      process.env.DELIVERY_ENABLED !== "false" ||
      base !== "http://127.0.0.1:3114"
    ) {
      throw new Error(
        "Dedicated loopback test database, disabled delivery and port 3114 required",
      );
    }
    const admin = await db.admin.upsert({
      where: { email },
      create: { email, passwordHash: hashPassword(password), role: "ADMIN" },
      update: { passwordHash: hashPassword(password), role: "ADMIN" },
    });
    adminId = admin.id;
  });
  test.beforeEach(async () => {
    // This is allowed only after the dedicated-database guard above.
    await db.rateBucket.deleteMany();
  });
  test.afterAll(async () => {
    if (adminId) {
      await db.lead.deleteMany({
        where: { requestKey: { startsWith: prefix } },
      });
      await db.admin.deleteMany({ where: { id: adminId } });
    }
    await db.$disconnect();
  });

  test("a real browser submits a request and stores its delivery jobs once", async ({
    page,
  }) => {
    const contact = prefix + "@example.invalid";
    await page.goto(base + "/kontakt");
    await page
      .getByLabel("Ihr Name", { exact: false })
      .fill("BEISPIEL Browser-Test");
    await page.getByLabel("E-Mail-Adresse", { exact: false }).fill(contact);
    await page
      .locator('[name="challenge"]')
      .fill(
        "Wir testen ausschließlich das lokale Anfrageformular mit künstlichen Daten.",
      );
    const proof = await page.locator('[name="formToken"]').inputValue();
    await page.waitForTimeout(1700);
    await page
      .getByRole("button", { name: "Kostenloses Erstgespräch anfragen" })
      .click();
    await expect(page).toHaveURL(base + "/danke");
    const rows = await db.lead.findMany({
      where: { email: contact },
      include: { jobs: true, activities: true },
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].jobs.map((j) => j.kind).sort()).toEqual([
      "INTERNAL_MAIL",
      "RECEIPT_MAIL",
    ]);
    expect(rows[0].jobs.every((j) => j.sentAt === null)).toBe(true);
    expect(rows[0].activities.some((a) => a.type === "LEAD_CREATED")).toBe(
      true,
    );
    // Include the browser-created row in this run's scoped cleanup.
    expect(rows[0].requestKey).toBe(proof.split(".")[1]);
    await db.lead.update({
      where: { id: rows[0].id },
      data: { requestKey: prefix + "-browser" },
    });
  });

  test("contact rejects foreign, missing and null origins, forged and expired proofs; duplicate retries stay single", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto(base + "/kontakt");
      const data = {
        ...(await fields(page, "#formular")),
        name: "BEISPIEL Anfrage",
        company: "BEISPIEL Testbetrieb",
        email: prefix + "-post@example.invalid",
        challenge:
          "Wir prüfen den echten Server gegen unerlaubte Formularübermittlung.",
        process: "Noch offen",
        contactWay: "E-Mail",
      };
      const count = await db.lead.count();
      for (const origin of ["https://foreign.example.invalid", "null", ""]) {
        const response = await context.request.post(base + "/kontakt", {
          multipart: data,
          headers: origin ? { Origin: origin } : {},
          maxRedirects: 0,
        });
        expect(response.status()).not.toBe(303);
        expect(await db.lead.count()).toBe(count);
      }
      for (const proof of [
        "forged",
        formToken(Date.now() - 3 * 3600000),
        formToken(Date.now() + 60000),
      ]) {
        await context.request.post(base + "/kontakt", {
          multipart: { ...data, formToken: proof },
          headers: { Origin: base },
          maxRedirects: 0,
        });
        expect(await db.lead.count()).toBe(count);
      }
      await page.waitForTimeout(1700);
      for (let i = 0; i < 2; i++) {
        const response = await context.request.post(base + "/kontakt", {
          multipart: data,
          headers: { Origin: base },
          maxRedirects: 0,
        });
        expect(response.status()).toBe(303);
        expect(response.headers().location).toBe("/danke");
      }
      const rows = await db.lead.findMany({ where: { email: data.email } });
      expect(rows).toHaveLength(1);
      await db.lead.update({
        where: { id: rows[0].id },
        data: { requestKey: prefix + "-retry" },
      });
    } finally {
      await context.close();
    }
  });

  test("login rejects cross-site attempts and wrong passwords; valid login creates a protected session and logout revokes it", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto(base + "/admin/login");
      const data = { ...(await fields(page, ".admin-form")), email, password };
      const count = await db.session.count({ where: { adminId } });
      for (const origin of ["https://foreign.example.invalid", "null", ""]) {
        const blocked = await context.request.post(base + "/admin/login", {
          multipart: data,
          headers: origin ? { Origin: origin } : {},
          maxRedirects: 0,
        });
        expect(blocked.status()).not.toBe(303);
        expect(await db.session.count({ where: { adminId } })).toBe(count);
      }
      await page.getByLabel("E-Mail", { exact: true }).fill(email);
      await page
        .getByLabel("Passwort", { exact: true })
        .fill("deliberately-wrong");
      await page.getByRole("button", { name: "Sicher anmelden" }).click();
      await expect(page).toHaveURL(/fehler=1/);
      expect(await db.session.count({ where: { adminId } })).toBe(count);
      await login(page);
      const cookie = (await context.cookies()).find(
        (c) => c.name === "pw_session",
      );
      expect(cookie).toBeDefined();
      expect(cookie!.httpOnly).toBe(true);
      expect(cookie!.secure).toBe(true);
      expect(cookie!.sameSite).toBe("Strict");
      const session = await db.session.findUnique({
        where: { id: digest(cookie!.value) },
      });
      expect(session?.adminId).toBe(adminId);
      expect(session?.id).not.toBe(cookie!.value);
      expect(
        (await context.request.get(base + "/api/admin/export")).status(),
      ).toBe(200);
      await page.getByRole("button", { name: "Abmelden", exact: true }).click();
      await expect(page).toHaveURL(base + "/admin/login");
      expect(
        await db.session.findUnique({ where: { id: digest(cookie!.value) } }),
      ).toBeNull();
      expect(
        (await context.request.get(base + "/api/admin/export")).status(),
      ).toBe(401);
    } finally {
      await context.close();
    }
  });

  test("admin changes persist, foreign-origin changes fail even with a valid session, anonymous mutation fails", async ({
    browser,
  }) => {
    const row = await lead();
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await login(page);
      await page.goto(base + "/admin?lead=" + row.id);
      const data = {
        ...(await fields(page, ".admin-detail form.admin-form")),
        status: "WON",
        note: "Unzulässige Änderung darf nicht gespeichert werden",
      };
      const blocked = await context.request.post(
        base + "/admin?lead=" + row.id,
        {
          multipart: data,
          headers: { Origin: "https://foreign.example.invalid" },
          maxRedirects: 0,
        },
      );
      expect(blocked.status()).not.toBe(303);
      expect(
        (await db.lead.findUniqueOrThrow({ where: { id: row.id } })).status,
      ).toBe("NEW");
      await context.clearCookies();
      await context.request.post(base + "/admin?lead=" + row.id, {
        multipart: data,
        headers: { Origin: base },
        maxRedirects: 0,
      });
      expect(
        (await db.lead.findUniqueOrThrow({ where: { id: row.id } })).status,
      ).toBe("NEW");
      await login(page);
      await page.goto(base + "/admin?lead=" + row.id);
      await page
        .locator('.admin-detail select[name="status"]')
        .selectOption("QUALIFIED");
      await page.locator('[name="note"]').fill("BEISPIEL geprüfte Änderung");
      await page.getByRole("button", { name: "Änderungen speichern" }).click();
      await expect(
        page.getByText("Änderungen gespeichert.", { exact: true }),
      ).toBeVisible();
      expect(
        (await db.lead.findUniqueOrThrow({ where: { id: row.id } })).status,
      ).toBe("QUALIFIED");
      expect(
        await db.activity.count({
          where: { leadId: row.id, note: "BEISPIEL geprüfte Änderung" },
        }),
      ).toBe(1);
    } finally {
      await context.close();
    }
  });

  test("expired, tampered and revoked-role sessions cannot export or view protected data", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await login(page);
      const cookie = (await context.cookies()).find(
        (c) => c.name === "pw_session",
      )!;
      await db.session.update({
        where: { id: digest(cookie.value) },
        data: { expiresAt: new Date(Date.now() - 1000) },
      });
      expect(
        (await context.request.get(base + "/api/admin/export")).status(),
      ).toBe(401);
      await page.goto(base + "/admin");
      await expect(page).toHaveURL(base + "/admin/login");
      await context.addCookies([
        { ...cookie, value: randomBytes(32).toString("hex") },
      ]);
      expect(
        (await context.request.get(base + "/api/admin/export")).status(),
      ).toBe(401);
      await login(page);
      await db.admin.update({
        where: { id: adminId },
        data: { role: "VIEWER" },
      });
      expect(
        (await context.request.get(base + "/api/admin/export")).status(),
      ).toBe(401);
      await page.goto(base + "/admin");
      await expect(page).toHaveURL(base + "/admin/login");
    } finally {
      await db.admin.update({
        where: { id: adminId },
        data: { role: "ADMIN" },
      });
      await context.close();
    }
  });

  test("real delivery logic generates usable confirmation and withdrawal links; foreign origin, replay and tampering fail", async ({
    browser,
  }) => {
    const row = await lead();
    await db.outbox.create({ data: { leadId: row.id, kind: "DOUBLE_OPT_IN" } });
    const original = globalThis.fetch;
    const old = {
      delivery: process.env.DELIVERY_ENABLED,
      key: process.env.RESEND_API_KEY,
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_INTERNAL_TO,
    };
    let text = "";
    try {
      process.env.DELIVERY_ENABLED = "true";
      process.env.RESEND_API_KEY = "test-only";
      process.env.MAIL_FROM = "test@example.invalid";
      process.env.MAIL_INTERNAL_TO = "internal@example.invalid";
      globalThis.fetch = async (url, init) => {
        expect(String(url)).toBe("https://api.resend.com/emails");
        text = JSON.parse(String(init?.body)).text;
        return new Response("{}", { status: 200 });
      };
      expect((await deliverBatch(row.id)).sent).toBe(1);
    } finally {
      globalThis.fetch = original;
      process.env.DELIVERY_ENABLED = old.delivery;
      process.env.RESEND_API_KEY = old.key;
      process.env.MAIL_FROM = old.from;
      process.env.MAIL_INTERNAL_TO = old.to;
    }
    const confirm = text.match(
      /http:\/\/127\.0\.0\.1:3114\/einwilligung\?token=[a-f0-9]+/,
    )?.[0];
    const withdraw = text.match(
      /http:\/\/127\.0\.0\.1:3114\/einstellungen\?id=[a-z0-9]+&token=[a-f0-9]+/,
    )?.[0];
    expect(confirm).toBeTruthy();
    expect(withdraw).toBeTruthy();
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto(confirm!);
      const data = await fields(page, "main form");
      for (const origin of ["https://foreign.example.invalid", "null", ""]) {
        await context.request.post(confirm!, {
          multipart: data,
          headers: origin ? { Origin: origin } : {},
          maxRedirects: 0,
        });
        expect(
          (await db.lead.findUniqueOrThrow({ where: { id: row.id } }))
            .marketingConfirmedAt,
        ).toBeNull();
      }
      const posted = page.waitForRequest((r) => r.method() === "POST");
      await page
        .getByRole("button", { name: "E-Mail-Impulse verbindlich bestätigen" })
        .click();
      const actual = await posted;
      expect(actual.headers().origin).toBe(base);
      expect(actual.headers().referer).toBe(base + "/");
      await expect(page).toHaveURL(/fertig=ja/);
      const stored = await db.lead.findUniqueOrThrow({ where: { id: row.id } });
      expect(stored.marketingConfirmedAt).not.toBeNull();
      expect(stored.marketingTokenHash).toBeNull();
      await page.goto(confirm!);
      await page
        .getByRole("button", { name: "E-Mail-Impulse verbindlich bestätigen" })
        .click();
      await expect(page).toHaveURL(/fertig=ungueltig/);
      expect(
        await db.activity.count({
          where: {
            leadId: row.id,
            type: { startsWith: "MARKETING_CONFIRMED" },
          },
        }),
      ).toBe(1);
      await page.goto(withdraw!);
      const wd = await fields(page, "main form");
      for (const origin of ["https://foreign.example.invalid", "null", ""]) {
        await context.request.post(withdraw!, {
          multipart: wd,
          headers: origin ? { Origin: origin } : {},
          maxRedirects: 0,
        });
        expect(
          (await db.lead.findUniqueOrThrow({ where: { id: row.id } }))
            .suppressed,
        ).toBe(false);
      }
      await context.request.post(withdraw!, {
        multipart: { ...wd, token: "b".repeat(64) },
        headers: { Origin: base },
        maxRedirects: 0,
      });
      expect(
        (await db.lead.findUniqueOrThrow({ where: { id: row.id } })).suppressed,
      ).toBe(false);
      await page
        .getByRole("button", { name: "Einwilligung widerrufen" })
        .click();
      await expect(page).toHaveURL(/fertig=ja/);
      const final = await db.lead.findUniqueOrThrow({ where: { id: row.id } });
      expect(final.suppressed).toBe(true);
      expect(final.objectionAt).not.toBeNull();
      expect(final.marketingConfirmedAt).toBeNull();
    } finally {
      await context.close();
    }
  });

  test("login throttles repeated failures before allowing another password check", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto(base + "/admin/login");
      const data = {
        ...(await fields(page, ".admin-form")),
        email,
        password: "deliberately-wrong",
      };
      const before = await db.session.count({ where: { adminId } });
      for (let i = 0; i < 5; i++) {
        const response = await context.request.post(base + "/admin/login", {
          multipart: data,
          headers: { Origin: base },
          maxRedirects: 0,
        });
        expect(response.status()).toBe(303);
        expect(response.headers().location).toBe("/admin/login?fehler=1");
      }
      const blocked = await context.request.post(base + "/admin/login", {
        multipart: { ...data, password },
        headers: { Origin: base },
        maxRedirects: 0,
      });
      expect(blocked.headers().location).toBe("/admin/login?fehler=limit");
      expect(await db.session.count({ where: { adminId } })).toBe(before);
    } finally {
      await context.close();
    }
  });

  test("expired and unknown confirmation links cannot change consent", async ({
    browser,
  }) => {
    const row = await lead();
    const token = randomBytes(32).toString("hex");
    await db.lead.update({
      where: { id: row.id },
      data: {
        marketingTokenHash: digest(token),
        marketingTokenExpires: new Date(Date.now() - 1000),
      },
    });
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      for (const t of [token, randomBytes(32).toString("hex")]) {
        await page.goto(base + "/einwilligung?token=" + t);
        await page
          .getByRole("button", {
            name: "E-Mail-Impulse verbindlich bestätigen",
          })
          .click();
        await expect(page).toHaveURL(/fertig=ungueltig/);
        expect(
          (await db.lead.findUniqueOrThrow({ where: { id: row.id } }))
            .marketingConfirmedAt,
        ).toBeNull();
      }
    } finally {
      await context.close();
    }
  });
});
