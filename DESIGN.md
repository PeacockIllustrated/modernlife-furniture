# DESIGN.md — House of Chairs, design system v2

The working reference for the clean commercial store. It supersedes the
museum-gallery system; `reference/concept-v5.html` is history, not authority.
CLAUDE.md carries the intent; this file carries the values.

## Concept
A premium direct-to-consumer store in our own voice. Photography leads, type
is confident and quiet, surfaces are flat, shapes are softly rounded, motion
is light. Every band is designed around an image slot managed from the
dashboard; the generative line drawings survive only as quiet placeholders
until photography exists and as small brand accents. Never design a section
that only works with the drawing.

## Tokens (app/globals.css, `:root`)
```css
--paper:  #F5F3EF;  /* page ground                    */
--panel:  #EAE7E1;  /* panel tone, tonal blocks       */
--stone:      var(--paper);  /* legacy alias, keep     */
--stone-deep: var(--panel);  /* legacy alias, keep     */
--ink:    #1E211E;  /* text on light                  */
--basalt: #151C18;  /* dark bands and footer          */
--bone:   #DDD9CC;  /* text on dark                   */
--amber:  #C97B3D;  /* single brand accent; also the "prepared" status */
--rose:   #B4685E;  /* status only: reserved, sold    */
--sea:    #5E7A6B;  /* status only: available         */
--hair-colour: rgba(30,33,30,.16);
--hair: 1px solid var(--hair-colour);
--radius-s: 6px;    /* inputs, selects, textareas, small elements */
--radius-m: 12px;   /* cards, figures, tonal blocks   */
--shadow-float: 0 8px 24px rgba(30,33,30,.12); /* floating elements only */
```
Status colours are data, not decoration. The legacy `--stone` aliases exist so
older rules keep working; new work should reference `--paper` and `--panel`.

## Shape
- Pill buttons everywhere: `border-radius: 999px` on `.enquire`, `.btn`,
  `.btn-solid`, `.btn-line`, `.highlight-all`, `.featured-cta`,
  `.interest-open`, and form submits. Comfortable horizontal padding,
  palette-inversion hover kept from v1.
- `--radius-s` on inputs, selects and textareas.
- `--radius-m` on cards and figures that hold images or canvases, always with
  `overflow: hidden`: `.featured-figure`, `.room-tile-figure`,
  `.promo-figure`, `.cat-row-figure`, `.piece-figure`, `.enquire-panel`,
  `.enquire-aside`, `.block`, `.acquire`. The photo hero panel rounds only
  its free corner.
- `--shadow-float` is for floating elements only (sticky bars, the mobile
  enquiry bar). Flat surfaces carry no shadow.
- Full-bleed bands (`.category-band`, `.feature`, `.buying`) stay square;
  rounding belongs to elements that sit inside a ground, not to the grounds.

## Type
- Display: Fraunces, weight 300 (400 for card h3s), italic for the one
  emphasis word (the "Checked, documented, *delivered*" pattern). Loaded via
  next/font.
- Body and UI: Archivo 400/500.
- Mono (Spline Sans Mono) is demoted to small metadata only: eyebrows,
  counters, prices, status lines, nav, footer columns.
- Sentence case everywhere, including nav and buttons.

## Layout rhythm
- Content capped at `--shell` (1200px) and centred via `--edge-pad`;
  backgrounds run full bleed.
- Whitespace is generous, one idea per band. Alternate paper and panel
  grounds with an occasional basalt band (buying band, feature closers,
  footer top strip) for rhythm; hairlines structure the inside of a ground.
- Chairs lead: nav first link, hero primary CTA, first tile in the category
  row, first row of the collection index.
- Header: a plain fixed bar on paper, slightly translucent with backdrop
  blur, bottom hairline. The v1 difference blend is retired; it fought the
  light commercial ground and the photography.
- The announcement strip sits in normal flow beneath the header and scrolls
  away; its top padding keeps its line clear of the fixed bar.

## The chair silhouettes
Sixteen drawn chair profiles live in `public/Asset *.svg` and are extracted
into `lib/chairs.ts` by `npm run chairs`. The SVGs stay the source; the module
is generated, so edit the drawings, not the paths. Inlining them keeps both the
splash and the hero off the network: the whole set is about 10KB of path data,
cheaper than sixteen requests, scalable, and recolourable to any token.

They carry the brand on their own. Do not outline them, do not put them in
frames or grids of equal cells, and do not arrange them into a picture of
something else: they are the pieces, shown as pieces.

