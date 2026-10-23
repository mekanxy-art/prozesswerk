"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="error-page">
      <h1>Dieser Schritt hat nicht funktioniert.</h1>
      <p>
        Bitte laden Sie die Seite erneut. Interne Fehlerdetails werden nicht
        angezeigt.
      </p>
      <button className="button" onClick={reset}>
        Erneut versuchen
      </button>
    </section>
  );
}
