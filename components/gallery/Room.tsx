import type { Room as RoomData } from "@/content/landing";
import SpecimenLabel from "./SpecimenLabel";
import Plinth from "./Plinth";

/**
 * A category room: the 7fr canvas panel and the 5fr label card, side by side
 * on desktop, stacked below 860px (panel above label). The generative visual
 * is passed in as `visual` so the room wrapper stays free of canvas concerns.
 */
export default function Room({
  data,
  visual,
}: {
  data: RoomData;
  visual: React.ReactNode;
}) {
  return (
    <section
      className={`specimen${data.variant === "dark" ? " dark" : ""}`}
      id={data.id}
      aria-labelledby={`${data.id}-title`}
    >
      <div className="panel">
        {visual}
        <Plinth />
      </div>
      <SpecimenLabel
        titleId={`${data.id}-title`}
        number={data.number}
        title={data.title}
        story={data.story}
        hint={data.hint}
        facts={data.facts}
        cta={data.cta}
      />
    </section>
  );
}
