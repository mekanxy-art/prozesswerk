import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pages, articles, faq, serviceLinks } from "@/lib/content";
import { company, safeBooking, siteUrl } from "@/lib/config";
import { Arrow, Breadcrumbs, CTA, FAQ, JsonLd } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";
import { Mascot, ProcessArt, WebsiteArt } from "@/components/visuals";
import { serviceGroups } from "@/lib/offering";
import { MarketingSections } from "@/components/marketing-sections";
type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | undefined>>;
};
const special: Record<string, { title: string; description: string }> = {
  kontakt: {
    title: "Was möchten Sie verbessern?",
    description:
      "Kostenloses Erstgespräch zu Ihrer Website oder Ihren Geschäftsprozessen anfragen.",
  },
  termin: {
    title: "Ein Gespräch. Ein klarer erster Schritt.",
    description:
      "Kostenloses Erstgespräch zur Automatisierung Ihrer Unternehmensprozesse.",
  },
  faq: {
    title: "Ihre Fragen zur Automatisierung.",
    description:
      "Antworten zu Kosten, Systemen, KI, Datenschutz und Betrieb von Automatisierungsprojekten.",
  },
  wissen: {
    title: "Prozesse verstehen. Besser entscheiden.",
    description:
      "Praktische Leitfäden und Entscheidungshilfen zur Automatisierung von Unternehmensprozessen.",
  },
  danke: {
    title: "Ihre Anfrage ist angekommen.",
    description: "Ihre Prozessanalyse-Anfrage wurde gespeichert.",
  },
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const item =
    pages[slug] ||
    special[slug] ||
    articles.find((a) => `wissen/${a.slug}` === slug);
  if (!item)
    return {
      title: "Seite nicht gefunden",
      robots: { index: false, follow: false },
    };
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: item.title,
      description: item.description,
      url: `/${slug}`,
    },
    ...(slug === "danke" ? { robots: { index: false, follow: false } } : {}),
  };
}
export default async function ContentPage({ params, searchParams }: Props) {
  const slug = (await params).slug.join("/");
  const query = await searchParams;
  const page = pages[slug];
  const article = articles.find((a) => `wissen/${a.slug}` === slug);
  const info = page || special[slug] || article;
  if (!info) notFound();
  const visualHero = !!page && !page.legal && slug !== "cookie-einstellungen";
  const customSections =
    !!page &&
    [
      "leistungen",
      "beispiele",
      "loesungen",
      "leistungen/websites-sichtbarkeit",
      "leistungen/prozesse-automatisierung",
    ].includes(slug);
  const crumbs = slug.includes("/")
    ? [
        {
          name: slug.startsWith("wissen") ? "Wissen" : "Leistungen",
          href: slug.startsWith("wissen") ? "/wissen" : "/leistungen",
        },
        { name: info.title, href: `/${slug}` },
      ]
    : [
        {
          name:
            slug === "kontakt"
              ? "Kontakt"
              : slug === "ueber-uns"
                ? "Über uns"
                : slug === "danke"
                  ? "Danke"
                  : info.title,
          href: `/${slug}`,
        },
      ];
  const parentGroup = serviceGroups.find(
    (g) =>
      g.href !== "/" + slug && g.links.some(([href]) => href === "/" + slug),
  );
  if (parentGroup)
    crumbs.splice(1, 0, { name: parentGroup.title, href: parentGroup.href });
  return (
    <>
      <div className="page-shell">
        <Breadcrumbs items={crumbs} />
        <section className={`page-hero ${visualHero ? "page-hero-split" : ""}`}>
          <div className="page-hero-text">
            <span className="eyebrow">
              {page?.label ||
                (article
                  ? "WISSEN / " + article.category
                  : slug === "kontakt"
                    ? "KOSTENLOSES ERSTGESPRÄCH"
                    : "GUT ZU WISSEN")}
            </span>
            <h1>{info.title}</h1>
            <p>
              {page?.intro ||
                article?.description ||
                (slug === "kontakt"
                  ? "Eine neue Website, ein Shopify-Shop oder weniger Routine im Alltag: Erzählen Sie uns, was Sie vorhaben."
                  : slug === "termin"
                    ? "Wir besprechen Ihren Ablauf, die beteiligten Systeme und mögliche nächste Schritte. Kostenlos und unverbindlich."
                    : slug === "danke"
                      ? "Ihre Angaben wurden dauerhaft gespeichert. Eine Eingangsbestätigung wird versendet, sobald der E-Mail-Versand eingerichtet und aktiv ist."
                      : "Verständliche Antworten und konkrete Ansätze für Ihren Arbeitsalltag.")}
            </p>
            {article && (
              <div className="article-meta">
                Redaktion: {company.name} · Aktualisiert am 17. Oktober 2026 ·
                Fachbeitrag
              </div>
            )}
            {page?.legal && (
              <div className="notice">
                Entwurf mit offenen Angaben. Vor Veröffentlichung juristisch und
                anhand des tatsächlichen Betriebs prüfen.
              </div>
            )}
          </div>
          {visualHero && (
            <div
              className={`page-hero-art ${slug === "ueber-uns" ? "page-hero-character" : ""}`}
            >
              {slug === "ueber-uns" || slug === "leistungen" ? (
                <Mascot />
              ) : slug.startsWith("leistungen/website") ||
                slug === "leistungen/seo-grundlagen" ||
                slug.startsWith("leistungen/shopify") ? (
                <WebsiteArt shop={slug.startsWith("leistungen/shopify")} />
              ) : (
                <ProcessArt priority />
              )}
              <span>
                {slug === "ueber-uns"
                  ? "WIR DENKEN VERBINDUNGEN WEITER."
                  : slug.startsWith("leistungen/website") ||
                      slug === "leistungen/seo-grundlagen" ||
                      slug.startsWith("leistungen/shopify")
                    ? "EIN KLARER AUFTRITT. EIN EINFACHER KONTAKTWEG."
                    : "AUS EINZELNEN TOOLS WIRD EIN ABLAUF."}
              </span>
            </div>
          )}
        </section>
        {customSections && <MarketingSections slug={slug} page={page!} />}
        {(page || article) && !customSections && (
          <div className="editorial-layout">
            <aside>
              <span className="eyebrow">AUF DIESER SEITE</span>
              {(page?.sections || article?.sections || []).map((s, i) => (
                <a href={`#abschnitt-${i}`} key={s.title}>
                  {s.title}
                </a>
              ))}
              <Link href="/kontakt" className="text-link">
                Über Ihr Vorhaben sprechen <Arrow />
              </Link>
            </aside>
            <div className="article-body">
              {(page?.sections || article?.sections || []).map((s, i) => (
                <section id={`abschnitt-${i}`} key={s.title}>
                  <h2>{s.title}</h2>
                  <p>{s.text}</p>
                  {"bullets" in s && s.bullets && (
                    <ul>
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              {slug === "leistungen" && (
                <div className="related-links">
                  {serviceLinks.map(([href, label]) => (
                    <Link key={href} href={href}>
                      {label} <Arrow />
                    </Link>
                  ))}
                </div>
              )}
              {page?.legal && (
                <p className="small">
                  Prüfgrundlagen:{" "}
                  <a href="https://www.gesetze-im-internet.de/ddg/__5.html">
                    § 5 DDG
                  </a>
                  ,{" "}
                  <a href="https://www.gesetze-im-internet.de/ttdsg/__25.html">
                    § 25 TDDDG
                  </a>
                  ,{" "}
                  <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de">
                    DSGVO
                  </a>
                  . Keine Rechtsberatung.
                </p>
              )}
            </div>
          </div>
        )}
        {slug === "kontakt" && (
          <div className="contact-layout">
            <aside>
              <div className="contact-mascot">
                <Mascot />
              </div>
              <h2>
                Erst verstehen.
                <br />
                Dann passend umsetzen.
              </h2>
              <p>Im Erstgespräch klären wir:</p>
              <ul>
                <li>
                  Was Sie mit Ihrer Website oder Ihren Prozessen erreichen
                  möchten.
                </li>
                <li>Welche Website und Systeme bereits vorhanden sind.</li>
                <li>Was ein sinnvoller nächster Schritt ist.</li>
              </ul>
              <p className="small">
                Kein fertiges Lastenheft erforderlich. Das Erstgespräch ist
                unverbindlich.
              </p>
              {[company.email, company.phone, company.region].some(
                (value) => !value.startsWith("["),
              ) && (
                <div className="contact-data">
                  <strong>Direkter Kontakt</strong>
                  {!company.email.startsWith("[") && (
                    <a href={"mailto:" + company.email}>{company.email}</a>
                  )}
                  {!company.phone.startsWith("[") && (
                    <span>{company.phone}</span>
                  )}
                  {!company.region.startsWith("[") && (
                    <span>{company.region}</span>
                  )}
                </div>
              )}
            </aside>
            <LeadForm error={query.fehler} source={query.utm_source} />
          </div>
        )}
        {slug === "termin" && (
          <div className="narrow-panel">
            <h2>So bereiten Sie sich vor</h2>
            <p>
              Bringen Sie eine kurze Beschreibung Ihres Ablaufs und der
              beteiligten Programme mit. Anonymisierte Beispiele reichen aus;
              Zugangsdaten werden im Erstgespräch nicht benötigt.
            </p>
            {safeBooking() ? (
              <>
                <p>
                  Der Termin wird auf der externen Website des Buchungsanbieters
                  vereinbart. Es wird hier kein Kalender eingebettet.
                </p>
                <a
                  className="button"
                  href={safeBooking()!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Externe Terminbuchung öffnen <Arrow />
                </a>
              </>
            ) : (
              <>
                <p className="notice">
                  Ein direkter Terminbuchungslink ist noch nicht eingerichtet.
                  Nutzen Sie die Projektanfrage, um ein Gespräch anzufragen.
                </p>
                <Link className="button" href="/kontakt">
                  Gespräch anfragen <Arrow />
                </Link>
              </>
            )}
          </div>
        )}
        {slug === "faq" && (
          <div className="wide-faq">
            <FAQ />
          </div>
        )}
        {slug === "wissen" && (
          <div className="article-grid">
            {articles.map((a, i) => (
              <Link href={`/wissen/${a.slug}`} key={a.slug}>
                <div className={`article-cover cover-${i}`} aria-hidden="true">
                  <span>PROZESSNOTIZEN / 0{i + 1}</span>
                  <div>{i === 0 ? "↳" : i === 1 ? "∑" : "⋈"}</div>
                </div>
                <small>{a.category}</small>
                <h2>{a.title}</h2>
                <p>{a.description}</p>
                <span className="text-link">
                  Beitrag lesen <Arrow />
                </span>
              </Link>
            ))}
          </div>
        )}
        {slug === "danke" && (
          <div className="narrow-panel">
            <span className="success-icon" aria-hidden="true">
              ✓
            </span>
            <h2>Der erste Schritt ist gemacht.</h2>
            <p>
              Wir prüfen Ihre Beschreibung und melden uns über den von Ihnen
              gewählten Kontaktweg. Bitte senden Sie dieselbe Anfrage nicht
              erneut.
            </p>
            <Link className="button" href="/wissen">
              In der Zwischenzeit weiterlesen <Arrow />
            </Link>
          </div>
        )}
      </div>
      {!page?.legal &&
        !["kontakt", "danke", "termin", "cookie-einstellungen"].includes(
          slug,
        ) && <CTA />}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [{ name: "Start", href: "/" }, ...crumbs].map(
            (c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              item: new URL(c.href, siteUrl).href,
            }),
          ),
        }}
      />
      {slug === "faq" && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(([name, text]) => ({
              "@type": "Question",
              name,
              acceptedAnswer: { "@type": "Answer", text },
            })),
          }}
        />
      )}
      {slug.startsWith("leistungen/") && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: info.title,
            description: info.description,
            areaServed: { "@type": "Country", name: "Deutschland" },
            url: new URL(`/${slug}`, siteUrl).href,
          }}
        />
      )}
      {article && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            datePublished: "2026-10-17",
            dateModified: "2026-10-17",
            author: { "@type": "Organization", name: company.name },
            mainEntityOfPage: new URL(`/${slug}`, siteUrl).href,
          }}
        />
      )}
    </>
  );
}
