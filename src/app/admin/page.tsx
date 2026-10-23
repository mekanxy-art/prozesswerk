import Link from "next/link";
import { Prisma, LeadStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logout, updateLead, retryJob } from "./actions";
const labels: Record<LeadStatus, string> = {
  NEW: "Neu",
  QUALIFIED: "Qualifiziert",
  CONTACTED: "Kontaktiert",
  WON: "Gewonnen",
  CLOSED: "Abgeschlossen",
};
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const admin = await requireAdmin();
  const q = await searchParams;
  const search = (q.q || "").slice(0, 100);
  const status = Object.keys(labels).includes(q.status || "")
    ? (q.status as LeadStatus)
    : undefined;
  const page = Math.max(1, Math.min(1000, Number(q.seite) || 1));
  const where: Prisma.LeadWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { company: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [leads, total, detail, failed] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 30,
      skip: (page - 1) * 30,
    }),
    db.lead.count({ where }),
    q.lead
      ? db.lead.findUnique({
          where: { id: q.lead },
          include: {
            activities: { orderBy: { createdAt: "desc" }, take: 50 },
            jobs: true,
          },
        })
      : null,
    db.outbox.count({ where: { failedAt: { not: null } } }),
  ]);
  const pageUrl = (n: number) =>
    `/admin?${new URLSearchParams({ q: search, status: status || "", seite: String(n) })}`;
  return (
    <div className="admin-shell">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">GESCHÜTZTE LEAD-VERWALTUNG</span>
          <h1>Anfragen im Überblick.</h1>
          <p>
            {admin.email} · {total} passende Anfragen
          </p>
        </div>
        <div className="admin-actions">
          <a className="button" href="/api/admin/export">
            CSV exportieren ↓
          </a>
          <form action={logout}>
            <button className="button">Abmelden</button>
          </form>
        </div>
      </div>
      {process.env.DELIVERY_ENABLED !== "true" && (
        <p className="notice">
          Externer Versand ist deaktiviert. Anfragen und Versandaufträge werden
          gespeichert, aber noch nicht zugestellt.
        </p>
      )}
      {failed > 0 && (
        <p className="notice error">
          {failed} Versandaufträge benötigen Prüfung. Öffnen Sie die zugehörige
          Anfrage, um Fehler und Wiederholung zu sehen.
        </p>
      )}
      <form className="filter-form" method="get">
        <label htmlFor="suche">
          Name, Unternehmen oder E-Mail
          <input id="suche" name="q" defaultValue={search} maxLength={100} />
        </label>
        <label htmlFor="status">
          Status
          <select id="status" name="status" defaultValue={status || ""}>
            <option value="">Alle Status</option>
            {Object.entries(labels).map(([v, l]) => (
              <option value={v} key={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <button className="button">Filtern</button>
      </form>
      {leads.length ? (
        <div className="table-wrap">
          <table>
            <caption className="small">Anfragen – neueste zuerst</caption>
            <thead>
              <tr>
                <th scope="col">Unternehmen</th>
                <th scope="col">Kontakt</th>
                <th scope="col">Prozess</th>
                <th scope="col">Status</th>
                <th scope="col">Eingang</th>
                <th scope="col">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>
                    <Link href={`/admin?lead=${l.id}`}>{l.company}</Link>
                  </td>
                  <td>{l.name}</td>
                  <td>{l.process}</td>
                  <td>
                    <span className="status">{labels[l.status]}</span>
                  </td>
                  <td>
                    {l.createdAt.toLocaleDateString("de-DE", {
                      timeZone: "Europe/Berlin",
                    })}
                  </td>
                  <td>
                    {l.nextFollowUpAt?.toLocaleDateString("de-DE", {
                      timeZone: "Europe/Berlin",
                    }) || "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">Keine passenden Anfragen vorhanden.</div>
      )}
      <nav className="pagination" aria-label="Lead-Seiten">
        {page > 1 && <Link href={pageUrl(page - 1)}>← Vorherige</Link>}
        <span>
          Seite {page} von {Math.max(1, Math.ceil(total / 30))}
        </span>
        {page * 30 < total && <Link href={pageUrl(page + 1)}>Nächste →</Link>}
      </nav>
      {detail && (
        <section className="admin-detail">
          <h2>{detail.company}</h2>
          {q.gespeichert && (
            <p className="notice" role="status">
              Änderungen gespeichert.
            </p>
          )}
          <dl>
            {[
              ["Kontakt", detail.name],
              ["E-Mail", detail.email],
              ["Telefon", detail.phone || "–"],
              ["Größe", detail.size],
              ["Prozess", detail.process],
              ["Herausforderung", detail.challenge],
              ["Budget", detail.budget || "–"],
              ["Kontaktweg", detail.contactWay],
              ["Quelle", detail.source],
              ["Zweck", detail.purpose],
              [
                "Marketing",
                detail.marketingConfirmedAt
                  ? "Bestätigt"
                  : detail.marketingRequested
                    ? "Unbestätigt"
                    : "Nicht angefragt",
              ],
              [
                "Widerspruch",
                detail.objectionAt?.toISOString() || "Keiner dokumentiert",
              ],
            ].map(([k, v]) => (
              <div className="dl-row" style={{ display: "contents" }} key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="admin-columns">
            <form action={updateLead} className="admin-form">
              <input type="hidden" name="id" value={detail.id} />
              <label>
                Status
                <select name="status" defaultValue={detail.status}>
                  {Object.entries(labels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Letzter Kontakt
                <input
                  type="date"
                  name="lastContactAt"
                  defaultValue={detail.lastContactAt
                    ?.toISOString()
                    .slice(0, 10)}
                />
              </label>
              <label>
                Nächstes Follow-up
                <input
                  type="date"
                  name="nextFollowUpAt"
                  defaultValue={detail.nextFollowUpAt
                    ?.toISOString()
                    .slice(0, 10)}
                />
              </label>
              <label>
                Neue interne Notiz
                <textarea name="note" rows={4} maxLength={2000} />
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  name="suppressed"
                  defaultChecked={detail.suppressed}
                />
                <span>Kontakt gesperrt / Widerspruch beachten</span>
              </label>
              <p className="small">
                Ein dokumentierter Widerspruch bleibt auch nach Entfernen der
                Sperrmarkierung erhalten. Vor Kampagnen sind Rechtsgrundlage,
                Quelle und Sperrstatus zu prüfen.
              </p>
              <button className="button">Änderungen speichern</button>
            </form>
            <div>
              <h3>Aktivitätshistorie</h3>
              <ol className="activity-list">
                {detail.activities.map((a) => (
                  <li key={a.id}>
                    <strong>{a.type}</strong>
                    <br />
                    {a.createdAt.toLocaleString("de-DE", {
                      timeZone: "Europe/Berlin",
                    })}{" "}
                    · {a.actor}
                    {a.note && <p>{a.note}</p>}
                  </li>
                ))}
              </ol>
              <h3>Zustellung</h3>
              {detail.jobs.map((j) => (
                <div key={j.id}>
                  <p className="small">
                    {j.kind}:{" "}
                    {j.sentAt
                      ? "Zugestellt"
                      : j.failedAt
                        ? "Fehlgeschlagen"
                        : "Wartend"}{" "}
                    · {j.attempts} Versuche {j.errorCode && ` · ${j.errorCode}`}
                  </p>
                  {j.failedAt && (
                    <form action={retryJob}>
                      <input type="hidden" name="id" value={j.id} />
                      <button className="button">
                        Nach Prüfung erneut einreihen
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
