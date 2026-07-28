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

## The hero figure
`components/brand/Composite.tsx` is a progression, not a picture. One element
is drawn fourteen times: the section of a seat, reduced to a plane you rest on
and a rake that holds you. No legs, no frame, no object, nothing closed. Each
repeat steps up and to the right, shrinks, opens its rake and softens its
corner, so the family sweeps from upright and tight to low and open. What
reads is the transformation, which is what a room of one-of-one chairs is.
One repeat is `--amber`, taken from inside the run rather than its edge.

Every parameter moves monotonically across the run; only the line weight
alternates, and that is what gives the field depth. Keep it that way. The
moment values are chosen per repeat rather than interpolated, it stops being
a system and starts being decoration.

It lives in the hero's headline panel in both the quiet and the photographic
state, and it is sized in CSS rather than by the viewBox, so the repeats stay
a constant size at every panel aspect and the panel simply crops what it
cannot hold. The panel is the query container, not the viewport: the same
desktop gives it 1200px with no starred pieces and 620px with three. On the
wide panel the run has the empty right half to itself; below 820px of panel it
drops to a fragment in the foot with the copy padded clear. No line ever
crosses a call to action.

Pure SVG, no canvas and no client script. Stroke widths are attributes rather
than CSS because each repeat carries its scale in its transform;
`vector-effect: non-scaling-stroke` is the tidier answer but it moves the dash
pattern into device space and shatters the draw into dots. The resting state
is fully drawn, so nothing is missing if the animation never runs.

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
