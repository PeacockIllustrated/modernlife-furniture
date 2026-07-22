import Hero from "@/components/gallery/Hero";
import Highlighted from "@/components/gallery/Highlighted";
import Manifesto from "@/components/gallery/Manifesto";
import Room from "@/components/gallery/Room";
import Closing from "@/components/gallery/Closing";
import Tide from "@/components/canvas/Tide";
import RoomVisual from "@/components/canvas/RoomVisual";
import RevealObserver from "@/components/scroll/RevealObserver";
import { rooms } from "@/content/landing";
import { getCategories } from "@/lib/collection";

/**
 * The shop home: a hero banner, the owner's highlighted pieces as a
 * promotional range, the collection to shop by category (each room keeping its
 * generative visual), a brand note, then the closing invitation.
 */
export default async function Home() {
  const categories = await getCategories();
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <main>
      <Hero>
        <Tide label="Tide, the hero field, the grain of time" />
      </Hero>

      <Highlighted />

      <section className="shop-by" aria-labelledby="shop-by-title">
        <span className="mono eyebrow">Shop by category</span>
        <h2 id="shop-by-title">Four rooms of the collection</h2>
        <p>
          Chairs, shelving and storage, cabinets and sideboards, and tables.
          Each room keeps its own material study; step into any one to see what
          is in.
        </p>
      </section>

      {rooms.map((room) => {
        const category = bySlug.get(room.slug);
        const data = category
          ? {
              ...room,
              title: category.name,
              story: category.story,
              hint: category.hint,
              facts: category.facts,
            }
          : room;
        return (
          <Room
            key={room.id}
            data={data}
            visual={
              <RoomVisual visual={room.visual} label={room.canvasLabel} />
            }
          />
        );
      })}

      <Manifesto />

      <Closing />

      <RevealObserver />
    </main>
  );
}
