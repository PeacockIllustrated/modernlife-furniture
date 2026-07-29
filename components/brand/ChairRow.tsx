import { chairs } from "@/lib/chairs";

/**
 * The hero figure: the collection stood in a row on one ground line.
 *
 * The splash throws these same silhouettes around and drops them through the
 * floor; the hero is where they have been set down and lined up, which is the
 * shop rather than the arrival. So this is composed, not simulated: heights,
 * gaps and the small leans are authored, because a row is a display and a
 * heap is a delivery.
 *
 * The rhythm is deliberately uneven, tall against low and wide against
 * narrow, so it reads as a collection of one-offs rather than a set. Two
 * pieces sit back at lower opacity to give the row depth, one is in the brand
 * amber, and the row runs off the right of the panel because it is a shop
 * window, not a family portrait.
 */

interface Placed {
  /** Index into the chair set. */
  i: number;
  /** Drawn height, in viewBox units. */
  h: number;
  /** Gap before this chair; negative overlaps it into the one before. */
  gap: number;
  /** A small lean, in degrees, because nothing set down by hand is square. */
  lean: number;
  ink: number;
  amber?: boolean;
}

const VIEW_H = 340;
// Chairs stand on the bottom edge; the row is as wide as its contents.
const ROW: Placed[] = [
  { i: 8, h: 96, gap: 0, lean: 0, ink: 0.24 }, // the chaise, low and wide
  { i: 5, h: 248, gap: -26, lean: -1.6, ink: 0.92 }, // the egg
  { i: 13, h: 196, gap: 4, lean: 1.2, ink: 0.3 }, // the stool, set back
  { i: 0, h: 244, gap: -12, lean: -0.8, ink: 0.92 }, // the wishbone
  { i: 9, h: 188, gap: -18, lean: 0, ink: 0.92, amber: true }, // the slat bench
  { i: 2, h: 232, gap: -8, lean: 2, ink: 0.28 }, // the swan, set back
  { i: 11, h: 262, gap: -14, lean: -1.1, ink: 0.92 }, // a side chair
  { i: 3, h: 210, gap: 2, lean: 0.9, ink: 0.92 }, // the club chair
  { i: 15, h: 250, gap: -16, lean: -1.8, ink: 0.92 }, // and one more, cropped
];

/** Lays the row out left to right, each chair standing on the ground line. */
function layout() {
  let x = 0;
  const out = ROW.map((p) => {
    const c = chairs[p.i];
    const w = (c.w / c.h) * p.h;
    x += p.gap;
    const at = x + w / 2;
    x += w;
    return { ...p, c, w, at };
  });
  return { items: out, width: x };
}

const { items, width } = layout();

export default function ChairRow() {
  return (
    <svg
      viewBox={`0 0 ${Math.round(width)} ${VIEW_H}`}
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {items.map((p, k) => {
        const s = p.h / p.c.h;
        return (
          <path
            key={k}
            className={p.amber ? "row-chair row-chair-lead" : "row-chair"}
            d={p.c.d}
            fillOpacity={p.amber ? undefined : p.ink}
            // Stand it on the ground line, centre it on its slot, then lean it
            // about the point where it meets the floor.
            transform={`rotate(${p.lean} ${p.at.toFixed(1)} ${VIEW_H}) translate(${p.at.toFixed(1)} ${VIEW_H}) scale(${s.toFixed(4)}) translate(${(-p.c.w / 2).toFixed(2)} ${-p.c.h})`}
          />
        );
      })}
    </svg>
  );
}
