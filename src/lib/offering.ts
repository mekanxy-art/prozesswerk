import type { PageContent } from "./content";

export const shopifyOffers = [
  {
    href: "/leistungen/shopify-shop-erstellen",
    summary:
      "Wir bauen Ihren Shopify-Shop mit einer passenden Gestaltung, übersichtlichen Produkten und einem klaren Weg zum Kauf. Umfang, Inhalte und benötigte Funktionen legen wir gemeinsam fest.",
    page: {
      title: "Ihr Angebot. Ein eigener Shopify-Shop.",
      label: "SHOPIFY-SHOP ERSTELLEN",
      description:
        "Shopify-Shops erstellen und Themes anpassen: Shopstruktur, Produktseiten, Inhalte und technische Tests mit klar vereinbartem Umfang.",
      intro:
        "Vom ersten Konzept bis zum getesteten Shop: Wir gestalten Ihren Shopify-Auftritt und setzen die vereinbarten Seiten und Funktionen um. Passend zu Ihren Produkten und Ihrem Unternehmen.",
      sections: [
        {
          title: "Ein klarer Aufbau für Ihre Produkte",
          text: "Gemeinsam klären wir Zielgruppe, Sortiment und benötigte Funktionen. Daraus entwickeln wir Navigation, Kollektionen und einen Seitenaufbau, der Besucher durch Ihr Angebot führt.",
        },
        {
          title: "Gestaltung und Theme-Anpassung",
          text: "Wir richten ein passendes Shopify-Theme ein und passen es an Ihre Marke an. Startseite, Produktseiten und weitere vereinbarte Inhalte werden für Smartphone und Desktop gestaltet. Individuelle Theme-Funktionen stimmen wir vorab ab.",
        },
        {
          title: "Produkte, Inhalte und Shop-Einstellungen",
          text: "Wir unterstützen bei der vereinbarten Anzahl an Produkten, Varianten, Bildern und Inhalten. Versand- und Zahlungseinstellungen bereiten wir nach Ihren Vorgaben vor. Der Shopinhaber übernimmt Kontoverifizierung, Vertragsabschlüsse und erforderliche Freigaben.",
        },
        {
          title: "Gemeinsam testen. Dann starten.",
          text: "Vor dem Start prüfen wir die vereinbarten Kaufabläufe mit Testbestellungen, Darstellung und wichtige Kontaktwege. Shopify-Tarif, gegebenenfalls kostenpflichtige Themes, Apps und laufende Betreuung werden gesondert abgestimmt. Sie erhalten eine verständliche Übergabe.",
        },
      ],
    },
  },
  {
    href: "/leistungen/shopify-migration",
    summary:
      "Sie möchten mit Ihrem bestehenden Shop zu Shopify wechseln? Wir prüfen Ihr Ausgangssystem, planen die vereinbarte Datenübernahme und testen den neuen Shop vor der Umstellung.",
    page: {
      title: "Ein neuer Shop. Ein geplanter Wechsel.",
      label: "ZU SHOPIFY WECHSELN",
      description:
        "Shopify-Migration nach Bestandsprüfung: vereinbarte Produkt- und Kundendaten übernehmen, Inhalte aufbauen, Weiterleitungen planen und den Wechsel testen.",
      intro:
        "Wir begleiten den Wechsel Ihres bestehenden Shops zu Shopify. Zuerst prüfen wir Daten, Funktionen und Schnittstellen. Darauf bauen ein klarer Migrationsumfang und ein abgestimmter Umstellungsplan auf.",
      sections: [
        {
          title: "Erst prüfen, was mitkommen soll",
          text: "Wir erfassen Ausgangssystem, Produkte, Varianten, Kundendaten, Inhalte, URLs und bestehende Anbindungen. Apps, Abonnements, Bestellhistorien und Sonderfunktionen werden einzeln auf ihre Übertragbarkeit geprüft. Auf dieser Grundlage erhalten Sie ein Angebot.",
        },
        {
          title: "Daten mit einem Testimport übernehmen",
          text: "Wir sichern die vereinbarten Ausgangsdaten und testen die Zuordnung zunächst an einer kleinen Auswahl. Die eigentliche Übernahme erfolgt je nach Datentyp über Importdateien, Schnittstellen oder eine passende Migrations-App. Kostenpflichtige Werkzeuge werden vorab abgestimmt.",
        },
        {
          title: "Inhalte und Weiterleitungen mitdenken",
          text: "Wir bauen die vereinbarten Seiten auf und ordnen alte URLs passenden neuen Zielen zu. Weiterleitungen und wichtige Seiteninformationen werden geprüft. Bestehende Suchmaschinenpositionen lassen sich beim Wechsel nicht garantieren.",
        },
        {
          title: "Die Umstellung gemeinsam freigeben",
          text: "Vor der Umstellung vergleichen wir vereinbarte Datenbestände und prüfen Kaufabläufe, Versand, Zahlungen und Anbindungen im vereinbarten Umfang. Zeitpunkt, Umgang mit neuen Bestellungen und Rückfallplan stimmen wir mit Ihnen ab. Kundenpasswörter können nicht per CSV übernommen werden; die Einrichtung der Kundenkonten wird separat geplant.",
        },
      ],
    },
  },
];

