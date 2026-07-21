import Link from "next/link";
import { getFeaturedPieces } from "@/lib/collection";
import { statusLabel, priceLabel, periodRange } from "@/lib/format";

/**
 * The owner's curated selection for the homepage. Ordered by the position the
 * owner sets in the dashboard, it sits between the category rooms and the
 * closing invitation. When nothing is featured the section renders nothing, so
 * the landing rhythm is never broken by an empty band.
 */
export default async function Featured() {
  const pieces = await getFeaturedPieces();
  if (pieces.length === 0) return null;

  return (
    <section className="featured-rail" aria-labelledby="featured-title">
      <div className="featured-head">
        <span className="mono eyebrow">Selected pieces</span>
        <h2 id="featured-title" className="reveal">
          Currently on the floor
        </h2>
        <p className="reveal">
          A short view of the collection as it stands, chosen and arranged by
          hand. The full record, room by room, sits in the collection.
        </p>
      </div>

      <div className="featured-list">
        {pieces.map((piece) => (
          <Link
            key={piece.slug}
            href={`/piece/${piece.slug}`}
            className="featured-entry reveal"
          >
            <div className="featured-entry-top mono">
              <span>{piece.attribution}</span>
              {piece.provenanceVerified ? (
                <span className="featured-verified">
                  <span className="seal-mark" aria-hidden="true" />
                  Provenance verified
                </span>
              ) : null}
            </div>
            <h3>{piece.title}</h3>
            <p className="featured-materials">
              {piece.materials.join(", ")}
              {piece.origin ? `, ${piece.origin}` : ""}
            </p>
            <div className="featured-entry-meta mono">
              <span>
                {periodRange(piece.periodLabel, piece.yearFrom, piece.yearTo)}
              </span>
              <span data-status={piece.status}>{statusLabel(piece.status)}</span>
              <span>{priceLabel(piece.priceOnRequest, piece.pricePence)}</span>
            </div>
          </Link>
        ))}
      </div>

      <Link className="featured-all mono" href="/collection">
        See the whole collection
      </Link>
    </section>
  );
}
