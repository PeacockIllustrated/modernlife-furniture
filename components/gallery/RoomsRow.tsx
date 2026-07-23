import Link from "next/link";
import { rooms } from "@/content/landing";
import { getCategories, getPieces } from "@/lib/collection";
import RoomVisual from "@/components/canvas/RoomVisual";
import Plinth from "@/components/gallery/Plinth";

/**
 * The collection compressed to one row: four category tiles, each keeping its
 * room's generative study on the room's own ground, light and dark
 * alternating down the row as the full rooms alternated down the old page.
 * The count line comes from the one cached getPieces read, so the row costs
 * no extra queries; a room with nothing in simply drops the line rather than
 * reading empty.
 */
export default async function RoomsRow() {
  const [categories, pieces] = await Promise.all([
    getCategories(),
    getPieces(),
  ]);
  const names = new Map(categories.map((c) => [c.slug, c.name]));
  const counts = new Map<string, number>();
  for (const piece of pieces) {
    counts.set(piece.categorySlug, (counts.get(piece.categorySlug) ?? 0) + 1);
  }

  return (
    <section className="rooms" aria-labelledby="rooms-title">
      <div className="rooms-head">
        <span className="mono eyebrow">The collection, room by room</span>
        <h2 id="rooms-title">Four rooms</h2>
      </div>
      <div className="rooms-grid">
        {rooms.map((room, i) => {
          const count = counts.get(room.slug) ?? 0;
          return (
            <Link
              key={room.slug}
              href={`/collection/${room.slug}`}
              className="room-tile reveal"
            >
              <div
                className="room-tile-figure"
                data-ground={i % 2 === 1 ? "dark" : "light"}
              >
                <RoomVisual
                  visual={room.visual}
                  label={room.canvasLabel}
                  scrollBound={false}
                />
                <Plinth />
              </div>
              <h3>{names.get(room.slug) ?? room.title}</h3>
              {count > 0 ? (
                <span className="room-tile-count mono">
                  {count} {count === 1 ? "piece" : "pieces"} in the room
                </span>
              ) : null}
              <span className="room-tile-view mono">View the room</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
