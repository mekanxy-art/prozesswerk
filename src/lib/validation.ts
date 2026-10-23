import { leadTopics } from "./lead-topics";
import { z } from "zod";
const clean = (max: number, min = 1) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .refine(
      (v) =>
        ![...v].some(
          (c) => c.charCodeAt(0) < 32 && !["\t", "\n", "\r"].includes(c),
        ),
      "Ungültige Steuerzeichen",
    );
export const leadSchema = z
  .object({
    name: clean(100, 2),
    company: clean(160, 0),
    email: z
      .string()
      .trim()
      .max(254)
      .pipe(z.email())
      .transform((v) => v.trim().toLowerCase()),
    phone: z
      .string()
      .trim()
      .max(40)
      .regex(/^[+\d\s()/.-]*$/),
    size: z.enum(["", "1–9", "10–49", "50–249", "250+"]),
    process: z.enum(leadTopics),
    challenge: clean(4000, 20),
    budget: z.enum([
      "",
      "Noch offen",
      "Unter 5.000 €",
      "5.000–15.000 €",
      "Über 15.000 €",
    ]),
    contactWay: z.enum(["E-Mail", "Telefon"]),
    privacy: z.enum(["on", "notice"]),
    marketing: z.boolean(),
    source: z
      .string()
      .max(160)
      .regex(/^[\p{L}\p{N} _./:-]*$/u),
  })
  .refine((v) => v.contactWay !== "Telefon" || v.phone.length >= 6, {
    message: "Telefonnummer fehlt",
    path: ["phone"],
  });
export type LeadInput = z.infer<typeof leadSchema>;
export function safeSource(value: string) {
  // No arbitrary query strings, email addresses or user identifiers in attribution.
  return /^[a-zA-Z0-9 _.-]{1,60}$/.test(value) && !value.includes("@")
    ? value
    : "Website";
}
