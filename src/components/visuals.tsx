import Image from "next/image";

export function Mascot({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      className={className}
      src="/images/connector-mascot-v2.webp"
      alt=""
      width={1024}
      height={1024}
      sizes="(max-width: 700px) 80vw, 480px"
      priority={priority}
    />
  );
}

export function MascotStage() {
  return (
    <div className="mascot-stage">
      <div className="stage-topline">
        <span>
          <i /> IHRE PROZESSE. GUT VERBUNDEN.
        </span>
        <span>BEISPIEL</span>
      </div>
      <div className="stage-orbit orbit-one" aria-hidden="true" />
      <div className="stage-orbit orbit-two" aria-hidden="true" />
      <div className="stage-task task-in">
        <span className="task-symbol">↙</span>
        <div>
          <small>EINGANG</small>
          <strong>Neue Anfrage</strong>
        </div>
        <span className="task-check">✓</span>
      </div>
      <Mascot className="hero-mascot" priority />
      <div className="stage-task task-done">
        <span className="task-symbol">✓</span>
        <div>
          <small>NÄCHSTER SCHRITT</small>
          <strong>Im CRM zugeordnet</strong>
        </div>
      </div>
      <div className="mascot-signature">
        <span>Hallo, ich verbinde.</span>
        <svg viewBox="0 0 65 40" fill="none" aria-hidden="true">
          <path
            d="M2 2C45 0 12 38 59 30M48 22l12 8-10 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="stage-bottomline">
        <span>Ihre Systeme arbeiten zusammen.</span>
        <strong>Sie behalten den Überblick. ↗</strong>
      </div>
    </div>
  );
}

export function ProcessArt({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      className={className}
      src="/images/connected-process-v2.webp"
      alt="Illustration: Ein Postfach, ein Prozessbaustein und ein orangefarbener Bogen sind durch ein Kabel verbunden."
      width={1536}
      height={1024}
      sizes="(max-width: 800px) 92vw, 650px"
      priority={priority}
    />
  );
}

export function MiniFlow({ variant = 0 }: { variant?: number }) {
  const labels = [
    ["Anfrage", "Prüfen", "CRM"],
    ["Auftrag", "Freigabe", "Start"],
    ["Ihre Tools", "n8n", "Ein Ablauf"],
  ][variant];
  return (
    <div className={`mini-flow mini-flow-${variant}`} aria-hidden="true">
      <div className="mini-flow-track" />
      {labels.map((s, i) => (
        <div className={`mini-flow-node mini-node-${i}`} key={s}>
          <span>{i === 0 ? "↙" : i === 1 ? "⋈" : "✓"}</span>
          <small>{s}</small>
        </div>
      ))}
    </div>
  );
}

export function WebsiteArt({ shop = false }: { shop?: boolean }) {
  return (
    <div
      className="website-art"
      role="img"
      aria-label={
        shop
          ? "Konzept eines Online-Shops mit Produktübersicht und Kaufweg"
          : "Konzept einer Unternehmenswebsite mit klarer Navigation, Angebot und Kontaktweg"
      }
    >
      <div className="website-chrome">
        <span>● ● ●</span>
        <span>{shop ? "IHR ONLINE-SHOP" : "IHRE WEBSITE"}</span>
        <span>↗</span>
      </div>
      <div className="website-art-content">
        <div className="website-art-nav">
          <strong>{shop ? "Ihre Marke." : "Ihr Unternehmen."}</strong>
          <span>{shop ? "Produkte · Warenkorb" : "Über uns · Kontakt"}</span>
        </div>
        <small>KLAR. SICHTBAR. VERBUNDEN.</small>
        <div className="website-art-title">
          {shop ? "Ihre Produkte." : "Ein guter"}
          <br />
          {shop ? "Ihr eigener Shop." : "erster Eindruck."}
        </div>
        <div className="website-art-bottom">
          <span className="website-art-button">
            {shop ? "Produkte entdecken ↗" : "Kontakt aufnehmen ↗"}
          </span>
          <span className="website-art-star" aria-hidden="true">
            ✳
          </span>
        </div>
      </div>
      <div className="website-art-caption">
        GESTALTUNGSKONZEPT / KEINE KUNDENREFERENZ
      </div>
    </div>
  );
}
