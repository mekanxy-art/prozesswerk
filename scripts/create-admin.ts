import "dotenv/config";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/security";
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 16)
    throw new Error(
      "ADMIN_EMAIL und ADMIN_PASSWORD (mindestens 16 Zeichen) als temporäre Umgebungsvariablen setzen.",
    );
  await db.admin.upsert({
    where: { email },
    create: { email, passwordHash: hashPassword(password) },
    update: { passwordHash: hashPassword(password) },
  });
  await db.session.deleteMany({ where: { admin: { email } } });
  console.log(
    "Admin gespeichert. Bestehende Sitzungen dieses Kontos wurden widerrufen.",
  );
}
main().finally(() => db.$disconnect());
