import type { Provenance } from "@/lib/collection";
import ProvenanceRings, {
  type RingMarker,
} from "@/components/canvas/ProvenanceRings";

// Ownership marks, cycling the accent palette. The canvas colours must be
// concrete (canvas cannot read CSS variables); the legend swatches use the
// tokens so the two stay in step.
const RING_COLOURS = [
  "rgba(201,123,61,.95)",
  "rgba(180,104,94,.95)",
  "rgba(122,156,137,.95)", // a lighter sea, legible on basalt at mobile size
];
const SWATCHES = ["var(--amber)", "var(--rose)", "var(--sea)"];

/**
 * Provenance as an actual rings diagram: each provenance row lands on a
 * coloured ring, with a legend reading the rings back as a history. Reuses the
 * tables visual, so the piece's story is drawn in the same grain-and-ownership
 * language as the landing.
 */
export default function ProvenanceDiagram({
  provenance,
  label,
}: {
  provenance: Provenance[];
  label: string;
}) {
  // The piece-page figure is small (roughly 300 to 400px min dimension), so it
  // draws only about a dozen rings. Keep the marked indices low and close so
  // every provenance row lands on a ring that is actually drawn and the legend
  // never lists a colour with no ring.
  const markers: RingMarker[] = provenance.map((_, i) => ({
    ring: 2 + i * 2,
    colour: RING_COLOURS[i % RING_COLOURS.length],
  }));

  return (
    <div className="provenance">
      <div className="provenance-figure">
        <ProvenanceRings label={label} markers={markers} />
      </div>
      <ol className="provenance-legend">
        {provenance.map((row, i) => (
          <li key={row.position}>
            <span
              className="swatch"
              style={{ background: SWATCHES[i % SWATCHES.length] }}
              aria-hidden="true"
            />
            <div>
              <span className="mono">{row.label}</span>
              <p>{row.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
