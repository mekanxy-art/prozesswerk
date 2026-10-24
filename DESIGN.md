# Prozesswerk – Designsystem

## Ziel und Bestand

Eine verständliche Website für Websites, Shopify-Shops und Prozessautomatisierung. Das vorhandene orangefarbene Maskottchen, die Leistungsstruktur, Unterseiten und Backend-Funktionen bleiben erhalten.

## Gestaltung

- Hintergrund: warmes Papier `#f6f5ef`; Text: `#252c25`; Nebeninformationen: `#586052`.
- Flächen: `#e9ecdf`; Akzent: `#d9ed9b`. Orange bleibt dem Maskottchen vorbehalten.
- Systemschriften ohne zusätzliche Downloads. Segoe UI/Arial für Inhalte, Georgia kursiv für ausgewählte Betonungen.
- Große, linksbündige Überschriften mit ausgeglichener Zeilenlänge. Fließtext bleibt schmal genug zum Lesen.
- Zwei gleich aufgebaute Leistungsbereiche. Geteilte Informationen beginnen auf gemeinsamen Linien; Smartphone-Ansicht stapelt die Bereiche.
- Primäre Aktion: dunkler Button. Sekundäre Aktion: unterstrichener Textlink. Abgerundete Flächen nur dort, wo sie zusammengehörige Inhalte gruppieren.

## Bewegung und Bedienung

- Kurze Rückmeldung: 160 ms; Menü und Beispielwechsel: 280 ms; Kurve `cubic-bezier(.22, 1, .36, 1)`.
- Bewegung erklärt Zustandswechsel. Keine zusätzliche dauerhafte Animation des Maskottchens und keine Übernahme des Scrollens.
- Die bestehende Lauftext-Pause und `prefers-reduced-motion` bleiben erhalten.
- Inhalte bleiben ohne JavaScript sichtbar; Tastaturfokus und Seitenposition bleiben nutzbar.

## Umsetzung

`src/app/open-design.css` ergänzt die bestehende Gestaltung gezielt. Kein Frameworkwechsel und keine neue Laufzeitbibliothek. Die Quellen und die Prüfung stehen unter `docs/OPEN-DESIGN.md`.
