# Architektur und Annahmen

> Historischer Entwicklungs- bzw. Prüfstand. Aussagen zu damaliger Gestaltung, Testzahlen und fehlenden Datenbankprüfungen gelten für diese Phase. Aktueller Stand: [Veröffentlichungsprüfung vom 24.10.2026](RELEASE-2026-10-24.md).

## Ausgangslage und Grenzen

Leeres Projekt, keine Unternehmensdaten, kein Hostingkonto, keine echte Domain, kein E-Mail-Dienst und kein n8n-Endpunkt. Die Lösung wird lokal geliefert. Keine Veröffentlichung und keine externen Nachrichten sind autorisiert. Der sichtbare Name bleibt `[FIRMENNAME]`; „prozesswerk“ ist nur der Projektordner, keine behauptete Marke.

Next.js 15 App Router, React 19, strict TypeScript, CSS mit zentralen Designvariablen, PostgreSQL und Prisma 6. Versionen und transitive Sicherheitskorrekturen sind im Lockfile festgehalten. Systemschriften, eigene CSS-Prozessgrafik, keine Bilder von Dritten, kein Tracking. Next 15 ist bewusst als überprüfte Versionslinie gewählt; vor Launch Supportstatus und neue Advisories erneut prüfen.

## Nutzerführung und Inhalt

Start → Leistung / Anwendungsfall → Vorgehensweise / Beispiel → kostenlose Prozessanalyse. Der zweite Einstieg führt über drei Fachartikel. Jede der drei Leistungsseiten hat einen eigenen fachlichen Schwerpunkt. `/kontakt` sammelt Anfragen; `/termin` bietet entweder einen geprüften externen Link oder die Anfrage an. Beispiele sind ausdrücklich keine Referenzen.

Öffentliche Seiten: `/`, `/leistungen`, drei Detailseiten unter `/leistungen/`, `/loesungen`, `/vorgehensweise`, `/beispiele`, `/ueber-uns`, `/kontakt`, `/termin`, `/faq`, `/wissen` und drei Artikel, `/impressum`, `/datenschutz`, `/cookie-einstellungen`, `/danke`, 404. Einwilligungs- und Widerrufsseiten sowie `/admin` ergänzen die Struktur.

## Datenfluss

1. HTML-Formular mit signiertem, zeitlich begrenztem Token und Honeypot. Zentrale Funktion ohne Browser-JavaScript nutzbar.
2. Server Action prüft Origin, Mindestdauer, Token, Zod-Schema und gemeinsame Datenbanklimits. Limits verwenden rotierende HMAC-Schlüssel; Roh-IP wird nicht gespeichert. Ohne vertrauenswürdigen Proxy gilt vorsichtig ein gemeinsamer Besucherzähler.
3. Eine Transaktion erzeugt Lead, Aktivität und Outbox-Aufträge. Ein eindeutiger Anfrageschlüssel verhindert doppelte Speicherung. Erfolg bedeutet „in Datenbank gespeichert“, nicht „E-Mail zugestellt“.
4. Ein separater Worker beansprucht Aufträge atomar mit zeitlich begrenztem Lock und Claim-Token. Nach acht Sekunden bricht ein externer Aufruf ab. Maximal fünf Versuche mit exponentieller Verzögerung; Fehler bleiben im Admin sichtbar und können nach Prüfung erneut eingereiht werden.
5. Resend erhält eine stabile Idempotency-ID. Interne Nachricht enthält nur einen Link zur geschützten Ansicht. Externe Zustellung ist standardmäßig deaktiviert.
6. n8n erhält eine HMAC-SHA256-Signatur über `timestamp.body`, Unix-Zeitstempel und stabile Ereignis-ID. Empfänger muss Signatur, Zeitfenster und dauerhafte Ereignis-ID-Deduplizierung prüfen. Ein transaktionales Empfängerbeispiel befindet sich in `examples/n8n-receiver.ts`; die nachgelagerte fachliche Verarbeitung ist beim echten Empfänger in dieselbe Transaktion beziehungsweise eine eigene Inbox/Outbox aufzunehmen.