export const websiteAreas = [
  {
    title: "Website erstellen",
    text: "Ein neuer Webauftritt mit klaren Inhalten, passendem Design und einem einfachen Weg zur Anfrage.",
  },
  {
    title: "Website optimieren & SEO",
    text: "Bestehende Seiten in Struktur, Bedienung und Ladezeit verbessern und SEO-Grundlagen schaffen.",
  },
  {
    title: "Shopify-Shops & Migration",
    text: "Einen neuen Shopify-Shop aufbauen oder den Wechsel Ihres bestehenden Shops zu Shopify begleiten.",
  },
];

export const processUseCases = [
  {
    id: "anfragen",
    title: "Anfragen & Vertrieb",
    text: "Anfragen erfassen, Kontaktdaten im CRM zuordnen und den nächsten Schritt für Ihr Team vorbereiten.",
    flow: ["Anfrage", "CRM", "Nächster Schritt"],
    href: "/leistungen/vertriebsautomatisierung",
  },
  {
    id: "dokumente",
    title: "Dokumente & Angebote",
    text: "Freigegebene Daten in Vorlagen übernehmen, Dokumente erstellen und die Prüfung vor dem Versand organisieren.",
    flow: ["Daten", "Freigabe", "Dokument"],
    href: "/leistungen/prozessautomatisierung",
  },
  {
    id: "onboarding",
    title: "Kunden-Onboarding",
    text: "Nach dem Auftrag Aufgaben anlegen, benötigte Unterlagen im Blick behalten und klare Übergaben schaffen.",
    flow: ["Auftrag", "Unterlagen", "Projektstart"],
    href: "/loesungen#abschnitt-3",
  },
];
export const processSteps = [
  [
    "Analysieren",
    "Wir verstehen Ihren heutigen Ablauf, die beteiligten Systeme und typische Ausnahmen.",
  ],
  [
    "Vereinfachen",
    "Wir klären Zuständigkeiten und lassen unnötige Schritte weg, bevor wir automatisieren.",
  ],
  [
    "Verbinden",
    "Wir setzen den vereinbarten Ablauf mit Ihren vorhandenen Tools und passenden Schnittstellen um.",
  ],
  [
    "Testen & übergeben",
    "Wir prüfen Normalfälle und Ausnahmen mit Ihnen und dokumentieren den fertigen Ablauf.",
  ],
];

