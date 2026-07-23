# CONTENT.md — Modern Life Furniture

## Voice
Quietly confident and commercial. Short sentences that state facts a buyer
cares about: what it is, who it is attributed to, what condition it is in,
what it costs, how it arrives. Warmth without theatre; the bench is never
romanticised and restoration is never sold. Humour is dry and rare.

Hard rules: British spelling. No em-dashes (commas, semicolons, full stops).
Sentence case headings, including nav and buttons. No exclamation marks. No
emoji. No urgency theatre; "only one left" is true of everything we sell and
goes without saying.

## House lines as shipped (owner may amend)
- Wordmark treatment: "Modern / Life *furniture*" (italic on furniture)
- Hero primary CTA: "See the chairs" (routes to /collection/chairs)
- Manifesto: "We do not make furniture. The designers of the last century
  already did. We find the best of it and *rehome* it."
- Buying band: eyebrow "Buying", heading "Checked, documented, *delivered*",
  body facts: condition report with every piece, provenance written down,
  delivered nationwide and placed in the room, fourteen day returns. CTA
  "See the chairs".
- Trust strip: 01 "Every piece checked and photographed honestly." 02
  "Provenance researched and written down." 03 "Delivered nationwide, placed
  in the room." 04 "Fourteen day returns."
- Closing h2: "Live with a piece of history"
- Closing body: "The collection changes weekly and the best pieces rarely
  reach the website. Tell us what you are after and we will find it. And if
  you have a piece the artists made, we buy."
- Footer strapline: "Vintage designer furniture, chairs above all"
- Sell page: h1 "Sell your chair to us"; intro "We buy chairs, and other
  pieces, by the designers of the last century. Send a few photographs and
  whatever you know of the history; we reply with a view, and an offer if it
  is a piece for us." What we look for: designer attribution, honest
  condition, original parts.
- Home category row: eyebrow "Browse the collection", heading "Shop by
  category", tile CTA "View pieces".

The old museum lines (the bench manifesto, "Bought, restored, rehomed",
"restored on our bench" hero sub, room-by-room framing) are retired. The
hero sub in `content/landing.ts` still carries the old line; the content
session replaces it.

## Every page ends in a next action
Home routes to chairs and to featured pieces; category pages route to
pieces; a sold piece routes to registering interest and to similar pieces;
the sell and enquire pages end in their forms. Keep both forms short, fast
and reassuring, and confirm receipt plainly.

## Placeholders awaiting the owner
Piece counts, periods, schools and origins in the category data are
plausible placeholders. Flag placeholder rows in seed data with
`placeholder: true` and confirm with the owner before launch. Same for the
contact email `studio@modernlifefurniture.co.uk`, the delivery and returns
prose in `content/store.ts`, and the collector words.

## Attribution rules (legal and ethical)
Never state a real designer or maker as fact for a piece without owner
confirmation. Approved hedges: "attributed to", "school of", "in the manner
of", "maker unconfirmed". Never write "after [designer]" marketing copy that
implies authentication. Era and style descriptors (Bauhaus school, Danish
modern, space age) are fine as categories.
