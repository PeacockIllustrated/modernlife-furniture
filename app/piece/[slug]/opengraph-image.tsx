import { ImageResponse } from "next/og";
import { getPieceBySlug } from "@/lib/collection";
import { staticPieces } from "@/content/pieces";
import { statusLabel, priceLabel } from "@/lib/format";

export function generateStaticParams() {
  return staticPieces.map((p) => ({ slug: p.slug }));
}

// Per-piece Open Graph card. Social shareability is a priority for this site,
// so a link dropped into Instagram, Pinterest or a message lands with the
// piece named on the museum-stone ground rather than a bare URL. Rendered at
// the standard 1200x630 with the site palette; no external assets so it builds
// anywhere.

export const alt = "Modern Life Furniture";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STONE = "#e4e2db";
const INK = "#1e211e";
const HAIR = "rgba(30, 33, 30, 0.18)";

const ACCENT: Record<string, string> = {
  available: "#5e7a6b",
  reserved: "#b4685e",
  sold: "#b4685e",
  restoration: "#c97b3d",
  draft: "#1e211e",
};

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const piece = await getPieceBySlug(params.slug);

  if (!piece) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: STONE,
            color: INK,
            fontSize: 56,
            letterSpacing: "-0.02em",
          }}
        >
          Modern Life Furniture
        </div>
      ),
      { ...size },
    );
  }

  const accent = ACCENT[piece.status] ?? INK;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: STONE,
          color: INK,
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(30, 33, 30, 0.6)",
          }}
        >
          <span>Modern Life Furniture</span>
          <span>Specimen record</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: "0.02em",
              color: "rgba(30, 33, 30, 0.72)",
              marginBottom: 18,
            }}
          >
            {piece.attribution}
          </div>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            {piece.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${HAIR}`,
            paddingTop: 28,
            fontSize: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: accent,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                background: accent,
                display: "flex",
              }}
            />
            <span>{statusLabel(piece.status)}</span>
          </div>
          <div style={{ color: "rgba(30, 33, 30, 0.72)" }}>
            {priceLabel(piece.priceOnRequest, piece.pricePence)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
