"use client";
import { useState } from "react";
import Link from "next/link";
const examples = [
  {
    label: "Vertrieb & CRM",
    tag: "VOM POSTFACH ZUM NÄCHSTEN SCHRITT",
    title: "Eine Anfrage. Kein Copy & Paste.",
    text: "Eine Anfrage kommt an. Die Daten werden geprüft und im CRM zugeordnet. Ihr Team weiß, wer als Nächstes dran ist.",
    steps: [
      ["Anfrage erfassen", "Formular oder Postfach"],
      ["Daten prüfen", "Vollständigkeit & Dubletten"],
      ["CRM aktualisieren", "Kontakt & Aufgabe anlegen"],
    ],
    exception: "Unklare Angaben? Eine Person prüft nach.",
    href: "/leistungen/vertriebsautomatisierung",
  },
  {
    label: "Angebote & Dokumente",
    tag: "VON DATEN ZUM FREIGEGEBENEN DOKUMENT",
    title: "Einmal erfassen. Sauber weitergeben.",
    text: "Freigegebene Projektdaten befüllen eine Vorlage. Ihr Team prüft das Dokument, bevor es an die richtige Person geht.",
    steps: [
      ["Daten übernehmen", "Aus dem führenden System"],
      ["Entwurf erstellen", "Mit Ihrer Dokumentvorlage"],
      ["Freigabe einholen", "Vor dem Versand prüfen"],
    ],
    exception: "Fehlen Pflichtangaben, bleibt der Versand gestoppt.",
    href: "/leistungen/prozessautomatisierung",
  },
  {
    label: "Kunden-Onboarding",
    tag: "VOM AUFTRAG ZUM GUTEN START",
    title: "Der Auftrag steht. Der Ablauf auch.",
    text: "Nach einer Auftragsfreigabe entstehen Aufgaben und eine Projektstruktur. Fehlende Unterlagen werden sichtbar, bevor sie den Start verzögern.",
    steps: [
      ["Auftrag freigeben", "Ein klarer Auslöser"],
      ["Projekt vorbereiten", "Ordner, Aufgaben & Checkliste"],
      ["Team übergeben", "Zuständigkeiten sind klar"],
    ],
    exception: "Ohne Freigabe startet keine Kundenkommunikation.",
    href: "/loesungen",
  },
];
export function ProcessExplorer() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const current = examples[active];
  const manualSteps = [
    [
      ["Anfrage lesen", "Postfach einzeln prüfen"],
      ["Daten übertragen", "Kontakt ins CRM abtippen"],
      ["Team erinnern", "Nachricht separat verschicken"],
    ],
    [
      ["Daten zusammensuchen", "Mehrere Quellen öffnen"],
      ["Vorlage ausfüllen", "Angaben manuell übertragen"],
      ["Prüfung organisieren", "Versionen und Freigaben abgleichen"],
    ],
    [
      ["Auftrag nachlesen", "Freigabe im Postfach suchen"],
      ["Projekt anlegen", "Ordner und Aufgaben einzeln erstellen"],
      ["Unterlagen nachhalten", "Zuständigkeiten persönlich abstimmen"],
    ],
  ];
  const shownSteps = manual ? manualSteps[active] : current.steps;
  return (
    <div className="process-explorer">
      <div
        className="explorer-switches"
        role="group"
        aria-label="Automatisierungsbeispiel auswählen"
      >
        {examples.map((example, i) => (
          <button
            key={example.label}
            type="button"
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            {example.label}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div className="explorer-content" aria-live="polite" aria-atomic="true">
        <div className="explorer-copy" key={current.label}>
          <span className="eyebrow">{current.tag}</span>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <Link className="text-link" href={current.href}>
            Mehr zu dieser Lösung <span aria-hidden="true">↗</span>
          </Link>
          <small>Illustratives Beispiel · keine Kundenreferenz</small>
        </div>
        <div className="explorer-diagram" key={current.tag}>
          <div
            className="workflow-comparison"
            role="group"
            aria-label="Ablauf vergleichen"
          >
            <button
              type="button"
              aria-pressed={manual}
              onClick={() => setManual(true)}
            >
              Heute manuell
            </button>
            <button
              type="button"
              aria-pressed={!manual}
              onClick={() => setManual(false)}
            >
              Verbunden
            </button>
          </div>
          <span className="diagram-label">
            {manual
              ? "Viele einzelne Handgriffe"
              : "Ein Schritt greift in den nächsten"}
          </span>
          <ol>
            {shownSteps.map(([title, text], i) => (
              <li key={title}>
                <span className="diagram-step-icon" aria-hidden="true">
                  {i === 0 ? (
                    "↙"
                  ) : i === 1 ? (
                    "⋈"
                  ) : (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="m5 12 4 4L19 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </span>
                <div>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
                <span className="diagram-count">0{i + 1}</span>
              </li>
            ))}
          </ol>
          <p>
            <span aria-hidden="true">↳</span>
            {manual
              ? "Ein Beispiel für einen manuellen Ablauf. Ihr tatsächlicher Prozess kann abweichen."
              : current.exception}
          </p>
        </div>
      </div>
    </div>
  );
}
