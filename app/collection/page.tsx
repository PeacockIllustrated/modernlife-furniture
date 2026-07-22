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
    "Chairs, shelving and storage, cabinets and sideboards, and tables. Vintage designer furniture, bought, restored and rehomed.",
};

/**
 * The collection index: each category shown as a generative preview row, its
 * own material study beside the name, in the landing's light and dark rhythm.
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
        <span className="mono eyebrow">Four rooms</span>
        <h1>The collection</h1>
        <p>
          Each category is a room in the gallery. The collection changes weekly
          and the best pieces rarely reach the website; if you are after
          something in particular, tell us and we will find it.
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
                  View {name.toLowerCase()}
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
