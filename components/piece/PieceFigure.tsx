import Image from "next/image";
import type { RoomVisual as RoomVisualKind } from "@/content/landing";
import type { PieceImage } from "@/lib/collection";
import RoomVisual from "@/components/canvas/RoomVisual";

/**
 * The specimen figure: the category's generative study as the ground, with
 * photography laid over it when it exists. For placeholder pieces with no
 * photography yet, the study stands as the exhibit and a quiet note says so.
 */
export default function PieceFigure({
  visual,
  label,
  images,
}: {
  visual: RoomVisualKind;
  label: string;
  images: PieceImage[];
}) {
  const hero = images.find((i) => i.kind === "hero") ?? images[0];
  const hasPhoto = Boolean(hero);

  return (
    <div className="piece-figure">
      <div
        className="piece-backdrop"
        style={{ opacity: hasPhoto ? 0.22 : 1 }}
        aria-hidden={hasPhoto ? "true" : undefined}
      >
        <RoomVisual visual={visual} label={label} scrollBound={false} />
      </div>
      {hasPhoto ? (
        <Image
          className="piece-photo"
          src={hero.path}
          alt={hero.alt || label}
          fill
          sizes="(max-width: 860px) 100vw, 58vw"
          priority
        />
      ) : (
        <span className="no-photo mono">Photography to follow</span>
      )}
    </div>
  );
}
