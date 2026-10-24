# Testprotokoll – Master-Prompt-Überarbeitung

> Historischer Entwicklungs- bzw. Prüfstand. Aussagen zu damaliger Gestaltung, Testzahlen und fehlenden Datenbankprüfungen gelten für diese Phase. Aktueller Stand: [Veröffentlichungsprüfung vom 24.10.2026](RELEASE-2026-10-24.md).

Ausführung: 19.10.2026, 17:21:47 (Europe/Berlin). Status: **lokal geprüft, mit Einschränkungen für den Live-Betrieb**.

## Umgebung

Windows, Node.js 24.15.0, Next.js 15.5.28, React 19.3.1, Playwright 1.64.1, Chrome 155.0.8059.82. Produktiv kompilierter lokaler Next.js-Server auf 127.0.0.1:3100; Fehler-Testinstanz auf :3101. Testbrowser mit getrennten temporären Profilen, keine persönlichen Profile. Kein produktiver Versand und keine echte Datenbank verändert.

Der erfolgreiche Build liegt in .next-master-final19. Für diese Windows-Prüfung wurden ein getrenntes Verzeichnis und ein serieller lokaler Build ohne separaten Webpack-Buildworker verwendet. Normale Standard- und Docker-Betriebsarten bleiben verfügbar. Der Build meldet weiterhin, dass kein Next.js-spezifisches ESLint-Plugin konfiguriert ist; die vorhandenen Prüfregeln und TypeScript-Prüfung liefen. Ein Docker-Build wurde nicht ausgeführt.

## Browserprüfungen

17 bestanden, 0 unerwartete Fehler, 0 übersprungen, 0 instabile Ergebnisse. Laufzeit 28.1 Sekunden. Zwei zuvor zu weit gefasste Fehlermeldungs-Selektoren wurden auf das Formular begrenzt, um den eingebauten Next.js-Seitenankündiger nicht mit der Formularmeldung zu verwechseln; der abschließende Gesamtlauf ist erfolgreich.

| Testfall                                                                | Ergebnis  | Dauer  |
| ----------------------------------------------------------------------- | --------- | ------ |
| process explorer switches examples and keeps a useful next step         | Bestanden | 0.58 s |
| service, solution and example layouts work at desktop and mobile sizes  | Bestanden | 2.35 s |
| inline errors preserve values and link to the invalid field             | Bestanden | 0.50 s |
| storage outage never reports success and keeps the message              | Bestanden | 3.31 s |
| no-JavaScript validation retains typed fields                           | Bestanden | 0.32 s |
| expired or altered session is renewed without clearing the request      | Bestanden | 3.37 s |
| public routes, metadata, assets, headers and internal links work        | Bestanden | 2.89 s |
| main tasks fit 320, 390, tablet and desktop; preview form is honest     | Bestanden | 3.75 s |
| native navigation, modal focus and text reflow remain usable            | Bestanden | 0.53 s |
| scroll decoration never hides content and keyboard focus remains usable | Bestanden | 0.39 s |
| reduced motion clears pending reveals and the moving text can be paused | Bestanden | 0.41 s |
| service content and links remain readable without JavaScript            | Bestanden | 0.29 s |
| two service areas lead to their offers and the updated enquiry form     | Bestanden | 0.61 s |
| new service pages fit mobile and desktop and have accessible layouts    | Bestanden | 4.90 s |
| studio navigation supports pages, history, keyboard and reduced motion  | Bestanden | 1.26 s |
| studio home remains accessible and contained on narrow screens          | Bestanden | 1.41 s |
| service page stays contained at 320 pixels                              | Bestanden | 0.23 s |

Enthalten sind 320-, 390-, 768- und 1440-Pixel-Ansichten, automatische axe-Prüfungen mit WCAG-2.2-AA-Regeln auf repräsentativen Seiten, Navigation, Verlauf, native Direktlinks, Dialogfokus, progressive Formulare und reduzierte Bewegung. Alle registrierten öffentlichen Inhaltsseiten und Wissensartikel wurden mit Statuscode, eindeutigem Titel, Description und Canonical geprüft. Gesammelte interne Links, JSON-LD, 404, geschützter Export, CSP und Social-Bild wurden geprüft. Bei den öffentlichen Seitenaufrufen wurden im Browser keine Drittanbieteranfragen erfasst.

Die Formularprüfungen umfassen Feldfehler und Fokus, erhaltene Eingaben mit und ohne JavaScript, eine absichtlich unerreichbare Datenbank sowie Erneuerung eines ungültigen Formulartokens. Der Test auf :3101 verarbeitet nur synthetische Angaben; eine Erfolgszustellung oder erfolgreiche Speicherung in einer echten Datenbank wird damit ausdrücklich nicht bestätigt.

