# Prozesswerk – Studio-Redesign

> Historischer Entwicklungs- bzw. Prüfstand. Aussagen zu damaliger Gestaltung, Testzahlen und fehlenden Datenbankprüfungen gelten für diese Phase. Aktueller Stand: [Veröffentlichungsprüfung vom 24.10.2026](docs/RELEASE-2026-10-24.md).

Die bestehende Next.js-Website wurde gestalterisch an der Referenz https://www.unhyde.me/de ausgerichtet. Das vorhandene orangefarbene Maskottchen, die Prozessillustration, die Unterseiten und die Backend-Implementierung sind erhalten.

## Gestaltung und Navigation

- Dunkle Einstiegsfläche, große Versalien und Konturschrift, limettengrüne Akzente.
- Neuer Aufbau der Startseite: Einstieg, Ansatz, Leistungen, interaktive Beispiele, Systemverbindungen, Vorgehen, FAQ und Kontakt.
- Bildschirmfüllendes Menü mit allen Hauptseiten, Tastaturbedienung, Fokusführung und Escape zum Schließen.
- Animierte Seitenwechsel und Seitenaufbau. Betriebssystem-Einstellung für reduzierte Bewegung wird berücksichtigt.
- Passende Gestaltung der Leistungs-, Lösungs-, Beispiel-, Wissens- und Kontaktseiten.
- Responsive Ansichten bis 320 Pixel Breite.

## Lokal starten

Im Projektordner `npm ci` und danach `npm run dev` ausführen. Die auf dem Terminal angezeigte lokale Adresse öffnen.

Die ZIP enthält keine Zugangsdaten, Datenbanken oder installierten Abhängigkeiten. Die bisherige Backend-Konfiguration muss in der eigenen Umgebung weiterverwendet werden. Ohne Konfiguration bleibt der Formularversand wie bisher sichtbar deaktiviert. Details stehen in README.md und docs/BETRIEB.md. Es wurde kein Live-Deployment durchgeführt.

## Prüfung

Fünf Browserprüfungen für Seitenwechsel, Zurück-Navigation, Tastaturbedienung, reduzierte Bewegung, interaktive Prozessauswahl sowie Desktop- und Mobilansichten. Automatische Barrierefreiheitsprüfung auf Startseite und den zentralen Unterseiten bei 390 Pixel Breite; Überlaufprüfung bei 1440, 390 und 320 Pixeln.

Die vorhandenen Datenbanktests wurden bei dieser Gestaltungsänderung nicht ausgeführt.

## Build-Hinweis dieser Arbeitsumgebung

Die Next.js-Produktionskompilierung einschließlich Typprüfung und Seitengenerierung war erfolgreich. Für die lokale Prüfung wurden vorhandene Abhängigkeiten über eine Windows-Verzeichnisverknüpfung wiederverwendet. Das Kopieren der Standalone-Abhängigkeiten erzeugte dadurch eine Windows-Symlink-Warnung; dieses lokale Build-Verzeichnis ist nicht Bestandteil der Lieferung. Für den Einsatz aus dem ZIP die Abhängigkeiten mit `npm ci` direkt im neuen Projekt installieren und `npm run build` ausführen.

## Erweiterung des Angebots

Die Leistungen sind jetzt in zwei Hauptbereiche gegliedert: Websites & Sichtbarkeit sowie Prozesse & Automatisierung. Neue Unterseiten beschreiben Website-Erstellung, Website-Optimierung, SEO-Grundlagen und Prozessanalyse. Die bestehenden Automatisierungsangebote bleiben darunter erreichbar. Startseite, Footer, Kontaktformular, Formularvalidierung und FAQ wurden angepasst. Das kostenlose Erstgespräch ist von einer separat beauftragten Prozessanalyse abgegrenzt; SEO ist als begrenzte Grundlagenoptimierung beschrieben.

Prüfung nach dieser Erweiterung: sieben Browserprüfungen einschließlich aller neuen Leistungsseiten bei 1440, 390 und 320 Pixeln sowie neun bestandene Validierungs-/Sicherheitstests. Die neue lokale Vorschau verwendet weiterhin Port 3100.

## Shopify-Angebot

Unter „Websites, Shops & Sichtbarkeit“ sind Shopify-Shop-Erstellung und Shopify-Migration ergänzt. Beide Leistungen haben eigene Unterseiten, passende Konzeptdarstellungen und Kontaktformular-Optionen. Migrationen werden nach Bestandsprüfung mit vereinbartem Datenumfang, Testimport, Weiterleitungen und Umstellungsplan angeboten. Der bestehende Kategorien-Link bleibt gültig.

Prüfung dieser Erweiterung: Typprüfung, Next.js-Kompilierung, neun Validierungs-/Sicherheitstests sowie fünf Browserprüfungen für Leistungsseiten, neue Formularoptionen, Navigation und mobile Darstellung.

## Vereinfachtes Prozessangebot und Bewegung

„Prozesse verbessern & automatisieren“ bildet jetzt eine gemeinsame Leistung. Anfragen & Vertrieb, Dokumente & Angebote und Kunden-Onboarding sind ausdrücklich Beispiele. Analyse, Vereinfachung, Systemanbindung und Test bilden die Vorgehensweise. Eine ausführliche Analyse bleibt separat beauftragbar. Bestehende Unterseiten bleiben erreichbar.

Ergänzt sind einmalige Scrollauftritte für Inhalte und Karten, ein gestaffelter Einstieg der großen Überschrift, zurückhaltende Hover-Reaktionen sowie eine Pause-Taste für den bestehenden Lauftext. Native Scrollbedienung bleibt erhalten. Alle Inhalte bleiben ohne JavaScript sichtbar. Die Einstellung für reduzierte Bewegung wird auch bei einer Änderung während des Seitenbesuchs berücksichtigt; Tastaturfokus macht betroffene Karten sofort sichtbar.

Zehn Browserprüfungen bestanden, darunter Scrollauftritte, Tastaturfokus, Bewegungspause, reduzierte Bewegung, Darstellung ohne JavaScript und mobile Leistungsseiten. Nach abschließender typografischer Korrektur wurden die beiden Leistungsprüfungen erneut erfolgreich ausgeführt. Die lokale Vorschau bleibt auf Port 3100 geöffnet.
