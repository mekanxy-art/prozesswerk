# Lokale Sicherheitsprüfung vom 24.10.2026

> Dieser Bericht dokumentiert die lokale Prüfung vor der anschließenden Repository-Aktualisierung. Angaben zum damals unveränderten GitHub-Zweig beziehen sich auf diesen Prüfzeitpunkt. Der aktuelle Quellstand und die zusätzliche Repository-Prüfung stehen in [RELEASE-2026-10-24.md](RELEASE-2026-10-24.md).

Geprüft wurde ausschließlich die lokale Prozesswerk-Arbeitsfassung unter http://127.0.0.1:3113 im Produktionsmodus mit Next.js 15.5.28. Keine Änderungen wurden zu GitHub übertragen und keine Website veröffentlicht. Der Hauptzweig wurde abschließend nur gelesen und steht weiterhin auf `aac89b29c062214ce8c09026ba27ad55909ef61b`.

## Korrekturen

- Produktions-CSP: keine beliebigen Inline-Styles mehr. Eigene Stylesheets, Nonce-Styles und genau Next/Images feste Deklaration `color:transparent` über ihren Hash bleiben erlaubt. Konzeptseiten verwenden separate CSS-Dateien. Entwicklung behält die für den Entwicklungsserver erforderlichen Ausnahmen.
- Bestätigungs-/Widerrufsseiten: `Referrer-Policy: strict-origin`, `Cache-Control: private, no-store`, `X-Robots-Tag: noindex, nofollow`.
- Schreibende Server-Aktionen verweigern im Produktionsmodus Anfragen, wenn `APP_ORIGIN` fehlt, ungültig ist oder die Anfrageherkunft abweicht. Beim späteren Betrieb muss die tatsächliche öffentliche Herkunft konfiguriert werden.
- Login: für unbekannte Konten wird ein vorbereiteter Passwort-Hash geprüft. Damit entfällt die zuvor unterschiedliche Anzahl teurer Hash-Berechnungen. Nicht alle zeitlichen Seitenkanäle wurden vermessen.
- Widerrufslinks werden zusätzlich auf ID-/Tokenformat geprüft. Das ist Eingabehärtung; eine vorherige XSS-Ausnutzung wurde nicht nachgewiesen.
- Inhaltsrouten verwenden `Map` statt Zugriff auf normale Objektprototypen. Zuvor erhielten unbekannte Adressen wie `/constructor` eine falsche erfolgreiche Antwort; jetzt liefern sie 404. Keine Codeausführung oder Datenoffenlegung wurde daraus nachgewiesen.
- Sechs Browser-Regressionsprüfungen und ein zusätzlicher Herkunftsprüfungstest ergänzt. Paketprüfung: `npm run security:audit`.
- `.github/dependabot.yml` lokal für spätere Aktualisierungen vorbereitet. Ohne Übertragung wird auf GitHub nichts aktiviert.

## Nachweise

| Prüfung                              | Ergebnis                                                                                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Produktionsfassung                   | Gebaut und mit Next.js gestartet; getestete Build-ID `UlO1RiOLp6NO3sTQUG3r7`                                                  |
| Browser                              | 21 Prüfungen bestanden: sechs Sicherheitsprüfungen, Navigation, Darstellung, Bedienung, Konzeptseiten und Barrierefreiheit    |
| Unit-Tests                           | 11 bestanden                                                                                                                  |
| TypeScript                           | Nach den Quelltextänderungen erfolgreich                                                                                      |
| npm audit                            | Keine gemeldeten Paketlücken, einschließlich Entwicklungsabhängigkeiten; zeitpunktbezogenes Ergebnis                          |
| Zusätzliche ESLint-Sicherheitsregeln | 47 Dateien, 0 Fehler, 25 manuell durchgesehene Warnungen                                                                      |
| OWASP ZAP 2.17.0                     | Passiver Scan von 53 lokalen Antworten; keine High-Meldungen; drei Medium-Meldungen mit niedriger Befundsicherheit verbleiben |

