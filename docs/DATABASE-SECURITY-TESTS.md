# Datenbankgestützte Sicherheitsprüfungen

`tests/e2e/backend-security.spec.ts` setzt ausdrücklich eine eigene lokale PostgreSQL-Testdatenbank voraus. Niemals echte Daten verwenden. Tests und Bereinigung verändern ausschließlich diese Testdatenbank. Die zusätzlichen Browserprüfungen werden ohne `ALLOW_DATABASE_TESTS=true` übersprungen; übersprungen bedeutet nicht bestanden.

## Vorbereitung

Eine eigene Datenbank `pw_security_test` mit eigenem Testbenutzer erstellen, PostgreSQL nur auf Loopback binden. Im lokalen Terminal folgende Variablen setzen, niemals Zugangsdaten veröffentlichen:

- `DATABASE_URL`: Verbindung zur eigens erstellten Datenbank auf localhost oder 127.0.0.1.
- `FORM_SECRET`, `RATE_LIMIT_SECRET`: unabhängig erzeugte zufällige Werte mit jeweils mindestens 32 Zeichen.
- `ALLOW_DATABASE_TESTS=true`, `DELIVERY_ENABLED=false`, `TRUST_PROXY=false`.
- `APP_ORIGIN=http://127.0.0.1:3114`, `SITE_URL=http://127.0.0.1:3114`, `TEST_BASE_URL=http://127.0.0.1:3114`, `PORT=3114`.
- `TEST_BROWSER_CHANNEL=chrome` für die hier geprüfte Chrome-Installation.
- Optional `TEST_ADMIN_EMAIL` und zufälliges `TEST_ADMIN_PASSWORD`. Ohne Angaben erzeugt der Test sein Passwort zufällig und nutzt eine reservierte example.invalid-Adresse.

Mit diesem Umfeld im Projekt `npm run db:deploy` ausführen, dann `npm run build` und `npm start`. Wird `PROZESSWERK_BUILD_DIR` verwendet, muss der Wert bei Build und Start identisch sein. Keine bereits laufende Website desselben Buildordners während eines neuen Builds weiterverwenden.

In einem zweiten Terminal mit denselben Variablen:

```text
npm run test:integration
npx playwright test tests/e2e/backend-security.spec.ts --reporter=list
```

Die Testdatei verweigert nichtlokale Datenbankadressen, andere Datenbanknamen, aktivierten externen Webversand und eine andere Vorschauadresse als Port 3114. Testkonten und angelegte Browser-Testanfragen werden anschließend entfernt. Danach zusätzliche Webinstanz und Datenbank beenden.

Der Webversand bleibt deaktiviert. Nur in isolierten Testprozessen werden externe Dienstantworten simuliert, damit die echte Versandlogik ohne tatsächliche E-Mail/Webhook-Zustellung geprüft werden kann.

## Durchgeführte lokale Prüfung

Am 24.10.2026 liefen acht neue Datenbank-Browserprüfungen ohne übersprungene Tests sowie neun Backend-Integrationstests einschließlich übergeordnetem Test erfolgreich. PostgreSQL 18.4 wurde portabel unter `work/security-tools/postgres-local-test` eingerichtet, ohne Systemdienst oder globale Installation. Private Testzugangsdaten, PostgreSQL-Dateien und Werkzeuge gehören nicht zum Quellprojekt-ZIP. Ergebnisse stehen in `SECURITY-REVIEW-2026-10-24.md`.
