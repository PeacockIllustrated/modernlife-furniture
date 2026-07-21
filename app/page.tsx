import Hero from "@/components/gallery/Hero";
import Manifesto from "@/components/gallery/Manifesto";
import Room from "@/components/gallery/Room";
import Featured from "@/components/gallery/Featured";
import Closing from "@/components/gallery/Closing";
import Tide from "@/components/canvas/Tide";
import RoomVisual from "@/components/canvas/RoomVisual";
import RevealObserver from "@/components/scroll/RevealObserver";
import { rooms } from "@/content/landing";
import { getCategories } from "@/lib/collection";

/**
 * The landing gallery: hero, manifesto, five category rooms in the light,
 * dark, light, dark, light rhythm, then the closing. Panels carry static
 * placeholders in session 1; the live generative visuals replace them in
 * sessions 2 and 3.
 */
export default async function Home() {
  // Story, hint and dl facts come from the collection layer (Supabase when
  // configured, the static catalogue otherwise); the room's visual, variant and
  // CTA stay in the presentational scaffold.
  const categories = await getCategories();
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <main>
      <Hero>
        <Tide label="Tide, the hero field, the grain of time" />
      </Hero>

      <Manifesto />

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

      <Featured />

      <Closing />

      <RevealObserver />
    </main>
  );
}