export const serviceGroups = [
  {
    href: "/leistungen/websites-sichtbarkeit",
    title: "Websites & Online-Shops",
    promise: "Ein Auftritt, der zu Ihnen passt.",
    text: "Wir erstellen Websites und Shopify-Shops, verbessern bestehende Auftritte und begleiten den Wechsel zu Shopify.",
    links: [
      ["/leistungen/website-erstellung", "Website erstellen"],
      ["/leistungen/website-optimierung", "Website optimieren"],
      ["/leistungen/seo-grundlagen", "SEO-Grundlagen"],
      ...shopifyOffers.map((o) => [
        o.href,
        o.page.label === "SHOPIFY-SHOP ERSTELLEN"
          ? "Shopify-Shop erstellen"
          : "Zu Shopify wechseln",
      ]),
    ],
  },
  {
    href: "/leistungen/prozesse-automatisierung",
    title: "Prozesse & Automatisierung",
    promise: "Ein Alltag mit weniger Handarbeit.",
    text: "Wir verbessern und automatisieren Ihre Abläufe – vom Eingang einer Anfrage bis zur Übergabe an Ihr Team. Analyse und Systemanbindung gehören dazu.",
    links: [
      [
        "/leistungen/prozesse-automatisierung",
        "Prozesse verbessern & automatisieren",
      ],
    ],
  },
];

