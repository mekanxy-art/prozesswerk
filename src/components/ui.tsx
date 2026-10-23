import Link from "next/link";
import { headers } from "next/headers";
import { company } from "@/lib/config";
import { faq, serviceLinks } from "@/lib/content";
import { Mascot } from "./visuals";
import { SiteNavigation } from "./site-navigation";
export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
export function CTA({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`cta-band cta-v2 ${compact ? "compact" : ""}`}>
      <div className="cta-mascot">
        <Mascot />
      </div>
      <div>
        <span className="eyebrow">DER ERSTE SCHRITT IST EIN GESPRÄCH.</span>
        <h2>
          Was darf für Sie
          <br />
          einfacher werden?
        </h2>
        <p>
          Erzählen Sie uns von Ihrer Website oder Ihrem Ablauf. Wir denken mit.
          <br />
          Kostenlos und unverbindlich.
        </p>
      </div>
      <Link className="button light" href="/kontakt">
        Kostenloses Erstgespräch <Arrow />
      </Link>
    </section>
  );
}
export function FAQ({ limit }: { limit?: number }) {
  return (
    <div className="faq-list">
      {faq.slice(0, limit).map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function Header() {
  return <SiteNavigation name={company.name} />;
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link className="footer-brand" href="/">
            {company.name}
            <span aria-hidden="true">↗</span>
          </Link>
          <p>
            Ein klarer Auftritt.
            <br />
            Durchdachte digitale Prozesse.
          </p>
          <p className="small">Für Unternehmen in Deutschland.</p>
        </div>
        <div>
          <strong>Unsere Leistungen</strong>
          {serviceLinks.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          <Link href="/loesungen">Lösungen nach Anwendungsfall</Link>
        </div>
        <div>
          <strong>Ein guter Anfang</strong>
          <Link href="/vorgehensweise">Unsere Vorgehensweise</Link>
          <Link href="/beispiele">Beispielprozesse</Link>
          <Link href="/faq">Häufige Fragen</Link>
          <Link href="/termin">Erstgespräch</Link>
          <Link href="/kontakt">Kontakt</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {company.name}
        </span>
        <div>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/cookie-einstellungen">Datenschutzeinstellungen</Link>
        </div>
      </div>
    </footer>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label="Brotkrumennavigation">
      <Link href="/">Start</Link>
      {items.map((item, i) => (
        <span key={item.href}>
          <span aria-hidden="true">/</span>
          {i === items.length - 1 ? (
            <span aria-current="page">{item.name}</span>
          ) : (
            <Link href={item.href}>{item.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
export async function JsonLd({ data }: { data: unknown }) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <script
      nonce={nonce}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export function Workflow({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`workflow ${small ? "small-workflow" : ""}`}
      role="img"
      aria-label="Beispiel eines Workflows: Anfrage erfassen, Daten prüfen, CRM aktualisieren und Team benachrichtigen. Unklare Daten werden manuell geprüft."
    >
      <div className="flow-toolbar">
        <span>
          <i /> WORKFLOW / ANFRAGEN
        </span>
        <span className="flow-tag">BEISPIEL</span>
      </div>
      <div className="flow-canvas">
        <div className="flow-dots" />
        <div className="flow-node node-in">
          <span className="node-icon">↙</span>
          <div>
            <small>01 / AUSLÖSER</small>
            <strong>Neue Anfrage</strong>
            <span>Formular eingegangen</span>
          </div>
          <b>✓</b>
        </div>
        <div className="flow-line line-a">
          <span />
        </div>
        <div className="flow-node node-check">
          <span className="node-icon">⋈</span>
          <div>
            <small>02 / PRÜFEN</small>
            <strong>Daten vollständig?</strong>
            <span>Regeln & Zuständigkeit</span>
          </div>
          <b>✓</b>
        </div>
        <div className="flow-line line-b">
          <span />
        </div>
        <div className="flow-node node-crm">
          <span className="node-icon">▤</span>
          <div>
            <small>03 / VERBINDEN</small>
            <strong>CRM aktualisieren</strong>
            <span>Kontakt sicher zuordnen</span>
          </div>
          <b>✓</b>
        </div>
        <div className="flow-line line-c">
          <span />
        </div>
        <div className="flow-node node-team">
          <span className="node-icon">↗</span>
          <div>
            <small>04 / WEITERGEHEN</small>
            <strong>Team informieren</strong>
            <span>Der nächste Schritt ist klar.</span>
          </div>
          <b>✓</b>
        </div>
        <div className="flow-exception">
          <span>↳</span> Unklare Daten? Menschliche Prüfung.
        </div>
        <div className="flow-note">
          <i /> Systeme arbeiten zusammen.
          <br />
          <strong>Ihr Team behält die Kontrolle.</strong>
        </div>
      </div>
      <div className="flow-footer">
        <span>
          <i /> Regeln statt Copy & Paste
        </span>
        <span>MIT MENSCHLICHER FREIGABE</span>
      </div>
    </div>
  );
}
