# Prozesswerk – Designsystem

## Aktuelle Richtung

Die Gestaltung verwendet warmes Papier `#f3f3ec`, dunklen Text `#252d27`, flächiges Grün `#e5eadb` und Akzent `#dbe99c`. Das orangefarbene Maskottchen bleibt das erkennbare Markenelement. Durchgehende Systemschrift Arial/Helvetica, große linksbündige Aussagen, rechteckige Aktionen und breite Bild-/Textachsen.

Die Startseite verbindet Websites und Shops mit der Arbeit dahinter. Zwei Leistungsbereiche, eigene fiktive Gestaltungskonzepte und der bedienbare Prozessvergleich erklären das Angebot. Es werden keine Kundenergebnisse, Partnerstatus oder Einsparwerte erfunden.

## Umsetzung

Die Stylesheets werden bewusst in dieser Reihenfolge geladen:

1. `globals.css`: Grundlagen, Formulare, Admin und gemeinsame Komponenten.
2. `design-v2.css`: erhaltene Illustrations- und Unterseitenlayouts.
3. `studio.css`: Navigation, Layouts und responsive Regeln.
4. `open-design.css`: übernommene Hierarchie- und Bewegungsverbesserungen.
5. `taste-local.css`: aktuelle Gestaltung der Gesamtseite und Startseite.

Die vorhandenen Schichten bleiben zur Vermeidung unkontrollierter Änderungen bestehen; sie sind keine fünf auswählbaren Designs. Eine spätere Zusammenführung benötigt eigene visuelle Regressionstests. Neue Änderungen bevorzugt in der zuständigen bestehenden Schicht vornehmen.

## Bewegung und Bedienung

Bewegung ergänzt Zustandswechsel. Kein erzwungenes Scrollen und keine zusätzliche dauerhafte Maskottchenanimation. Inhalte bleiben ohne JavaScript sichtbar; reduzierte Bewegung wird berücksichtigt, das Menü führt den Tastaturfokus und der Prozessvergleich bleibt bedienbar. Die strengere Produktions-CSP und echte Klickabläufe sind getestet.

Quellen, eigene Konzepte und zehn Referenzen: [TASTE-RECHERCHE.md](docs/TASTE-RECHERCHE.md). Frühere Gestaltung: [OPEN-DESIGN.md](docs/OPEN-DESIGN.md), [DESIGN-STUDIO.md](DESIGN-STUDIO.md).