## The logo
The mark lives in `public/logo/` as the designer exported it: `FullSet.svg` is
the full lockup (icon, wordmark, rule, tagline), with `Logo.svg`, `Icon.svg`
and `Tagline.svg` as the pieces. Those four are the source and are never edited
by hand here.

`npm run logo` reads `FullSet.svg` and writes
`public/logo/house-of-chairs-animated.svg`: the same artwork, passed through
untouched, with a `data-part` attribute on each element and a block of CSS
appended to the file's own `<style>`. Re-export from Illustrator and run it
again; the script counts the drawable elements and fails loudly if the export
order changed, rather than animating the wrong letter.

The build, in order, is the mark explaining itself:

1. **H, U, S and E fall in**, leaving the gap where the O belongs.
2. **CHAIRS arrives letter by letter** from the left.
3. **The O drops last**, onto the H of CHAIRS that has just settled beneath it.
   That interlock is the whole idea of the lockup, so the animation is built
   to point at it and everything else waits its turn.
4. **The rest assembles**: "of", the icon, the rule drawing left to right, then
   the tagline.

It ends at about 2.2 seconds. The output is self-contained, with no script and
no external references, so it plays in a browser, inside an `<img>`, and in
anything else that renders SVG with CSS. That is what lets the splash and any
exported use of the logo be the same file rather than two things that drift.
Under reduced motion the whole lockup renders at rest with nothing missing.

## The splash
`components/splash/` is the first-visit curtain: chairs rain in on the paper
ground, pile up under a real solver (`lib/physics.ts`), then the floor opens
and the heap drains off the bottom of the screen. The paper goes before the
chairs do, so the site appears behind them while they are still falling. The
logo assembles over the top of it, played straight from the exported asset, and
the floor holds until it has landed and had a beat to be read.

It is a curtain over the home page only. A piece page opened from a social
post is the money page and loads straight into the piece. Four things about it
are not negotiable, and all four are handled outside the canvas so they hold
even when the script does not run:

- **It always leaves.** A CSS animation clears the overlay after five seconds
  whatever happens, and the inline pre-paint script schedules its own release
  of the scroll lock. A bundle that never loads cannot freeze the page.
- **It never repeats in a session**, and never runs under reduced motion. Both
  are decided before first paint, so a returning visitor sees no flash of it.
- **Any input skips it**: pointer, key, wheel or touch.
- **It is not read out.** The overlay is decorative and hidden from assistive
  technology; the page underneath is the document.

The solver is oriented boxes, SAT, and sequential impulses with warm starting.
Bodies are the silhouettes' bounding boxes inset to 84%, so pieces interlock
slightly rather than resting on invisible air. Chair size comes off the
smaller screen edge and the count off the area, so a phone gets a heap of the
same visual weight as a desktop rather than a swarm of specks.

## The hero figure
`components/brand/ChairFall.tsx` is the same fall as the splash, slowed right
down and turned into weather. Where the splash is an event with a beginning
and an end, this is ambient: pieces drift down through the headline panel,
turning slowly, and each one that leaves the bottom is put back above the top
somewhere new, so it never ends and never repeats. No collision and no pile: a
pile fills up and stops, and this has to hold for as long as somebody reads
the headline.

It is deliberately faint, ink at 7 to 14 per cent with one piece in `--amber`
a little stronger. The headline, the subline and the two calls to action own
this panel; the chairs are texture behind them. If it ever competes with the
type, take the opacity down, not the count.

Lifecycle is `useCanvasScene`, the same hook as every other visual here, so it
inherits the whole contract: device pixel ratio capped at two, the loop paused
whenever the panel is off-screen, deferred until the page has gone idle so it
never competes with the first render, and one still frame under reduced motion
with nothing missing.

## Photography
Photography leads every card, hero and band, through slots managed in the
dashboard (hero image, buying band image, per-piece galleries). Every slot
falls back to the category's generative study over a plinth so no section
ever renders empty. next/image everywhere with real `sizes`.

Note for whoever next touches `components/canvas`: the canvas renderers still
paint their ground as the v1 stone `#E4E2DB`. On the new paper it reads as a
near-panel tone inside the framed figures, which passes, but the constants
should move to `--panel` (`#EAE7E1`) when that layer is next open.

## Motion, light touch
- The section reveal (26px rise) and eased canvas interactions survive;
  nothing new that costs conversion or Lighthouse.
- Every canvas pauses off-screen, devicePixelRatio capped at 2, and canvases
  that listen to pointer input carry `touch-action: pan-y`.
- `prefers-reduced-motion` renders everything at rest with nothing missing.
- Keyboard focus visible on all interactive elements; tap targets 44px
  minimum.
