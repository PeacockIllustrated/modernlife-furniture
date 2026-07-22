import Link from "next/link";
import { getFeaturedPieces } from "@/lib/collection";
import { rooms } from "@/content/landing";
import { statusLabel, priceLabel, periodRange } from "@/lib/format";
import RoomVisual from "@/components/canvas/RoomVisual";

/**
 * The promotional highlights: the owner's featured pieces given pride of place
 * directly under the hero, laid out like a shop's featured range. The lead
 * piece takes a full banner, the rest a card row. Each carries the category's
 * generative study on a colour-washed panel, so the visuals keep their
 * character with a little more colour pop.
 */

const ACCENTS = ["amber", "sea", "rose"] as const;

function visualFor(categorySlug: string) {
  const room = rooms.find((r) => r.slug === categorySlug);
  return {
    visual: room?.visual ?? "rings",
    label: room?.canvasLabel ?? "A generative study of the piece",
  };
}

export default async function Highlighted() {
  const pieces = await getFeaturedPieces();
  if (pieces.length === 0) return null;

  const [lead, ...rest] = pieces;
  const leadVisual = visualFor(lead.categorySlug);

  return (
    <section className="highlight" aria-labelledby="highlight-title">
      <div className="highlight-head">
        <span className="mono eyebrow">Highlighted</span>
        <h2 id="highlight-title">This month on the floor</h2>
        <p>
          A handful of pieces we have picked out, restored and ready to rehome.
          The full collection sits below, room by room.
        </p>
      </div>

      <Link
        href={`/piece/${lead.slug}`}
        className="promo promo-lead reveal"
        data-accent={ACCENTS[0]}
      >
        <div className="promo-figure">
          <RoomVisual
            visual={leadVisual.visual}
            label={leadVisual.label}
            scrollBound={false}
          />
        </div>
        <div className="promo-body">
          <span className="mono promo-tag">Featured piece</span>
          <span className="mono promo-attr">{lead.attribution}</span>
          <h3>{lead.title}</h3>
          <p className="promo-story">{lead.story}</p>
          <div className="promo-meta mono">
            <span className="promo-status" data-status={lead.status}>
              {statusLabel(lead.status)}
            </span>
            <span className="promo-price">
              {priceLabel(lead.priceOnRequest, lead.pricePence)}
            </span>
          </div>
          <span className="promo-cta mono">View piece</span>
        </div>
      </Link>

      {rest.length > 0 ? (
        <div className="promo-rest">
          {rest.map((piece, i) => {
            const v = visualFor(piece.categorySlug);
            return (
              <Link
                key={piece.slug}
                href={`/piece/${piece.slug}`}
                className="promo promo-card reveal"
                data-accent={ACCENTS[(i + 1) % ACCENTS.length]}
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
                  <span className="promo-sub mono">
                    {periodRange(piece.periodLabel, piece.yearFrom, piece.yearTo)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}

      <Link className="highlight-all mono" href="/collection">
        Browse the whole collection
      </Link>
    </section>
  );
}
