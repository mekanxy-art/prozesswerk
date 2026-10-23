import { MotionMarquee } from "@/components/motion-page";
import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, CTA, FAQ, JsonLd } from "@/components/ui";
import { Mascot, MiniFlow, WebsiteArt } from "@/components/visuals";
import { ProcessExplorer } from "@/components/process-explorer";
import { serviceGroups } from "@/lib/offering";
import { faq } from "@/lib/content";
import { company, siteUrl } from "@/lib/config";
export const metadata: Metadata = {
  title: "Websites, Shopify-Shops & Automatisierung",
  description:
    "Websites und Shopify-Shops erstellen, Shop-Migrationen begleiten und Prozesse vereinfachen. Für Unternehmen im Mittelstand.",
  alternates: { canonical: "/" },
};
export default function Home() {
  return (
    <div className="studio-home">
      <section className="studio-hero master-hero">
        <div className="hero-meta">
          <span>
            <i className="status-dot" /> WEBSITES, SHOPS & PROZESSE
          </span>
          <span>VON DER WEBSITE BIS ZUM WORKFLOW.</span>
        </div>
        <h1>
          <span>Websites.</span>
          <span>Online-Shops.</span>
          <span className="outline-title">Weniger Routine.</span>
        </h1>
        <div className="hero-bottom">
          <p>
            Wir gestalten Ihren Webauftritt, erstellen Shopify-Shops und
            vereinfachen wiederkehrende Abläufe. Für kleine und mittelständische
            Unternehmen.
          </p>
          <div className="hero-actions">
            <Link className="button hero-primary" href="/kontakt">
              Projekt anfragen <Arrow />
            </Link>
            <Link className="text-link" href="/leistungen">
              Leistungen ansehen <Arrow />
            </Link>
          </div>
          <p className="hero-first-step">
            Kostenloses Erstgespräch · Umsetzung nach vereinbartem Umfang
          </p>
        </div>
        <div className="hero-character">
          <span className="character-note">
            Hallo, ich verbinde. <span aria-hidden="true">↘</span>
          </span>
          <Mascot className="hero-mascot" priority />
          <span className="character-caption">
            <i className="status-dot" /> ALLES GUT VERBUNDEN.
          </span>
        </div>
        <div className="hero-index">
          <span>01 / MEHR ZEIT FÜR GUTE ARBEIT</span>
          <span>KONZEPT → VERBINDUNG → FREIRAUM</span>
        </div>
      </section>
      <MotionMarquee />
      <section className="studio-services section" id="leistungen">
        <span id="entdecken" className="anchor-marker" aria-hidden="true" />
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / UNSERE LEISTUNGEN</span>
            <h2>
              Wählen Sie Ihren
              <br />
              <span>Einstieg.</span>
            </h2>
          </div>
          <Link className="text-link" href="/leistungen">
            Alle Leistungen <Arrow />
          </Link>
        </div>
        <div className="studio-service-list">
          {serviceGroups.map((group, i) => (
            <Link
              key={group.href}
              className="studio-service-row"
              href={group.href}
            >
              <span className="row-number">0{i + 1}</span>
              <div>
                <small>
                  {i === 0
                    ? "EIN AUFTRITT, DER ZU IHNEN PASST"
                    : "WENIGER ROUTINE. MEHR FREIRAUM."}
                </small>
                <h3>{group.title}</h3>
                <p>{group.text}</p>
              </div>
              {i === 0 ? (
                <div className="mini-flow website-mini">
                  <WebsiteArt />
                </div>
              ) : (
                <MiniFlow variant={2} />
              )}
              <span className="service-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section studio-explorer" id="moeglichkeiten">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              02 / AUTOMATISIERUNG AN EINEM BEISPIEL
            </span>
            <h2>
              So könnte es
              <br />
              <em>für Sie laufen.</em>
            </h2>
          </div>
          <p>
            Entdecken Sie typische Abläufe hinter Ihrer Website.
            <br />
            Wählen Sie Ihren Bereich.
          </p>
        </div>
        <ProcessExplorer />
        <Link className="text-link examples-link" href="/beispiele">
          Alle Beispielprozesse entdecken <Arrow />
        </Link>
      </section>
      <section className="section studio-process">
        <div className="section-heading">
          <div>
            <span className="eyebrow">03 / SO GEHT ES WEITER</span>
            <h2>
              Vom ersten Hallo.
              <br />
              Bis es <em>einfach läuft.</em>
            </h2>
          </div>
          <Link className="text-link" href="/vorgehensweise">
            Unser Vorgehen <Arrow />
          </Link>
        </div>
        <ol className="process-steps">
          {[
            [
              "Zuhören",
              "Wir klären Ihr Ziel: eine Website, einen Shop oder einen besseren Ablauf.",
            ],
            [
              "Klarheit schaffen",
              "Sie erhalten einen Vorschlag mit Umfang, Kosten und einem konkreten Ziel.",
            ],
            [
              "Umsetzen & testen",
              "Wir setzen um. Sie prüfen mit uns Normalfälle und Ausnahmen.",
            ],
            [
              "Gut übergeben",
              "Dokumentation, Zuständigkeiten und vereinbarte Betreuung sind geklärt.",
            ],
          ].map(([title, text], i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="section project-scope">
        <div>
          <span className="eyebrow">04 / UMFANG & KOSTEN</span>
          <h2>
            Ein klares Angebot.
            <br />
            <em>Vor der Umsetzung.</em>
          </h2>
        </div>
        <div>
          <p>
            Der Preis hängt von Seitenumfang, Inhalten, Funktionen und
            vorhandenen Systemen ab. Im Erstgespräch klären wir, was Sie
            brauchen. Danach erhalten Sie einen Vorschlag mit Leistungsumfang
            und Kosten.
          </p>
          <ul>
            <li>
              Einmalige Umsetzung und laufende Kosten werden getrennt benannt.
            </li>
            <li>
              Hosting, Shopify, Themes oder Apps stimmen wir vorab mit Ihnen ab.
            </li>
            <li>
              Eine ausführliche Prozessanalyse kann separat beauftragt werden.
            </li>
          </ul>
          <Link href="/kontakt" className="text-link">
            Ihr Vorhaben besprechen <Arrow />
          </Link>
        </div>
      </section>
      <section className="section faq-section studio-faq">
        <div>
          <span className="eyebrow">05 / GUT ZU WISSEN</span>
          <h2>
            Gute Fragen.
            <br />
            <em>Klare Antworten.</em>
          </h2>
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
