import Link from "next/link";
export default function NotFound() {
  return (
    <section className="error-page">
      <span className="eyebrow">404 / HIER GEHT ES NICHT WEITER</span>
      <h1>
        Dieser Weg ist
        <br />
        noch nicht verbunden.
      </h1>
      <p>Die gesuchte Seite existiert nicht oder wurde verschoben.</p>
      <Link className="button" href="/">
        Zur Startseite ↗
      </Link>
    </section>
  );
}
