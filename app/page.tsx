import Hero from "@/components/gallery/Hero";
import Manifesto from "@/components/gallery/Manifesto";
import Room from "@/components/gallery/Room";
import Closing from "@/components/gallery/Closing";
import PanelPlaceholder from "@/components/canvas/PanelPlaceholder";
import RoomVisual from "@/components/canvas/RoomVisual";
import RevealObserver from "@/components/scroll/RevealObserver";
import { rooms } from "@/content/landing";

/**
 * The landing gallery: hero, manifesto, five category rooms in the light,
 * dark, light, dark, light rhythm, then the closing. Panels carry static
 * placeholders in session 1; the live generative visuals replace them in
 * sessions 2 and 3.
 */
export default function Home() {
  return (
    <main>
      <Hero>
        <PanelPlaceholder
          visual="tide"
          label="Tide, the hero field, the grain of time"
        />
      </Hero>

      <Manifesto />

      {rooms.map((room) => (
        <Room
          key={room.id}
          data={room}
          visual={
            <RoomVisual visual={room.visual} label={room.canvasLabel} />
          }
        />
      ))}

      <Closing />

      <RevealObserver />
    </main>
  );
}
