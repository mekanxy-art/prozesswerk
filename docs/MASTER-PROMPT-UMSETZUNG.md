# Umsetzung des Website-Master-Prompts

> Historischer Entwicklungs- bzw. Prüfstand. Aussagen zu damaliger Gestaltung, Testzahlen und fehlenden Datenbankprüfungen gelten für diese Phase. Aktueller Stand: [Veröffentlichungsprüfung vom 24.10.2026](RELEASE-2026-10-24.md).

Stand: 19. Oktober 2026. Status: **mit Einschränkungen – lokale Vorschau, kein freigegebener Live-Betrieb**.

## 1. Auftrag, Zielgruppe und Annahmen

Die bestehende Prozesswerk-Website wird verbessert, nicht durch einen neuen Technologiestapel ersetzt. Zielgruppe sind kleine und mittelständische Unternehmen mit Bedarf an Websites, Shopify-Shops oder einfacheren internen Abläufen. Hauptaufgabe: das passende Angebot verstehen und ein kostenloses Erstgespräch anfragen. Bisherige Vorgaben bleiben erhalten: orangefarbenes Maskottchen, dunkle Flächen, limettengrüne Akzente, zwei gleichwertig gegliederte Leistungsbereiche und bestehende Unterseiten.

Prozesswerk ist der vorhandene Projektname; echte Betreiberidentität, Sitz und Einzugsgebiet sind weiterhin nicht angegeben. Es werden keine Teammitglieder, Kundenreferenzen, Zertifikate, Standorte oder Ergebniszahlen erfunden. Die Seite verkauft selbst keine Waren und wickelt keine Zahlungen ab; sie beschreibt unter anderem die Leistung, Shopify-Shops für Kunden zu erstellen.

Drei Verbesserungshypothesen vor der Umsetzung:

1. Angebot unmittelbar im Einstieg nennen: Besucher können Websites, Shops und Automatisierung schneller zuordnen.
2. Anfrage auf Name, E-Mail und Vorhaben als Pflichtangaben reduzieren: weniger unnötiger Aufwand beim Erstkontakt.
3. Inhalte ohne Verdeckungen und Warteanimationen zeigen: direkterer Zugang, besseres Verhalten bei Tastaturbedienung und eingeschränkter Bewegung.

Diese Wirkungen sind Hypothesen. Ein Test mit drei bis fünf tatsächlichen Interessenten bleibt offen.

## 2. Bestand, Sicherung und Architektur

Vor Änderungen wurde die vorherige Quellcode-Lieferung unter work/prozesswerk-vor-master-prompt.zip gesichert. SHA-256: 6DEA9514DBEFF2303881F9B9F42365063D8176CD2640F78AE63F5F3EB325D32E.

Die vorhandene Architektur bleibt: Next.js App Router, React, TypeScript, selbst gestaltete Komponenten und vorhandene PostgreSQL-/Prisma-Anbindung mit Outbox und Administration. Es wurden kein weiteres Framework, kein CMS, keine Analyseplattform und keine neue Bibliothek installiert. Login und Datenbank wurden bereits im Ausgangsprojekt verwendet; sie wurden nicht aus Designgründen hinzugefügt. Eine echte Datenbank wurde bei dieser Überarbeitung nicht verändert.

Der Standardbuild und npm start verwenden nun die normale Next.js-Auslieferung. Docker aktiviert BUILD_STANDALONE=true und behält seinen bisherigen Standalone-Betrieb. PROZESSWERK_BUILD_DIR erlaubt ein getrenntes lokales Buildverzeichnis. Dies war in dieser Windows-Umgebung nötig, weil erneute Schreibzugriffe auf vorhandene Buildverzeichnisse mit EPERM scheiterten. Ein frisches Buildverzeichnis wurde erfolgreich kompiliert. Die lokale Sonderkonfiguration nutzt einen seriellen Build ohne separaten Webpack-Buildworker; der Standardmodus ist davon nicht betroffen. Docker wurde hier nicht ausgeführt.

## 3. Sitemap und zentrale Nutzerwege