## Sicherheitstests

npm test: **10 von 10 bestanden**. Geprüft wurden signierte und zeitlich begrenzte Formulartoken, Passwortprüfung, signierte Webhooks, CSV-Formelinjection, begrenzte Attribution, serverseitige Eingabeprüfung, Wiederholungsverzögerung, Timeouts, gültige Leistungsthemen und reduzierte Pflichtangaben. Dies ist kein vollständiger Penetrationstest. Datenbank-Integrationstests mit echter Testdatenbank und Admin-Anmeldung wurden bei dieser Überarbeitung nicht ausgeführt.

## Lighthouse – ein lokaler mobiler Labordurchlauf

Lighthouse 13.5.0; Produktionsbuild auf Loopback, mobile Standardemulation und simulierte Drosselung. Messung nach den Funktionstests, ohne parallelen Testlauf.

| Kategorie      | Ergebnis |
| -------------- | -------- |
| performance    | 99/100   |
| accessibility  | 100/100  |
| best-practices | 100/100  |
| seo            | 69/100   |

- Largest Contentful Paint: 2.2 s.
- Cumulative Layout Shift: 0.
- Total Blocking Time: 10 ms.

Der SEO-Wert wird durch das absichtliche noindex/robots-Verbot der privaten Vorschau begrenzt. Das wurde nicht entfernt, nur um einen höheren Prüfwert zu erzielen. Der zusätzliche Diagnosehinweis zum Back/Forward-Cache ist keine Garantie einer vollständigen Browseroptimierung. Der Browser-Zurück-Ablauf wurde funktional geprüft.

Keine realen INP-Werte und keine 75.-Perzentil-Feldwerte bestätigt. Die Labormessung garantiert keine identischen Werte auf fremden Geräten, Hostingumgebungen oder Netzen.

## Sichtprüfung und Grenzen

Desktop- und Mobil-Screenshots wurden erzeugt und betrachtet. Bei der Sichtprüfung wurde das Kontaktformular mobil vor die ergänzenden Erläuterungen gesetzt. Beide Leistungsbereiche besitzen weiterhin dieselbe Struktur. Das vorhandene Maskottchen bleibt erhalten.

Offen: Safari/WebKit und Firefox (keine installierten Testbrowser), echte Mobilgeräte, manueller Screenreader-Test, tatsächlicher Browserzoom und Nutzertest mit drei bis fünf Personen. Eine Änderung der CSS-Grundschrift im automatischen Reflow-Test ersetzt keine vollständige manuelle Zoomprüfung. Automatische Kontrast- und Semantikprüfungen sind kein vollständiger WCAG-Nachweis.

## Reproduzieren

Die Befehle setzen die Konfiguration aus README und .env.example voraus. Für die lokale Windows-Umgebung wurde PROZESSWERK_BUILD_DIR=.next-master-final19 verwendet. Vor einem erneuten Build laufende Vorschau beenden. Ein regulärer Neubau aus der ZIP startet mit npm ci und npm run build.

- Typprüfung: npm run typecheck
- Sicherheit: npm test
- Öffentliche Browserprüfungen: TEST_BASE_URL auf die Vorschau setzen, TEST_BROWSER_CHANNEL=chrome wählen; dann die Dateien design.spec.ts, offering.spec.ts, studio.spec.ts, motion.spec.ts und master.spec.ts mit Playwright ausführen.
- form-state.spec.ts erwartet eine eigene isolierte Fehlerinstanz auf Port 3101 mit Testsecrets, DELIVERY_ENABLED=false und unerreichbarer Testdatenbank. Niemals auf ein produktives System richten.
- Bei eingeschränkten Windows-Umgebungen TEMP und TMP auf ein beschreibbares Arbeitsverzeichnis setzen. Netzwerkzugriff auf die lokalen Testserver muss erlaubt sein.

## Noch vor Livegang erforderlich

Echte Betreiber- und Verarbeitungsangaben, fachliche Rechtsprüfung, Rechtebestätigung für bereitgestellte Assets, gewählte Anbieter und Kosten, Domain/HTTPS, produktive Datenbank, getestete Sicherung/Wiederherstellung, verifizierter E-Mail-Absender und tatsächlicher Empfänger, erfolgreicher Empfang, Wartungsverantwortung und ausdrückliche Veröffentlichung. Die lokale Hauptvorschau bleibt bis dahin mit sichtbar deaktiviertem Formular und noindex versehen.
