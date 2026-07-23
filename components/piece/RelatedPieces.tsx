import Link from "next/link";
import type { Piece } from "@/lib/collection";
import { rooms } from "@/content/landing";
import { statusLabel, priceLabel } from "@/lib/format";
import RoomVisual from "@/components/canvas/RoomVisual";

/**
 * From the same room: neighbouring exhibits from the piece's category, reusing
 * the promotional card idiom from the home page so the store reads as one
 * range. Generative figures stand in for photography, as they do everywhere.
 */

const ACCENTS = ["amber", "sea", "rose"] as const;

function visualFor(categorySlug: string) {
  const room = rooms.find((r) => r.slug === categorySlug);
  return {
    visual: room?.visual ?? ("rings" as const),
    label: room?.canvasLabel ?? "A generative study of the piece",
  };
}

export default function RelatedPieces({ pieces }: { pieces: Piece[] }) {
  if (pieces.length === 0) return null;
  return (
    <section className="section-rule" aria-labelledby="related-title">
      <h2 id="related-title" className="store-head">
        From the same room
      </h2>
      <div className="promo-rest">
        {pieces.map((piece, i) => {
          const v = visualFor(piece.categorySlug);
          return (
            <Link
              key={piece.slug}
              href={`/piece/${piece.slug}`}
              className="promo promo-card reveal"
              data-accent={ACCENTS[i % ACCENTS.length]}
            >
              <div className="promo-figure">
                <RoomVisual
                  visual={v.visual}
                  label={v.label}
                  scrollBound={false}
                />
              </div>
              <div className="promo-body">
                <span className="mono promo-attr">{piece.attribution}</span>
                <h3>{piece.title}</h3>
                <div className="promo-meta mono">
                  <span className="promo-status" data-status={piece.status}>
                    {statusLabel(piece.status)}
                  </span>
                  <span className="promo-price">
                    {priceLabel(piece.priceOnRequest, piece.pricePence)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
