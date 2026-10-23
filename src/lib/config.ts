export const company = {
  name: process.env.COMPANY_NAME || "Prozesswerk",
  owner: process.env.COMPANY_OWNER || "[NAME]",
  address: process.env.COMPANY_ADDRESS || "[ADRESSE]",
  email: process.env.COMPANY_EMAIL || "[E-MAIL]",
  phone: process.env.COMPANY_PHONE || "[TELEFON]",
  legalForm: process.env.COMPANY_LEGAL_FORM || "[RECHTSFORM]",
  vat: process.env.COMPANY_VAT || "[UST-ID]",
  register: process.env.COMPANY_REGISTER || "[REGISTERDATEN]",
  privacy: process.env.COMPANY_PRIVACY || "[DATENSCHUTZKONTAKT]",
  host: process.env.COMPANY_HOST || "[HOSTER]",
  region: process.env.COMPANY_REGION || "[REGION]",
  crm: process.env.COMPANY_CRM || "[CRM]",
};
export const siteUrl =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";
export const indexable = process.env.SITE_INDEXABLE === "true";
export const configured = !Object.values(company).some((v) =>
  v.startsWith("["),
);
export const privacyVersion = "2026-10-19";
export function safeBooking() {
  try {
    const url = new URL(process.env.BOOKING_URL || "");
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
