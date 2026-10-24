import type { Metadata, Viewport } from "next";
import { Header, Footer, JsonLd } from "@/components/ui";
import { company, configured, siteUrl, indexable } from "@/lib/config";
import "./globals.css";
import "./design-v2.css";
import "./studio.css";
import "./open-design.css";
import "./taste-local.css";
import { PageTransitions } from "@/components/site-navigation";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Websites & Shops gestalten. Prozesse verbinden. | ${company.name}`,
    template: `%s | ${company.name}`,
  },
  description:
    "Websites und Shopify-Shops erstellen, Migrationen begleiten, SEO-Grundlagen schaffen und Geschäftsprozesse vereinfachen. Für kleine und mittelständische Unternehmen in Deutschland.",
  robots: { index: indexable, follow: indexable },
  openGraph: {
    locale: "de_DE",
    type: "website",
    siteName: company.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  themeColor: "#f3f3ec",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <a className="skip-link" href="#inhalt">
          Zum Inhalt
        </a>
        {!configured && (
          <div className="preview-notice">
            ENTWICKLUNGSSTAND · Unternehmensangaben und Rechtstexte sind noch zu
            vervollständigen.
          </div>
        )}
        <Header />
        <PageTransitions />
        <main id="inhalt" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        {configured && (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: company.name,
              url: siteUrl,
              email: company.email,
            }}
          />
        )}
      </body>
    </html>
  );
}
