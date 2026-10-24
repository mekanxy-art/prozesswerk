import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow, CTA, FAQ, JsonLd } from "@/components/ui";
import { Mascot } from "@/components/visuals";
import { ProcessExplorer } from "@/components/process-explorer";
import { faq } from "@/lib/content";
import { company, siteUrl } from "@/lib/config";
export const metadata: Metadata = {
  title: "Websites, Shopify-Shops & Automatisierung",
  description:
    "Websites und Shopify-Shops erstellen, Shop-Migrationen begleiten und wiederkehrende Abläufe vereinfachen. Für kleine und mittelständische Unternehmen.",
  alternates: { canonical: "/" },
};
export default function Home() {
  return (
    <div className="studio-home taste-home">
      <section className="taste-hero">
        <div className="taste-hero-visual">
          <Mascot className="hero-mascot" priority />
          <p>
            Ihr Auftritt. Ihr Alltag.
            <br />
            Gut verbunden.
          </p>
        </div>
        <div className="taste-hero-copy">
          <h1>
            Digital.
            <br />
            Gut verbunden.
          </h1>
          <p>
            Websites, Shopify-Shops und Automatisierungen, die zu Ihrem
            Unternehmen passen.
          </p>
          <Link className="button hero-primary" href="/kontakt">
            Vorhaben besprechen <Arrow />
          </Link>
          <span className="taste-hero-note">
            Kostenloses Erstgespräch. Ein klarer nächster Schritt.
          </span>
        </div>
      </section>
      <section className="taste-intro section" aria-labelledby="intro-title">
        <h2 id="intro-title">
          Außen klar.
          <br />
          Innen einfacher.
        </h2>
        <div>
          <p>
            Ihre Website soll erklären, was Sie anbieten. Ihr Shop soll den Weg
            zum Produkt leicht machen. Und hinter den Kulissen sollen
            Informationen weiterfließen, statt immer wieder abgetippt zu werden.
          </p>
          <p>
            Wir setzen dort an, wo Sie heute Unterstützung brauchen. Mit einem
            neuen Auftritt, einem besseren Ablauf oder beidem.
          </p>
          <Link className="text-link" href="/leistungen">
            Unsere Leistungen <Arrow />
          </Link>
        </div>
      </section>
      <section
        className="taste-offers section"
        id="leistungen"
        aria-labelledby="offers-title"
      >
        <span id="entdecken" className="anchor-marker" aria-hidden="true" />
        <div className="taste-offers-title">
          <h2 id="offers-title">
            Was möchten Sie
            <br />
            verbessern?
          </h2>
          <p>Zwei Bereiche. Ein durchdachter Zusammenhang.</p>
        </div>
        <article className="taste-offer taste-offer-web">
          <div className="taste-offer-copy">
            <h3>Websites & Shops</h3>
            <p>
              Ein Auftritt, der Ihr Angebot verständlich macht und Besucher zum
              nächsten Schritt führt.
            </p>
            <ul>
              <li>
                <Link href="/leistungen/website-erstellung">
                  Website erstellen <Arrow />
                </Link>
              </li>
              <li>
                <Link href="/leistungen/website-optimierung">
                  Website optimieren & SEO <Arrow />
                </Link>
              </li>
              <li>
                <Link href="/leistungen/shopify-shop-erstellen">
                  Shopify-Shop erstellen <Arrow />
                </Link>
              </li>
              <li>
                <Link href="/leistungen/shopify-migration">
                  Zu Shopify wechseln <Arrow />
                </Link>
              </li>
            </ul>
            <Link
              className="text-link"
              href="/leistungen/websites-sichtbarkeit"
            >
              Zum Bereich Websites & Shops <Arrow />
            </Link>
          </div>
          <div className="taste-offer-picture">
            <Image
              src="/images/konzept-website.png"
              alt="Website-Gestaltungskonzept mit klarer Navigation und großem Einstiegsbereich"
              width={1120}
              height={780}
              sizes="(max-width: 700px) 90vw, 55vw"
            />
            <p>Website-Konzept von Prozesswerk. Fiktives Beispiel.</p>
          </div>
        </article>
        <article className="taste-offer taste-offer-process">
          <div className="taste-offer-copy">
            <h3>Prozesse & Automatisierung</h3>
            <p>
              Wiederkehrende Arbeit vereinfachen. Ihre vorhandenen Systeme
              verbinden. Mit Regeln, die Ihr Team versteht.
            </p>
            <ul className="taste-process-list">
              <li>Anfragen ins CRM übernehmen</li>
              <li>Dokumente aus vorhandenen Daten vorbereiten</li>
              <li>Aufgaben und Übergaben koordinieren</li>
            </ul>
            <p className="taste-offer-note">
              Analyse, Umsetzung und Prüfung gehören zusammen. KI setzen wir
              dort ein, wo sie für den vereinbarten Ablauf sinnvoll ist.
            </p>
            <Link
              className="text-link"
              href="/leistungen/prozesse-automatisierung"
            >
              Zum Bereich Automatisierung <Arrow />
            </Link>
          </div>
          <div className="taste-offer-picture taste-process-picture">
            <Image
              src="/images/connected-process-v2.webp"
              alt="Illustration: Eine Anfrage wird geprüft, im CRM zugeordnet und an das Team übergeben"
              width={1536}
              height={1024}
              sizes="(max-width: 700px) 90vw, 55vw"
            />
            <p>Ein möglicher Ablauf. Ihr Team behält die Kontrolle.</p>
          </div>
        </article>
      </section>
      <section className="section taste-work" aria-labelledby="work-title">
        <div className="taste-work-heading">
          <h2 id="work-title">So kann es aussehen.</h2>
          <p>
            Gestaltung wird greifbar, wenn man sie sieht.
            <br />
            Zwei eigene Konzepte zum Durchklicken.
          </p>
        </div>
        <div className="taste-work-grid">
          <a
            className="taste-work-item"
            href="/konzepte/website.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/konzept-website.png"
              alt="Werkraum: Website-Konzept für einen Handwerksbetrieb"
              width={1120}
              height={780}
              sizes="(max-width: 700px) 90vw, 55vw"
            />
            <div>
              <h3>Ein klarer Webauftritt</h3>
              <span>
                Konzept öffnen <Arrow />
              </span>
            </div>
            <p>Seitenstruktur, Gestaltung und ein direkter Kontaktweg.</p>
          </a>
          <a
            className="taste-work-item"
            href="/konzepte/shop.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/konzept-shop-final.png"
              alt="Alltag: Shop-Konzept mit Produktabbildung, Varianten und Produktdetails"
              width={1120}
              height={780}
              sizes="(max-width: 700px) 90vw, 40vw"
            />
            <div>
              <h3>Ein Produkt im Mittelpunkt</h3>
              <span>
                Konzept öffnen <Arrow />
              </span>
            </div>
            <p>Ein übersichtlicher Einstieg in ein kleines Sortiment.</p>
          </a>
        </div>
        <p className="taste-demo-note">
          Gestaltungsbeispiele mit fiktiven Marken. Keine Kundenreferenzen; der
          Shop ist eine Design-Demo ohne Kaufabwicklung.
        </p>
      </section>
      <section
        className="section studio-explorer taste-explorer"
        id="moeglichkeiten"
      >
        <div className="section-heading">
          <div>
            <h2>
              Weniger Routine.
              <br />
              Mehr Überblick.
            </h2>
          </div>
          <p>
            Wählen Sie ein Beispiel und vergleichen Sie die manuelle Arbeit mit
            einem verbundenen Ablauf.
          </p>
        </div>
        <ProcessExplorer />
        <Link className="text-link examples-link" href="/beispiele">
          Alle Prozessbeispiele <Arrow />
        </Link>
      </section>
      <section className="section taste-method" aria-labelledby="method-title">
        <div>
          <h2 id="method-title">
            Von der Idee
            <br />
            in Ihren Alltag.
          </h2>
          <Link className="text-link" href="/vorgehensweise">
            Unser Vorgehen <Arrow />
          </Link>
        </div>
        <ol className="process-steps">
          {[
            [
              "Verstehen",
              "Wir klären Ziel, Ausgangslage und die Menschen, die später damit arbeiten.",
            ],
            [
              "Umfang festlegen",
              "Sie erhalten einen Vorschlag mit Leistungen, Kosten und einem klaren Ziel.",
            ],
            [
              "Bauen & prüfen",
              "Wir setzen um und testen die vereinbarten Abläufe, auch bei Ausnahmen.",
            ],
            [
              "Gut übergeben",
              "Sie bekommen die Umsetzung, eine verständliche Dokumentation und klare Zuständigkeiten.",
            ],
          ].map(([title, text]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="section project-scope taste-scope">
        <div>
          <h2>
            Erst Klarheit.
            <br />
            Dann Umsetzung.
          </h2>
          <p>Was Sie vor einer Beauftragung wissen sollten.</p>
        </div>
        <div>
          <p>
            Der Preis richtet sich nach Umfang, Inhalten, Funktionen und
            bestehenden Systemen. Im kostenlosen Erstgespräch klären wir den
            passenden Einstieg. Danach erhalten Sie ein konkretes Angebot.
          </p>
          <ul>
            <li>Vereinbarte Leistungen und ein nachvollziehbarer Umfang.</li>
            <li>
              Einmalige Umsetzung und laufende Kosten getrennt ausgewiesen.
            </li>
            <li>Hosting, Shopify, Themes oder Apps vorab abgestimmt.</li>
            <li>
              Ausführliche Prozessanalysen bei Bedarf separat beauftragbar.
            </li>
          </ul>
          <Link href="/kontakt" className="text-link">
            Ihr Vorhaben besprechen <Arrow />
          </Link>
        </div>
      </section>
      <section className="section faq-section studio-faq taste-faq">
        <div>
          <h2>Gut zu wissen.</h2>
          <Link className="text-link" href="/faq">
            Alle Fragen <Arrow />
          </Link>
        </div>
        <FAQ limit={4} />
      </section>
      <CTA />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: company.name,
          url: siteUrl,
          inLanguage: "de-DE",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.slice(0, 4).map(([name, text]) => ({
            "@type": "Question",
            name,
            acceptedAnswer: { "@type": "Answer", text },
          })),
        }}
      />
    </div>
  );
}
