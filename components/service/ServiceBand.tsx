import type { RoomVisual as RoomVisualKind } from "@/content/landing";
import RoomVisual from "@/components/canvas/RoomVisual";

/**
 * A generative header band for a service page, holding the study at its
 * finished state. Restoration takes the conservator's drawing; the sell page
 * takes the ownership rings.
 */
export default function ServiceBand({
  visual,
  label,
  dark,
}: {
  visual: RoomVisualKind;
  label: string;
  dark?: boolean;
}) {
  return (
    <div
      className="service-band"
      style={dark ? { background: "var(--basalt)" } : undefined}
    >
      <RoomVisual visual={visual} label={label} scrollBound={false} />
    </div>
  );
}
