import type { RoomVisual as RoomVisualKind } from "@/content/landing";
import BallChair from "./BallChair";
import ExplodedBall from "./ExplodedBall";
import PanelPlaceholder from "./PanelPlaceholder";

/**
 * Chooses the live generative visual for a room, falling back to the static
 * placeholder for visuals not yet ported. Tide, Grove, Strata and Rings land
 * in session 3.
 */
export default function RoomVisual({
  visual,
  label,
}: {
  visual: RoomVisualKind;
  label: string;
}) {
  switch (visual) {
    case "chair":
      return <BallChair label={label} />;
    case "bench":
      return <ExplodedBall label={label} />;
    default:
      return <PanelPlaceholder visual={visual} label={label} />;
  }
}
