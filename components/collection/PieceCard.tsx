import Image from "next/image";
import Link from "next/link";
import { rooms } from "@/content/landing";
import { statusLabel, priceLabel, canOptimiseImage } from "@/lib/format";
import RoomVisual from "@/components/canvas/RoomVisual";
import Plinth from "@/components/gallery/Plinth";
import type { Piece, PieceImage } from "@/lib/collection";

/**
 * One piece as a product card, the single card idiom for the whole store:
 * the New in row, the shop grid, an era's pieces and the neighbours at the
 * foot of a piece page all render this. The card is a closed object, figure
 * and text inside one bordered surface, so the words never float loose on
 * the page ground.
 *
 * The photograph is contained on white, as everywhere else, and falls back
 * to the era's generative study over a plinth until photography exists. A
 * status flag rides the figure only when the piece is not simply available,
 * which is the state a browsing buyer needs to see before they click.
 */

function roomFor(categorySlug: string) {
  const room = rooms.find((r) => r.slug === categorySlug);
  return {
    visual: room?.visual ?? ("rings" as const),
    label: room?.canvasLabel ?? "A generative study of the piece",
    ground: room?.variant ?? ("dark" as const),
  };
}

export default function PieceCard({
  piece,
  image,
  priority = false,
  sizes = "(max-width: 560px) 100vw, (max-width: 900px) 50vw, 30vw",
}: {
  piece: Piece;
  image?: PieceImage | null;
  priority?: boolean;
  sizes?: string;
}) {
  const room = roomFor(piece.categorySlug);
  const flagged = piece.status !== "available";

  return (
    <Link href={`/piece/${piece.slug}`} className="pc reveal">
      <div className="pc-figure" data-ground={image ? "photo" : room.ground}>
        {image ? (
          <Image
            className="pc-photo"
            src={image.path}
            alt={image.alt || piece.title}
            fill
            priority={priority}
            sizes={sizes}
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
        {flagged ? (
          <span className="mono pc-flag" data-status={piece.status}>
            {statusLabel(piece.status)}
          </span>
        ) : null}
      </div>

      <div className="pc-body">
        {piece.catalogueNumber ? (
          <span className="mono pc-cat">{piece.catalogueNumber}</span>
        ) : null}
        <h3>{piece.title}</h3>
        {piece.attribution ? (
          <p className="pc-attr">{piece.attribution}</p>
        ) : null}
        <div className="pc-meta mono">
          <span className="pc-status" data-status={piece.status}>
            <span className="pc-dot" aria-hidden="true" />
            {statusLabel(piece.status)}
          </span>
          <span className="pc-price">
            {priceLabel(piece.priceOnRequest, piece.pricePence)}
          </span>
        </div>
      </div>
    </Link>
  );
}
