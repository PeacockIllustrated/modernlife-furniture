import Image from "next/image";
import type { PieceFeature } from "@/lib/collection";
import type { RoomVisual as RoomVisualKind } from "@/content/landing";
import RoomVisual from "@/components/canvas/RoomVisual";
import Plinth from "@/components/gallery/Plinth";
import { emphasise } from "@/components/typography/Em";

/**
 * The piece, in detail: the owner's story bands, each one feature of the
 * piece given a media panel and a short passage, media and text alternating
 * sides like plates in a catalogue. Photography fills the panel when the
 * owner has uploaded it; until then the category's generative study stands in
 * at low intensity over a plinth, so the template reads complete today.
 */
export default function StoryBands({
  features,
  visual,
  canvasLabel,
}: {
  features: PieceFeature[];
  visual: RoomVisualKind;
  canvasLabel: string;
}) {
  if (features.length === 0) return null;
  return (
    <section
      className="section-rule story-bands"
      aria-label="The piece, in detail"
    >
      <span className="mono eyebrow">The piece, in detail</span>
      {features.map((feature) => (
        <article
          key={feature.position}
          className="story-band reveal"
          data-layout={feature.layout}
        >
          <div className="story-band-figure">
            {feature.imagePath ? (
              <Image
                className="story-band-photo"
                src={feature.imagePath}
                alt={feature.imageAlt || feature.title.replaceAll("*", "")}
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            ) : (
              <>
                <div className="story-band-backdrop" aria-hidden="true">
                  <RoomVisual
                    visual={visual}
                    label={canvasLabel}
                    scrollBound={false}
                  />
                </div>
                <Plinth />
              </>
            )}
          </div>
          <div className="story-band-text">
            {feature.eyebrow ? (
              <span className="mono story-band-eyebrow">{feature.eyebrow}</span>
            ) : null}
            <h2>{emphasise(feature.title)}</h2>
            <p>{feature.body}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
