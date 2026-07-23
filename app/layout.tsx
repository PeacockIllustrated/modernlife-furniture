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
    default:
      "Modern Life Furniture, collected works by the furniture artists of the last century",
    template: "%s, Modern Life Furniture",
  },
  description:
    "A collector and restorer of vintage designer furniture. Found in attics and auction rooms, restored on our bench, and passed on with the story intact.",
  openGraph: {
    title: "Modern Life Furniture",
    description: "Bought, restored, rehomed.",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Modern Life furniture, the wordmark over the contour field",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Life Furniture",
    description: "Bought, restored, rehomed.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#e4e2db",
  colorScheme: "light",
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
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <LenisProvider>
          {/* In normal flow above the fixed header, so it scrolls away and
              the header takes over the top of the viewport. */}
          <Announcement />
          <Header />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
