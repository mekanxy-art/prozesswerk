import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { db } from "./db";
import { digest } from "./security";
export async function checkOrigin() {
  const h = await headers();
  const allowed = new URL(process.env.APP_ORIGIN || "http://localhost:3000")
    .origin;
  if (h.get("origin") !== allowed) throw new Error("ORIGIN_DENIED");
}
export async function currentAdmin() {
  const token = (await cookies()).get("pw_session")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await db.session.findUnique({
    where: { id: digest(token) },
    include: { admin: true },
  });
  if (
    !session ||
    session.expiresAt.getTime() < Date.now() ||
    session.admin.role !== "ADMIN"
  )
    return null;
  return session.admin;
}
export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
export async function createSession(adminId: string) {
  const token = randomBytes(32).toString("hex");
  await db.session.create({
    data: {
      id: digest(token),
      adminId,
      expiresAt: new Date(Date.now() + 8 * 3600000),
    },
  });
  (await cookies()).set("pw_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 3600,
  });
}