E-Mail und Webhooks bieten keine atomare Transaktion mit einem fremden Dienst. Nach einem Absturz kann eine Zustellung erneut versucht werden. Empfänger-Idempotenz ist daher verbindlich; „exactly once“ wird nicht behauptet.

## Zugriff und Datensicherheit

Admin-Konten werden nur per Betriebsskript angelegt. scrypt mit individuellem Salt, zufällige opaque Session, nur der SHA256-Digest wird gespeichert. Acht Stunden absolute Laufzeit; HttpOnly, SameSite Strict und Secure im Produktionsmodus. Rollenprüfung in jeder lesenden und schreibenden Operation, CSV eingeschlossen. Passwortwechsel widerruft bestehende Sitzungen. Kein öffentliches Anlegen von Konten, kein vorgegebenes Passwort. Für exponierten Produktivbetrieb zusätzlich vorgeschaltetes VPN/SSO mit MFA prüfen.

Prisma parametrisiert Datenbankoperationen, React maskiert Textausgaben. Kein HTML aus Formulardaten. CSV entschärft Formelpräfixe. Änderungen erzeugen anhängende Aktivitäten; eine kryptografisch manipulationssichere Revisionierung wird nicht behauptet. Origin-Prüfung plus die Next-Server-Action-Prüfungen schützen Mutationen vor Cross-Site-Anfragen.

Nonce-basierte CSP für Skripte; inline Styles bleiben für Next/React-Oberflächen erlaubt. Keine Frames, Objekte oder fremden Skripte. Nonces erfordern dynamisches Server-Rendering; öffentliche Inhalte sind bereits im HTML und brauchen zur Lesbarkeit kein JavaScript. Das ist die bewusste Abwägung gegenüber vollständiger statischer Generierung. HSTS nur im Produktionsmodus und erst hinter richtig eingerichtetem HTTPS einsetzen.

## Einwilligung und Aufbewahrung

Kein optionaler Trackingdienst, kein öffentlicher Cookie, keine eingebetteten Kalender. Die Formularkennung ist kurzlebiger Formularzustand und kein Tracking. Datenschutz-Checkbox dokumentiert Kenntnisnahme; sie wird nicht als pauschale Einwilligung zur Bearbeitung ausgegeben. Marketing ist separat, nicht vorausgewählt und erst nach Double-Opt-in bestätigt. Öffnen eines Links allein bestätigt nichts. Widerruf setzt Widerspruch und Sperrstatus. Es gibt keinen Kampagnenversand.

Die Löschroutine entfernt nur geschlossene, nicht gesperrte Leads nach konfigurierbarer Inaktivität (Voreinstellung 180 Tage). Sperreinträge werden nicht automatisch entfernt, damit Widersprüche nicht verloren gehen; dafür ist eine gesonderte, minimierte und juristisch geprüfte Aufbewahrungsregel erforderlich. Offene Leads müssen regelmäßig auf Abschluss geprüft werden. Erfolgreiche Projekte gehören in einen getrennten Aufbewahrungsprozess.

## SEO und Auffindbarkeit

Individuelle Titel, Beschreibungen, Canonicals, Open Graph, Sitemap und Robots. Vorschaustand global `noindex` und gesperrte Sitemap. Nichtöffentliche Seiten zusätzlich `noindex`. Robots ist kein Zugriffsschutz. Organization-Daten werden erst bei vervollständigter Konfiguration ausgegeben; Service, sichtbare FAQ, Breadcrumbs und Artikel erhalten passende strukturierte Daten. Kein LocalBusiness ohne reale Adresse, keine Bewertungen. Hilfreiche Definitionen, direkte Antworten und sichtbare Artikelstände unterstützen die Erfassbarkeit; Zitierungen durch KI-Systeme werden nicht versprochen.

URL-Änderungen: alte und neue URL dokumentieren, gezielte permanente 308-Weiterleitung in `next.config.ts` ergänzen, interne Links und Canonical aktualisieren; keine pauschale Umleitung gelöschter Inhalte auf die Startseite. Echte fehlende Inhalte liefern 404.
