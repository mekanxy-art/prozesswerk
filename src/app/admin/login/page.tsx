import { login } from "../actions";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  const q = await searchParams;
  return (
    <div className="admin-shell">
      <div className="login-panel">
        <span className="eyebrow">GESCHÜTZTER BEREICH</span>
        <h1>Willkommen zurück.</h1>
        <p>Lead-Verwaltung für berechtigte Personen.</p>
        {q.fehler && (
          <p className="notice error" role="alert">
            {q.fehler === "limit"
              ? "Zu viele Versuche. Bitte in 15 Minuten erneut versuchen."
              : "Die Anmeldung war nicht erfolgreich."}
          </p>
        )}
        <form className="admin-form" action={login}>
          <label>
            E-Mail
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </label>
          <label>
            Passwort
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
            />
          </label>
          <button className="button">Sicher anmelden ↗</button>
        </form>
      </div>
    </div>
  );
}
