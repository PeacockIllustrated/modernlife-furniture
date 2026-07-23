import Image from "next/image";
import Link from "next/link";
import { hero, rooms } from "@/content/landing";
import { emphasise } from "@/components/typography/Em";
import { statusLabel, priceLabel, canOptimiseImage } from "@/lib/format";
import RoomVisual from "@/components/canvas/RoomVisual";
import Plinth from "@/components/gallery/Plinth";
import type { StoreSettings } from "@/content/store";
import type { Piece, PieceImage } from "@/lib/collection";

/**
 * The store hero, a two-part composition on the paper ground: the headline
 * panel on the left, the starred rail on the right (stacking under on
 * phones). The rail carries the owner's top three starred pieces, the lead
 * one large with its photograph, the other two as slim rows, so the first
 * viewport sells real pieces rather than a headline alone.
 *
 * This default export is the quiet state, before a hero photograph exists:
 * the Tide canvas (passed as children from the page) sits behind the
 * headline panel only, never behind the starred cards. Once the owner
 * uploads a hero image, PhotoHero renders instead and reuses the lede and
 * rail exported here.
 */

function roomFor(categorySlug: string) {
  const room = rooms.find((r) => r.slug === categorySlug);
  return {
    visual: room?.visual ?? ("rings" as const),
    label: room?.canvasLabel ?? "A generative study of the piece",
    ground: room?.variant ?? ("dark" as const),
  };
}

/**
 * The headline block: the owner's headline through the house emphasis, the
 * standing subline and the two shop calls to action. Children, when given,
 * are the generative backdrop and sit behind the copy inside the panel.
 */
export function HeroLede({
  settings,
  children,
}: {
  settings: StoreSettings;
  children?: React.ReactNode;
}) {
  return (
    <div className="hero-lede">
      {children ? <div className="hero-tide">{children}</div> : null}
      <div className="hero-lede-copy">
        <h1>{emphasise(settings.heroHeadline)}</h1>
        <p>{hero.sub}</p>
        <div className="hero-cta">
          <Link className="btn btn-solid" href="/collection">
            See the chairs
          </Link>
          <Link className="btn btn-line" href="/collection">
            Browse the collection
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * The starred rail: the top three starred pieces as compact cards, each a
 * single link to its piece page. The lead card is large, photograph first,
 * the category's generative study over a plinth until photography exists;
 * the two behind it run as slim rows so the rail reads as one composition.
 */
export function StarredRail({
  pieces,
  images,
}: {
  pieces: Piece[];
  images: Record<string, PieceImage | null>;
}) {
  if (pieces.length === 0) return null;
  return (
    <ul className="hero-rail" aria-label="Starred pieces">
      {pieces.map((piece, i) => {
        const lead = i === 0;
        const room = roomFor(piece.categorySlug);
        const image = images[piece.slug] ?? null;
        return (
          <li key={piece.slug}>
            <Link
              href={`/piece/${piece.slug}`}
              className={lead ? "star-card star-card-lead reveal" : "star-card reveal"}
            >
              <div className="star-figure" data-ground={room.ground}>
                {image ? (
                  <Image
                    className="star-photo"
                    src={image.path}
                    alt={image.alt || piece.title}
                    fill
                    priority={lead}
                    sizes={
                      lead
                        ? "(max-width: 860px) 100vw, 44vw"
                        : "(max-width: 860px) 34vw, 136px"
                    }
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
              <div className="star-body">
                <span className="star-eyebrow mono">
                  {lead ? `Starred, ${piece.catalogueNumber}` : piece.catalogueNumber}
                </span>
                <h2>{piece.title}</h2>
                <div className="star-meta mono">
                  <span className="featured-status" data-status={piece.status}>
                    <span className="featured-dot" aria-hidden="true" />
                    {statusLabel(piece.status)}
                  </span>
                  <span className="featured-price">
                    {priceLabel(piece.priceOnRequest, piece.pricePence)}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Hero({
  settings,
  pieces,
  images,
  children,
}: {
  settings: StoreSettings;
  pieces: Piece[];
  images: Record<string, PieceImage | null>;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={
        pieces.length > 0 ? "hero-store" : "hero-store hero-store-solo"
      }
      aria-label="Modern Life Furniture"
    >
      <HeroLede settings={settings}>{children}</HeroLede>
      <StarredRail pieces={pieces} images={images} />
    </section>
  );
}
