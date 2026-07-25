import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getPieces, getPieceHeroImages } from "@/lib/collection";
import ShopGrid from "@/components/collection/ShopGrid";
import FeatureBand from "@/components/gallery/FeatureBand";
import RevealObserver from "@/components/scroll/RevealObserver";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Every piece in the collection, one of one: vintage designer chairs and modern classics, filtered by era and availability. Checked, documented and delivered nationwide.",
};

export const revalidate = 60;

/**
 * The shop: one grid of everything for sale, with era, availability and
 * search narrowing it in the browser. The eras still have pages of their
 * own, reached from the home page and the footer, but a buyer who wants to
 * see the lot no longer has to walk through five rooms to do it.
 */
export default async function ShopPage() {
  const [categories, pieces] = await Promise.all([
    getCategories(),
    getPieces(),
  ]);
  const images = await getPieceHeroImages(pieces.map((p) => p.slug));

  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Shop</span>
      </nav>

      <div className="page-head">
        <span className="mono eyebrow">Browse</span>
        <h1>Shop the collection</h1>
        <p>
          Every piece is one of one, checked over, photographed honestly and
          sold with its condition report. Filter by era or availability, or
          search for what you have in mind.
        </p>
      </div>

      {pieces.length === 0 ? (
        <p className="shop-empty">
          Nothing is listed at the moment. Tell us what you are after and we
          will let you know when the right piece arrives.
        </p>
      ) : (
        <ShopGrid pieces={pieces} images={images} categories={categories} />
      )}

      <FeatureBand
        eyebrow="More chairs than reach the website"
        heading="Looking for something in particular"
        body="Tell us what you are after and we will find it. And if you have a piece by one of the designers of the last century, we buy."
        cta={{ label: "Make an enquiry", href: "/enquire" }}
        visual="rings"
      />

      <RevealObserver />
    </main>
  );
}
