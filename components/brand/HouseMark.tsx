/**
 * The house mark: the name drawn rather than written. A section cut through a
 * house, three storeys under a pitched roof, and in every bay a chair in
 * profile. One chair sits alone in the gable, in the brand amber, so the eye
 * lands there first.
 *
 * The chair profile is the same abstract line used by the Modern classics
 * study: a chair, never a maker's chair. Bays alternate direction so the
 * facade reads as drawn rather than stamped.
 *
 * Pure SVG, no canvas and no script: hairlines on the panel ground, serialised
 * once at build. The strokes lay themselves down through CSS alone, storey by
 * storey from the ground up, and under reduced motion the whole drawing
 * renders at rest with nothing missing.
 *
 * Stroke widths are attributes rather than CSS because the chairs carry a
 * large scale in their transform, so each one divides its width back down.
 * vector-effect: non-scaling-stroke would be the tidier answer, but it moves
 * the dash pattern into device space and shatters the draw into dots.
 */

// ---- the chair, in chair space: x forward, y down, y = 1 is the floor ----
const CHAIR =
  "M.16 1 L.3 .54 C.285 .36 .25 .24 .275 .12 C.288 .048 .415 .042 .452 .122 " +
  "C.468 .232 .442 .384 .437 .5 C.55 .525 .68 .522 .79 .495 " +
  "C.835 .487 .85 .522 .83 .56 L.8 1";
// The midpoint of the profile's width, so a chair centres on its bay.
const CHAIR_MID = 0.505;

// ---- the house, in viewBox units ----
const VIEW = { w: 480, h: 400 };
const APEX = { x: 240, y: 22 };
const EAVE_Y = 146;
const OVERHANG = { left: 14, right: 466 };
const WALL = { left: 28, right: 452 };
const GROUND = 374;
const STOREYS = 3;
const BAYS = 4;

const storeyH = (GROUND - EAVE_Y) / STOREYS;
const bayW = (WALL.right - WALL.left) / BAYS;
// The floor of each storey, top storey first.
const floors = Array.from({ length: STOREYS }, (_, i) => EAVE_Y + (i + 1) * storeyH);
const partitions = Array.from({ length: BAYS - 1 }, (_, i) => WALL.left + (i + 1) * bayW);
const bayCentres = Array.from({ length: BAYS }, (_, i) => WALL.left + (i + 0.5) * bayW);

const CHAIR_H = 56;
const GABLE_CHAIR_H = 64;

// Line weights as they land in viewBox units. The mark renders between about
// 0.7x and 1.3x, so these stay hairlines at every size the panel takes.
const W_FRAME = 1.5;
const W_FLOOR = 1.1;
const W_DIVIDER = 1;
const W_CHAIR = 1.15;
const W_CHAIR_LEAD = 1.5;

/** Places the profile on a floor line, centred on x, mirrored on request. */
function seat(x: number, floorY: number, h: number, flip: boolean) {
  return `translate(${x} ${floorY}) scale(${flip ? -h : h} ${h}) translate(${-CHAIR_MID} -1)`;
}

// The order the drawing lays itself down in: the shell, then the chairs from
// the ground floor up, then the one in the gable last.
const STRUCTURE_STEP = 0.07;
const CHAIR_START = 0.3;
const CHAIR_STEP = 0.05;

const delay = (s: number) => ({ animationDelay: `${s.toFixed(2)}s` });

export default function HouseMark() {
  const structure = [
    // the roof, eave to apex to eave
    `M${OVERHANG.left} ${EAVE_Y} L${APEX.x} ${APEX.y} L${OVERHANG.right} ${EAVE_Y}`,
    // the walls
    `M${WALL.left} ${EAVE_Y} V${GROUND}`,
    `M${WALL.right} ${EAVE_Y} V${GROUND}`,
    // the ground the house stands on
    `M${OVERHANG.left} ${GROUND} H${OVERHANG.right}`,
  ];

  const chairs: { transform: string; step: number }[] = [];
  floors.forEach((floorY, row) => {
    bayCentres.forEach((cx, col) => {
      chairs.push({
        transform: seat(cx, floorY, CHAIR_H, (row + col) % 2 === 1),
        // ground floor first, so the house fills from the bottom up
        step: (STOREYS - 1 - row) * BAYS + col,
      });
    });
  });
  const gableDelay = CHAIR_START + chairs.length * CHAIR_STEP + 0.1;

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {structure.map((d, i) => (
        <path
          key={`s${i}`}
          className="mark-line mark-frame"
          d={d}
          strokeWidth={W_FRAME}
          pathLength={100}
          data-draw=""
          style={delay(i * STRUCTURE_STEP)}
        />
      ))}

      {/* the floors between storeys, the eaves line closing the body */}
      {[EAVE_Y, ...floors.slice(0, -1)].map((y, i) => (
        <path
          key={`f${i}`}
          className="mark-line mark-floor"
          d={`M${WALL.left} ${y} H${WALL.right}`}
          strokeWidth={W_FLOOR}
          pathLength={100}
          data-draw=""
          style={delay(0.2 + i * STRUCTURE_STEP)}
        />
      ))}

      {/* the walls dividing one bay from the next */}
      {partitions.map((x, i) => (
        <path
          key={`p${i}`}
          className="mark-line mark-divider"
          d={`M${x} ${EAVE_Y} V${GROUND}`}
          strokeWidth={W_DIVIDER}
          pathLength={100}
          data-draw=""
          style={delay(0.26 + i * 0.04)}
        />
      ))}

      {chairs.map((c, i) => (
        <path
          key={`c${i}`}
          className="mark-line mark-chair"
          d={CHAIR}
          transform={c.transform}
          strokeWidth={W_CHAIR / CHAIR_H}
          pathLength={100}
          data-draw=""
          style={delay(CHAIR_START + c.step * CHAIR_STEP)}
        />
      ))}

      {/* the chair in the gable, the one the house is named for */}
      <path
        className="mark-line mark-chair-lead"
        d={CHAIR}
        transform={seat(APEX.x, EAVE_Y, GABLE_CHAIR_H, false)}
        strokeWidth={W_CHAIR_LEAD / GABLE_CHAIR_H}
        pathLength={100}
        data-draw=""
        style={delay(gableDelay)}
      />
    </svg>
  );
}