- Startseite → zwei Leistungsbereiche → jeweilige Leistungen → Projektanfrage.
- Websites & Online-Shops → Website erstellen; Website optimieren; SEO-Grundlagen; Shopify-Shop erstellen; Shopify-Migration.
- Prozesse & Automatisierung → eine gemeinsame Leistung mit Beispielen zu Anfragen, Dokumenten und Onboarding; Analyse, Vereinfachung, Verbindung und Test sind die Vorgehensweise.
- Beispiele, Lösungen, Vorgehensweise, Wissen mit Fachartikeln, Über uns und FAQ bleiben direkt erreichbar.
- Kontakt → Formularprüfung → Speicherung und Outbox → Danke-Seite erst nach erfolgreicher Verarbeitung des Formulars. Ein direkter Aufruf der Danke-Seite ist kein Nachweis eines Speichervorgangs.
- Impressum, Datenschutz, Einstellungen sowie bestehende Admin- und Einwilligungsrouten bleiben erhalten.

Bestehende URLs und die Anker leistungen, entdecken und moeglichkeiten bleiben erhalten. Es gab keinen Anlass für pauschale Weiterleitungen oder neue Such-/Filterfunktionen.

## 4. Referenzanalyse und Designentscheidung

Die folgenden Seiten wurden am 19.10.2026 textlich abgerufen. UNHYDE war zuvor in dieser Unterhaltung auch im Browser visuell betrachtet worden. Für Apple und GOV.UK wird ausdrücklich keine vollständige visuelle oder interaktive Prüfung behauptet.