Die 25 ESLint-Warnungen betreffen dynamische Objektzugriffe auf validierte Formular-/Vorlagenschlüssel, bekannte Umgebungsvariablen bzw. Arrays sowie lokale Start-/Exportskript-Dateipfade. Kein weiterer bestätigter Angriffspfad bei der Durchsicht. Das ist kein Beweis vollständiger Sicherheit. Vor der Routenkorrektur waren es 29 Warnungen.

Semgrep Community Edition 1.182.1 konnte in dieser Windows-Ausführungsumgebung wegen `Unix_error: Permission denied socketpair` keinen Scan ausführen. Semgrep zählt ausdrücklich nicht als bestandene Prüfung; zusätzliche statische Prüfung erfolgte mit den genannten ESLint-Regeln.

## Verbleibende ZAP-Meldungen

Vorher: 51 Antworten, 74 Meldungsinstanzen aus sechs Regeln. Nachher: 53 Antworten, 40 Instanzen aus fünf Regeln. Das sind keine Anzahlen nachgewiesener Lücken; neue CSS-Dateien verändern den Umfang leicht. Die Medium-Meldung über allgemein erlaubte Inline-Styles entfällt.

- **Drei Medium-Hinweise, niedrige Befundsicherheit: vermeintlich fehlende CSRF-Tokens** auf Kontakt-, Login- und Einwilligungsformular. Die generische Erkennung erfasst Next.js-Server-Aktionen bzw. anwendungsspezifische Prüfungen nicht vollständig. Es bestehen Herkunftsprüfungen, für das Kontaktformular zusätzlich signierte zeitlich gebundene Formulardaten, für Sitzungen ein HttpOnly-Cookie mit SameSite Strict. Einwilligung benötigt einen zufälligen Bestätigungstoken. Inzwischen sind die vollständigen lokalen Abläufe mit echter Testdatenbank geprüft: gültige Browseranfragen funktionieren, fremde/fehlende/null-Herkunft wird abgewiesen, auch angemeldete fremde Änderungen bleiben ohne Wirkung. Die generischen Scanner-Hinweise sind in diesem Umfang nicht als CSRF-Lücken bestätigt.
- **Token in URLs (informativ):** Diese Links benötigen ihren Token. Neue Header begrenzen Weitergabe und Caching. Browserhistorie, weitergeleitete E-Mails und spätere Server-/Proxyprotokolle bleiben zu beachten; produktives Logging muss Query-Tokens ausblenden.
- **Beeinflussbare HTML-Attribute (informativ):** Bestätigungstoken im versteckten Feld; React maskiert Werte, Format ist begrenzt. Getestete fehlerhafte Widerrufs-ID erzeugt weder ausführbares Markup noch Formular.
- **Verdächtige Kommentare / moderne Webanwendung (informativ):** Generische Hinweise auf Framework-Bundles und weiteren Prüfbedarf; keine nachgewiesene Zugangsschlüssel-Offenlegung.

## Grenzen

Nur eigene lokale Seiten, keine aktiven Angriffsscans, keine Formularübermittlung oder Anmeldung durch ZAP. Keine Produktivdatenbank und kein Systemzertifikat installiert. Werkzeuge getrennt vom Projekt eingerichtet, keine neuen Website-Abhängigkeiten.

Die unten dokumentierten zusätzlichen Datenbankprüfungen schließen die zuvor offenen lokalen Funktionsprüfungen ab. Tatsächliche externe Zustellung wurde weiterhin nur simuliert. Öffentliches Hosting, HTTPS, Proxyvertrauen, verteilte Rate-Limits, Backups und Geheimnisverwaltung müssen mit der tatsächlichen Betriebskonfiguration geprüft werden. Dies ist eine lokale Prüfung und Härtung, kein unabhängiger Penetrationstest und keine Sicherheitsgarantie.

