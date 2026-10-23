import Link from "next/link";
import { type PageContent } from "@/lib/content";
import {
  serviceGroups,
  processUseCases,
  processSteps,
  websiteAreas,
} from "@/lib/offering";
import { MiniFlow, WebsiteArt } from "./visuals";
export function MarketingSections({
  slug,
  page,
}: {
  slug: string;
  page: PageContent;
}) {
  if (slug === "leistungen")
    return (
      <div className="offering-overview">
        {serviceGroups.map((group, i) => (
          <section className="offering-group" key={group.href}>
            <div className="offering-art">
              {i === 0 ? <WebsiteArt /> : <MiniFlow variant={2} />}
            </div>
            <span className="eyebrow">
              0{i + 1} / {group.title}
            </span>
            <h2>{group.promise}</h2>
            <p>{group.text}</p>
            <div className="offering-process">
              <Link className="process-offer-link" href={group.href}>
                {i === 0
                  ? "Websites & Shops erstellen und verbessern"
                  : "Prozesse verbessern & automatisieren"}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
              <span className="eyebrow">
                {i === 0
                  ? "LEISTUNGEN IM ÜBERBLICK"
                  : "BEISPIELE AUS DEM ARBEITSALLTAG"}
              </span>
              <ul>
                {(i === 0 ? websiteAreas : processUseCases).map((c) => (
                  <li key={c.title}>
                    <strong>{c.title}</strong>
                    <p>{c.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Link className="text-link" href="/kontakt">
              {i === 1
                ? "Über Ihren Ablauf sprechen"
                : "Über Ihren Webauftritt sprechen"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </section>
        ))}
      </div>
    );
  if (slug === "leistungen/prozesse-automatisierung")
    return (
      <div className="process-service-overview">
        <section className="process-service-intro">
          <span className="eyebrow">
            EINE LEISTUNG. EIN ZUSAMMENHÄNGENDER ABLAUF.
          </span>
          <h2>
            Prozesse verbessern
            <br />& automatisieren.
          </h2>
          <p>
            Sie brauchen keine einzelnen Technikbausteine zu buchen. Wir
            begleiten den Weg vom heutigen Ablauf bis zur getesteten Umsetzung.
            Die folgenden Bereiche zeigen, wo das im Alltag helfen kann.
          </p>
        </section>
        <div className="process-usecases">
          {processUseCases.map((c, i) => (
            <section className="process-usecase" id={c.id} key={c.id}>
              <span className="eyebrow">BEISPIEL / 0{i + 1}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <div
                className="usecase-flow"
                role="group"
                aria-label="Möglicher Ablauf"
              >
                {c.flow.map((label, j) => (
                  <span key={label}>
                    {j > 0 && <b aria-hidden="true">→</b>}
                    {label}
                  </span>
                ))}
              </div>
              <Link className="text-link" href={c.href}>
                Beispiel vertiefen <span aria-hidden="true">↗</span>
              </Link>
            </section>
          ))}
        </div>
        <section className="process-method">
          <span className="eyebrow">SO ARBEITEN WIR ZUSAMMEN</span>
          <h2>
            Vier Schritte.
            <br />
            Ein sinnvoller Prozess.
          </h2>
          <ol>
            {processSteps.map(([title, text], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="process-service-end">
          <div>
            <h3>Erst einmal Klarheit schaffen?</h3>
            <p>
              Eine ausführliche Prozessanalyse kann auch separat beauftragt
              werden. Im kostenlosen Erstgespräch klären wir, welcher Einstieg
              zu Ihnen passt.
            </p>
          </div>
          <Link
            className="text-link"
            href="/leistungen/prozessanalyse-optimierung"
          >
            Mehr zur Prozessanalyse <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </div>
    );
  const group = serviceGroups.find((g) => g.href === "/" + slug);
  if (group)
    return (
      <div className="service-detail-grid">
        {page.sections.map((s, i) => (
          <section id={"abschnitt-" + i} key={s.title}>
            {group === serviceGroups[0] ? (
              <div className="mini-flow website-service-art">
                <WebsiteArt shop={group.links[i][0].includes("shopify")} />
              </div>
            ) : (
              <MiniFlow variant={i % 3} />
            )}
            <span className="eyebrow">
              0{i + 1} / {group.title}
            </span>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
            <ul>
              {s.bullets?.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Link className="text-link" href={group.links[i][0]}>
              Leistung entdecken <span aria-hidden="true">↗</span>
            </Link>
          </section>
        ))}
      </div>
    );
  if (slug === "beispiele")
    return (
      <div className="case-list-v2">
        {page.sections.map((s, i) => (
          <section id={`abschnitt-${i}`} key={s.title} className="case-card">
            <div className={`case-visual case-visual-${i}`}>
              <span className="eyebrow">BEISPIELPROZESS / 0{i + 1}</span>
              <div className="case-visual-symbol" aria-hidden="true">
                {["↗", "▤", "⋈"][i]}
              </div>
              <div className="case-flow-labels">
                {[
                  ["Anfrage", "Prüfen", "CRM"],
                  ["Daten", "Freigabe", "Dokument"],
                  ["Auftrag", "Aufgaben", "Start"],
                ][i].map((t, j) => (
                  <span key={t}>
                    {j > 0 && <b aria-hidden="true">→</b>}
                    {t}
                  </span>
                ))}
              </div>
              <small>KONZEPT · KEIN KUNDENPROJEKT</small>
            </div>
            <div className="case-copy">
              <h2>{s.title.replace(/^Beispiel \d+ \/ /, "")}</h2>
              {s.text
                .split(/(?=Ausgangslage:|Lösung:|Ausnahme:|Messen:)/)
                .filter(Boolean)
                .map((part) => {
                  const separator = part.indexOf(":");
                  return (
                    <div className="case-copy-part" key={part}>
                      <h3>{part.slice(0, separator)}</h3>
                      <p>{part.slice(separator + 1).trim()}</p>
                    </div>
                  );
                })}
              <Link className="text-link" href="/kontakt">
                Über einen ähnlichen Ablauf sprechen{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        ))}
      </div>
    );
  if (slug === "loesungen")
    return (
      <div className="industry-grid">
        {page.sections.map((s, i) => (
          <section id={`abschnitt-${i}`} key={s.title}>
            <span className="industry-number">0{i + 1}</span>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
            <Link className="text-link" href="/kontakt">
              Passt das zu Ihrem Team? <span aria-hidden="true">↗</span>
            </Link>
          </section>
        ))}
      </div>
    );
  return null;
}
