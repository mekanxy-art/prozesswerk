import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { equal } from "@/lib/security";
import { preferenceToken } from "@/lib/delivery";
import { checkOrigin } from "@/lib/auth";
export const metadata: Metadata = {
  title: "E-Mail-Impulse widerrufen",
  robots: { index: false, follow: false },
};
export default async function Preferences({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string; fertig?: string }>;
}) {
  const q = await searchParams;
  async function withdraw(form: FormData) {
    "use server";
    await checkOrigin();
    const id = String(form.get("id") || "");
    const token = String(form.get("token") || "");
    if (!equal(token, preferenceToken(id)))
      redirect("/einstellungen?fertig=ungueltig");
    await db.$transaction(async (tx) => {
      const changed = await tx.lead.updateMany({
        where: { id },
        data: {
          suppressed: true,
          objectionAt: new Date(),
          marketingConfirmedAt: null,
          marketingTokenHash: null,
        },
      });
      if (changed.count)
        await tx.activity.create({
          data: { leadId: id, actor: "contact", type: "MARKETING_WITHDRAWN" },
        });
    });
    redirect("/einstellungen?fertig=ja");
  }
  return (
    <section className="page-shell">
      <div className="page-hero">
        <h1>E-Mail-Impulse verwalten.</h1>
        <p>
          {q.fertig === "ja"
            ? "Ihr Widerruf wurde gespeichert. Der Kontakt ist für weitere Marketingansprache gesperrt."
            : q.fertig
              ? "Dieser Link ist ungültig. Bitte wenden Sie sich an den Datenschutzkontakt."
              : "Sie können Ihre optionale Marketingeinwilligung hier jederzeit widerrufen."}
        </p>
      </div>
      {!q.fertig && q.id && q.token && (
        <form action={withdraw}>
          <input type="hidden" name="id" value={q.id} />
          <input type="hidden" name="token" value={q.token} />
          <button className="button">Einwilligung widerrufen</button>
        </form>
      )}
      <p className="small">
        Für sonstige Datenschutzanliegen finden Sie den Kontakt in den{" "}
        <a href="/datenschutz">Datenschutzhinweisen</a>.
      </p>
    </section>
  );
}
