# Installation, Deployment und Betrieb

## Lokal

Voraussetzungen: Node.js 22 LTS, npm, PostgreSQL 16 oder neuer. Docker ist optional. Keine Konten bei externen Diensten sind für Seiten und Speicherung erforderlich.

```sh
npm ci
cp .env.example .env
# DATABASE_URL, APP_ORIGIN, NEXT_PUBLIC_SITE_URL konfigurieren.
# FORM_SECRET und RATE_LIMIT_SECRET unabhängig mit 32 zufälligen Bytes erzeugen.
npm run db:deploy
npm run dev
```

`http://localhost:3000` verwenden; `APP_ORIGIN` muss exakt zum Browser-Ursprung passen. `127.0.0.1` und `localhost` sind unterschiedliche Origins. Fehlende Secrets deaktivieren das Formular sichtbar. `DELIVERY_ENABLED=false` verhindert E-Mails und Webhooks, Leads und Aufträge werden trotzdem gespeichert. Testdaten nicht in der Produktionsdatenbank verwenden. In dieser Arbeitsumgebung wurde PostgreSQL 18.4 aus einem temporären Runtimepaket nur für lokale Tests gestartet; es ist keine Produktivinstallation.

Admin: `ADMIN_EMAIL` und ein mindestens 16 Zeichen langes `ADMIN_PASSWORD` als temporäre Umgebungsvariablen setzen, dann `npm run admin:create`. Keine Secrets in die Shell-Historie schreiben; sicheren Secret-Manager oder verdeckte Eingabe verwenden. Variablen danach entfernen. Der Admin ist unter `/admin` erreichbar. Das Skript aktualisiert auch Passwörter und widerruft alle Sitzungen des Kontos. Es gibt keine Beispielleads im Produktiv-Seed.

## Prüfungen

Aktuelle Befehle, Voraussetzungen und Ports: [TESTING.md](TESTING.md). Für die reine Vorschau genügen `npm run typecheck`, `npm run lint`, `npm test` und nach einem Produktionsbuild `npm run test:public`. Datenbankprüfungen benötigen eine ausdrücklich freigegebene separate Testumgebung; die neuen Sicherheitstests verwenden Port 3114. `npm run test:outage` startet selbst eine Fehlerinstanz auf Port 3101. Keine Tests gegen Produktivdaten.

## Docker

In `.env` zusätzlich `POSTGRES_PASSWORD` setzen (URL-sicher, zufällig); Compose ersetzt die Datenbank-URL mit dem internen Ziel. Das Beispiel bündelt zum einfachen Einstieg Datenbank und App. Die Datenbank ist nur an Loopback gebunden. Für Produktion bevorzugt getrennte Datenbankkonten für Migration und Laufzeit erstellen. Der Compose-Datenbankbenutzer ist ein Bootstrap-Konto mit zu weitgehenden Rechten für den Dauerbetrieb.

```sh
docker compose up --build -d
docker compose logs --tail=100 web worker
docker compose run --rm migrate
```

Das Runtime-Image führt nur den Standalone-Server als unprivilegierter Benutzer aus. Das separate Operations-Image enthält Prisma und TypeScript-Werkzeuge für Migration und Worker. Der Worker läuft alle 30 Sekunden. Die Retention-Routine täglich über den Scheduler des Hostingbetriebs starten: `docker compose run --rm worker npm run retention`. Kein automatischer Seed. Container-Build und Compose sind hier mangels Docker nicht ausgeführt worden.

Sitemap und Robots werden dynamisch aus der Runtimekonfiguration erzeugt. Für Produktion `SITE_URL`, `APP_ORIGIN` und die Unternehmensangaben zur Laufzeit setzen; `NEXT_PUBLIC_SITE_URL` dient nur als älterer Build-Fallback. Servergeheimnisse niemals in Docker-Build-Argumente schreiben. Sie gehören ausschließlich in Runtime-Secrets. Der ausgelieferte Stand bleibt absichtlich nicht indexierbar, bis `SITE_INDEXABLE=true` gesetzt wird.

## Hosting und HTTPS

EU-Region mit vertraglich festgelegter Verarbeitung, Auftragsverarbeitung, Backup-Region und Unterauftragnehmern wählen. Keine Anbieterfreigabe aus dieser Dokumentation ableiten. Vor dem Server einen TLS-Reverse-Proxy betreiben, der Größenlimits, HTTPS-Weiterleitung und zuverlässige IP-Header setzt. `TRUST_PROXY=true` erst setzen, wenn der Proxy `X-Real-IP` überschreibt und direkte Zugriffe auf die App unterbunden sind. Sonst zählt das Limit aus Sicherheitsgründen Besucher gemeinsam.

