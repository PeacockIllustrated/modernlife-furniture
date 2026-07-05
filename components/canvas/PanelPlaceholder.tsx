import type { RoomVisual } from "@/content/landing";

const STUDY_NAME: Record<RoomVisual, string> = {
  tide: "Tide, the grain of time",
  chair: "Ball chair, assembling",
  grove: "Grove, the collection branching",
  strata: "Strata, veneer and lacquer",
  rings: "Rings, grain and ownership",
  bench: "Conservator's drawing",
};

/**
 * Static stand-in for a category panel, used in session 1 before the live
 * Canvas 2D visuals land in sessions 2 and 3. It keeps the panel's proportions
 * and a meaningful, labelled frame so the page reads complete and the reduced
 * motion contract (never a blank) already holds.
 */
export default function PanelPlaceholder({
  visual,
  label,
}: {
  visual: RoomVisual;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span className="mono" style={{ opacity: 0.4 }}>
        {STUDY_NAME[visual]}
      </span>
    </div>
  );
}
