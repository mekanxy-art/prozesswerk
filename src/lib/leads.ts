import { privacyVersion } from "./config";
import { Prisma } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { db } from "./db";
import { digest } from "./security";
import type { LeadInput } from "./validation";
export async function saveLead(input: LeadInput, requestKey: string) {
  const { privacy: _privacy, marketing, ...fields } = input;
  void _privacy;
  try {
    return await db.$transaction(async (tx) => {
      const token = marketing ? randomBytes(32).toString("hex") : null;
      const lead = await tx.lead.create({
        data: {
          ...fields,
          purpose: "Bearbeitung einer Projektanfrage",
          privacyVersion,
          requestKey,
          marketingRequested: marketing,
          marketingTokenHash: token ? digest(token) : null,
          marketingTokenExpires: token ? new Date(Date.now() + 86400000) : null,
        },
      });
      // Token is never persisted in plaintext. Worker issues a fresh token when sending DOI.
      await tx.outbox.createMany({
        data: [
          "INTERNAL_MAIL",
          "RECEIPT_MAIL",
          ...(process.env.N8N_WEBHOOK_URL ? ["WEBHOOK"] : []),
          ...(marketing ? ["DOUBLE_OPT_IN"] : []),
        ].map((kind) => ({
          leadId: lead.id,
          kind: kind as
            "INTERNAL_MAIL" | "RECEIPT_MAIL" | "WEBHOOK" | "DOUBLE_OPT_IN",
        })),
      });
      await tx.activity.create({
        data: { leadId: lead.id, actor: "system", type: "LEAD_CREATED" },
      });
      return lead;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existing = await db.lead.findUnique({ where: { requestKey } });
      if (existing) return existing;
    }
    throw error;
  }
}
