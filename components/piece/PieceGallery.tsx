"use client";

import { useState } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { PieceImage } from "@/lib/collection";

/**
 * The specimen gallery: the category's generative study as the ground, the
 * photographs laid over it, and a thumbnail rail for walking through them.
 * The study arrives as children from the server page, so this client shell
 * owns nothing but the choice of photograph. With no photography at all the
 * study stands as the exhibit and a quiet note says so, exactly the contract
 * the old PieceFigure kept.
 */

const KIND_CAPTIONS: Partial<Record<PieceImage["kind"], string>> = {
  as_found: "As found",
  restored: "Restored",
};

export default function PieceGallery({
  images,
  label,
  children,
}: {
  images: PieceImage[];
  label: string;
  children: ReactNode;
}) {
  // Lead with the hero when one is marked, otherwise the first photograph.
  const heroIndex = Math.max(
    images.findIndex((i) => i.kind === "hero"),
    0,
  );
  const [active, setActive] = useState(heroIndex);
  const current = images[active] ?? images[0];
  const hasPhoto = Boolean(current);

  return (
    <div className="piece-gallery">
      <div className="piece-figure">
        <div
          className="piece-backdrop"
          style={{ opacity: hasPhoto ? 0.22 : 1 }}
          aria-hidden={hasPhoto ? "true" : undefined}
        >
          {children}
        </div>
        {hasPhoto ? (
          <Image
            // Remount per photograph so a slow load never shows a stale alt.
            key={current.path}
            className="piece-photo"
            src={current.path}
            alt={current.alt || label}
            fill
            sizes="(max-width: 860px) 100vw, 58vw"
            priority={active === heroIndex}
          />
        ) : (
          <span className="no-photo mono">Photography to follow</span>
        )}
      </div>

      {images.length > 1 ? (
        <div
          className="gallery-rail"
          role="group"
          aria-label="Photographs of the piece"
        >
          {images.map((image, i) => {
            const caption = KIND_CAPTIONS[image.kind];
            return (
              <button
                key={`${image.path}-${i}`}
                type="button"
                className="gallery-thumb"
                aria-pressed={i === active}
                aria-label={`Show photograph ${i + 1}${
                  image.alt ? `, ${image.alt}` : ""
                }`}
                onClick={() => setActive(i)}
              >
                <span className="gallery-thumb-img" aria-hidden="true">
                  <Image src={image.path} alt="" fill sizes="88px" />
                </span>
                {caption ? (
                  <span className="gallery-kind mono">{caption}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
