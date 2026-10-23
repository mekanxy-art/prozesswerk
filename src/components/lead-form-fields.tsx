"use client";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitLeadState } from "@/app/actions";
import { leadTopics } from "@/lib/lead-topics";
import {
  emptyLeadValues,
  type LeadFormValues,
  type LeadFormState,
} from "@/lib/lead-form-state";

export function LeadFormFields({
  token,
  source,
  initialError,
}: {
  token: string;
  source: string;
  initialError?: string;
}) {
  const initial: LeadFormState = {
    status: initialError ? "error" : "idle",
    message: initialError
      ? "Die vorherige Anfrage konnte nicht verarbeitet werden. Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut."
      : undefined,
  };
  const [state, action, pending] = useActionState(
    submitLeadState,
    initial,
    "/kontakt",
  );
  const [values, setValues] = useState<LeadFormValues>(
    state.values || emptyLeadValues,
  );
  const summary = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === "error") summary.current?.focus();
  }, [state]);
  const change =
    (key: keyof LeadFormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setValues({ ...values, [key]: event.target.value });
  const error = (key: keyof LeadFormValues) => state.fieldErrors?.[key];
  const errorText = (key: keyof LeadFormValues) =>
    error(key) ? (
      <span className="field-error" id={`${key}-error`}>
        {error(key)}
      </span>
    ) : null;
  const invalid = (key: keyof LeadFormValues) => ({
    "aria-invalid": !!error(key),
    "aria-describedby": error(key) ? `${key}-error` : undefined,
  });
  return (
    <form
      action={action}
      id="formular"
      className="lead-form"
      noValidate
      aria-busy={pending}
    >
      <div className="form-heading">
        <span className="eyebrow">IHR ERSTER SCHRITT</span>
        <h2>Was haben Sie vor?</h2>
        <p>
          Beschreiben Sie kurz Ihre Idee. Ein fertiges Konzept ist nicht
          erforderlich. Das Erstgespräch ist kostenlos und unverbindlich.
        </p>
      </div>
      {!token && (
        <p className="notice" role="status">
          Lokale Vorschau: Das Anfrageformular ist noch nicht für den Versand
          eingerichtet. Es werden keine Anfragen übermittelt.
        </p>
      )}
      {state.status === "error" && (
        <div
          ref={summary}
          className="notice error form-error-summary"
          tabIndex={-1}
          role="alert"
        >
          <strong>Die Anfrage wurde nicht gesendet.</strong>
          <p>{state.message}</p>
          {state.fieldErrors && (
            <ul>
              {Object.entries(state.fieldErrors).map(([key, message]) => (
                <li key={key}>
                  <a href={`#lead-${key}`}>{message}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <input type="hidden" name="formToken" value={state.token || token} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="privacy" value="notice" />
      <div className="honey" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-grid">
        <label htmlFor="lead-name">
          Ihr Name *
          <input
            id="lead-name"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            value={values.name}
            onChange={change("name")}
            {...invalid("name")}
          />
          {errorText("name")}
        </label>
        <label htmlFor="lead-email">
          E-Mail-Adresse *
          <input
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={values.email}
            onChange={change("email")}
            {...invalid("email")}
          />
          {errorText("email")}
        </label>
        <label htmlFor="lead-process">
          Worum geht es bei Ihrem Vorhaben?
          <select
            id="lead-process"
            name="process"
            value={values.process}
            onChange={change("process")}
            {...invalid("process")}
          >
            {leadTopics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
          {errorText("process")}
        </label>
        <label htmlFor="lead-company">
          Unternehmen <span>(optional)</span>
          <input
            id="lead-company"
            name="company"
            autoComplete="organization"
            maxLength={160}
            value={values.company}
            onChange={change("company")}
            {...invalid("company")}
          />
          {errorText("company")}
        </label>
        <label className="full" htmlFor="lead-challenge">
          Ihr Vorhaben *
          <textarea
            id="lead-challenge"
            name="challenge"
            required
            minLength={20}
            maxLength={4000}
            rows={5}
            placeholder="Was möchten Sie erreichen? Gibt es bereits eine Website oder einen Ablauf, den Sie verbessern möchten?"
            value={values.challenge}
            onChange={change("challenge")}
            {...invalid("challenge")}
          />
          {errorText("challenge")}
          <span className="field-hint">
            Mindestens 20 Zeichen. Bitte keine sensiblen Kunden- oder
            Zugangsdaten eintragen.
          </span>
        </label>
      </div>
      <details
        className="optional-contact"
        open={error("phone") ? true : undefined}
      >
        <summary>Telefonkontakt ergänzen (optional)</summary>
        <div className="form-grid">
          <label htmlFor="lead-phone">
            Telefonnummer
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              value={values.phone}
              onChange={change("phone")}
              {...invalid("phone")}
            />
            {errorText("phone")}
          </label>
          <label htmlFor="lead-contactWay">
            Bevorzugter Kontaktweg
            <select
              id="lead-contactWay"
              name="contactWay"
              value={values.contactWay}
              onChange={change("contactWay")}
              {...invalid("contactWay")}
            >
              <option>E-Mail</option>
              <option>Telefon</option>
            </select>
            {errorText("contactWay")}
          </label>
        </div>
      </details>
      <p className="form-privacy">
        Wir verwenden Ihre Angaben zur Bearbeitung Ihrer Anfrage. Mehr dazu in
        den <Link href="/datenschutz">Datenschutzhinweisen</Link>. Mit *
        markierte Felder sind erforderlich.
      </p>
      <button className="button" type="submit" disabled={!token || pending}>
        {pending
          ? "Anfrage wird gespeichert …"
          : "Kostenloses Erstgespräch anfragen"}
        <span aria-hidden="true">↗</span>
      </button>
      <span className="motion-text" role="status" aria-live="polite">
        {pending ? "Ihre Anfrage wird verarbeitet. Bitte warten." : ""}
      </span>
    </form>
  );
}
