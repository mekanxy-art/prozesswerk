import "dotenv/config";
import { company, siteUrl, safeBooking } from "../src/lib/config";
const issues: string[] = [];
for (const [key, value] of Object.entries(company))
  if (!value || value.startsWith("["))
    issues.push(`Unternehmensangabe fehlt: ${key}`);
if (!siteUrl.startsWith("https://"))
  issues.push("Produktionsdomain muss HTTPS verwenden.");
if (process.env.APP_ORIGIN !== siteUrl.replace(/\/$/, ""))
  issues.push("APP_ORIGIN muss der öffentlichen Domain entsprechen.");
for (const key of ["FORM_SECRET", "RATE_LIMIT_SECRET"])
  if ((process.env[key]?.length || 0) < 32)
    issues.push(`${key} fehlt/zu kurz.`);
if (!process.env.DATABASE_URL) issues.push("DATABASE_URL fehlt.");
if (process.env.DELIVERY_ENABLED !== "true")
  issues.push("Externe Zustellung ist deaktiviert.");
for (const key of ["RESEND_API_KEY", "MAIL_FROM", "MAIL_INTERNAL_TO"])
  if (!process.env[key]) issues.push(`${key} fehlt.`);
if (
  process.env.N8N_WEBHOOK_URL &&
  !process.env.N8N_WEBHOOK_URL.startsWith("https://")
)
  issues.push("n8n-Ziel muss HTTPS verwenden.");
if (
  process.env.N8N_WEBHOOK_URL &&
  (process.env.N8N_SIGNING_SECRET?.length || 0) < 32
)
  issues.push("n8n-Signaturschlüssel fehlt/zu kurz.");
if (process.env.BOOKING_URL && !safeBooking())
  issues.push("Terminlink ungültig.");
if (process.env.SITE_INDEXABLE !== "true")
  issues.push("Indexierung ist deaktiviert.");
console.log(
  issues.length
    ? issues.map((i) => "OFFEN: " + i).join("\n")
    : "Technische Konfiguration vollständig. Rechtliche und betriebliche Freigabe separat prüfen.",
);
process.exitCode = issues.length ? 1 : 0;
