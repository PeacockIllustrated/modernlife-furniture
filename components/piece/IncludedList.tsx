import type { IncludedItem } from "@/lib/collection";

/**
 * What comes with the piece: the file, the report, the care notes and the
 * delivery, numbered like entries in a register. The list arrives already
 * resolved by the data layer, which falls back to the house four when the
 * piece names nothing of its own.
 */
export default function IncludedList({ items }: { items: IncludedItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="section-rule reveal" aria-labelledby="included-title">
      <h2 id="included-title" className="store-head">
        What comes with the piece
      </h2>
      <ol className="included-list">
        {items.map((item, i) => (
          <li key={`${item.position}-${item.label}`} className="included-item">
            <span className="mono included-no" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="included-label">{item.label}</span>
            {item.note ? (
              <span className="included-note">{item.note}</span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
