import type { Metadata, Viewport } from "next";
import { fraunces, archivo, splineMono } from "./fonts";
import LenisProvider from "@/components/scroll/LenisProvider";
import Announcement from "@/components/chrome/Announcement";
import Header from "@/components/chrome/Header";
import Footer from "@/components/chrome/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://modernlifefurniture.co.uk"),
  title: {
    default: "Modern Life Furniture, vintage designer furniture, chairs first",
    template: "%s, Modern Life Furniture",
  },
  description:
    "Vintage designer furniture, chairs above all. Every piece one of one, checked, documented and delivered nationwide, sold by enquiry.",
  openGraph: {
    title: "Modern Life Furniture",
    description: "Vintage designer furniture, chairs first.",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Modern Life Furniture, the wordmark over the contour field",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Life Furniture",
    description: "Vintage designer furniture, chairs first.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ef",
  colorScheme: "light",
};

/* Sitewide Organization JSON-LD, per the SEO rules in CLAUDE.md. Static and
   serialised once at build; per-piece Product JSON-LD lives on the piece
   page. */
const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Modern Life Furniture",
  url: "https://modernlifefurniture.co.uk",
  email: "studio@modernlifefurniture.co.uk",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${fraunces.variable} ${archivo.variable} ${splineMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organisationJsonLd),
          }}
        />
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <LenisProvider>
          {/* In normal flow under the fixed header, so it scrolls away and
              the header keeps the top of the viewport. */}
          <Announcement />
          <Header />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
