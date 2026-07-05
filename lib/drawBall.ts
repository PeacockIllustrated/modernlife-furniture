import { clamp, lerp } from "./anim";

/**
 * The ball chair, drawn in the site's own language.
 *
 * Contour lines carry the form: meridians describe the sphere, receding rings
 * describe the cavity, piping lines describe the cushions. This is the single
 * renderer shared by BallChair (assembled) and ExplodedBall (the conservator's
 * drawing). It is pure: context in, no React, no module state that mutates
 * between frames. Any improvement to the chair lands here and nowhere else.
 *
 * Positioned by explicit part centres (`P`) so it can assemble or explode
 * cleanly; each part is faded independently by `A`. The vivid orange interior
 * is intentional and must not be desaturated to the base palette.
 */

export interface BallPositions {
  /** shell centre y */
  shellY: number;
  /** interior (aperture cavity) centre y */
  intY: number;
  /** cushion centre y */
  cushY: number;
  /** stem top y */
  stemTopY: number;
  /** base ellipse centre y */
  baseY: number;
  /** floor shadow centre y */
  shadowY: number;
}

export interface BallAlphas {
  shell?: number;
  interior?: number;
  cushion?: number;
  stem?: number;
  base?: number;
}

/** Default ground the aperture is punched through: gallery stone. */
const STONE = "#E4E2DB";

