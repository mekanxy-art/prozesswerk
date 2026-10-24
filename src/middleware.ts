import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const production = process.env.NODE_ENV === "production";
  // Only Next/Image's fixed, non-executable color declaration is allowed inline.
  const styles = production
    ? `style-src 'self' 'nonce-${nonce}'; style-src-attr 'unsafe-hashes' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk='`
    : "style-src 'self' 'unsafe-inline'";
  const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV !== "production" ? "'unsafe-eval'" : ""}; ${styles}; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`;
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  const privateLink = ["/einwilligung", "/einstellungen"].includes(
    request.nextUrl.pathname,
  );
  // Preserve Origin for native POST forms while excluding URL paths and tokens
  // from referrers. `no-referrer` makes Chromium send Origin: null here.
  if (privateLink) response.headers.set("Referrer-Policy", "strict-origin");
  if (
    privateLink ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/danke"
  ) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