export const offeringPages: Record<string, PageContent> = {
  ...Object.fromEntries(shopifyOffers.map((o) => [o.href.slice(1), o.page])),
  leistungen: {
    title: "Websites & Abläufe.",
    description:
      "Websites und Shopify-Shops erstellen, zu Shopify wechseln, Sichtbarkeit verbessern und Geschäftsprozesse verbinden.",
    label: "UNSERE LEISTUNGEN",
    intro:
      "Eine verständliche Website oder ein durchdachter Shop nach außen. Klare, verbundene Abläufe im Unternehmen. Wir unterstützen Sie dort, wo Sie heute ansetzen möchten – einzeln oder zusammen.",
    sections: serviceGroups.map((g) => ({
      title: g.title,
      text: g.text,
      bullets: g.links.map(([, label]) => label),
    })),
  },
  "leistungen/websites-sichtbarkeit": {
    title: "Websites und Shops, die zu Ihnen passen.",
    description:
      "Unternehmenswebsites und Shopify-Shops erstellen, Websites optimieren, SEO-Grundlagen verbessern und Shop-Migrationen begleiten.",
    label: "WEBSITES & ONLINE-SHOPS",
    intro:
      "Ob Unternehmenswebsite oder Online-Shop: Ihr Angebot braucht einen verständlichen Auftritt. Wir gestalten Websites, erstellen Shopify-Shops und begleiten den Wechsel von einem bestehenden Shopsystem.",
    sections: [
      {
        title: "Website erstellen",
        text: "Von der ersten Seitenstruktur bis zur fertigen Unternehmenswebsite: verständliche Inhalte, eine passende Gestaltung und eine gute Darstellung auf Smartphone und Desktop.",
        bullets: [
          "Ziele, Zielgruppen und Inhalte klären",
          "Individuelles Design und technische Umsetzung",
          "Kontaktwege, Prüfung und verständliche Übergabe",
        ],
      },
      {
        title: "Website optimieren",
        text: "Ihre Website ist bereits da, aber Inhalte, Bedienung oder Ladezeiten passen nicht mehr? Wir prüfen den Bestand und verbessern die Stellen, die für Ihre Besucher wichtig sind.",
        bullets: [
          "Seitenstruktur und Nutzerführung verbessern",
          "Mobile Darstellung und Ladezeiten prüfen",
          "Kontaktmöglichkeiten klarer gestalten",
        ],
      },
      {
        title: "SEO-Grundlagen",
        text: "Wir schaffen eine verständliche Seitenstruktur und technische Voraussetzungen für Suchmaschinen. Der Umfang wird passend zu Ihrer Website vereinbart.",
        bullets: [
          "Suchthemen und passende Seiteninhalte",
          "Seitentitel, Beschreibungen und interne Verlinkung",
          "Indexierbarkeit und technische Grundlagen",
        ],
      },
      ...shopifyOffers.map((o) => ({
        title:
          o.page.label === "SHOPIFY-SHOP ERSTELLEN"
            ? "Shopify-Shop erstellen"
            : "Zu Shopify wechseln",
        text: o.summary,
        bullets:
          o.page.label === "SHOPIFY-SHOP ERSTELLEN"
            ? [
                "Shopstruktur und Theme-Anpassung",
                "Produkte, Kollektionen und Inhalte",
                "Testbestellungen und verständliche Übergabe",
              ]
            : [
                "Ausgangssystem und Daten prüfen",
                "Vereinbarte Datenübernahme und Weiterleitungen",
                "Tests und abgestimmter Umstellungsplan",
              ],
      })),
    ],
  },
  "leistungen/prozesse-automatisierung": {
    title: "Ein Alltag mit weniger Handarbeit.",
    description:
      "Prozesse verbessern und automatisieren: Anfragen und Vertrieb, Dokumente und Angebote sowie Kunden-Onboarding als konkrete Einsatzmöglichkeiten.",
    label: "PROZESSE VERBESSERN & AUTOMATISIEREN",
    intro:
      "Ein zusammenhängender Ablauf statt vieler einzelner Handgriffe. Wir analysieren Ihren Prozess, vereinfachen ihn und verbinden die beteiligten Systeme. Sie entscheiden, wo wir anfangen.",
    sections: processSteps.map(([title, text]) => ({ title, text })),
  },
  "leistungen/website-erstellung": {
    title: "Ihr Unternehmen. Verständlich im Web.",
    label: "WEBSITE ERSTELLEN",
    description:
      "Individuelle Unternehmenswebsites mit klarer Struktur, passendem Design und einfacher Kontaktführung.",
    intro:
      "Wir entwickeln Ihre Website ausgehend von Ihrem Angebot und den Fragen Ihrer Besucher. Von der Struktur über das Design bis zur technischen Umsetzung.",
    sections: [
      {
        title: "Erst das Ziel. Dann die Seiten.",
        text: "Gemeinsam klären wir, wen Sie erreichen möchten, welche Leistungen im Mittelpunkt stehen und welche Inhalte dafür benötigt werden. Daraus entsteht eine nachvollziehbare Seitenstruktur.",
      },
      {
        title: "Gestaltung, die zu Ihnen passt",
        text: "Wir gestalten eine Website passend zu Ihrem Unternehmen und setzen sie für Smartphone, Tablet und Desktop um. Texte, Bilder und Kontaktwege führen durch das Angebot.",
      },
      {
        title: "Technisch sauber starten",
        text: "Zum vereinbarten Umfang gehören die Prüfung der wichtigsten Seiten und Kontaktwege sowie grundlegende SEO-Einstellungen. Hosting, Domain, Pflege und die Einbindung von Drittdiensten stimmen wir vorab mit Ihnen ab.",
      },
      {
        title: "Ein klarer Umfang. Eine verständliche Übergabe.",
        text: "Im Angebot halten wir Seitenumfang, Inhaltserstellung, Korrekturen und Zuständigkeiten fest. Nach gemeinsamer Prüfung erhalten Sie die vereinbarte Dokumentation. Laufende Betreuung lässt sich separat vereinbaren.",
      },
    ],
  },
  "leistungen/website-optimierung": {
    title: "Ihre Website kann mehr.",
    label: "WEBSITE OPTIMIEREN",
    description:
      "Bestehende Websites in Struktur, Nutzerführung, mobiler Darstellung und Ladezeit gezielt verbessern.",
    intro:
      "Es muss nicht immer eine neue Website sein. Wir prüfen Ihren bestehenden Auftritt und priorisieren Verbesserungen, die zum Ziel und zum technischen Bestand passen.",
    sections: [
      {
        title: "Den Bestand verstehen",
        text: "Wir betrachten die wichtigsten Seiten, die mobile Darstellung und den Weg zur Anfrage. Verfügbare Nutzungsdaten beziehen wir ein, sofern sie rechtmäßig erhoben wurden.",
      },
      {
        title: "Angebot und Kontaktwege verständlicher machen",
        text: "Besucher sollen schnell erkennen, was Sie anbieten und wie sie weiterkommen. Dafür überarbeiten wir nach Bedarf Inhalte, Navigation und Handlungsaufforderungen.",
      },
      {
        title: "Technische Bremsen lösen",
        text: "Wir prüfen unter anderem Bilder, Ladeverhalten und die Darstellung auf unterschiedlichen Bildschirmgrößen. Was sinnvoll umsetzbar ist, hängt vom vorhandenen System und den verfügbaren Zugängen ab.",
      },
      {
        title: "Gezielt verbessern statt alles auf einmal",
        text: "Sie erhalten einen abgegrenzten Vorschlag mit Prioritäten und Prüfkriterien. Vorher und nachher vergleichen wir die vereinbarten Merkmale; mehr Anfragen oder bestimmte Geschäftsergebnisse lassen sich nicht garantieren.",
      },
    ],
  },
  "leistungen/seo-grundlagen": {
    title: "Die Grundlage, um gefunden zu werden.",
    label: "SEO-GRUNDLAGEN",
    description:
      "Technische und inhaltliche SEO-Grundlagen: Seitenstruktur, Suchthemen, Metadaten und interne Verlinkung.",
    intro:
      "Suchmaschinen sollen Ihre Website erfassen und Ihre Inhalte einordnen können. Wir verbessern dafür die technischen und inhaltlichen Grundlagen – passend zu Ihrem Angebot.",
    sections: [
      {
        title: "Suchthemen und Inhalte zusammenbringen",
        text: "Wir klären, welche Fragen Ihre Zielgruppe hat und welche Ihrer Seiten diese beantworten sollen. Daraus leiten wir verständliche Inhalte und eine sinnvolle Seitenstruktur ab.",
      },
      {
        title: "Seiten sauber aufbauen",
        text: "Wir überarbeiten im vereinbarten Umfang Seitentitel, Beschreibungen, Überschriften und interne Links. Jede wichtige Leistung soll eine passende, verständliche Seite erhalten.",
      },
      {
        title: "Technische Voraussetzungen prüfen",
        text: "Wir prüfen unter anderem Indexierbarkeit, Sitemap, Weiterleitungen und mobile Darstellung. Maßnahmen stimmen wir auf das eingesetzte System und den vereinbarten Umfang ab.",
      },
      {
        title: "Klare Erwartungen",
        text: "Das Angebot umfasst eine abgegrenzte Grundlagenoptimierung. Suchmaschinen entscheiden selbst über Aufnahme und Platzierung. Bestimmte Rankings, feste Ergebnisfristen und eine laufende SEO-Betreuung sind nicht enthalten.",
      },
    ],
  },
  "leistungen/prozessanalyse-optimierung": {
    title: "Erst verstehen. Dann einfacher machen.",
    label: "PROZESSE ANALYSIEREN & VERBESSERN",
    description:
      "Arbeitsabläufe untersuchen, Medienbrüche erkennen und konkrete Verbesserungen priorisieren – vor der technischen Umsetzung.",
    intro:
      "Nicht jeder umständliche Ablauf braucht sofort neue Software. Wir schauen auf die tatsächlichen Arbeitsschritte und klären, was entfallen, einfacher werden oder automatisiert werden kann.",
    sections: [
      {
        title: "Ein kostenloses Erstgespräch als Einstieg",
        text: "Wir besprechen Ihren Ablauf, Ihr Ziel und die beteiligten Systeme. Danach entscheiden wir gemeinsam, ob eine ausführliche Analyse sinnvoll ist. Das Erstgespräch ist keine vollständige Prozessanalyse.",
      },
      {
        title: "Den heutigen Ablauf sichtbar machen",
        text: "Für die vertiefte Analyse vereinbaren wir einen eigenen Umfang. Wir erfassen Auslöser, Eingaben, Entscheidungen, Zuständigkeiten und Ausnahmen anhand Ihrer tatsächlichen Arbeitsweise.",
      },
      {
        title: "Verbesserungen priorisieren",
        text: "Wir betrachten Doppelarbeit, Wartezeiten und unnötige Übergaben. Gemeinsam ordnen wir mögliche Maßnahmen nach Nutzen, Aufwand und Abhängigkeiten ein.",
      },
      {
        title: "Mit einem konkreten nächsten Schritt weitergehen",
        text: "Sie erhalten das vereinbarte Prozessbild und einen Vorschlag für die nächsten Maßnahmen. Eine mögliche technische Umsetzung und deren Kosten werden gesondert beschrieben.",
      },
    ],
  },
};