| Referenz / Bereich                                                   | Beobachtetes Prinzip                                                        | Übertragung                                                                               | Grenze                                                                                                              |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [UNHYDE – Start und Leistungen](https://www.unhyde.me/de)            | Große Typografie, getrennte Angebote, auffällige Kontaktführung.            | Vorhandene dunkle Markenwelt behalten, Angebot im Einstieg konkret benennen.              | Stark inszenierte Projektübergänge bringen der Anfrage hier wenig; keine fremden Medien oder Referenzen übernommen. |
| [Apple Deutschland – Angebotsdarstellung](https://www.apple.com/de/) | Pro Produkt eine kurze Botschaft und unterscheidbare nächste Schritte.      | Klarer Hauptaufruf „Projekt anfragen“ und nachgeordnete Leistungsübersicht.               | Produktkauf ist ein anderer Vorgang als ein Dienstleistungsgespräch; keine Apple-Texte oder Layouts kopiert.        |
| [GOV.UK – Kontakt nach Anliegen](https://www.gov.uk/contact)         | Besucher ordnen sich über ihr Anliegen und verständliche Beschreibungen zu. | Aufgabenorientierte Begriffe, kurze Formularfelder, sichtbare Fehler am betroffenen Feld. | Behördeninhalte und umfangreiche Themenverzeichnisse wären für diese Website zu schwergewichtig.                    |

Zwei Designrichtungen wurden abgewogen:

- **A: kompakte Prozesswerk-Markenwelt.** Vorhandene Farben und Figur, direkte Angebotsüberschrift, kürzerer Seitenaufbau, klare Kontaktführung. Eigene Einschätzung: hohe Markenpassung und gute Lesbarkeit bei geringem Umbauaufwand.
- **B: helle, stärker redaktionelle Informationsseite.** Sehr sachliche Aufgabenführung, weniger Inszenierung. Eigene Einschätzung: gut für Text und Formulare, aber schwächere Kontinuität zum gemeinsam entwickelten Auftritt.

A wurde gewählt. Die vorhandene Marke und bereits funktionierende Komponenten geben hier den Ausschlag; dies ist keine durch Nutzerstudien bestätigte Bewertung.

## 5. Designsystem und Inhalte

- Hintergrundrollen: warmes Papier #f1f0e9; dunkle Markenfläche #20231f; Akzent #d8f087; zurückhaltende grüne Nebenflächen.
- Systemschriften Arial/Helvetica und Georgia für einzelne Hervorhebungen; keine Fontdateien eingebunden und keine externen Schriftanfragen.
- Inhaltsbreite bis 1600 px, Außenabstand etwa 6 %, inhaltsabhängige Raster mit einspaltiger Mobilansicht ab 700 px.
- Große, konkret beschriftete Hauptbuttons; sichtbare Fokusrahmen; Formularfelder mindestens 46 px hoch. Kleine Textlinks und Inline-Links werden nicht pauschal als 44-px-Ziele behauptet.
- Beide Leistungsbereiche verwenden denselben Aufbau: Illustration, Kategorie, Kernaussage, Erklärung, gemeinsamer Einstieg, drei beschriebene Bereiche, Kontaktlink.
- Keine erfundenen Preise. Die Preislogik erklärt Projektumfang, einmalige Umsetzung und getrennte laufende Anbieter-/Betreuungskosten.
- Bewegungen verdecken keine Texte. Kurze Verschiebung beim Scrollen und Hover bleiben; Seitenverdeckungen und verzögernder Klickübergang wurden entfernt. Der bestehende Lauftext hat eine Pausentaste. Reduzierte Bewegung wird berücksichtigt.
- Das bestehende Maskottchen bleibt unverändert. Website-Konzeptbilder sind ausdrücklich als Gestaltungskonzept gekennzeichnet und keine Kundenreferenzen.

## 6. Formular und Verarbeitung

Das öffentliche Formular verlangt nur Name, E-Mail-Adresse und eine kurze Beschreibung. Thema und Unternehmen sind optional; Telefonkontakt ist aufklappbar. Unternehmensgröße, Budget und Marketinganmeldung sind nicht mehr Bestandteil des öffentlichen Erstkontakts. Die vorhandene Datenstruktur bleibt kompatibel; fehlende optionale Werte werden leer gespeichert. Eine Datenschutzinformation wird angezeigt, keine pauschale Pflicht-Einwilligungscheckbox. Der interne Wert „notice“ bezeichnet die Anzeige der Information und keinen Nachweis einer Einwilligung. Die Rechtsgrundlage muss für den späteren Betreiber fachlich bestimmt werden.

Serverseitige Prüfung, Herkunftsprüfung, signierter Formulartoken, Honeypot, HMAC-basierte Rate Limits und idempotente Verarbeitung bleiben vorhanden. Fehler liefern Feldmeldungen, eine fokussierbare Zusammenfassung und erhaltene Werte. Ohne JavaScript wird der gleiche serverseitige Rückweg verwendet. Abgelaufene Formulartoken werden ersetzt, ohne Eingaben in eine URL oder in Local Storage zu schreiben. Nur nach erfolgreicher Speicherung wird zur Bestätigung weitergeleitet. Der Speichervorgang schreibt weiterhin zusammenhängend in die Datenbank und Outbox.

Die lokale Hauptvorschau enthält keinen FORM_SECRET und zeigt den Versand sichtbar deaktiviert. Für Fehlerprüfungen wurde eine getrennte Instanz auf Port 3101 mit ausschließlich synthetischen Testangaben und absichtlich unerreichbarer Datenbank verwendet. DELIVERY_ENABLED blieb false. Es wurden keine echten Anfragen verschickt und keine echte Kunden-Datenbank beschrieben.

## 7. Dienste, Lizenzen, Datenflüsse und Kosten

| Bestandteil                                  | Tatsächlicher Stand                                                                                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js 15.5.28 / React 19.3.1 / Zod 4.6.7   | Vorhandene Abhängigkeiten, MIT laut installierter Paketmetadaten.                                                                                                     |
| Prisma Client 6.19.3                         | Vorhanden, Apache-2.0 laut Paketmetadaten. Keine neue Datenbank provisioniert.                                                                                        |
| Playwright 1.64.1                            | Vorhandenes Prüfwerkzeug, Apache-2.0.                                                                                                                                 |
| axe-core / axe Playwright 4.14.0             | Vorhandene Prüfwerkzeuge, MPL-2.0. Automatische Prüfung ersetzt keine vollständige Barrierefreiheitsprüfung.                                                          |
| Maskottchen und Prozessgrafik                | Bereits bereitgestellte Assets. Herkunftshinweise im früheren Designbericht; tatsächliche Nutzungsrechte sind vom Betreiber zu bestätigen. Keine neue Lizenzgarantie. |
| Domain, Hosting, Geschäfts-E-Mail            | Nicht gewählt bzw. nicht konfiguriert; Eigentümer, Tarif, Region und Kosten noch offen.                                                                               |
| PostgreSQL / Versand / optional n8n          | Integration im vorhandenen Code; produktive Zugänge, Empfänger, Datenstandort, Verträge und laufende Kosten fehlen.                                                   |
| Shopify                                      | Nur als angebotene Dienstleistung beschrieben. Kein Shopify-Konto angelegt, kein Tarif gebucht, kein Kunden-Shop verändert.                                           |
| Tracking, Drittanbieterfonts, Videos, Karten | Nicht neu eingebaut. Kein Cookiebanner aus Gewohnheit ergänzt.                                                                                                        |

Die Umsetzung hat keine neuen kostenpflichtigen Dienste aktiviert. Eine seriöse Gesamtsumme pro Monat lässt sich ohne gewählte Anbieter und Tarife nicht nennen. Vor Livegang sind aktuelle Preisangebote, Limits, kommerzielle Nutzungsbedingungen und Exportmöglichkeiten festzuhalten. Domain und zentrale Konten sollen dem Betreiber gehören; Zugriffe erfolgen über passende Rollen statt geteilte Passwörter.

Datenfluss bei späterem Betrieb: Browser → eigene Next.js-Anwendung → validierte Anfrage → PostgreSQL und Outbox → konfigurierter Worker → Mailanbieter bzw. ausdrücklich aktivierte Webhook-Anbindung. Empfänger, Hostingland, Aufbewahrungszeit und Lösch-/Auskunftsverfahren sind vor Aktivierung zu bestätigen. Die vorhandene Beispielkonfiguration nennt 180 Tage; das ist keine bereits rechtlich geprüfte Aufbewahrungsfrist.

## 8. Datenschutz und Rechtsprüfung

Die Angaben auf Impressum und Datenschutz bleiben klar als Entwürfe markiert. Fehlende Namen und Adressen werden nicht erfunden. Betreiberland Deutschland und B2B-Zielgruppe sind bestehende Projektannahmen, keine neu bestätigten Unternehmensdaten. Es gibt keinen eigenen B2C-Checkout auf dieser Seite. Die konkrete Anwendbarkeit des BFSG und sonstiger Pflichten muss anhand des tatsächlichen Geschäfts geprüft werden.

Amtliche bzw. primäre Hinweise:

- [Bundesfachstelle – BFSG-FAQ](https://www.bundesfachstelle-barrierefreiheit.de/DE/Barrierefreiheitsstaerkungsgesetz/FAQ/faq_node.html): abgerufen; keine pauschale Übertragung auf jeden Unternehmensauftritt.
- [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html), [§ 25 TDDDG](https://www.gesetze-im-internet.de/tdddg/__25.html): die Abrufe lieferten im Recherchewerkzeug Fehler; deshalb keine bestätigte aktuelle Rechtsprüfung behauptet.
- [DSGVO – EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de): Abruf wurde durch eine JavaScript-/Robot-Prüfung blockiert. Keine solche Prüfung umgangen.

Reale Dienste und Datenflüsse, Auftragsverarbeitung, mögliche Drittlandübermittlungen und Rechtsgrundlagen sind fachlich abzugleichen. Es wurde keine Rechtsberatung, Sicherheitszertifizierung oder Garantie gesetzlicher Konformität erbracht.

## 9. Prüfung und Messung

Ausgeführte Ergebnisse und Bedingungen werden im Testprotokoll ergänzt. Der Server läuft ausschließlich auf 127.0.0.1. Die erste Browserausführung war durch die Netzwerk-Sandbox blockiert und ist kein Website-Testresultat. Nach entsprechender Netzwerkfreigabe wurden die lokalen Server neu gestartet. Chrome wurde verwendet, da der Edge-Start in der Umgebung scheiterte. Die Prüfung verwendet temporäre Browserprofile im Arbeitsverzeichnis und keine persönlichen Browserprofile.

Es sind keine installierten Playwright-Browser für WebKit oder Firefox vorhanden. Safari, echte Mobilgeräte, eine manuelle Screenreader-Prüfung und ein Zielgruppen-Nutzertest sind weiterhin offen. 320-px-Reflow und automatische axe-Prüfungen sind kein vollständiger Nachweis von WCAG 2.2 AA.

Core Web Vitals werden als Ziel verstanden, nicht als garantierter Messwert: [web.dev – Web Vitals](https://web.dev/articles/vitals). Ein lokaler Lighthouse-Labortest kann LCP, CLS und Diagnosewerte liefern, aber keine realen INP- oder 75.-Perzentil-Feldwerte bestätigen. Ohne ausreichende echte Aufrufe werden keine Feldwerte behauptet.

## 10. Veröffentlichung, Migration und Rückfallplan

Es wurde nichts öffentlich veröffentlicht. Die Hauptvorschau bindet an die lokale Loopback-Adresse und bleibt noindex. Für eine spätere externe Vorschau ist echte Zugriffskontrolle erforderlich; robots.txt ist kein Zugriffsschutz.

Vor einem Livegang fehlen: bestätigte Betreiberangaben und fachlich geprüfte Rechtstexte; Domain und Hosting; Produktions-Datenbank und Migration; bestätigte Empfängeradresse und verifizierte Absenderdomain; SPF/DKIM/DMARC passend zum tatsächlichen Anbieter; Umgebungsvariablen, HTTPS und Hauptdomain; getestete Speicherung, Zustellung und Wiederholung; Backup/Wiederherstellung, Wartungs- und Eskalationsverantwortung; ausdrückliche Live-Freigabe.

Wichtige Konfiguration: APP_ORIGIN muss exakt dem Formular-Ursprung entsprechen; SITE_URL und NEXT_PUBLIC_SITE_URL müssen auf die tatsächliche Domain zeigen. FORM_SECRET und RATE_LIMIT_SECRET unabhängig erzeugen und nicht ins Repository übernehmen. DELIVERY_ENABLED erst nach der Zustellprüfung aktivieren. SITE_INDEXABLE erst für eine freigegebene öffentliche Website einschalten.

Rückfall: lokalen Server beenden, den gesicherten vorherigen Quellcode in ein getrenntes Verzeichnis entpacken, Abhängigkeiten installieren, im richtigen Modus neu bauen und dort starten. Keine ungeprüften rekursiven Löschungen. Die Produktions-Datenbank wird durch diesen Code-Rollback nicht zurückgesetzt; bei späteren Datenmigrationen ist ein eigener geprüfter Datenbankplan erforderlich. Aktuell wurden keine produktiven Datensätze verändert.

## 11. Pflege und Übergabe

- Inhalte: src/lib/offering.ts und src/lib/content.ts; Themenauswahl: src/lib/lead-topics.ts. Beide Leistungsbereiche nutzen gemeinsame Komponenten.
- Gestaltung: src/app/studio.css; Formular: LeadForm/LeadFormFields; Navigation: SiteNavigation.
- Installation: npm ci; Datenbank erst nach richtiger Konfiguration mit npm run db:deploy vorbereiten. Entwicklung: npm run dev. Standardbetrieb: npm run build, danach npm start. Docker erzeugt ausdrücklich den Standalone-Build.
- Die Windows-Prüfung nutzt PROZESSWERK_BUILD_DIR=.next-master-final19 und PORT=3100. Dies ist ein lokales Arbeitsverzeichnis und gehört nicht in die ZIP.
- Eine grafische CMS-Pflege wurde nicht zusätzlich eingebaut. Technische Inhaltsänderungen erfolgen über den Quellcode; ein späteres CMS wäre ein eigener, begründeter Umfang.
- Konten und Domain bleiben beim Betreiber. Geheimnisse nur lokal bzw. im Hosting-Secrets-System pflegen. Updates, Sicherungen und Wiederherstellung müssen einer verantwortlichen Person zugeordnet werden.

## 12. Abschlussstatus

**Umgesetzt:** klarer Einstieg, gekürzte Nutzerwege, gleichwertige Leistungsdarstellung, unverändertes Maskottchen, Preislogik, datensparsameres Formular mit erhaltenen Fehlerwerten, direktes Navigieren ohne Seitenverdeckung, stärkere Dialog-Fokusführung, No-JavaScript-Navigation, aktualisierte Social-Vorschau und portable Startkonfiguration.

**Tatsächlich getestet:** siehe separates Testprotokoll mit aktuellen Ausführungen; frühere Prüfberichte im Projekt sind historische Stände.

**Noch offen:** echte Nutzerstudie, echte Geräte, Safari/WebKit, Screenreader, abschließende Rechte- und Rechtsprüfung, Kundenpflege durch einen tatsächlichen Verantwortlichen.

**Extern blockiert:** Live-Domain/Hosting, reale Betreiberangaben und Zugangseinladungen, produktiver Datenbank- und Mailbetrieb, echte Zustellbestätigung und laufende Kosten. Daher lokale Abnahme mit Einschränkungen, keine Veröffentlichung als vollständig produktionsreif.

Aktuelles Prüfergebnis: 17/17 Browsertests und 10/10 Sicherheitstests bestanden. Mobiler lokaler Lighthouse-Labortest: Performance 99, Accessibility 100, Best Practices 100, SEO 69 (private Vorschau absichtlich nicht crawlbar), LCP 2,2 s, CLS 0, TBT 10 ms. Details und Grenzen: TESTPROTOKOLL-MASTER.md.
