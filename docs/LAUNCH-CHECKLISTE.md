# Launch-Checkliste und offene Angaben

Status: lokal implementiert; nicht veröffentlicht. Technische Abnahme und juristische Freigabe sind getrennte Schritte.

## Unternehmen und Redaktion

- [ ] `[FIRMENNAME]`, `[DOMAIN]` (`NEXT_PUBLIC_SITE_URL` und `APP_ORIGIN`), `[NAME]`, `[ADRESSE]`, `[E-MAIL]`, `[TELEFON]` ergänzen.
- [ ] `[RECHTSFORM]`, `[UST-ID]`, `[REGISTERDATEN]` zutreffend ergänzen; nicht vorhandene optionale Angaben nach Prüfung entfernen.
- [ ] `[DATENSCHUTZKONTAKT]`, `[HOSTER]`, `[HOSTINGREGION]`, `[E-MAIL-DIENST UND REGION]`, `[N8N-BETREIBER UND REGION]`, `[AUFSICHTSBEHÖRDE ERGÄNZEN]` vervollständigen.
- [ ] `[REGION]`, `[CRM]` und optional `[TERMINLINK]` (`BOOKING_URL`) festlegen.
- [ ] Teamprofile und reale Qualifikationen ergänzen, redaktionelle Verantwortung und Artikelstände bestätigen. Keine erfundenen Referenzen hinzufügen.
- [ ] Firmenangaben in `src/lib/config.ts` beziehungsweise serverseitigen Umgebungsvariablen pflegen; Impressum/Datenschutz-Entwürfe enthalten zusätzliche Textplatzhalter und müssen ausdrücklich redaktionell angepasst werden.

## Juristische und Datenschutzprüfung

- [ ] Impressum nach § 5 DDG und weitere tatsächlich geltende Informationspflichten prüfen.
- [ ] Vollständige Datenschutzhinweise nach Art. 13 DSGVO: Zwecke, je Verarbeitung passende Rechtsgrundlagen, Empfänger, Drittlandgarantien, Fristen und Rechte.
- [ ] Formularhinweis, Pflichtfelder und freiwillige Marketingeinwilligung prüfen. DOI, Nachweis, Widerruf und Weitergabe an Newsletterdienste testen.
- [ ] Hosting, E-Mail, n8n und gegebenenfalls KI-Anbieter: AVV, Unterauftragnehmer, Region, Zugriffe und Drittlandübermittlungen prüfen.
- [ ] Aufbewahrung für offene, abgeschlossene und erfolgreiche Anfragen sowie minimierte Sperreinträge verbindlich festlegen; Löschroutine und Backupfristen darauf anpassen.
- [ ] TDDDG-Bewertung der tatsächlichen Dienste; optionales Tracking erst nach geprüftem Konzept und gegebenenfalls wirksamem Consent aktivieren.
- [ ] UWG § 7 und DSGVO vor jeder Vertriebsmaßnahme prüfen. Keine Annahme, dass B2B-E-Mails generell erlaubt seien. Herkunft, Zweck, Widerspruch und Sperrstatus verbindlich verarbeiten.
- [ ] BFSG-Anwendbarkeit am realen Angebot, Verbraucherbezug, Unternehmensgröße und etwaigen Ausnahmen prüfen. Kein pauschaler Schluss aus „B2B“ oder aus bestandenem Accessibilityscanner.
- [ ] Barrierefreiheit, Vertragstexte, Buchungsanbieter, Verbraucherstreitbeilegung und redaktionelle Pflichtangaben für das konkrete Geschäftsmodell beurteilen.

Prüfgrundlagen: [DDG § 5](https://www.gesetze-im-internet.de/ddg/__5.html), [TDDDG § 25](https://www.gesetze-im-internet.de/ttdsg/__25.html), [UWG § 7](https://www.gesetze-im-internet.de/uwg_2004/__7.html), [BFSG § 1](https://www.gesetze-im-internet.de/bfsg/__1.html), [DSGVO](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de). Abruf: 17. Oktober 2026. Diese Checkliste ist keine Rechtsberatung und begründet keine abschließende Rechtssicherheit.

## Technik, Daten und Sicherheit

- [ ] Produktionsdatenbank und separate Migrations-/Laufzeitrollen erstellen; Runtime darf keine Tabellen oder Rollen anlegen. Activitytabelle nach Möglichkeit nur INSERT/SELECT für Runtime, UPDATE/DELETE nur für eng begrenzte Betriebsrolle.
- [ ] Zufällige Secrets konfigurieren, getrennte Staging-/Produktionsschlüssel, Secret-Manager, Rotation dokumentieren.
- [ ] Admin individuell anlegen; Passwortmanager, MFA/VPN/SSO-Vorsicherung und Berechtigungen prüfen.
- [ ] Origin, vertrauenswürdigen Proxy, IP-Header und Rate Limits testen. Ohne Proxykonfiguration gilt ein gemeinsamer Besucherzähler.
- [ ] HTTPS, Zertifikatserneuerung, Canonicaldomain, HSTS-Eignung und DNS kontrollieren.
- [ ] Versandwarteschlange vor Aktivierung auf Altanfragen prüfen. Echte Testzustellung und n8n-Empfängerintegration freigeben und testen.
- [ ] n8n-Signatur, Zeitfenster, Replay-Speicher und Idempotenz mit dem echten Empfänger prüfen.
- [ ] Backup verschlüsseln, isolierten Restore beim Hoster ausführen und RPO/RTO dokumentieren.
- [ ] Monitoring, fehlgeschlagene/überalterte Outbox, Uptime, Log-Rotation, PII-Filter und Zuständigkeit einrichten.
- [ ] Retention täglich planen; offene Leads regelmäßig abschließen, Datenanfragen und Sperren organisatorisch behandeln.

## Abnahme und Freigabe

- [ ] Frische Installation mit `npm ci`, Migration, Typecheck, Lint, Format, Unit-, Integrations- und E2E-Tests sowie Produktions-Build im Zielsystem ausführen.
- [ ] 320 px, Tablet und Desktop; Tastatur, Fokus, Screenreader-Stichprobe, Formfehler und lange Inhalte prüfen.
- [ ] Kein-JavaScript-Anfrage, 404, echte Datenbankstörung, Wiederanlauf und Provider-Timeout testen.
- [ ] Lighthouse und Core Web Vitals unter realistischen Hosting-/Netzbedingungen messen. Zielwerte sind keine zugesicherten Messergebnisse.
- [ ] Rich-Results-/Schema-Validator extern prüfen; interne Tests prüfen JSON-Struktur und Typen, nicht jede Google-Eignungsregel.
- [ ] Produktionsmetadaten, Sitemap, Robots, Canonicals und kein Admin-Index prüfen.
- [ ] `npm run launch:check` ohne offene Konfigurationspunkte; Textplatzhalter zusätzlich durchsuchen.
- [ ] Nach fachlicher und juristischer Freigabe `SITE_INDEXABLE=true` setzen, neu bauen, Sitemap prüfen.
- [ ] Explizite Freigabe für Veröffentlichung und externe Nachrichten einholen. Diese Auslieferung ist keine solche Freigabe.
