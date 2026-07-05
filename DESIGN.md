# DESIGN.md — Modern Life Furniture

The design direction, locked. Reference render: `reference/concept-v5.html`.

## Concept
A specimen gallery. The site treats furniture the way a museum treats specimens: one subject per room, isolated, lit, labelled, with provenance. Because the client is a collector-restorer, the gallery language is literal, not metaphorical. The signature is that every category is represented by a live generative "material study" drawn in contour lines, not photography, in phase one. Photography joins later at piece level; the category visuals stay generative.

Every visual on the site is built from lines. That is the unifying rule. Fills exist only in service of line drawings (the ball chair interior gradient sits beneath its depth rings; the strata bands are the exception that proves the rule, being pure sediment). If a new visual is proposed, it must be describable as "contour lines doing X".

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
- Cursor is a presence, not a pointer: it displaces the hero field, refracts the strata, brightens grove branches, swells the rings, swivels the chair, explodes the drawing
- Idle states self-demonstrate: the chair sways gently, the exploded drawing breathes apart and together, so the interactions are discoverable without instruction
- All eased following uses lerp toward a target (factor 0.05 to 0.06) so everything has weight
- Production upgrade: drive the build sequences (chair assembly, grove growth) from Lenis/ScrollTrigger scroll progress rather than time-once-visible, so scrubbing the page scrubs the build

## The five visuals, build specs
All are implemented in `reference/concept-v5.html`; port each into a typed component with the shared canvas lifecycle hook (see ARCHITECTURE.md). Numbers below are the tuned values; keep them.

### 1. Tide (hero)
Horizontal contour lines, one per ~30px of height, each point displaced by three summed sines (freq 0.012/0.004/0.021, amps 7/13/3, drifting at differing speeds). Cursor applies a gaussian lift, exp(-d²/16000) × 34px within ~220px. Ink on stone, opacity ramping 0.16 to 0.50 with depth. Reads as water held still, or the grain of time.

### 2. Ball chair (Chairs category) — the signature object
One renderer, `drawBall(ctx, cx, R, t, swivel, positions, alphas)`, shared with the Restoration visual. Form is carried by contour lines:
- Shell: bone fill, then clipped meridian ellipses at rx 0.32/0.58/0.82R (alpha .05 to .09) that lean opposite the swivel; one low latitude arc; hatched shade (3 arcs, lower left) and hatched breathing sheen (3 arcs, upper right). Outer ink line 1.6px last
- Aperture: punched to the background colour with a two-contour moulded rim (bone ring R×0.05 plus two thin ink rings), so the shell reads hollow when the interior separates
- Interior: radial gradient (#F0812F → #DC5E1F → #98380F), then THE TUNNEL: seven receding rings, radius shrinking to 0.14×, centres lerping toward a back point offset opposite the swivel, colour darkening rust, subtle per-ring breathing. Two upholstery seams curving to the back point. Warm rim-light arc (rgba(255,190,140,.5)) on the upper opening edge
- Cushions: seat and bolster as filled ellipses with piping contour ellipses and a thin white highlight stitch arc
- Stem: swept bezier form with a seat plate ellipse and two inner contour curves; base: ellipse with two concentric "turning rings" like spun metal
- Swivel: target = cursor x relative to centre, clamped, × R×0.14; lerp 0.05. Idle: sin(t×0.3) × R×0.05
- Build sequence (assembled instance): ink circumference sweeps (compass stroke), interior blooms, pedestal rises ~R×0.25 into place, cushions settle. In production, bind sequence progress to scroll

### 3. Grove (Shelving and storage, dark room)
Seeded recursive branching from three trunks at the floor line: depth ≤ 7, length decay 0.66 to 0.82, spread ±0.575rad; horizontal "shelf" segments spawn at depths 2 to 4 with p=0.3. Segments draw in order (growth counter, full in ~4s while visible), bone lines on basalt, width tapering 4.5 to 0.6 by depth, per-branch sway by depth, cursor proximity brightens and lifts nearby segments.

### 4. Strata (Cabinets and sideboards)
Ninety horizontal bands inside an outlined cabinet rectangle with two oak feet. Band colours interpolate amber → rose → smoke → sea → amber with per-band seeds. Bands drift slowly; the band nearest the cursor's y refracts horizontally exp(-dy²/9000) × 26px and brightens. Reads as veneer and lacquer layers bending light around the hand.

### 5. Conservator's drawing (Restoration)
The same drawBall renderer, exploded. Explicit part centres, assembled vs exploded, lerped by an eased explode factor e:
- shell −1.48R, interior +0.42R, cushions +1.62R, stem top +2.02R, base +2.85R (relative to cy); shadow drifts down and thins
- e target: cursor distance from the chair centre / (0.52 × min dimension), clamped; idle: 0.3 + 0.2sin(t×0.35)
- Dashed vertical register line the full panel height, the drawing's spine
- Leader lines to right-aligned mono notes, alpha keyed to e (in from e=0.3): "shell / fibreglass, refinished", "upholstery / wool, replaced", "cushions / foam, renewed", "stem / steel, re-enamelled", "base / cast, rebalanced". Labels are measured (measureText) and right-aligned to panel edge minus 16px so they never clip

## Anti-clipart rules (learned the hard way in v4)
- No flat fill + outline as the sole description of a form. Volume must be carried by contour lines, hatching or receding rings
- Shading and highlights are hatched clusters of thin arcs, never single fat strokes
- Any hollow object shown open must be genuinely punched through to the ground colour
- Exploded diagrams separate along a single axis with clear air between parts; parts never half-overlap
