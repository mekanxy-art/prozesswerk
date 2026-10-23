# Testanleitung

## Drei getrennte Prüfbereiche

| Bereich                      | Voraussetzung                                       | Ausführung                                              |
| ---------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| Unit-/Sicherheitstests       | Installierte Abhängigkeiten                         | `npm test`                                              |
| Öffentliche Seiten           | Produktionsserver im Vorschaumodus, Chromium        | Die fünf im README genannten `*.spec.ts`-Dateien        |
| Datenbank und Formularfehler | Separate, ausdrücklich konfigurierte Testumgebungen | Integrationstests, `site.spec.ts`, `form-state.spec.ts` |

## Öffentliche Seiten unter PowerShell

Erstes Terminal im Projektordner: `npm run build`, danach `npm start`. `FORM_SECRET` darf für diese Tests nicht gesetzt sein, `SITE_INDEXABLE` bleibt `false`.

Zweites Terminal:

```powershell
$env:TEST_BROWSER_CHANNEL = 'chromium'
$env:TEST_BASE_URL = 'http://localhost:3000'
npx playwright install chromium
npm run test:e2e -- tests/e2e/design.spec.ts tests/e2e/offering.spec.ts tests/e2e/studio.spec.ts tests/e2e/motion.spec.ts tests/e2e/master.spec.ts
```

Unter einer POSIX-Shell stattdessen `export TEST_BROWSER_CHANNEL=chromium` und `export TEST_BASE_URL=http://localhost:3000` verwenden.

## Isolierte Formular-Fehlerinstanz

`form-state.spec.ts` greift fest auf `http://127.0.0.1:3101` zu. Dafür den gebauten Server separat mit folgenden Umgebungsvariablen starten. Das Datenbankziel muss absichtlich unerreichbar sein:

```powershell
$env:PORT = '3101'
$env:APP_ORIGIN = 'http://127.0.0.1:3101'
$env:SITE_URL = 'http://127.0.0.1:3101'
$env:DATABASE_URL = 'postgresql://qa:qa@127.0.0.1:1/unavailable?connect_timeout=1'
$env:FORM_SECRET = 'local-form-error-test-secret-32-characters-minimum'
$env:RATE_LIMIT_SECRET = 'local-rate-error-test-secret-different-32-characters'
$env:DELIVERY_ENABLED = 'false'
npm start
```

Die beiden Secrets sind öffentlich dokumentierte, ausschließlich lokale Testwerte. Niemals produktiv verwenden. Im zweiten Terminal mit Chromium-Kanal `npm run test:e2e -- tests/e2e/form-state.spec.ts` ausführen. Diese Tests bestätigen Fehlerbehandlung, keine erfolgreiche Datenbankspeicherung.

## Datenbanktests

`npm run test:integration` und `tests/e2e/site.spec.ts` legen Datensätze an. Eine eigene wegwerfbare PostgreSQL-Datenbank bereitstellen, Migrationen anwenden und `ALLOW_DATABASE_TESTS=true` setzen. Testprozess und zugehöriger Server müssen dieselbe Datenbank verwenden. Für `site.spec.ts` gelten zusätzlich die Konfiguration und Admin-Testabläufe in [BETRIEB.md](BETRIEB.md).

`npm run test:e2e` ohne Dateiauswahl ist kein einfacher Smoke-Test: Es nimmt auch die getrennten Datenbank- und Fehlerinstanz-Tests auf.

## Berichte richtig einordnen

Der [Prüfbericht vom 19.10.2026](TESTPROTOKOLL-MASTER.md) dokumentiert einen historischen lokalen Lauf. Ein neuer GitHub-Actions-Lauf ist ein eigener Nachweis. Automatische axe-Prüfungen ersetzen keinen vollständigen Barrierefreiheitsnachweis; Unit-Tests ersetzen keinen Penetrationstest. Docker, reale E-Mail-Zustellung und eine öffentliche Hostingumgebung sind damit nicht bestätigt.
