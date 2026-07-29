/**
 * Reads the designer's chair silhouettes from public/ and writes lib/chairs.ts.
 * The SVG files stay the source of truth; run `npm run chairs` after changing
 * them. Inlining the paths keeps the splash and the hero off the network: the
 * whole set is about 10KB of path data, cheaper than sixteen requests.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "public";
const files = readdirSync(DIR)
  .filter((f) => /^Asset \d+\.svg$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

const chairs = files.map((file) => {
  const svg = readFileSync(join(DIR, file), "utf8");
  const [, vb] = svg.match(/viewBox="([^"]+)"/);
  const [, , w, h] = vb.split(/\s+/).map(Number);
  // Some silhouettes are drawn as several paths; one string draws them all.
  const d = [...svg.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]).join(" ");
  return { id: file.replace(/\.svg$/, ""), w, h, d };
});

const body = chairs
  .map(
    (c) =>
      `  { id: ${JSON.stringify(c.id)}, w: ${c.w}, h: ${c.h}, d: ${JSON.stringify(c.d)} },`,
  )
  .join("\n");

writeFileSync(
  "lib/chairs.ts",
  `/**
 * The chair silhouettes, extracted from public/Asset *.svg by
 * scripts/extract-chairs.mjs. Do not edit by hand: edit the SVGs and run
 * \`npm run chairs\`.
 *
 * Each entry carries the path's own coordinate space (w, h) so it can be
 * placed at any size, by the splash on canvas and by the hero in SVG.
 */

export interface Chair {
  id: string;
  /** The silhouette's own width and height, its viewBox extent. */
  w: number;
  h: number;
  /** Every subpath of the silhouette, concatenated. */
  d: string;
}

export const chairs: Chair[] = [
${body}
];
`,
);

console.log(`wrote lib/chairs.ts with ${chairs.length} chairs`);
