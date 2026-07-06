# DESIGN.md — Modern Life Furniture

The design direction, locked. Reference render: `reference/concept-v5.html`.

## Concept
A specimen gallery. The site treats furniture the way a museum treats specimens: one subject per room, isolated, lit, labelled, with provenance. Because the client is a collector-restorer, the gallery language is literal, not metaphorical. The signature is that every category is represented by a live generative "material study" drawn in contour lines, not photography, in phase one. Photography joins later at piece level; the category visuals stay generative.

Every visual on the site is built from lines. That is the unifying rule. Fills exist only in service of line drawings (the warmth in the ball chair's mouth sits beneath its lining arcs; the strata bands are the exception that proves the rule, being pure sediment). If a new visual is proposed, it must be describable as "contour lines doing X".

## Tokens
```css
--stone:      #E4E2DB;  /* gallery ground, light rooms   */
--stone-deep: #D8D6CE;  /* closing section ground        */
--ink:        #1E211E;  /* line work, text on light      */
--basalt:     #151C18;  /* dark rooms                    */
--bone:       #DDD9CC;  /* line work, text on dark       */
--amber:      #C97B3D;  /* accent 1, ownership, cane     */
--rose:       #B4685E;  /* accent 2                      */
--sea:        #5E7A6B;  /* accent 3                      */
--hair: 1px solid rgba(30,33,30,.28);  /* hairline rules */
```
The ball chair's interior uses a deliberately more vivid orange family than `--amber`, sampled from the reference chair photo: `#F0812F` rim, `#DC5E1F` mid, `#98380F` depth, cushions `#E76F26` and `#F07E33`, seams `rgba(120,36,8,.45)`. This is intentional: the page is muted stone so one saturated object per light room lands like the real chair in a showroom. Do not desaturate it to match the base palette.

## Type
- Display: Fraunces, weight 300 (400 for category h2s), optical size high, letter-spacing -0.02em, italic for emphasis words. Load via next/font
- Body: Archivo 400/500
- Utility/labels: Spline Sans Mono 400/500, 0.7 to 0.74rem, letter-spacing 0.08 to 0.12em. Used for the specimen-card dt terms, hints, nav, buttons, and all in-canvas annotation
- Hero h1: clamp(3.4rem, 11vw, 10.5rem), line-height 0.92
- Manifesto: Fraunces 300, clamp(1.5rem, 3.4vw, 2.9rem), max-width 24em, centred

## Layout system
- Full-bleed alternating "rooms": hero, manifesto, five category sections, closing, footer
- Category section: CSS grid 7fr (canvas panel) / 5fr (label card), min-height 100vh, hairline top border. Below 860px: stacked, panel min 58vh
- Room rhythm: light, dark, light, dark, light (Chairs, Shelving, Cabinets, Tables, Restoration)
- Label card: mono eyebrow ("Category 01 of 05"), Fraunces h2, story paragraph max 36ch, mono interaction hint, dl of facts (dt mono / dd Archivo), bordered mono CTA
- Every panel has a "plinth": a 1px line at 9% from the bottom, 8% inset, 25% opacity
- Header: fixed, mix-blend-mode difference so it inverts over dark rooms
- No cards, no rounded imagery, no shadows, ever

## Motion language
Motion borrows from natural and workshop processes, never from UI convention. No fades-and-slides-for-their-own-sake beyond the section reveal (26px rise, 0.9s ease).
- Cursor is a presence, not a pointer: it displaces the hero field, refracts the strata, brightens grove branches, swells the rings, turns the chair's mouth to face you, parts the seam
- Idle states self-demonstrate: the chair sways gently, the exploded drawing breathes apart and together, so the interactions are discoverable without instruction
- All eased following uses lerp toward a target (factor 0.05 to 0.06) so everything has weight
- Production upgrade: drive the build sequences (chair assembly, grove growth) from Lenis/ScrollTrigger scroll progress rather than time-once-visible, so scrubbing the page scrubs the build

## The five visuals, build specs
All are implemented in `reference/concept-v5.html`; port each into a typed component with the shared canvas lifecycle hook (see ARCHITECTURE.md). Numbers below are the tuned values; keep them.

### 1. Tide (hero)
Horizontal contour lines, one per ~30px of height, each point displaced by three summed sines (freq 0.012/0.004/0.021, amps 7/13/3, drifting at differing speeds). Cursor applies a gaussian lift, exp(-d²/16000) × 34px within ~220px. Ink on stone, opacity ramping 0.16 to 0.50 with depth. Reads as water held still, or the grain of time.

### 2. Ball chair (Chairs category) — the signature object, abstracted (amended by the owner, July 2026)
The literal portrait is retired. One renderer remains, `lib/drawBall.ts`, exporting `drawLatheChair`: the chair as a lathe survey, a stack of latitude sections whose broken mouths line up into the orange cavity. Form is carried entirely by lines:
- Geometry: shell radius R = min(w×0.30, h×0.31), centre (w×0.5, h×0.46). Seventeen latitude hoops, latitudes v from −0.94 to +0.94, each a tilted ellipse (ry = rx×0.24, rx = R×sqrt(1−v²)). A solid 1px lathe axis line at cx, alpha .12
- Depth: each hoop strokes in ~10 chunks, chunk alpha = base × (0.35 + 0.65 × facing), base = 0.22 + 0.30×(1−|v|); front chunks 1.3px, back 1px. Hatched shade (3 thin arcs, lower left) and a 1.5px silhouette circle at alpha .15 firm the sphere
- Mouth: slices within 0.78 latitude of centre −0.03 carry a gap of half-angle 1.15rad × sqrt profile, genuinely absent line punched to the stone, with ink cut ticks at each gap end (the shell wall in section)
- Cavity: two receding lining arcs per slice at rx×0.86 and rx×0.62, colour ramp #F0812F → #DC5E1F → #98380F by distance from the mouth centre (do not desaturate); one warmer seat arc (#E76F26) on the low slices; a radial warmth fill in the mouth lens (alpha ≤ 0.30, strictly beneath the lines); warm rim light rgba(255,190,140,.5) on the upper opening edge
- Stance: seat plate, four stem hoops and three base "turning rings" as flat-alpha section ellipses; two stroked shadow ellipses
- Swivel: per-slice azimuths, target = clamp((px−cx)/(w×0.35),−1,1) × 0.55rad, hard clamp ±0.90; ease factor 0.045 + 0.020×(1−|v|) so the equator leads and the turn travels through the body. Idle sin(t×0.3)×0.16
- Build (scroll-bound): every hoop enters as a compass stroke sweeping from the back, a warm pen-tip dot riding each live end; base 0 to 0.22, stem and seat 0.12 to 0.34, shell bottom-to-top 0.25 to 0.80, mouth and colour open last 0.72 to 1.00. Reduced motion holds the finished chair turned 0.22rad toward the label

### 3. Grove (Shelving and storage, dark room)
Seeded recursive branching from three trunks at the floor line: depth ≤ 7, length decay 0.66 to 0.82, spread ±0.575rad; horizontal "shelf" segments spawn at depths 2 to 4 with p=0.3. Segments draw in order (growth counter, full in ~4s while visible), bone lines on basalt, width tapering 4.5 to 0.6 by depth, per-branch sway by depth, cursor proximity brightens and lifts nearby segments.

### 4. Strata (Cabinets and sideboards)
Ninety horizontal bands inside an outlined cabinet rectangle with two oak feet. Band colours interpolate amber → rose → smoke → sea → amber with per-band seeds. Bands drift slowly; the band nearest the cursor's y refracts horizontally exp(-dy²/9000) × 26px and brightens. Reads as veneer and lacquer layers bending light around the hand.

### 5. The seam (Restoration) — abstract, no longer the chair (amended by the owner, July 2026)
`components/canvas/Seam.tsx`. Contour lines forming a single grain figure that cleaves along a vertical seam as you approach the panel edge, hatched stitches bridging the gap, healing to faint scars at rest. Ink on stone, no orange.
- Figure: eleven nested closed contours, deliberately not concentric; centres lerp from a heart point (−0.20B, +0.06B off centre) to the panel centre, radii B×(0.14 to 1.0), elongation 1.38 : 0.85, three summed sine wobbles per contour with per-session phases. Every third contour is a growth line (1.4px, alpha .55); the rest 1px, alpha .30 up. B = 0.34 × min dimension
- Cleave: separation e eased at 0.06 toward cursor distance from centre / (0.52 × min dimension); idle 0.3 + 0.2sin(t×0.35). Two clipped passes translated ±e×B×0.34, one axis only, clear air between the halves
- Cut faces: seam crossings interpolated per contour, joined per half by a 1px hand-true section polyline with end-grain ticks, nothing hidden
- Stitches: at most ten rungs at crossing heights, each a hatched cluster of three 0.8px quadratic arcs sagging with the gap, anchor ticks at both ends, fading in over e 0.22 to 0.5. Below e 0.18 the rungs become faint 65-degree scars, the repair still legible at rest
- Dashed vertical register line the full panel height, the drawing's spine
- Leader lines to right-aligned mono notes (measured, panel edge minus 16px, never clipped), alpha in from e=0.3, naming only generic acts: "seam / opened along the joint", "faces / cleaned back to timber", "stitch / bridged, reversible", "grain / matched through the break", "close / clamped and left to rest"
- Reduced motion holds e=0.55: parted, stitched, annotated

## Anti-clipart rules (learned the hard way in v4)
- No flat fill + outline as the sole description of a form. Volume must be carried by contour lines, hatching or receding rings
- Shading and highlights are hatched clusters of thin arcs, never single fat strokes
- Any hollow object shown open must be genuinely punched through to the ground colour
- Exploded diagrams separate along a single axis with clear air between parts; parts never half-overlap
