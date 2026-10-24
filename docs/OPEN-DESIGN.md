# Prozesswerk mit Open Design überarbeitet

> Historischer Entwicklungs- bzw. Prüfstand. Aussagen zu damaliger Gestaltung, Testzahlen und fehlenden Datenbankprüfungen gelten für diese Phase. Aktueller Stand: [Veröffentlichungsprüfung vom 24.10.2026](RELEASE-2026-10-24.md).

## Tatsächliche Nutzung der Referenz

Die öffentlich verfügbaren Leitfäden aus [nexu-io/open-design](https://github.com/nexu-io/open-design) wurden direkt für die bestehende Next.js-Website angewandt. Es wurde keine zusätzliche Open-Design-Desktop-App installiert und kein externer KI-Dienst mit Projekt- oder Kundendaten verbunden.

Referenzstand: `e03d5c23f308c39f4de7c057568df66c29a84385`.

- [Redesign Skill](https://github.com/nexu-io/open-design/blob/e03d5c23f308c39f4de7c057568df66c29a84385/skills/redesign-skill/SKILL.md): Bestand prüfen, Typografie und Flächen ordnen, Änderungen im vorhandenen Stack halten.
- [UI Animation](https://github.com/nexu-io/open-design/blob/e03d5c23f308c39f4de7c057568df66c29a84385/skills/ui-animation/SKILL.md) und [Entscheidungsrahmen](https://github.com/nexu-io/open-design/blob/e03d5c23f308c39f4de7c057568df66c29a84385/skills/ui-animation/references/decision-framework.md): Bewegung für Rückmeldung und Orientierung, kurze Übergänge, reduzierte Bewegung beachten.
- [Code-Migration-Szenario](https://github.com/nexu-io/open-design/blob/e03d5c23f308c39f4de7c057568df66c29a84385/plugins/_official/scenarios/od-code-migration/SKILL.md): Bestand aufnehmen, Gestaltung festhalten, gezielt ändern, bauen und prüfen.

Dies ist eine eigene Umsetzung für Prozesswerk anhand dieser Methoden. Es wurden keine fremden Markenbilder oder fertigen Seitentemplates übernommen.

## Änderungen

- Heller Einstieg mit warmen Flächen, klaren Aktionen und eigenem Bereich für das bestehende Maskottchen.
- Zwei gleich aufgebaute Leistungsbereiche auf der Startseite, mit gut lesbaren Beschreibungen und sichtbaren Verweisen.
- Kompaktere Einstiege auf Unterseiten; das Maskottchen wird vollständig gezeigt.
- Aktive Navigation ist sichtbar. Menü und Prozessbeispiele erhalten kurze Übergänge; bestehende Tastaturführung bleibt erhalten.
- Die Einstellung für reduzierte Bewegung und die Lauftext-Pause bleiben erhalten.
- Eine vorhandene Hydration-Warnung an JSON-LD-Skripten wird für das vom Browser verborgene Nonce-Attribut begrenzt unterdrückt. Die Nonce und die Content-Security-Policy bleiben erhalten.

## Abgrenzung

Die Änderung betrifft Gestaltung und Bedienung. Unternehmensangaben bleiben im Entwicklungsstand und das Kontaktformular versendet ohne Backend-Konfiguration keine Anfragen. Kein öffentliches Hosting wurde neu freigeschaltet. Keine Datenbankmigration und kein Frameworkwechsel.

## Prüfung am 24.10.2026

- Produktions-Build erfolgreich, anschließend die gebaute Anwendung lokal geprüft.
- 13 öffentliche Browserprüfungen bestanden: Routen und interne Verweise, Navigation und Zurück-Funktion, Tastaturführung, Prozessauswahl, reduzierte Bewegung, Darstellung ohne JavaScript, Barrierefreiheitsprüfungen und Breiten von 320 bis 1440 Pixeln.
- 10 bestehende Validierungs-/Sicherheitstests bestanden; TypeScript-Prüfung erfolgreich.
- Beim abschließenden Laden und Bedienen wurden keine JavaScript- oder Hydration-Fehler in der Browserkonsole beobachtet.
- Die allgemeinen Datenbank-/Formular-Integrationstests benötigen eine separate, konfigurierte Testumgebung. Ein versuchsweiser Gesamtlauf konnte diese Tests wegen fehlender Voraussetzungen nicht ausführen; die für diese Designänderung vorgesehenen öffentlichen Tests wurden danach auf der Produktionsversion vollständig erfolgreich ausgeführt.
- Zwei bestehende Scrolltests verwenden nun eine geringere Fensterhöhe, damit das Ziel im kompakteren Layout tatsächlich außerhalb des ersten sichtbaren Bereichs liegt. Der geprüfte Funktionsumfang bleibt gleich.
