import type { RoomVisual as RoomVisualKind } from "@/content/landing";
import BallChair from "./BallChair";
import Joint from "./Joint";
import Grove from "./Grove";
import Strata from "./Strata";
import ProvenanceRings from "./ProvenanceRings";
import PanelPlaceholder from "./PanelPlaceholder";

/**
 * Chooses the live generative visual for a room. Tide belongs to the hero and
 * is placed there directly, so it is not switched here.
 */
export default function RoomVisual({
  visual,
  label,
  scrollBound = true,
}: {
  visual: RoomVisualKind;
  label: string;
  scrollBound?: boolean;
}) {
  switch (visual) {
    case "chair":
      return <BallChair label={label} scrollBound={scrollBound} />;
    case "grove":
      return <Grove label={label} scrollBound={scrollBound} />;
    case "strata":
      return <Strata label={label} />;
    case "rings":
      return <ProvenanceRings label={label} />;
    case "bench":
      return <Joint label={label} />;
    default:
      return <PanelPlaceholder visual={visual} label={label} />;
  }
}
