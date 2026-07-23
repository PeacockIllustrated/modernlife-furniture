import Image from "next/image";
import Link from "next/link";
import { getPieces, getPieceHeroImages } from "@/lib/collection";
import { rooms } from "@/content/landing";
import { statusLabel, priceLabel, canOptimiseImage } from "@/lib/format";
import RoomVisual from "@/components/canvas/RoomVisual";
import Plinth from "@/components/gallery/Plinth";

/**
 * New in: the most recent arrivals as a card row under the hero. The starred
 * pieces already lead the hero, so this row excludes them and shows the
 * newest listings still on the floor instead; sold pieces sit this one out.
 * Only the figure carries a frame, photograph first once photography exists,
 * the category's generative study over a plinth until then. If exclusions
 * leave fewer than two pieces the row renders nothing rather than a stub.
 */

function roomFor(categorySlug: string) {
  const room = rooms.find((r) => r.slug === categorySlug);
  return {
    visual: room?.visual ?? ("rings" as const),
    label: room?.canvasLabel ?? "A generative study of the piece",
    ground: room?.variant ?? ("dark" as const),
  };
}

export default async function Highlighted({
  exclude = [],
}: {
  exclude?: string[];
}) {
  // getPieces answers newest first, so the head of the list is the newest
  // through the door once the hero's starred pieces are set aside.
  const pieces = (await getPieces())
    .filter((p) => !exclude.includes(p.slug) && p.status !== "sold")
    .slice(0, 3);
  if (pieces.length < 2) return null;
  const heroImages = await getPieceHeroImages(pieces.map((p) => p.slug));

  return (
    <section className="highlight" aria-labelledby="highlight-title">
      <div className="highlight-head">
        <span className="mono eyebrow">Latest arrivals</span>
        <h2 id="highlight-title">New in</h2>
        <p>
          The newest pieces to reach the floor, checked over and listed. The
          full collection sits below, era by era.
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
