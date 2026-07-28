import { ImageResponse } from "next/og";

// The sitewide Open Graph card. Generated rather than shipped as a static
// image, so the wordmark can never drift out of date behind a rebrand, and so
// it builds anywhere with no external assets. 1200x630 in the site palette,
// the house mark reduced to its outline beside the name.

export const alt = "House of Chairs, vintage designer furniture, chairs first";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f5f3ef";
const INK = "#1e211e";
const AMBER = "#c97b3d";
const HAIR = "rgba(30, 33, 30, 0.18)";

// The chair profile and the house it sits in, the same drawing as the hero
// mark, reduced to a single gable for the card.
const CHAIR =
  "M.16 1 L.3 .54 C.285 .36 .25 .24 .275 .12 C.288 .048 .415 .042 .452 .122 " +
  "C.468 .232 .442 .384 .437 .5 C.55 .525 .68 .522 .79 .495 " +
  "C.835 .487 .85 .522 .83 .56 L.8 1";

function HouseGlyph() {
  return (
    <svg width={260} height={260} viewBox="0 0 200 200" fill="none">
      <path
        d="M8 78 L100 10 L192 78"
        stroke={INK}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 78 V186 M180 78 V186 M8 186 H192 M20 78 H180 M20 132 H180"
        stroke={INK}
        strokeWidth={2}
        strokeOpacity={0.55}
        strokeLinecap="round"
      />
      <path
        d={CHAIR}
        transform="translate(60 132) scale(48) translate(-0.505 -1)"
        stroke={INK}
        strokeWidth={0.05}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={CHAIR}
        transform="translate(140 132) scale(-48 48) translate(-0.505 -1)"
        stroke={INK}
        strokeWidth={0.05}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={CHAIR}
        transform="translate(60 186) scale(48) translate(-0.505 -1)"
        stroke={INK}
        strokeWidth={0.05}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={CHAIR}
        transform="translate(140 186) scale(-48 48) translate(-0.505 -1)"
        stroke={INK}
        strokeWidth={0.05}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={CHAIR}
        transform="translate(100 78) scale(54) translate(-0.505 -1)"
        stroke={AMBER}
        strokeWidth={0.05}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(30, 33, 30, 0.6)",
          }}
        >
          North East England
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 56,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 96,
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
              }}
            >
              House of Chairs
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                marginTop: 20,
                color: "rgba(30, 33, 30, 0.72)",
              }}
            >
              Vintage designer furniture, chairs above all
            </div>
          </div>
          <HouseGlyph />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${HAIR}`,
            paddingTop: 28,
            fontSize: 26,
            color: "rgba(30, 33, 30, 0.72)",
          }}
        >
          <span>Every piece one of one</span>
          <span>Delivered nationwide</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
