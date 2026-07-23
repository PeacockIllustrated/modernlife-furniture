import Image from "next/image";
import type { PieceImage } from "@/lib/collection";
import { canOptimiseImage } from "@/lib/format";

/**
 * Condition: the condition report in prose, and where before and after
 * photography both exists, the pair side by side so the buyer can read the
 * state of the piece for themselves. With neither notes nor a pair the
 * section says nothing at all.
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
        Condition
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
                    (i === 0
                      ? "The piece before preparation"
                      : "The piece after preparation")
                  }
                  fill
                  sizes="(max-width: 860px) 100vw, 45vw"
                  unoptimized={!canOptimiseImage(image.path)}
                />
              </div>
              <figcaption className="mono condition-caption">
                {i === 0 ? "Before" : "After"}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}
