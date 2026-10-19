# Beiträge und Weiterentwicklung

Das Repository ist zunächst ein persönliches Portfolio-Projekt. Eine Veröffentlichung allein vergibt noch keine Open-Source-Lizenz; siehe [RIGHTS.md](RIGHTS.md).

Für vorgeschlagene Änderungen bitte Problem, erwartetes Verhalten und eine nachvollziehbare Prüfung beschreiben. Bei sichtbaren Änderungen einen Desktop- und Mobil-Screenshot ergänzen. Für kleine Inhaltskorrekturen genügt eine Sichtprüfung; für Verhaltensänderungen passende vorhandene Tests ausführen oder gezielt erweitern.

Vor einem Pull Request:

```sh
npm run typecheck
npm run lint
npm test
```

Relevante öffentliche Browsertests beschreibt [TESTING.md](docs/TESTING.md). Keine `.env`-Dateien, Zugangsdaten, Datenbankkopien, echten Anfragen oder Testberichte mit personenbezogenen Daten einreichen. Sicherheitslücken nicht als öffentliches Issue melden; siehe [SECURITY.md](SECURITY.md).

Commit-Nachrichten sollen den Zweck knapp beschreiben, zum Beispiel `docs: clarify local preview setup` oder `fix: preserve enquiry values after validation errors`.
