import Image from "next/image";
import type { BrochurePlate } from "@/content/brochure";

/**
 * A photograph mounted on white board, with its caption on a hairline beneath.
 *
 * The board is not decoration. These pieces are shot in daylight against
 * white, so on the paper ground an unmounted photograph would read as a
 * brighter rectangle with no edge; mounting it on white inside a hairline
 * makes that an intended plate rather than an accident, and it is what lets
 * the same photograph sit on a basalt band without punching a hole in it.
 */
export default function PlateFigure({
  plate,
  sizes,
  priority = false,
  caption = true,
}: {
  plate: BrochurePlate;
  sizes: string;
  priority?: boolean;
  caption?: boolean;
}) {
  return (
    <figure>
      <div className="br-figure">
        <Image
          src={plate.imagePath}
          alt={plate.imageAlt}
          fill
          sizes={sizes}
          priority={priority}
        />
      </div>
      {caption ? (
        <figcaption className="br-caption mono">
          <span>{plate.caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
