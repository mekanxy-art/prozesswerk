import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
export const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export function requiredSecret(name: string) {
  const value = process.env[name];
  if (!value || value.length < 32) throw new Error(`CONFIG_${name}`);
  return value;
}
export function equal(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export function formToken(
  now = Date.now(),
  key = randomBytes(24).toString("hex"),
) {
  const payload = `${now}.${key}`;
  return `${payload}.${createHmac("sha256", requiredSecret("FORM_SECRET")).update(payload).digest("hex")}`;
}
export function verifyFormToken(token: string, now = Date.now()) {
  const [time, key, sig, extra] = token.split(".");
  if (
    extra ||
    !/^\d{13}$/.test(time || "") ||
    !/^[a-f0-9]{48}$/.test(key || "") ||
    !sig
  )
    return null;
  const age = now - Number(time);
  if (age < 1500 || age > 2 * 60 * 60 * 1000) return null;
  const expected = createHmac("sha256", requiredSecret("FORM_SECRET"))
    .update(`${time}.${key}`)
    .digest("hex");
  return equal(expected, sig) ? key : null;
}
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, hash: string) {
  const [algo, salt, expected] = hash.split(":");
  if (algo !== "scrypt" || !salt || !expected || password.length > 256)
    return false;
  return equal(scryptSync(password, salt, 64).toString("hex"), expected);
}
export function signWebhook(body: string, timestamp: string, secret: string) {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
}
export function verifyWebhook(
  body: string,
  timestamp: string,
  signature: string,
  secret: string,
  now = Date.now(),
) {
  return (
    /^\d{10}$/.test(timestamp) &&
    Math.abs(now / 1000 - Number(timestamp)) <= 300 &&
    equal(signWebhook(body, timestamp, secret), signature)
  );
}
export function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${(/^[\s]*[=+@\-\t\r]/.test(text) ? "'" : "") + text.replaceAll('"', '""')}"`;
}

/** No production fallback origin: an unconfigured mutation endpoint stays closed. */
export function originAllowed(
  origin: string | null,
  configured: string | undefined,
  production: boolean,
) {
  if (!origin || (production && !configured)) return false;
  try {
    const expected = new URL(configured || "http://localhost:3000");
    if (
      !["http:", "https:"].includes(expected.protocol) ||
      expected.username ||
      expected.password
    )
      return false;
    if (expected.pathname !== "/" || expected.search || expected.hash)
      return false;
    return origin === expected.origin;
  } catch {
    return false;
  }
}
