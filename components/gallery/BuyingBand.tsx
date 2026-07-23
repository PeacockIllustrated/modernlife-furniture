import Image from "next/image";
import Link from "next/link";
import { canOptimiseImage } from "@/lib/format";
import RoomVisual from "@/components/canvas/RoomVisual";
import Plinth from "@/components/gallery/Plinth";

/**
 * The buying-confidence band: a full-bleed basalt split, the media panel on
 * one side and the plain facts of buying from us on the other. The owner's
 * photograph fills the media panel once uploaded; until then the provenance
 * rings stand in as a quiet placeholder, the drawing that matches the
 * band's promise of history written down, so the band never renders empty.
 * The invitation routes to the chairs, the front of the collection.
 */
export default function BuyingBand({
  image,
  alt,
}: {
  image: string;
  alt: string;
}) {
  return (
    <section className="buying" aria-labelledby="buying-title">
      <div className="buying-figure reveal">
        {image ? (
          <Image
            className="buying-photo"
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
            unoptimized={!canOptimiseImage(image)}
          />
        ) : (
          <>
            <RoomVisual
              visual="rings"
              label="Rings of grain and ownership, standing in for photography"
              scrollBound={false}
            />
            <Plinth />
          </>
        )}
      </div>
      <div className="buying-body reveal">
        <span className="mono eyebrow">Buying</span>
        <h2 id="buying-title">
          Checked, documented, <em>delivered</em>
        </h2>
        <p>
          Every piece is sold with a written condition report, and everything
          we know of its history is set down in the provenance file that
          travels with it.
        </p>
        <p>
          We deliver nationwide and place the piece in the room. If it does
          not sit right once it is home, you have fourteen days to return it.
        </p>
        <Link className="enquire" href="/collection/chairs">
          See the chairs
        </Link>
      </div>
    </section>
  );
}
