import type { Piece, SpecRow } from "@/lib/collection";
import { statusLabel, priceLabel, periodRange } from "@/lib/format";

/**
 * The specimen record: the piece's registered facts first, then the owner's
 * own specification rows grouped the way the dashboard arranged them. One
 * quiet table in the house dl idiom, hairline rules between rows, nothing a
 * museum label would not carry.
 */
export default function SpecRecord({
  piece,
  specs,
}: {
  piece: Piece;
  specs: SpecRow[];
}) {
  const auto: Array<[string, string]> = [
    ["Attribution", piece.attribution],
    ["Period", periodRange(piece.periodLabel, piece.yearFrom, piece.yearTo)],
    ["Origin", piece.origin],
    ["Materials", piece.materials.join(", ")],
    ["Status", statusLabel(piece.status)],
    ["Price", priceLabel(piece.priceOnRequest, piece.pricePence)],
  ];
  if (piece.catalogueNumber) {
    auto.unshift(["Catalogue number", piece.catalogueNumber]);
  }

  // Group the custom rows by their grouping, keeping first appearance order.
  // Rows with no grouping sit directly under the registered facts.
  const groups = new Map<string, SpecRow[]>();
  for (const row of specs) {
    const list = groups.get(row.grouping) ?? [];
    list.push(row);
    groups.set(row.grouping, list);
  }
  const ungrouped = groups.get("") ?? [];
  const named = Array.from(groups.entries()).filter(([name]) => name !== "");

  return (
    <section className="section-rule reveal" aria-labelledby="record-title">
      <h2 id="record-title" className="store-head">
        Specimen record
      </h2>
      <div className="record">
        <dl className="record-list">
          {auto.map(([term, detail]) => (
            <div key={term} className="record-row">
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
          {ungrouped.map((row) => (
            <div key={`${row.position}-${row.term}`} className="record-row">
              <dt>{row.term}</dt>
              <dd>{row.detail}</dd>
            </div>
          ))}
        </dl>
        {named.map(([name, rows]) => (
          <div key={name}>
            <h3 className="mono record-group">{name}</h3>
            <dl className="record-list">
              {rows.map((row) => (
                <div key={`${row.position}-${row.term}`} className="record-row">
                  <dt>{row.term}</dt>
                  <dd>{row.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
