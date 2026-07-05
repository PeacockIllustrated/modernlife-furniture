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
  "rgba(94,122,107,.95)",
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
  const markers: RingMarker[] = provenance.map((_, i) => ({
    ring: 6 + i * 7,
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
