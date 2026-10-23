import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { csvCell } from "@/lib/security";
export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return new NextResponse("Nicht autorisiert", { status: 401 });
  const leads = await db.lead.findMany({
    take: 10000,
    orderBy: { createdAt: "desc" },
  });
  const rows = [
    [
      "ID",
      "Name",
      "Unternehmen",
      "E-Mail",
      "Telefon",
      "Größe",
      "Prozess",
      "Herausforderung",
      "Budget",
      "Kontaktweg",
      "Status",
      "Quelle",
      "Zweck",
      "Eingang",
      "Letzter Kontakt",
      "Follow-up",
      "Widerspruch",
      "Gesperrt",
    ],
    ...leads.map((l) => [
      l.id,
      l.name,
      l.company,
      l.email,
      l.phone,
      l.size,
      l.process,
      l.challenge,
      l.budget,
      l.contactWay,
      l.status,
      l.source,
      l.purpose,
      l.createdAt.toISOString(),
      l.lastContactAt?.toISOString(),
      l.nextFollowUpAt?.toISOString(),
      l.objectionAt?.toISOString(),
      l.suppressed,
    ]),
  ];
  await db.activity.create({ data: { actor: admin.id, type: "CSV_EXPORTED" } });
  return new NextResponse(
    "\uFEFF" + rows.map((r) => r.map(csvCell).join(";")).join("\r\n"),
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="leads.csv"',
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
