import type { RoomVisual as RoomVisualKind } from "@/content/landing";
import RoomVisual from "@/components/canvas/RoomVisual";

/**
 * A slim generative header band for a category page, reusing the room's own
 * visual held at its finished state (not scroll-bound), so the page opens with
 * the material study the landing promised.
 */
export default function CategoryBand({
  visual,
  label,
  dark,
}: {
  visual: RoomVisualKind;
  label: string;
  dark: boolean;
}) {
  return (
    <div className={`category-band${dark ? " dark" : ""}`}>
      <RoomVisual visual={visual} label={label} scrollBound={false} />
    </div>
  );
}
