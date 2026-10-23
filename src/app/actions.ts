"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkOrigin } from "@/lib/auth";
import { leadSchema, safeSource } from "@/lib/validation";
import { verifyFormToken, formToken } from "@/lib/security";
import { consumeRate, clientIdentity } from "@/lib/rate-limit";
import { saveLead } from "@/lib/leads";
import {
  emptyLeadValues,
  type LeadFormState,
  type LeadFormValues,
} from "@/lib/lead-form-state";

export async function submitLeadState(
  _previous: LeadFormState,
  form: FormData,
): Promise<LeadFormState> {
  const limits: Record<keyof LeadFormValues, number> = {
    name: 101,
    company: 161,
    email: 255,
    phone: 41,
    process: 100,
    challenge: 4001,
    contactWay: 20,
  };
  const values = Object.fromEntries(
    Object.entries(emptyLeadValues).map(([key, fallback]) => [
      key,
      String(form.get(key) ?? fallback).slice(
        0,
        limits[key as keyof LeadFormValues],
      ),
    ]),
  ) as LeadFormValues;
  const fail = (
    code: string,
    message: string,
    fieldErrors?: LeadFormState["fieldErrors"],
  ): LeadFormState => ({ status: "error", code, message, values, fieldErrors });
  try {
    await checkOrigin();
    if (String(form.get("website") || ""))
      return fail(
        "eingaben",
        "Die Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
      );
    const parsed = leadSchema.safeParse({
      ...Object.fromEntries(form),
      ...values,
      size: String(form.get("size") ?? ""),
      budget: String(form.get("budget") ?? ""),
      privacy: String(form.get("privacy") ?? "notice"),
      marketing: form.get("marketing") === "on",
      source: safeSource(String(form.get("source") || "Website")),
    });
    if (!parsed.success) {
      const messages: Record<string, string> = {
        name: "Bitte geben Sie Ihren Namen mit 2 bis 100 Zeichen an.",
        company:
          "Bitte verwenden Sie höchstens 160 Zeichen für Ihr Unternehmen.",
        email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
        phone: "Für einen Rückruf benötigen wir eine gültige Telefonnummer.",
        process: "Bitte wählen Sie eines der angebotenen Themen.",
        challenge:
          "Bitte beschreiben Sie Ihr Vorhaben mit 20 bis 4.000 Zeichen.",
        contactWay: "Bitte wählen Sie E-Mail oder Telefon.",
      };
      const fieldErrors: LeadFormState["fieldErrors"] = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (key in values)
          fieldErrors[key as keyof LeadFormValues] = messages[key];
      }
      return fail(
        "eingaben",
        "Bitte prüfen Sie die markierten Angaben. Ihre Eingaben bleiben erhalten.",
        fieldErrors,
      );
    }
    const requestKey = verifyFormToken(String(form.get("formToken") || ""));
    if (!requestKey)
      return {
        ...fail(
          "sitzung",
          "Die Formularsitzung wurde erneuert. Bitte warten Sie einen Moment und senden Sie die Anfrage erneut. Ihre Eingaben bleiben erhalten.",
        ),
        token: formToken(),
      };
    if (
      !(await consumeRate(
        "lead",
        clientIdentity(await headers()),
        8,
        3600000,
      )) ||
      !(await consumeRate("email", parsed.data.email, 3, 3600000))
    )
      return fail(
        "limit",
        "Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut. Ihre Eingaben bleiben auf dieser Seite erhalten.",
      );
    await saveLead(parsed.data, requestKey);
  } catch {
    console.error(
      JSON.stringify({ event: "lead_save_failed", code: "SAVE_FAILED" }),
    );
    return fail(
      "technik",
      "Ihre Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut. Ihre Eingaben bleiben erhalten; es wurde keine Erfolgsbestätigung ausgelöst.",
    );
  }
  redirect("/danke");
}

export async function submitLead(form: FormData) {
  const result = await submitLeadState({ status: "idle" }, form);
  redirect(`/kontakt?fehler=${result.code || "technik"}#formular`);
}
