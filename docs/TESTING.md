# Testanleitung

## Getrennte Prüfbereiche

| Bereich                   | Voraussetzung                            | Befehl                                             |
| ------------------------- | ---------------------------------------- | -------------------------------------------------- |
| Unit-/Sicherheitstests    | Installierte Abhängigkeiten              | `npm test`                                         |
| Öffentliche Seiten        | Produktionsserver, kein FORM_SECRET      | `npm run test:public`                              |
| Datenbank/Server-Aktionen | Eigene Testdatenbank, explizite Freigabe | `npm run test:integration`, Datenbank-Browsertests |
| Ausfallverhalten          | Produktionsbuild, Port 3101 frei         | `npm run test:outage`                              |
| Formular-Fehlerzustände   | Eigene Fehlerinstanz auf Port 3101       | `form-state.spec.ts`                               |
| Pakete                    | npm-Registry erreichbar                  | `npm run security:audit`                           |

## Öffentliche Seiten

Im ersten Terminal `npm run build`, danach `npm start`. FORM_SECRET für diesen Lauf leer lassen; SITE_INDEXABLE=false und DELIVERY_ENABLED=false.

Im zweiten Terminal unter PowerShell:

```powershell
$env:TEST_BROWSER_CHANNEL = 'chromium'
$env:TEST_BASE_URL = 'http://localhost:3000'
npx playwright install chromium
npm run test:public
```

Unter POSIX-Shells `export` statt PowerShell-Variablen verwenden. Eine lokal installierte Chrome-Version kann über TEST_BROWSER_CHANNEL=chrome verwendet werden. Die 21 öffentlichen Prüfungen enthalten nun auch `security.spec.ts`: CSP, nicht zugängliche Konfigurationsdateien, abgewiesene Exporte, private Links und fehlerhafte Routen.

## Datenbank und angemeldete Abläufe

Die [Datenbank-Anleitung](DATABASE-SECURITY-TESTS.md) beschreibt die getrennte Datenbank `pw_security_test` und die Webinstanz auf Port 3114. Niemals Produktivdaten verwenden.

```text
npm run test:integration
npx playwright test tests/e2e/backend-security.spec.ts tests/e2e/site.spec.ts
```

Testprozess und Webserver brauchen dieselbe Datenbank, Herkunft und Secrets. Externer Versand bleibt auf der Webinstanz deaktiviert. Versandverträge werden im Testprozess simuliert. Der neue Backend-Sicherheitstest prüft zusätzlich, dass Datenbankname und Host zur isolierten Umgebung passen. Ohne ausdrückliche Freigabe werden dessen Tests übersprungen; das ist kein bestandener Lauf.

## Datenbankausfall

Nach einem Produktionsbuild:

```text
npm run test:outage
```

Das Skript startet selbst eine zusätzliche Instanz auf 127.0.0.1:3101 mit zufälligen Testsecrets, einem absichtlich unerreichbaren Datenbankziel und deaktiviertem Versand. Es prüft Health-Status 503, verständlichen Formularfehler, erhaltene E-Mail-Adresse und ausbleibenden falschen Erfolg. Anschließend beendet es seine Webinstanz.

Für die vier ausführlicheren Tests aus `form-state.spec.ts` dieselbe Fehlerinstanz separat starten: PORT=3101, APP_ORIGIN und SITE_URL=http://127.0.0.1:3101, unerreichbare Test-DATABASE_URL, zwei ausschließlich lokale zufällige Testsecrets und DELIVERY_ENABLED=false. Danach gezielt diese Datei ausführen. Keine laufende echte Datenbank absichtlich abschalten.

## Berichte und CI

Die GitHub-Konfiguration trennt öffentliche Vorschau und eigene PostgreSQL-Testumgebung. Ein grüner Lauf gilt nur für den dort geprüften Commit. Aktuelle lokale Nachweise stehen im [Veröffentlichungsstand](RELEASE-2026-10-24.md), ältere Protokolle sind ausdrücklich historisch.

`npm run test:e2e` ohne Auswahl ist kein einfacher Smoke-Test: Es umfasst auch Datenbank- und Fehlerinstanz-Tests. Automatische axe-Prüfungen ersetzen keinen vollständigen Barrierefreiheitsnachweis. Lokale Tests bestätigen weder echten E-Mail-Empfang noch Docker oder produktives Hosting.
