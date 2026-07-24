import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/collection";
import { rooms, closing } from "@/content/landing";
import RoomVisual from "@/components/canvas/RoomVisual";
import FeatureBand from "@/components/gallery/FeatureBand";
import RevealObserver from "@/components/scroll/RevealObserver";

export const metadata: Metadata = {
  title: "The collection",
  description:
    "Vintage designer chairs, era by era: Bauhaus and modernist, Danish modern, space age, Italian and sculptural, and modern classics. Checked, documented and delivered nationwide.",
};

export const revalidate = 60;

/**
 * The collection index: each era shown as a preview row, its study beside
 * the name. Every row routes to the era's pieces, so the page is a shop
 * index rather than a tour.
 */
export default async function CollectionIndex() {
  const categories = await getCategories();
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Collection</span>
      </nav>

      <div className="page-head">
        <span className="mono eyebrow">Browse</span>
        <h1>The collection</h1>
        <p>
          Chairs, era by era: Bauhaus and modernist, Danish modern, space age,
          Italian and sculptural, and modern classics. Every piece is one of
          one and the collection changes weekly; if you are after something in
          particular, tell us and we will find it.
        </p>
      </div>

      <div className="cat-rows">
        {rooms.map((room) => {
          const category = bySlug.get(room.slug);
          const name = category?.name ?? room.title;
          const hint = category?.hint ?? room.hint;
          return (
            <Link
              key={room.id}
              href={`/collection/${room.slug}`}
              className={`cat-row reveal${room.variant === "dark" ? " dark" : ""}`}
              aria-label={`${name}, ${room.number}`}
            >
              <div className="cat-row-figure">
                <RoomVisual
                  visual={room.visual}
                  label={room.canvasLabel}
                  scrollBound={false}
                />
              </div>
              <div className="cat-row-body">
                <span className="mono no">{room.number}</span>
                <h2>{name}</h2>
                <span className="hint">{hint}</span>
                <span className="cat-row-view">
                  View {name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <FeatureBand
        eyebrow="Ask about a piece"
        heading="The best pieces rarely reach the website"
        body={closing.body}
        cta={{ label: "Tell us what you are after", href: "/enquire" }}
        visual="rings"
      />

      <RevealObserver />
    </main>
  );
}
