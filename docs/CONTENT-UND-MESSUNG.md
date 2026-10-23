# Content-Plan und Messkonzept

Es bestehen drei veröffentlichungsfähige redaktionelle Grundlagenartikel, vorbehaltlich finaler Unternehmens- und Fachprüfung. Weitere Themen bleiben ein Redaktionsplan, keine massenhaft angelegten SEO-Seiten.

| Priorität | Thema                                               | Suchintention                   | Konkreter Inhalt / Nachweis                                                                    |
| --------- | --------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1         | Welche Prozesse zuerst automatisieren?              | Einstieg priorisieren           | Kriterien, eigene Baseline, Ausnahmen; Artikel vorhanden                                       |
| 2         | Was kostet eine n8n-Automatisierung?                | Budget planen                   | Aufwandstreiber und Gesamtkosten; Artikel vorhanden                                            |
| 3         | CRM und n8n verbinden                               | Umsetzung vorbereiten           | Datenhoheit, Deduplizierung, Rechte; Artikel vorhanden                                         |
| 4         | n8n vs. Zapier vs. Make                             | Werkzeug auswählen              | Hosting, Grenzen, Betrieb; aktuelle Originaldokumentation und Preise erst vor Redaktion prüfen |
| 5         | E-Mail-Vertrieb automatisieren: Chancen und Grenzen | Eignung bewerten                | Freigaben, Datenqualität, UWG; juristische Fachprüfung                                         |
| 6         | Datenschutz bei automatisierter Leadgenerierung     | rechtliche Orientierung         | Quellen, Rechtsgrundlagen, Widerspruch; geprüfter Gastbeitrag sinnvoll                         |
| 7         | Automatische Follow-ups mit Kontext                 | Prozesse verbessern             | Antworten stoppen Folgen, Sperrlisten und Freigaben                                            |
| 8         | Typische Fehler bei Prozessautomatisierung          | Probleme vermeiden              | unklare Zuständigkeit, fehlende Ausnahmefälle, keine Messung                                   |
| 9         | Make-or-buy für Automatisierung                     | Umsetzungspartner wählen        | interne Kapazität, Wartung, Übergabe und Lock-in                                               |
| 10        | ROI einer Prozessautomatisierung berechnen          | Investition bewerten            | offen gelegte Beispielrechnung, Kontrollaufwand, Sensitivität                                  |
| 11        | Automatisierung für Agenturen                       | konkreten Anwendungsfall finden | Briefing, Projektstart, Dokumentenfreigabe; als Beispiel markieren                             |
| 12        | Automatisierung für Recruiting                      | Eignung und Risiken verstehen   | Rollen, Löschfristen und menschliche Entscheidungen                                            |
| 13        | n8n im eigenen Betrieb                              | Betriebsmodell wählen           | Updates, Monitoring, Backup und Lizenzprüfung                                                  |
| 14        | Kunden-Onboarding automatisieren                    | Ablauf gestalten                | Eingaben, Verantwortliche, Stoppregeln und Eskalationen                                        |

Jeder Beitrag erhält Suchfrage, Zielgruppe, Autor/Redaktion, Stand, fachliche Prüfung und sinnvolle interne Links. Externe Zahlen nur mit Originalquelle, Datum und Kontext. Aktualisierung mindestens halbjährlich und bei fachlichen Änderungen. Keine garantierten Rankings oder KI-Zitate.

## Messung ohne vorschnelles Tracking

Der Auslieferungsstand hat absichtlich keinen Analyticsdienst und setzt keine Marketingcookies. Leads speichern eine auf 60 harmlose Zeichen begrenzte `utm_source`-Angabe nur bei Absenden; übrige UTM-Parameter werden verworfen. Keine vollständigen URLs, Suchbegriffe, Adressdaten oder Nutzerkennungen speichern. Infrastrukturlogs separat minimieren. Den angemessenen Bezug einer Quelle zu einer Anfrage vor Launch rechtlich bewerten.

| Ereignis                     | Vorbereitung / aktuelle Erfassung                    | Datenminimierung                                               |
| ---------------------------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| Formular gestartet           | Nur Messdefinition, nicht clientseitig erfasst       | Bei späterem Analytics nur Ereigniszähler, keine Feldwerte     |
| Formular erfolgreich         | `LEAD_CREATED` in DB, nur nach Speicherung           | Keine Browserprofile                                           |
| Terminbuchung geklickt       | Nur Messdefinition                                   | Ohne URL-/Personeninhalt zählen                                |
| Leistungsseite angesehen     | Nur Messdefinition                                   | Aggregierte Tageszählung erst nach Konzeptprüfung              |
| Fallstudie/Beispiel geöffnet | Nur Messdefinition                                   | Kein behaupteter Kundenerfolg                                  |
| Kontaktlink geklickt         | Nur Messdefinition                                   | Zielkategorie statt Adresse                                    |
| Organische Landingpage       | Noch keine verlässliche Erkennung                    | Nicht aus fehlender UTM-Quelle auf organisch schließen         |
| Qualifizierte Anfrage        | Status `QUALIFIED` und Aktivitätshistorie            | Im geschützten Bereich                                         |
| Anfragequelle                | Begrenzte Quelle beim Absenden                       | Keine dauerhaften Identifikatoren                              |
| Conversion Rate              | Definition vorbereitet, derzeit kein Besucher-Nenner | Qualifizierte Anfragen / passende Besuche im gleichen Zeitraum |

Entscheidung vor Ausbau: datenschutzfreundliche aggregierte Servermessung oder geprüfter Analyticsanbieter. Einwilligungspflichtige Messung erst nach Zustimmung laden. Consent-Version, Auswahl und Zeitpunkt dokumentieren; Widerruf stoppt weitere Erfassung; Ablehnen gleich leicht wie Akzeptieren. Ohne diese Umsetzung darf kein optionaler Analysedienst aktiviert werden. Keine stille Ersatzmessung über Fingerprinting.
