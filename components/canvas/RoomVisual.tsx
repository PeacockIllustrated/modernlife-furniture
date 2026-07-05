import type { RoomVisual as RoomVisualKind } from "@/content/landing";
import BallChair from "./BallChair";
import ExplodedBall from "./ExplodedBall";
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
}: {
  visual: RoomVisualKind;
  label: string;
}) {
  switch (visual) {
    case "chair":
      return <BallChair label={label} />;
    case "grove":
      return <Grove label={label} />;
    case "strata":
      return <Strata label={label} />;
    case "rings":
      return <ProvenanceRings label={label} />;
    case "bench":
      return <ExplodedBall label={label} />;
    default:
      return <PanelPlaceholder visual={visual} label={label} />;
  }
}
