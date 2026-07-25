import Link from "next/link";
import { getPieces, getPieceHeroImages } from "@/lib/collection";
import PieceCard from "@/components/collection/PieceCard";

/**
 * New in: the most recent arrivals as a card row under the hero. The starred
 * pieces already lead the hero, so this row excludes them and shows the
 * newest listings still on the floor instead; sold pieces sit this one out.
 * The cards are the store's one card idiom, shared with the shop grid. If
 * exclusions leave fewer than two pieces the row renders nothing rather than
 * a stub.
 */

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

      <div className="pc-grid">
        {pieces.map((piece) => (
          <PieceCard
            key={piece.slug}
            piece={piece}
            image={heroImages[piece.slug] ?? null}
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 30vw"
          />
        ))}
      </div>

      <Link className="highlight-all mono" href="/collection">
        Shop the whole collection
      </Link>
    </section>
  );
}
