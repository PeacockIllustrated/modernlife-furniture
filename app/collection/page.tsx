import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/collection";
import { rooms } from "@/content/landing";
import RevealObserver from "@/components/scroll/RevealObserver";

export const metadata: Metadata = {
  title: "The collection",
  description:
    "Chairs, shelving and storage, cabinets and sideboards, and tables. Vintage designer furniture, bought, restored and rehomed.",
};

/**
 * The collection index: the four product rooms as catalogue entries, plus the
 * restoration service. Restoration lives at its own service page, so it links
 * out rather than to a product listing.
 */
export default async function CollectionIndex() {
  const categories = await getCategories();
  const visualBySlug = new Map(rooms.map((r) => [r.slug, r]));

  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Collection</span>
      </nav>

      <div className="page-head">
        <span className="mono eyebrow">Five rooms, one bench</span>
        <h1>The collection</h1>
        <p>
          Each category is a room in the gallery. The collection changes weekly
          and the best pieces rarely reach the website; if you are after
          something in particular, tell us and we will find it.
        </p>
      </div>

      <div className="specimen-index">
        {categories.map((category) => {
          const room = visualBySlug.get(category.slug);
          const href =
            category.slug === "restoration"
              ? "/restoration"
              : `/collection/${category.slug}`;
          return (
            <Link key={category.slug} href={href} className="specimen-entry reveal">
              <div className="entry-attr mono">
                <span>
                  Category{" "}
                  {String(category.position).padStart(2, "0")} of 05
                </span>
              </div>
              <div className="entry-main">
                <h3>{category.name}</h3>
                <p className="entry-materials">{category.hint}</p>
              </div>
              <div className="entry-meta mono">
                <span>{room?.facts?.[0]?.detail ?? "View"}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <RevealObserver />
    </main>
  );
}
