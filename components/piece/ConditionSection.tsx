import Image from "next/image";
import type { PieceImage } from "@/lib/collection";

/**
 * Condition and restoration: the bench notes in prose, and where photography
 * of the piece as found and as restored both exists, the pair side by side so
 * the work can be read rather than taken on trust. With neither notes nor a
 * pair the section says nothing at all.
 */
export default function ConditionSection({
  notes,
  images,
}: {
  notes: string;
  images: PieceImage[];
}) {
  const asFound = images.find((i) => i.kind === "as_found");
  const restored = images.find((i) => i.kind === "restored");
  const pair = asFound && restored ? [asFound, restored] : null;
  if (!notes && !pair) return null;

  return (
    <section className="section-rule reveal" aria-labelledby="condition-title">
      <h2 id="condition-title" className="store-head">
        Condition and restoration
      </h2>
      {notes ? <p className="condition-notes">{notes}</p> : null}
      {pair ? (
        <div className="condition-pair">
          {pair.map((image, i) => (
            <figure key={image.kind} className="condition-shot">
              <div className="condition-img">
                <Image
                  src={image.path}
                  alt={
                    image.alt ||
                    (i === 0 ? "The piece as found" : "The piece restored")
                  }
                  fill
                  sizes="(max-width: 860px) 100vw, 45vw"
                />
              </div>
              <figcaption className="mono condition-caption">
                {i === 0 ? "As found" : "Restored"}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}