DNS: A/AAAA oder CNAME gemäß Hoster setzen, Apex/WWW auf eine kanonische Domain umleiten, Zertifikat und Erneuerung prüfen. E-Mail-Absenderdomain mit SPF, DKIM und DMARC konfigurieren und Zustelltests durchführen. HSTS auf Subdomains erst nach vollständiger HTTPS-Prüfung aktivieren. Kein HSTS-Preload automatisch beantragen.

## E-Mail und n8n aktivieren

1. Anbieter, Verarbeitung und Verträge prüfen. Resend ist als serverseitige HTTP-Anbindung implementiert, seine Eignung und Region sind offen.
2. `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_INTERNAL_TO` und echte `COMPANY_EMAIL` setzen. Testpostfach verwenden, keine fremden Empfänger ohne Freigabe.
3. Optional `N8N_WEBHOOK_URL` und unabhängiges `N8N_SIGNING_SECRET` setzen. Nur HTTPS ist im normalen Betrieb erlaubt. `ALLOW_LOCAL_WEBHOOK_TEST` ist ausschließlich für lokale Tests vorgesehen und gehört nicht in Produktion.
4. Auf n8n-Seite einen verifizierenden Eingang mit 5-Minuten-Zeitfenster, persistentem Event-ID-Speicher und transaktionaler Verarbeitung implementieren. Das Beispiel zeigt die Sicherheitslogik, ist aber kein fertig eingerichteter n8n-Server. Betriebssystemzeiten synchronisieren. Netzwerkseitig nur notwendige Ziele zulassen.
5. Alte wartende Aufträge vor Aktivierung prüfen: `DELIVERY_ENABLED=true` verarbeitet auch bereits gespeicherte Anfragen. Nicht einfach mit echten Daten einschalten.
6. `npm run worker` für einen Batch oder den Compose-Worker für Dauerbetrieb verwenden. Erfolgreiche Zustellung, Wiederholungen, Ausfälle und Sperrstatus mit einer Staginginstanz prüfen.

## Überwachung, Backup und Wiederherstellung

`/api/health` prüft die Datenbank ohne interne Details. Externen Uptime-Check im Minutenintervall konfigurieren, Alarm nach mehreren Fehlern. Aus der Outbox Zahl fehlgeschlagener Aufträge und Alter des ältesten wartenden Auftrags überwachen; bei deaktiviertem Versand sind wartende Aufträge erwartbar. Workerfehler werden als strukturierte Codes ohne Formularinhalt protokolliert. Infrastruktur-Logs ohne Querystrings konfigurieren; Einwilligungslinks enthalten Tokens. Kein Error-Tracking-Drittanbieter ist eingebaut. Bei späterer Nutzung PII-Filter, AVV, Region und Rechtsgrundlage prüfen.

Täglich verschlüsselte Backups, zusätzlicher gesicherter Speicher in vereinbarter Region; beispielhafte Backupfrist 30 Tage erst rechtlich/betrieblich freigeben. Bei höherem Schutzbedarf WAL/PITR ergänzen. Beispielwerkzeuge:

```sh
pg_dump --format=custom --file=backup.dump "$DATABASE_URL"
# Nur in separat angelegter, leerer Wiederherstellungsdatenbank:
pg_restore --no-owner --no-acl --dbname="$RESTORE_DATABASE_URL" backup.dump
```

Backups nicht im Repository ablegen. Eigene Backuprolle verwenden. Mindestens monatlich Wiederherstellung isoliert testen: Migrationsstand, Anzahl Datensätze, Stichproben und Login prüfen; Versand dabei deaktivieren. RPO/RTO vor Betrieb vereinbaren und messen. Zurückgespielte Sperren und zwischenzeitliche Löschungen berücksichtigen. Ein lokaler Dump/Restore-Test wird im Prüfbericht separat ausgewiesen; er ersetzt keinen Hoster-Restore-Test.

## Updates und Rollback

Abhängigkeiten wöchentlich prüfen, kritische Advisories priorisieren. Änderungen per Lockfile, Staging und Tests freigeben. Nach Deployment Health, Login, Anfrage und Outbox prüfen. Vor Schemaänderungen Backup, rückwärtskompatible Expand/Contract-Migrationen bevorzugen. Rollback auf zuvor getestetes Image/Commit, solange Schema kompatibel bleibt. Keine automatische destruktive Rückmigration. Wartungsfenster und Restore nutzen, wenn Datenänderungen inkompatibel sind.

Logs rotieren (Compose: 3 × 10 MB), Zugriffe beschränken. Datenbank-Activitytabelle als Betriebsprotokoll behandeln; keine notarielle oder unveränderliche Revisionierung behaupten. Tägliche Retention und quartalsweise Berechtigungsprüfung organisatorisch zuweisen.
