import Image from "next/image";
import Link from "next/link";
import { hero } from "@/content/landing";
import { canOptimiseImage } from "@/lib/format";
import { emphasise } from "@/components/typography/Em";
import type { StoreSettings } from "@/content/store";

/**
 * The photographic hero, shown once the owner has uploaded a hero image
 * through the site panel. A full-bleed photograph with a solid basalt panel
 * anchored bottom left, softly rounded on its free corner, carrying the
 * headline, the standing subline and the two shop calls to action. No
 * gradients and no scrims; the panel is opaque so the type never fights the
 * photograph. Until an image exists the page renders the Tide hero instead.
 */
export default function PhotoHero({ settings }: { settings: StoreSettings }) {
  return (
    <section className="photo-hero" aria-label="Modern Life Furniture">
      <Image
        className="photo-hero-img"
        src={settings.heroImage}
        alt={settings.heroAlt}
        fill
        priority
        sizes="100vw"
        unoptimized={!canOptimiseImage(settings.heroImage)}
      />
      <div className="photo-hero-panel">
        <h1>{emphasise(settings.heroHeadline)}</h1>
        <p>{hero.sub}</p>
        <div className="hero-cta">
          <Link className="btn btn-solid" href="/collection/chairs">
            See the chairs
          </Link>
          <Link className="btn btn-line" href="/collection">
            Browse the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
