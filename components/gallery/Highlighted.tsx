import Image from "next/image";
import Link from "next/link";
import { getFeaturedPieces, getPieceHeroImages } from "@/lib/collection";
import { rooms } from "@/content/landing";
import { statusLabel, priceLabel, canOptimiseImage } from "@/lib/format";
import RoomVisual from "@/components/canvas/RoomVisual";
import Plinth from "@/components/gallery/Plinth";

/**
 * The featured trio under the hero: the owner's top three pieces set as a
 * uniform card row, photograph first once photography exists, the category's
 * generative study over a plinth until then. Only the figure carries a frame;
 * the attribution, title, status and price sit straight on the page ground,
 * so the row reads as labelled exhibits rather than boxed products.
 */

function roomFor(categorySlug: string) {
  const room = rooms.find((r) => r.slug === categorySlug);
  return {
    visual: room?.visual ?? ("rings" as const),
    label: room?.canvasLabel ?? "A generative study of the piece",
    ground: room?.variant ?? ("dark" as const),
  };
}

export default async function Highlighted() {
  // The owner curates featured order; the row holds the top three so it
  // stays a uniform trio whatever is flagged.
  const pieces = (await getFeaturedPieces()).slice(0, 3);
  if (pieces.length === 0) return null;
  const heroImages = await getPieceHeroImages(pieces.map((p) => p.slug));

  return (
    <section className="highlight" aria-labelledby="highlight-title">
      <div className="highlight-head">
        <span className="mono eyebrow">Highlighted</span>
        <h2 id="highlight-title">This month on the floor</h2>
        <p>
          A handful of pieces we have picked out, checked over and ready to
          go. The full collection sits below, category by category.
        </p>
      </div>

      <div className="featured-row">
        {pieces.map((piece) => {
          const room = roomFor(piece.categorySlug);
          const image = heroImages[piece.slug] ?? null;
          return (
            <Link
              key={piece.slug}
              href={`/piece/${piece.slug}`}
              className="featured-card reveal"
            >
              <div className="featured-figure" data-ground={room.ground}>
                {image ? (
                  <Image
                    className="featured-photo"
                    src={image.path}
                    alt={image.alt || piece.title}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 860px) 50vw, 33vw"
                    unoptimized={!canOptimiseImage(image.path)}
                  />
                ) : (
                  <>
                    <RoomVisual
                      visual={room.visual}
                      label={room.label}
                      scrollBound={false}
                    />
                    <Plinth />
                  </>
                )}
              </div>
              <span className="featured-attr mono">{piece.attribution}</span>
              <h3>{piece.title}</h3>
              <div className="featured-meta mono">
                <span className="featured-status" data-status={piece.status}>
                  <span className="featured-dot" aria-hidden="true" />
                  {statusLabel(piece.status)}
                </span>
                <span className="featured-price">
                  {priceLabel(piece.priceOnRequest, piece.pricePence)}
                </span>
              </div>
              <span className="featured-cta mono">View piece</span>
            </Link>
          );
        })}
      </div>

      <Link className="highlight-all mono" href="/collection">
        Browse the whole collection
      </Link>
    </section>
  );
}
