import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { digest } from "@/lib/security";
import { checkOrigin } from "@/lib/auth";
export const metadata: Metadata = {
  title: "E-Mail-Einwilligung bestätigen",
  robots: { index: false, follow: false },
};
export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; fertig?: string }>;
}) {
  const q = await searchParams;
  const token = q.token || "";
  async function confirm(form: FormData) {
    "use server";
    await checkOrigin();
    const t = String(form.get("token") || "");
    if (!/^[a-f0-9]{64}$/.test(t)) redirect("/einwilligung?fertig=ungueltig");
    const changed = await db.$transaction(async (tx) => {
      const lead = await tx.lead.findFirst({
        where: {
          marketingTokenHash: digest(t),
          marketingTokenExpires: { gt: new Date() },
          suppressed: false,
          objectionAt: null,
          marketingConfirmedAt: null,
        },
      });
      if (!lead) return false;
      const result = await tx.lead.updateMany({
        where: {
          id: lead.id,
          marketingConfirmedAt: null,
          suppressed: false,
          objectionAt: null,
          marketingTokenHash: digest(t),
        },
        data: {
          marketingConfirmedAt: new Date(),
          marketingTokenHash: null,
          marketingTokenExpires: null,
        },
      });
      if (result.count !== 1) return false;
      await tx.activity.create({
        data: {
          leadId: lead.id,
          actor: "contact",
          type: "MARKETING_CONFIRMED:2026-10-17",
        },
      });
      return true;
    });
    redirect(`/einwilligung?fertig=${changed ? "ja" : "ungueltig"}`);
  }
  return (
    <section className="page-shell">
      <div className="page-hero">
        <span className="eyebrow">OPTIONALE E-MAIL-IMPULSE</span>
        <h1>Sie entscheiden.</h1>
        <p>
          {q.fertig === "ja"
            ? "Ihre Einwilligung wurde bestätigt. Sie können diese jederzeit widerrufen."
            : q.fertig
              ? "Dieser Link ist ungültig, bereits verwendet oder abgelaufen."
              : "Bestätigen Sie, dass Sie gelegentlich E-Mail-Impulse zur Prozessautomatisierung erhalten möchten. Ihre Prozessanfrage bleibt davon unabhängig."}
        </p>
      </div>
      {!q.fertig && /^[a-f0-9]{64}$/.test(token) && (
        <form action={confirm}>
          <input type="hidden" name="token" value={token} />
          <button className="button">
            E-Mail-Impulse verbindlich bestätigen
          </button>
          <p className="small">
            Mit Klick erteilen Sie Ihre freiwillige Einwilligung. Widerruf über
            den Link in Ihrer Bestätigungs-E-Mail oder den Datenschutzkontakt.
          </p>
        </form>
      )}
    </section>
  );
}