export function drawBall(
  ctx: CanvasRenderingContext2D,
  cx: number,
  R: number,
  t: number,
  sw: number,
  P: BallPositions,
  A: BallAlphas,
  bg: string = STONE,
): void {
  const a = (k: keyof BallAlphas): number => (A[k] === undefined ? 1 : A[k]!);
  ctx.lineCap = "round";
  const opR = R * 0.8;
  const opX = cx + sw;

  /* floor shadow, thinning as the piece lifts apart */
  const apart = Math.abs(P.shellY - (P.intY - R * 0.02));
  ctx.save();
  ctx.globalAlpha =
    Math.min(a("base"), a("shell")) *
    clamp(1 - apart / (R * 1.4), 0.2, 1) *
    0.5;
  ctx.fillStyle = "rgba(30,33,30,.18)";
  ctx.beginPath();
  ctx.ellipse(cx, P.shadowY, R * 0.62, R * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* ---- base: the tulip foot, turned metal described by rings ---- */
  if (a("base") > 0) {
    ctx.save();
    ctx.globalAlpha = a("base");
    ctx.fillStyle = "#F2F0E8";
    ctx.strokeStyle = "rgba(30,33,30,.55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(cx, P.baseY, R * 0.42, R * 0.095, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    /* turning rings */
    ctx.strokeStyle = "rgba(30,33,30,.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, P.baseY, R * 0.3, R * 0.062, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(30,33,30,.09)";
    ctx.beginPath();
    ctx.ellipse(cx, P.baseY, R * 0.17, R * 0.032, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /* ---- stem: swept enamel, form carried by two inner contour curves ---- */
  if (a("stem") > 0) {
    ctx.save();
    ctx.globalAlpha = a("stem");
    const sTop = P.stemTopY;
    const sBot = P.stemTopY + R * 0.48;
    ctx.fillStyle = "#F0EEE6";
    ctx.strokeStyle = "rgba(30,33,30,.5)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.1, sTop);
    ctx.bezierCurveTo(
      cx - R * 0.1,
      sBot - R * 0.16,
      cx - R * 0.2,
      sBot - R * 0.06,
      cx - R * 0.22,
      sBot,
    );
    ctx.lineTo(cx + R * 0.22, sBot);
    ctx.bezierCurveTo(
      cx + R * 0.2,
      sBot - R * 0.06,
      cx + R * 0.1,
      sBot - R * 0.16,
      cx + R * 0.1,
      sTop,
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    /* seat plate the sphere rests on */
    ctx.fillStyle = "#EDEBE2";
    ctx.strokeStyle = "rgba(30,33,30,.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, sTop, R * 0.3, R * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    /* contour curves */
    ctx.strokeStyle = "rgba(30,33,30,.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.045, sTop + R * 0.05);
    ctx.bezierCurveTo(
      cx - R * 0.045,
      sBot - R * 0.18,
      cx - R * 0.11,
      sBot - R * 0.07,
      cx - R * 0.13,
      sBot - R * 0.02,
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + R * 0.045, sTop + R * 0.05);
    ctx.bezierCurveTo(
      cx + R * 0.045,
      sBot - R * 0.18,
      cx + R * 0.11,
      sBot - R * 0.07,
      cx + R * 0.13,
      sBot - R * 0.02,
    );
    ctx.stroke();
    ctx.restore();
  }

  /* ---- cushions: piped wool, drawn as nested contour ellipses ---- */
  if (a("cushion") > 0) {
    ctx.save();
    ctx.globalAlpha = a("cushion");
    const cy2 = P.cushY;
    /* seat */
    ctx.fillStyle = "#E76F26";
    ctx.beginPath();
    ctx.ellipse(cx + sw - R * 0.05, cy2, opR * 0.58, opR * 0.26, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(140,45,12,.55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(cx + sw - R * 0.05, cy2, opR * 0.58, opR * 0.26, -0.05, 0, Math.PI * 2);
    ctx.stroke();
    /* piping contours */
    ctx.strokeStyle = "rgba(140,45,12,.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(
      cx + sw - R * 0.05,
      cy2 - opR * 0.02,
      opR * 0.42,
      opR * 0.16,
      -0.05,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.28)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(
      cx + sw - R * 0.08,
      cy2 - opR * 0.08,
      opR * 0.34,
      opR * 0.09,
      -0.07,
      Math.PI * 1.05,
      Math.PI * 1.95,
    );
    ctx.stroke();
    /* bolster */
    ctx.fillStyle = "#F07E33";
    ctx.beginPath();
    ctx.ellipse(
      cx + sw + opR * 0.36,
      cy2 + opR * 0.17,
      opR * 0.32,
      opR * 0.12,
      -0.16,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.strokeStyle = "rgba(140,45,12,.5)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.ellipse(
      cx + sw + opR * 0.36,
      cy2 + opR * 0.17,
      opR * 0.32,
      opR * 0.12,
      -0.16,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(
      cx + sw + opR * 0.34,
      cy2 + opR * 0.13,
      opR * 0.2,
      opR * 0.05,
      -0.16,
      Math.PI * 1.1,
      Math.PI * 1.9,
    );
    ctx.stroke();
    ctx.restore();
  }

  /* ---- shell: hollow fibreglass, meridians carry the volume ---- */
  if (a("shell") > 0) {
    ctx.save();
    ctx.globalAlpha = a("shell");
    const sy = P.shellY;
    const apY = sy + R * 0.02; /* aperture sits on the shell */
    ctx.fillStyle = "#F4F2EA";
    ctx.beginPath();
    ctx.arc(cx, sy, R, 0, Math.PI * 2);
    ctx.fill();
    /* meridian contours, clipped to the sphere, leaning with the swivel */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, sy, R, 0, Math.PI * 2);
    ctx.clip();
    const mers = [0.32, 0.58, 0.82];
    for (let m = 0; m < mers.length; m++) {
      const rx = R * mers[m];
      ctx.strokeStyle = "rgba(30,33,30," + (0.05 + m * 0.02) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx - sw * 0.8 * (1 - mers[m]), sy, rx, R * 0.995, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    /* one latitude, low on the form */
    ctx.strokeStyle = "rgba(30,33,30,.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, sy + R * 0.42, R * 0.9, R * 0.2, 0, 0, Math.PI);
    ctx.stroke();
    /* body shade, hatched not flat */
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = "rgba(30,33,30," + (0.05 - k * 0.012) + ")";
      ctx.lineWidth = R * 0.05;
      ctx.beginPath();
      ctx.arc(cx, sy, R * (0.9 - k * 0.055), Math.PI * 0.55, Math.PI * 1.12);
      ctx.stroke();
    }
    /* sheen, breathing, hatched */
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle =
        "rgba(255,255,255," + (0.4 - k * 0.12 + Math.sin(t * 0.7) * 0.06) + ")";
      ctx.lineWidth = R * 0.025;
      ctx.beginPath();
      ctx.arc(cx, sy, R * (0.92 - k * 0.045), -Math.PI * 0.44, -Math.PI * 0.06);
      ctx.stroke();
    }
    ctx.restore();
    /* the aperture: punched clean through, this is a hollow object */
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(opX, apY, opR, 0, Math.PI * 2);
    ctx.fill();
    /* moulded rim, two contours reading as wall thickness */
    ctx.strokeStyle = "#E9E6DC";
    ctx.lineWidth = R * 0.05;
    ctx.beginPath();
    ctx.arc(opX, apY, opR + R * 0.025, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(30,33,30,.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(opX, apY, opR + R * 0.055, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(30,33,30,.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(opX, apY, opR, 0, Math.PI * 2);
    ctx.stroke();
    /* outer line last */
    ctx.strokeStyle = "rgba(30,33,30,.75)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx, sy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  /* ---- interior: the cavity, depth carried by receding rings ---- */
  if (a("interior") > 0) {
    ctx.save();
    ctx.globalAlpha = a("interior");
    const iy = P.intY;
    const g = ctx.createRadialGradient(
      opX - sw * 0.6 - opR * 0.12,
      iy - opR * 0.14,
      opR * 0.08,
      opX,
      iy,
      opR,
    );
    g.addColorStop(0, "#F0812F");
    g.addColorStop(0.5, "#DC5E1F");
    g.addColorStop(1, "#98380F");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(opX, iy, opR, 0, Math.PI * 2);
    ctx.fill();
    /* the tunnel: rings recede to the back of the cavity, away from the swivel */
    const bx = opX - sw * 1.4 - opR * 0.14;
    const by = iy - opR * 0.1;
    ctx.lineWidth = 1;
    for (let k = 1; k <= 7; k++) {
      const u = k / 8;
      const rr = opR * (1 - u * 0.86);
      const kx = lerp(opX, bx, u);
      const ky = lerp(iy, by, u);
      const breathe = Math.sin(t * 0.6 + k * 0.7) * opR * 0.006;
      ctx.strokeStyle =
        "rgba(" +
        Math.round(lerp(120, 60, u)) +
        "," +
        Math.round(lerp(38, 16, u)) +
        "," +
        Math.round(lerp(10, 4, u)) +
        "," +
        (0.24 + u * 0.14) +
        ")";
      ctx.beginPath();
      ctx.arc(kx, ky, rr + breathe, 0, Math.PI * 2);
      ctx.stroke();
    }
    /* upholstery seams, falling toward the back point */
    ctx.strokeStyle = "rgba(120,36,8,.45)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(opX - opR * 0.02, iy - opR * 0.96);
    ctx.quadraticCurveTo(
      lerp(opX, bx, 0.5) + opR * 0.1,
      lerp(iy, by, 0.5) - opR * 0.2,
      bx + opR * 0.02,
      by + opR * 0.06,
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(opX + opR * 0.62, iy - opR * 0.7);
    ctx.quadraticCurveTo(
      lerp(opX, bx, 0.5) + opR * 0.3,
      lerp(iy, by, 0.5),
      bx + opR * 0.1,
      by + opR * 0.04,
    );
    ctx.stroke();
    /* rim light where the opening catches the room */
    ctx.strokeStyle = "rgba(255,190,140,.5)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(opX, iy, opR * 0.97, -Math.PI * 0.75, -Math.PI * 0.15);
    ctx.stroke();
    ctx.restore();
  }
}