Rohberichte im Ausgabeordner neben dem Projekt: `outputs/security-check-2026-10-24/` mit `npm-audit-after.json`, `eslint-security-before.json`, `eslint-security-after.json`, `zap-before.json`, `zap-after.json`. Sie sind keine öffentlich ausgelieferten Website-Dateien.

## Nachprüfung mit Datenbank

Getrennte portable PostgreSQL-18.4-Testdatenbank `pw_security_test` auf 127.0.0.1:55439, Produktions-Webinstanz auf 127.0.0.1:3114, künstliche Daten und zufällige Passwörter. Keine globale Installation, kein Systemdienst, kein GitHub-Upload.

- Acht neue Datenbank-Browserprüfungen bestanden, ohne übersprungene Tests.
- Neun Backend-Integrationstests einschließlich übergeordnetem Test bestanden.
- Elf Unit-Tests, TypeScript und ESLint bestanden. Die 21 öffentlichen Browserprüfungen wurden nach der Korrektur erneut ausgeführt.
- Nachgewiesen: echter Anfrageeingang und Versandaufträge; Schutz vor doppeltem Eingang, gefälschten/abgelaufenen Formularnachweisen und fremder/fehlender/null-Herkunft.
- Login mit falschem Passwort abgewiesen, gültiger Login erfolgreich, geschütztes Cookie und nur gehashte Sitzung in der Datenbank, Logout widerruft Sitzung. Abgelaufene/manipulierte Sitzungen und entzogene Admin-Rolle verlieren Zugriff. Wiederholte falsche Logins werden begrenzt.
- Berechtigter Admin kann ändern; anonyme und fremde Änderungen trotz gültiger Sitzung bleiben ohne Wirkung.
- Die echte Versandlogik erzeugt bei simuliertem Maildienst Bestätigungs-/Widerrufslinks. Browserbestätigung und Widerruf funktionieren. Fremde Herkunft, manipulierte Token, Wiederverwendung, abgelaufene und unbekannte Bestätigung ändern keine unzulässigen Daten.
- Keine echten Mails oder Webhooks versendet. Backend-Integration prüft simulierte Dienstverträge, Fehler und Wiederholungen.

### Gefundene und korrigierte Regression

Die zuvor ergänzte Richtlinie `no-referrer` ließ Chromium bei nativen Formularübermittlungen `Origin: null` senden. Damit blockierte Next.js auch berechtigte Klicks ohne JavaScript. Jetzt gilt `strict-origin`: Verweisinformation enthält nur die Herkunft ohne Pfad/Query-Token; die POST-Herkunft bleibt prüfbar. Der neue Test kontrolliert die tatsächliche Browserübermittlung ohne JavaScript: korrekte Herkunft, Referer nur `http://127.0.0.1:3114/`, erfolgreiche Bestätigung. Herkunftsprüfung unverändert streng.

Hintergrund: [MDN zur Referrer-Policy und Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy#effect_on_the_origin_header).

Die drei generischen ZAP-Formularhinweise erscheinen im passiven Scan weiterhin. Für die zusätzlich getesteten Abläufe wurde keine Ausnutzung nachgewiesen. Die Rohmeldungen werden nicht gelöscht. Die lokale Funktionsprüfung ist abgeschlossen; echter Hostingbetrieb und echte Dienstzustellung bleiben gesondert zu prüfen.

Nachweise im Ausgabeordner: `backend-browser-run.log`, `backend-integration-final.log`, `public-browser-final.log`. Testkonten und Browser-Testanfragen werden nach dem Testlauf entfernt. Private Testzugangsdaten und Datenbankdateien sind nicht im Projekt-ZIP enthalten.

Nach den Prüfungen wurden die zusätzliche Test-Webinstanz und die Testdatenbank beendet; beide Testports sind geschlossen. Die normale Vorschau auf Port 3113 bleibt verfügbar. GitHub-Hauptzweig abschließend unverändert auf `aac89b29c062214ce8c09026ba27ad55909ef61b` verifiziert.
