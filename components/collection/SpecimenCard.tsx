import Link from "next/link";
import type { Piece } from "@/lib/collection";
import { statusLabel, priceLabel, periodRange } from "@/lib/format";

/**
 * A piece as a catalogue entry, not a card: a full-width row separated by a
 * hairline, mono attribution and specimen facts either side of a Fraunces
 * title. Square and shadow-free, so the collection reads as a gallery ledger
 * rather than an e-commerce grid.
 */
export default function SpecimenCard({ piece }: { piece: Piece }) {
  return (
    <Link href={`/piece/${piece.slug}`} className="specimen-entry reveal">
      <div className="entry-attr mono">
        <span>{piece.attribution}</span>
        <span data-status={piece.status}>{statusLabel(piece.status)}</span>
      </div>
      <div className="entry-main">
        <h3>{piece.title}</h3>
        <p className="entry-materials">
          {piece.materials.join(", ")}
          {piece.origin ? `, ${piece.origin}` : ""}
        </p>
      </div>
      <div className="entry-meta mono">
        <span>
          {periodRange(piece.periodLabel, piece.yearFrom, piece.yearTo)}
        </span>
        <span>{priceLabel(piece.priceOnRequest, piece.pricePence)}</span>
      </div>
    </Link>
  );
}
