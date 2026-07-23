import Image from "next/image";
import { canOptimiseImage } from "@/lib/format";
import { HeroLede, StarredRail } from "@/components/gallery/Hero";
import type { StoreSettings } from "@/content/store";
import type { Piece, PieceImage } from "@/lib/collection";

/**
 * The photographic hero, shown once the owner has uploaded a hero image
 * through the site panel. The photograph becomes the backdrop for the whole
 * composition; the headline block sits in a soft paper panel so the type
 * never fights the picture, no gradients and no scrims, and the starred rail
 * keeps its own paper cards for the same reason. Until an image exists the
 * page renders the Tide hero instead.
 */
export default function PhotoHero({
  settings,
  pieces,
  images,
}: {
  settings: StoreSettings;
  pieces: Piece[];
  images: Record<string, PieceImage | null>;
}) {
  return (
    <section
      className={
        pieces.length > 0
          ? "hero-store hero-store-photo"
          : "hero-store hero-store-photo hero-store-solo"
      }
      aria-label="Modern Life Furniture"
    >
      <Image
        className="hero-backdrop"
        src={settings.heroImage}
        alt={settings.heroAlt}
        fill
        priority
        sizes="100vw"
        unoptimized={!canOptimiseImage(settings.heroImage)}
      />
      <HeroLede settings={settings} />
      <StarredRail pieces={pieces} images={images} />
    </section>
  );
}
