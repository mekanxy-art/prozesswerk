"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkOrigin, createSession, requireAdmin } from "@/lib/auth";
import { clientIdentity, consumeRate } from "@/lib/rate-limit";
import { digest, hashPassword, verifyPassword } from "@/lib/security";
export async function login(form: FormData) {
  await checkOrigin();
  const email = String(form.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") || "");
  if (email.length > 254 || password.length > 256)
    redirect("/admin/login?fehler=1");
  if (
    !(await consumeRate(
      "login-ip",
      clientIdentity(await headers()),
      20,
      900000,
    )) ||
    !(await consumeRate("login-email", email, 5, 900000))
  )
    redirect("/admin/login?fehler=limit");
  const admin = await db.admin.findUnique({ where: { email } });
  const valid = verifyPassword(
    password,
    admin?.passwordHash || hashPassword("unusable-dummy-password"),
  );
  if (!admin || !valid || admin.role !== "ADMIN") {
    await db.activity.create({
      data: { actor: "anonymous", type: "LOGIN_FAILED" },
    });
    redirect("/admin/login?fehler=1");
  }
  await createSession(admin.id);
  await db.activity.create({
    data: { actor: admin.id, type: "LOGIN_SUCCESS" },
  });
  redirect("/admin");
}
export async function logout() {
  await checkOrigin();
  const jar = await cookies();
  const token = jar.get("pw_session")?.value;
  if (token) await db.session.deleteMany({ where: { id: digest(token) } });
  jar.delete("pw_session");
  redirect("/admin/login");
}
const updateSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(["NEW", "QUALIFIED", "CONTACTED", "WON", "CLOSED"]),
  note: z.string().trim().max(2000),
  lastContactAt: z.string().max(10),
  nextFollowUpAt: z.string().max(10),
  suppressed: z.boolean(),
});
function dateValue(v: string) {
  if (!v) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v)))
    throw new Error("INVALID_DATE");
  return new Date(v + "T12:00:00Z");
}
export async function updateLead(form: FormData) {
  await checkOrigin();
  const admin = await requireAdmin();
  const data = updateSchema.parse({
    ...Object.fromEntries(form),
    suppressed: form.get("suppressed") === "on",
  });
  const last = dateValue(data.lastContactAt);
  const next = dateValue(data.nextFollowUpAt);
  await db.$transaction(async (tx) => {
    const old = await tx.lead.findUniqueOrThrow({ where: { id: data.id } });
    await tx.lead.update({
      where: { id: data.id },
      data: {
        status: data.status,
        lastContactAt: last,
        nextFollowUpAt: next,
        suppressed: data.suppressed,
        objectionAt: data.suppressed
          ? old.objectionAt || new Date()
          : old.objectionAt,
      },
    });
    await tx.activity.create({
      data: {
        leadId: data.id,
        actor: admin.id,
        type: `UPDATED:${old.status}->${data.status};SUPPRESSED:${data.suppressed}`,
        note: data.note || null,
      },
    });
  });
  revalidatePath("/admin");
  redirect(`/admin?lead=${data.id}&gespeichert=1`);
}
export async function retryJob(form: FormData) {
  await checkOrigin();
  const admin = await requireAdmin();
  const id = z.string().cuid().parse(form.get("id"));
  await db.$transaction(async (tx) => {
    const job = await tx.outbox.findUniqueOrThrow({ where: { id } });
    if (job.sentAt || !job.failedAt) return;
    await tx.outbox.update({
      where: { id },
      data: {
        failedAt: null,
        attempts: 0,
        availableAt: new Date(),
        lockedUntil: null,
        claimToken: null,
      },
    });
    await tx.activity.create({
      data: { leadId: job.leadId, actor: admin.id, type: "DELIVERY_REQUEUED" },
    });
  });
  revalidatePath("/admin");
}
