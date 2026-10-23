import { createHmac } from "node:crypto";
import { db } from "./db";
import { requiredSecret } from "./security";
export function rateKey(
  scope: string,
  identity: string,
  windowMs: number,
  now = Date.now(),
) {
  return createHmac("sha256", requiredSecret("RATE_LIMIT_SECRET"))
    .update(`${scope}:${identity}:${Math.floor(now / windowMs)}`)
    .digest("hex");
}
export async function consumeRate(
  scope: string,
  identity: string,
  limit: number,
  windowMs: number,
) {
  const bucket = await db.rateBucket.upsert({
    where: { key: rateKey(scope, identity, windowMs) },
    create: {
      key: rateKey(scope, identity, windowMs),
      expiresAt: new Date(Date.now() + windowMs * 2),
    },
    update: { count: { increment: 1 } },
  });
  return bucket.count <= limit;
}
export function clientIdentity(headers: Headers) {
  return process.env.TRUST_PROXY === "true"
    ? headers.get("x-real-ip") || "unknown"
    : "shared";
}
