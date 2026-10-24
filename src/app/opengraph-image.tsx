import { ImageResponse } from "next/og";
import { company } from "@/lib/config";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Digital. Gut verbunden. – Prozesswerk";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#f3f3ec",
        color: "#252d27",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 26, display: "flex" }}>
        {company.name} / PROZESSE. VERBUNDEN.
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        <span>Digital.</span>
        <span>Gut verbunden.</span>
      </div>
      <div style={{ fontSize: 24 }}>
        Websites, Shopify und Automatisierung für Unternehmen
      </div>
    </div>,
    size,
  );
}
