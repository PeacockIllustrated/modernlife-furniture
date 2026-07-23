import Image from "next/image";
import Link from "next/link";
import { canOptimiseImage } from "@/lib/format";
import RoomVisual from "@/components/canvas/RoomVisual";
import Plinth from "@/components/gallery/Plinth";

/**
 * The workshop band: a full-bleed basalt split, the bench on one side and a
 * short account of the practice on the other. The owner's workshop
 * photograph fills the media panel once uploaded; until then the Joint
 * drawing works the mortise at full intensity, so the band demonstrates the
 * bench rather than describing an absent picture. The invitation leads to
 * the selling page.
 */
export default function WorkshopBand({
  image,
  alt,
}: {
  image: string;
  alt: string;
}) {
  return (
    <section className="workshop" aria-labelledby="workshop-title">
      <div className="workshop-figure reveal">
        {image ? (
          <Image
            className="workshop-photo"
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
            unoptimized={!canOptimiseImage(image)}
          />
        ) : (
          <>
            <RoomVisual
              visual="bench"
              label="The bench, a mortise and tenon drawing itself together"
              scrollBound={false}
            />
            <Plinth />
          </>
        )}
      </div>
      <div className="workshop-body reveal">
        <span className="mono eyebrow">The bench</span>
        <h2 id="workshop-title">Restored on our bench, not sold as found</h2>
        <p>
          Every piece here has been through our hands. We find them in attics
          and auction rooms, take the finish back to the wood where the years
          ask for it, and write down everything we do. What leaves the bench
          is honest, steady and ready for its next forty years.
        </p>
        <Link className="enquire" href="/sell">
          Bring us a piece
        </Link>
      </div>
    </section>
  );
}
