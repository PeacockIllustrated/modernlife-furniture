import PieceCard from "@/components/collection/PieceCard";
import type { Piece, PieceImage } from "@/lib/collection";

/**
 * More from this era: neighbouring pieces at the foot of a piece page, on
 * the store's one card idiom so the row matches the shop grid and the New
 * in row exactly. Photography leads here as it does everywhere else.
 */
export default function RelatedPieces({
  pieces,
  images = {},
}: {
  pieces: Piece[];
  images?: Record<string, PieceImage | null>;
}) {
  if (pieces.length === 0) return null;
  return (
    <section className="section-rule" aria-labelledby="related-title">
      <h2 id="related-title" className="store-head">
        More from this era
      </h2>
      <div className="pc-grid">
        {pieces.map((piece) => (
          <PieceCard
            key={piece.slug}
            piece={piece}
            image={images[piece.slug] ?? null}
          />
        ))}
      </div>
    </section>
  );
}
