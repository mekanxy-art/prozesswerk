import { offeringPages, serviceGroups } from "./offering";
export type Section = { title: string; text: string; bullets?: string[] };
export type PageContent = {
  title: string;
  description: string;
  label: string;
  intro: string;
  sections: Section[];
  legal?: boolean;
};
export const faq = [
  [
    "Erstellen Sie auch Shopify-Shops und begleiten einen Shopwechsel?",
    "Ja. Wir erstellen Shopify-Shops mit vereinbartem Umfang und begleiten Migrationen nach einer Bestandsprüfung. Welche Daten und Funktionen übernommen werden können, hängt vom Ausgangssystem ab. Shopify-Tarif, Themes und Apps werden vorab abgestimmt.",
  ],
  [
    "Erstellen Sie auch neue Websites?",
    "Ja. Wir entwickeln Unternehmenswebsites von der Seitenstruktur über die Gestaltung bis zur technischen Umsetzung. Inhalte, Seitenumfang, Hosting und spätere Pflege stimmen wir vorab mit Ihnen ab.",
  ],
  [
    "Was umfasst die SEO-Optimierung?",
    "Wir bieten eine abgegrenzte Grundlagenoptimierung: Suchthemen, Seitenstruktur, Metadaten, interne Links und technische Voraussetzungen. Bestimmte Rankings und laufende SEO-Betreuung sind nicht Bestandteil dieses Angebots.",
  ],
  [
    "Ist die Prozessanalyse kostenlos?",
    "Das Erstgespräch ist kostenlos und unverbindlich. Eine ausführliche Prozessanalyse mit dokumentierten Abläufen und Verbesserungsvorschlägen wird separat angeboten und beauftragt.",
  ],
  [
    "Welche Prozesse eignen sich für eine Automatisierung?",
    "Wiederkehrende Abläufe mit klaren Regeln und digitalen Eingaben sind gute Kandidaten. Beispiele sind die Übernahme von CRM-Daten, Dokumentenfreigaben und regelmäßige Berichte. Ausnahmen, Datenqualität und Fehlerfolgen prüfen wir vor der Umsetzung.",
  ],
  [
    "Müssen wir unsere bestehenden Systeme ersetzen?",
    "Häufig lassen sich vorhandene Systeme über Schnittstellen verbinden. Wir prüfen Zugriffsrechte, technische Grenzen und laufende Kosten. Fehlt eine geeignete Schnittstelle, besprechen wir Alternativen und deren Wartungsaufwand.",
  ],
  [
    "Was kostet ein Automatisierungsprojekt?",
    "Der Aufwand hängt von den beteiligten Systemen, Ausnahmen und Sicherheitsanforderungen ab. Nach der Prozessanalyse erhalten Sie einen abgegrenzten Vorschlag mit Umfang, Kosten und Abnahmekriterien. Ohne Prüfung nennen wir keinen pauschalen Projektpreis.",
  ],
  [
    "Welche Rolle spielt KI?",
    "KI kann Texte entwerfen oder unstrukturierte Inhalte vorsortieren. Sie ist nicht für jeden Prozess erforderlich. Bei kritischen Entscheidungen planen wir Freigaben, klare Grenzen und einen überprüfbaren Umgang mit unsicheren Ergebnissen.",
  ],
  [
    "Was passiert, wenn ein Workflow fehlschlägt?",
    "Wir planen Wiederholungsversuche, Benachrichtigungen und eine manuelle Bearbeitungsmöglichkeit. Welche Reaktionszeiten gelten, hängt von der vereinbarten Betreuung ab. Eine vollständig fehlerfreie Automatisierung versprechen wir nicht.",
  ],
  [
    "Können automatisierte Vertriebs-E-Mails einfach gestartet werden?",
    "Nein. Vor einer Kampagne müssen die wettbewerbsrechtliche Zulässigkeit und die datenschutzrechtliche Grundlage geprüft werden. Widersprüche und Sperrlisten müssen wirksam berücksichtigt werden. Diese Website versendet keine Vertriebskampagnen.",
  ],
  [
    "Wer betreibt und wartet die Automatisierung?",
    "Betrieb, Verantwortlichkeiten und Zugriffsrechte werden vor Projektbeginn vereinbart. Eine Übergabe in Ihre Infrastruktur ist ebenso zu prüfen wie eine laufende Betreuung. Dokumentation und Fehlerbehandlung gehören zur Planung.",
  ],
];
export const pages: Record<string, PageContent> = {
  ...offeringPages,
  "leistungen/vertriebsautomatisierung": {
    title: "Mehr Überblick. Bessere Übergaben im Vertrieb.",
    description:
      "CRM, Anfragen und Follow-ups sinnvoll verbinden. Vertriebsautomatisierung mit Freigaben und klaren rechtlichen Grenzen.",
    label: "VERTRIEBSAUTOMATISIERUNG",
    intro:
      "Vertriebsautomatisierung verbindet wiederkehrende Schritte von der eingehenden Anfrage bis zur nächsten Aufgabe im CRM. So bleiben Informationen und Zuständigkeiten zusammen.",
    sections: [
      {
        title: "Eine Anfrage kommt an. Ihr Prozess startet.",
        text: "Eine freigegebene Anfrage wird auf Vollständigkeit geprüft, einem Team zugeordnet und mit dem CRM abgeglichen. Bestehende Kontakte werden aktualisiert, statt mehrfach angelegt zu werden.",
      },
      {
        title: "Follow-ups mit Kontext",
        text: "Das System erinnert an vereinbarte nächste Schritte. Texte können vorbereitet werden; vor dem Versand lässt sich eine Freigabe einbauen. Antworten und Widersprüche stoppen vorgesehene Kontaktfolgen.",
      },
      {
        title: "Keine Kampagne ohne Prüfung",
        text: "Wir planen keine wahllosen Werbe-E-Mails. Quelle, Zweck, Rechtsgrundlage, Widerspruch und Sperrlistenstatus sind vor jeder Kampagne zu prüfen. B2B ist keine pauschale Erlaubnis für E-Mail-Werbung.",
      },
      {
        title: "Was wir gemeinsam festlegen",
        text: "Wir brauchen eine Übersicht Ihres CRM, der Eingangskanäle und der Zuständigkeiten. Die Abnahme prüft unter anderem Dubletten, fehlende Daten und widersprechende Kontakte.",
        bullets: [
          "CRM-Felder und erforderliche Berechtigungen",
          "Freigaberegeln und Eskalationen",
          "Erfolg anhand nachvollziehbarer Übergaben messen",
        ],
      },
    ],
  },
  "leistungen/prozessautomatisierung": {
    title: "Aus wiederkehrender Arbeit wird ein verlässlicher Ablauf.",
    description:
      "Geschäftsprozesse automatisieren: Dokumente, Onboarding und Reporting für KMU mit klaren Zuständigkeiten und Fehlerwegen.",
    label: "PROZESSAUTOMATISIERUNG",
    intro:
      "Prozessautomatisierung führt wiederkehrende Aufgaben nach vereinbarten Regeln aus. Sie entlastet Teams dort, wo heute Daten kopiert, Status abgefragt oder Dokumente manuell weitergereicht werden.",
    sections: [
      {
        title: "Den Ablauf verstehen, bevor wir ihn verbinden",
        text: "Wir erfassen Auslöser, Eingaben, Entscheidungen und Ergebnisse. Dabei werden unnötige Schritte sichtbar. Ein unklarer Prozess wird durch Software allein nicht besser.",
      },
      {
        title: "Beispiel: vom Auftrag zum Onboarding",
        text: "Nach einem freigegebenen Auftrag entstehen Projektordner, Aufgaben und eine interne Checkliste. Fehlende Unterlagen werden sichtbar gemacht. Erst nach einer Freigabe startet der nächste Abschnitt. Dies ist ein Beispielszenario, keine Kundenreferenz.",
      },
      {
        title: "Ausnahmen gehören zum Prozess",
        text: "Unvollständige Daten gehen in eine Klärungsliste. Bei einer nicht erreichbaren Schnittstelle greifen begrenzte Wiederholungen. Verantwortliche erhalten eine Benachrichtigung statt eines stillen Fehlers.",
      },
      {
        title: "Eine sinnvolle erste Ausbaustufe",
        text: "Wir starten mit einem häufigen, stabilen Ablauf. Vorher und nachher messen Sie Bearbeitungszeit, Nacharbeit und Fehlerquote auf Basis Ihrer eigenen Daten. Daraus lässt sich die nächste Investition ableiten.",
      },
    ],
  },
  "leistungen/n8n-automatisierung": {
    title: "Ihre Systeme. Ein durchdachter Workflow.",
    description:
      "Individuelle n8n-Automatisierung mit APIs, Fehlerbehandlung, sicherem Betrieb und dokumentierter Übergabe.",
    label: "N8N-AUTOMATISIERUNG",
    intro:
      "n8n ist eine Plattform, mit der sich Anwendungen über visuelle Workflows und Schnittstellen verbinden lassen. Wir nutzen sie für klar definierte Abläufe und ergänzen Code, wenn Standardbausteine nicht ausreichen.",
    sections: [
      {
        title: "Schnittstellen statt Insellösungen",
        text: "CRM, E-Mail, Dokumente und interne Tools können Daten austauschen, sofern ihre APIs und Berechtigungen dies erlauben. Wir prüfen Limits, Datenformate und Abhängigkeiten vor der Umsetzung.",
      },
      {
        title: "Self-Hosting ist eine Betriebsentscheidung",
        text: "Ein eigener Betrieb bietet Gestaltungsspielraum, bringt aber Verantwortung für Updates, Backups, Zugriffe und Überwachung mit. Auch Hostingregion, Auftragsverarbeitung und Lizenzbedingungen müssen geprüft werden.",
      },
      {
        title: "Workflows mit Sicherheitsnetz",
        text: "Wir trennen Test und Produktion, hinterlegen Secrets serverseitig und planen zeitlich begrenzte Aufrufe, Wiederholungen sowie Schutz vor doppelter Verarbeitung.",
      },
      {
        title: "Wenn Ihr Team eine Oberfläche braucht",
        text: "Ein schlankes Portal kann Freigaben, offene Aufgaben und Ausnahmen sichtbar machen. Die Oberfläche greift auf abgesicherte Serverfunktionen zu; Webhook-Zugangsdaten gelangen nicht in den Browser.",
      },
    ],
  },
  loesungen: {
    title: "Passende Abläufe für Ihren Arbeitsalltag.",
    description:
      "Automatisierungsbeispiele für Agenturen, Beratung, Recruiting, SaaS und Dienstleister in Deutschland.",
    label: "LÖSUNGEN",
    intro:
      "Die Branche gibt den Kontext. Der konkrete Prozess entscheidet über die Lösung. Alle folgenden Szenarien sind illustrative Beispiele und keine Referenzprojekte.",
    sections: [
      {
        title: "Agenturen: vom Auftrag zum Projektstart",
        text: "Ein freigegebenes Angebot legt Projektstruktur und Aufgaben an. Fehlende Briefingangaben erscheinen in einer Checkliste, bevor das Team mit der Umsetzung beginnt.",
      },
      {
        title: "Beratungen: Wissen strukturiert weitergeben",
        text: "Nach einem Termin werden freigegebene Notizen einem Projekt zugeordnet. Aufgaben und nächste Schritte werden vorbereitet; sensible Inhalte bleiben in vereinbarten Systemen.",
      },
      {
        title: "Recruiting: Übergaben im Blick behalten",
        text: "Statusänderungen lösen interne Aufgaben aus. Personenbezogene Bewerbungsdaten erfordern ein besonders sorgfältiges Rollen-, Zweck- und Löschkonzept. Automatisierte Auswahlentscheidungen sind kein Standardbestandteil.",
      },
      {
        title: "SaaS und Dienstleistung: Onboarding verbinden",
        text: "Vertragsfreigabe, technische Einrichtung und interne Übergabe werden als zusammenhängender Ablauf sichtbar. Ausnahmen landen bei einer verantwortlichen Person.",
      },
    ],
  },
  vorgehensweise: {
    title: "Klein anfangen. Sauber umsetzen. Gezielt ausbauen.",
    description:
      "Vom kostenlosen Erstgespräch über Analyse und Umsetzung bis zur Übergabe: unser Vorgehen für Automatisierungsprojekte.",
    label: "ZUSAMMENARBEIT",
    intro:
      "Sie müssen keine fertige technische Lösung mitbringen. Wir beginnen mit Ihrem Arbeitsalltag und vereinbaren einen überschaubaren ersten Schritt.",
    sections: [
      {
        title: "01 / Verstehen",
        text: "Im kostenlosen Erstgespräch besprechen wir Ihren Ablauf, die beteiligten Systeme und Ihr Ziel. Danach entscheiden beide Seiten, ob eine vertiefte Analyse sinnvoll ist.",
      },
      {
        title: "02 / Abgrenzen",
        text: "Sie erhalten einen Vorschlag mit Umfang, Annahmen, Schnittstellen und Abnahmekriterien. Laufende Lizenz- und Betriebskosten sowie erforderliche rechtliche Prüfungen werden getrennt benannt.",
      },
      {
        title: "03 / Umsetzen und prüfen",
        text: "Wir entwickeln zunächst mit Testdaten. Sie prüfen Normalfälle und Ausnahmen anhand zuvor vereinbarter Szenarien. Offene Probleme werden vor dem Produktivstart dokumentiert und behoben.",
      },
      {
        title: "04 / Übergeben und betreiben",
        text: "Zum Start gehören Dokumentation, Verantwortlichkeiten, Monitoring und ein Rückfallplan. Betreuung und Reaktionszeiten werden ausdrücklich vereinbart.",
      },
    ],
  },
  beispiele: {
    title: "So könnte Ihr nächster Prozess aussehen.",
    description:
      "Nachvollziehbare Beispielszenarien für CRM, Onboarding und Dokumente. Keine erfundenen Kundenreferenzen oder Erfolgszahlen.",
    label: "BEISPIELPROZESSE",
    intro:
      "Hier zeigen wir mögliche Lösungen. Die Szenarien sind konzeptionelle Beispiele, keine umgesetzten Kundenprojekte und keine Ergebnisversprechen.",
    sections: [
      {
        title: "Beispiel 01 / Anfrage → CRM → verantwortliches Team",
        text: "Ausgangslage: Ein Postfach dient als gemeinsame Aufgabenliste. Lösung: Nach Eingang einer zulässigen Anfrage werden Pflichtangaben geprüft, Dubletten erkannt und ein CRM-Eintrag samt Aufgabe erstellt. Ausnahme: Unklare Zuordnungen landen zur manuellen Klärung. Messen: Zeit bis zur Zuordnung und Anzahl fehlender Angaben.",
      },
      {
        title: "Beispiel 02 / Angebot → Freigabe → Dokument",
        text: "Ausgangslage: Daten werden mehrfach in Vorlagen übertragen. Lösung: Freigegebene Projektdaten befüllen eine Vorlage. Vor Versand prüft eine verantwortliche Person das Ergebnis. Ausnahme: Fehlende Pflichtdaten blockieren die Freigabe. Messen: Nacharbeit und Vollständigkeit.",
      },
      {
        title: "Beispiel 03 / Auftrag → Onboarding → Status",
        text: "Ausgangslage: Projektstarts hängen von einzelnen Erinnerungen ab. Lösung: Eine Auftragsfreigabe legt Aufgaben an und zeigt fehlende Unterlagen. Ausnahme: Ohne zuständige Person erfolgt keine automatische Kundenkommunikation. Messen: offene Schritte und Durchlaufzeit.",
      },
    ],
  },
  "ueber-uns": {
    title: "Technik verständlich machen. Arbeit besser organisieren.",
    description:
      "Unser Ansatz: pragmatische Automatisierung für KMU, transparente Entscheidungen und nachvollziehbare Übergaben.",
    label: "ÜBER UNS",
    intro:
      "Wir möchten Unternehmen helfen, wiederkehrende Arbeit in klare digitale Abläufe zu übersetzen. Ein gutes Ergebnis passt zu Ihrem Team und bleibt verständlich.",
    sections: [
      {
        title: "Ihr Prozess ist der Ausgangspunkt",
        text: "Wir wählen Werkzeuge nach der Aufgabe. Eine feste Regel ist manchmal hilfreicher als KI; eine einfache Schnittstelle manchmal sinnvoller als ein großes neues System.",
      },
      {
        title: "Zusammenarbeit auf nachvollziehbarer Grundlage",
        text: "Ziele, Zuständigkeiten und Grenzen werden vor der Umsetzung benannt. Dokumentation, Fehlerwege und Übergabe gehören zur Planung.",
      },
      {
        title: "Unternehmensprofil wird ergänzt",
        text: "[FIRMENNAME], [RECHTSFORM], vertreten durch [NAME], mit Sitz in [ADRESSE]. Teamprofile, Qualifikationen und reale Projekterfahrung sind vor Veröffentlichung zu ergänzen. Es werden keine Personen oder Zertifizierungen erfunden.",
      },
    ],
  },
  impressum: {
    title: "Impressum",
    description:
      "Anbieterkennzeichnung – deutlich markierter Entwurf mit noch zu ergänzenden Unternehmensdaten.",
    label: "RECHTLICHER ENTWURF",
    intro:
      "Nicht zur unveränderten Veröffentlichung geeignet. Die tatsächlichen Angaben und die für das Unternehmen geltenden Pflichtinformationen müssen fachlich geprüft werden.",
    legal: true,
    sections: [
      {
        title: "Anbieter gemäß § 5 DDG",
        text: "[FIRMENNAME] · [RECHTSFORM]\nVertreten durch: [NAME]\nGeschäftsanschrift: [ADRESSE]\nE-Mail: [E-MAIL]\nTelefon: [TELEFON]",
      },
      {
        title: "Register und steuerliche Angaben",
        text: "Registergericht und Registernummer: [REGISTERDATEN]\nUmsatzsteuer-Identifikationsnummer, soweit vorhanden: [UST-ID]",
      },
      {
        title: "Vor Veröffentlichung prüfen",
        text: "Die anwendbaren Angaben zu berufsrechtlichen Regelungen, Aufsicht, redaktioneller Verantwortung und Verbraucherstreitbeilegung hängen vom tatsächlichen Unternehmen und Angebot ab. Diese Punkte sind nicht pauschal als erfüllt anzusehen.",
      },
    ],
  },
  datenschutz: {
    title: "Datenschutzhinweise",
    description:
      "Datenschutzentwurf für Anfragen, Hosting und den geschützten Lead-Bereich. Vor Veröffentlichung prüfen und vervollständigen.",
    label: "RECHTLICHER ENTWURF",
    intro:
      "Stand: 19. Oktober 2026. Dieser Entwurf beschreibt die vorbereitete Technik. Er muss mit dem realen Betrieb abgeglichen und durch qualifizierte deutsche Rechtsberatung oder Datenschutzbeauftragte geprüft werden.",
    legal: true,
    sections: [
      {
        title: "Verantwortliche Stelle und Kontakt",
        text: "[FIRMENNAME], [RECHTSFORM], [ADRESSE], vertreten durch [NAME]. Kontakt: [E-MAIL]. Datenschutzkontakt: [DATENSCHUTZKONTAKT]. Zuständige Aufsichtsbehörde: [AUFSICHTSBEHÖRDE ERGÄNZEN].",
      },
      {
        title: "Anfragen und Prozessanalyse",
        text: "Wir verarbeiten Name, E-Mail, Vorhaben und gewähltes Thema sowie gegebenenfalls freiwillig angegebene Unternehmens- und Telefonangaben zur Bearbeitung Ihrer Anfrage. Als Rechtsgrundlage sind je nach Anfragesituation Art. 6 Abs. 1 lit. b oder lit. f DSGVO zu prüfen; bei lit. f ist das konkrete berechtigte Interesse zu dokumentieren. Name, E-Mail-Adresse und Beschreibung sind Pflichtfelder für die Zuordnung und Bearbeitung. Ohne diese Angaben ist das Formular nicht nutzbar. Bitte übermitteln Sie keine besonderen Kategorien personenbezogener Daten.",
      },
      {
        title: "Empfänger und Hosting",
        text: "Anfragen werden in einer PostgreSQL-Datenbank gespeichert. Hostinganbieter: [HOSTER], Hostingregion: [HOSTINGREGION]. E-Mail-Dienst: [E-MAIL-DIENST UND REGION]. Optionaler Workflow-Betrieb: [N8N-BETREIBER UND REGION]. Empfänger, Auftragsverarbeitungsverträge, Unterauftragnehmer und eventuelle Drittlandübermittlungen einschließlich Garantien müssen vor Aktivierung konkret ergänzt werden. Im Auslieferungszustand ist die externe Zustellung deaktiviert.",
      },
      {
        title: "Speicherdauer und Schutz vor Missbrauch",
        text: "Für nicht weiterverfolgte Anfragen ist technisch eine Löschfrist von 180 Tagen seit der letzten Aktualisierung voreingestellt; die tatsächlich erforderliche Frist und gesetzliche Aufbewahrungspflichten sind zu prüfen. Erfolgreiche Projekte benötigen ein getrenntes Aufbewahrungskonzept. Kurzlebige, mit einem geheimen Schlüssel pseudonymisierte Zähler schützen vor Missbrauch. Roh-IP-Adressen werden durch die Anwendung nicht gespeichert. Hostingprotokolle und deren Löschfristen sind separat zu ergänzen.",
      },
      {
        title: "Optionale E-Mail-Impulse",
        text: "Die nicht vorausgewählte Checkbox ist freiwillig. Erst nach separater Bestätigung wird die Einwilligung als bestätigt gespeichert. Grundlage ist die Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Die Bestätigungsseite zeigt eine zusätzliche ausdrückliche Bestätigung, um Linkvorschauen keine Anmeldung auslösen zu lassen. Ein Widerrufslink befindet sich in der Bestätigungs-E-Mail. Ein später eingesetzter Newsletter-Dienst muss Widerruf und Sperrstatus verbindlich übernehmen. Ein Newsletter-Versand ist hier nicht aktiviert.",
      },
      {
        title: "Cookies, externe Inhalte und Statistik",
        text: "Diese Website lädt keine Analyse-, Werbe-, Karten-, Video- oder Terminbuchungs-Skripte von Dritten. Im öffentlichen Bereich werden keine Cookies gesetzt. Der geschützte Admin-Bereich verwendet nach Anmeldung ein notwendiges Sitzungscookie mit acht Stunden Laufzeit. Optionale Dienste müssen vor ihrem Einbau gesondert rechtlich und technisch bewertet werden. Eine Terminbuchung kann als externer Link angeboten werden; der Anbieter wird erst nach dem Aufruf kontaktiert.",
      },
      {
        title: "Ihre Rechte",
        text: "Je nach gesetzlichen Voraussetzungen bestehen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch. Eine Einwilligung können Sie mit Wirkung für die Zukunft widerrufen; die vorherige Verarbeitung bleibt davon unberührt. Sie können sich bei einer Datenschutzaufsichtsbehörde beschweren. Kontakt: [DATENSCHUTZKONTAKT]. Es findet keine automatisierte Entscheidung mit rechtlicher oder vergleichbar erheblicher Wirkung durch diese Website statt.",
      },
    ],
  },
  "cookie-einstellungen": {
    title: "Ihre Datenschutzeinstellungen",
    description:
      "Keine optionalen Tracking-Dienste aktiv. Informationen zu notwendigen Cookies und externen Inhalten.",
    label: "DATENSCHUTZ",
    intro:
      "Auf dieser Website sind keine optionalen Cookies, Analyse-Skripte oder eingebetteten Drittanbieter aktiv. Daher gibt es aktuell keine optionale Cookie-Einwilligung zu verwalten.",
    sections: [
      {
        title: "Notwendige Funktion",
        text: "Nur der geschützte Admin-Bereich setzt nach erfolgreicher Anmeldung ein notwendiges Sitzungscookie. Öffentliche Inhalte und die Anfrage sind ohne ein solches Cookie erreichbar.",
      },
      {
        title: "Externe Terminbuchung",
        text: "Sofern ein geprüfter Terminlink konfiguriert wird, führt dieser auf die Website des Buchungsanbieters. Es wird kein Kalender automatisch eingebettet.",
      },
      {
        title: "Wenn später weitere Dienste hinzukommen",
        text: "Einwilligungspflichtige Dienste dürfen erst nach ausdrücklicher Zustimmung laden. Ablehnen und Akzeptieren müssen gleich einfach sein; ein jederzeit erreichbarer Widerruf und ein Nachweis des Consent-Status sind vor Aktivierung erforderlich.",
      },
    ],
  },
};
export const serviceLinks = serviceGroups.map((g) => [g.href, g.title]);
export const articles = [
  {
    slug: "welche-prozesse-zuerst-automatisieren",
    title: "Welche Prozesse sollten Sie zuerst automatisieren?",
    description:
      "Mit Wiederholung, Klarheit und Fehlerfolgen einen geeigneten Einstieg auswählen.",
    category: "ENTSCHEIDUNGSHILFE",
    sections: [
      {
        title: "Beginnen Sie mit einem beobachtbaren Ablauf",
        text: "Schreiben Sie einen Prozess von seinem Auslöser bis zum Ergebnis auf. Notieren Sie, welche Informationen gebraucht werden und wer die nächste Entscheidung trifft. Ein geeigneter erster Kandidat kommt regelmäßig vor und hat einen klaren Abschluss.",
      },
      {
        title: "Prüfen Sie vier Kriterien",
        text: "Bewerten Sie Häufigkeit, Regelklarheit, Datenqualität und Fehlerfolgen jeweils getrennt. Ein häufig wiederkehrender Ablauf mit stabilen Daten ist leichter abzugrenzen. Bei hohen Fehlerfolgen sollte eine menschliche Freigabe Teil des Piloten sein.",
      },
      {
        title: "Messen Sie vor dem Pilot",
        text: "Erfassen Sie für einen repräsentativen Zeitraum die Anzahl der Fälle, Bearbeitungszeit und Nacharbeit. Beispielrechnung: 40 Fälle × 8 Minuten ergeben 320 Minuten Ausgangsaufwand. Das ist eine Rechenillustration, keine versprochene Einsparung. Vergleichen Sie nach dem Pilot auch neue Kontroll- und Wartungsaufwände.",
      },
      {
        title: "Legen Sie eine Stoppregel fest",
        text: "Wenn Daten fehlen oder das System nicht eindeutig entscheiden kann, muss der Ablauf in eine manuelle Klärung wechseln. Erst wenn Normalfälle und Ausnahmen funktionieren, sollte der Umfang wachsen.",
      },
    ],
  },
  {
    slug: "was-kostet-n8n-automatisierung",
    title: "Was kostet eine n8n-Automatisierung?",
    description:
      "Welche Faktoren den Projektaufwand und die laufenden Kosten bestimmen.",
    category: "PLANUNG",
    sections: [
      {
        title: "Ein Workflow ist keine feste Preiseinheit",
        text: "Zwei Abläufe mit gleich vielen Schritten können sehr unterschiedlich aufwendig sein. Entscheidend sind Schnittstellen, Datenqualität, Berechtigungen und die Zahl der Ausnahmen. Ein belastbares Angebot braucht deshalb eine abgegrenzte Prozessbeschreibung.",
      },
      {
        title: "Einmalige und laufende Kosten trennen",
        text: "Zur Umsetzung kommen gegebenenfalls Hosting, Lizenzen, API-Nutzung und Wartung. Prüfen Sie, welche Kosten nach Fallzahl wachsen und welche Aufgaben Ihr eigenes Team übernimmt. Für KI-Dienste sind Nutzungslimits sinnvoll.",
      },
      {
        title: "Diese Unterlagen helfen beim Angebot",
        text: "Bringen Sie eine Systemübersicht, anonymisierte Beispieldaten und eine Liste der häufigsten Ausnahmen mit. Legen Sie fest, welche Freigaben erforderlich sind und wer die Abnahme durchführt. Das senkt Unklarheiten im Angebot.",
      },
      {
        title: "Wirtschaftlichkeit mit Ihren Daten prüfen",
        text: "Stellen Sie dem erwarteten Nutzen die Investition und den laufenden Aufwand gegenüber. Berücksichtigen Sie verbleibende Kontrollen und Anlaufzeit. Ein Projekt muss sich nicht allein über Minuten rechnen; nachvollziehbare Qualität und verlässliche Übergaben können ebenfalls Ziele sein.",
      },
    ],
  },
  {
    slug: "crm-mit-n8n-verbinden",
    title: "CRM und n8n verbinden: erst die Datenregeln klären.",
    description:
      "Ein Praxisleitfaden zu Datenhoheit, Dubletten, Fehlerfällen und Berechtigungen.",
    category: "PRAXIS",
    sections: [
      {
        title: "Bestimmen Sie das führende System",
        text: "Legen Sie für jedes Feld fest, welche Anwendung die verbindliche Quelle ist. Ohne diese Regel können zwei Systeme sich gegenseitig überschreiben. Eine E-Mail-Adresse allein ist nicht für jeden Kontakt ein stabiler eindeutiger Schlüssel.",
      },
      {
        title: "Doppelte Ereignisse erwarten",
        text: "Webhooks können mehrfach eintreffen. Speichern Sie eine Ereigniskennung und prüfen Sie vor einer Änderung, ob sie schon verarbeitet wurde. Aktualisierung und Kennzeichnung sollten innerhalb derselben Datenbanktransaktion erfolgen.",
      },
      {
        title: "Fehler nachvollziehbar behandeln",
        text: "Unterscheiden Sie temporäre Störungen von ungültigen Daten. Temporäre Störungen können begrenzt wiederholt werden. Fehlerhafte Daten brauchen eine Klärungsliste mit Zuständigkeit. Logs sollten keine vollständigen Kontaktprofile enthalten.",
      },
      {
        title: "Berechtigungen und Widersprüche mitnehmen",
        text: "Nutzen Sie einen technischen Zugang mit nur den erforderlichen Rechten. Quelle, Zweck und Sperrstatus dürfen bei der Synchronisation nicht verloren gehen. Testen Sie ausdrücklich, dass gesperrte Kontakte keine geplante Kontaktfolge auslösen.",
      },
    ],
  },
];
