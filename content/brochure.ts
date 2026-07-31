/**
 * The catalogue: issue one of the printed-style brochure at /brochure.
 *
 * Six pieces the shop actually holds, photographed in daylight against white.
 * The copy describes what the photographs show and nothing more, and every
 * attribution is a hedge, per the rule in CLAUDE.md: a maker is named only
 * where the piece carries a mark, and then as a description of the mark rather
 * than an authentication.
 *
 * Two fields are deliberately empty and are the owner's to fill before this
 * goes to a customer:
 *   - `dimensions`, which no one should ever invent; a buyer measures a room
 *     with them. Null renders the honest fallback line instead.
 *   - `pricePence`, which stays null so every plate reads "Price on request".
 *     Set it and the same plate renders the sterling amount, no other change.
 *
 * Everything here is `placeholder: true` until the owner has read it.
 */

export interface BrochureSpec {
  term: string;
  detail: string;
}

export interface BrochurePlate {
  /** Folio, printed on the plate and used as its anchor id. */
  number: string;
  slug: string;
  catalogueNumber: string;
  title: string;
  /** Always a hedge: attributed to, school of, in the manner of, unconfirmed,
      or a plain description of a mark the piece carries. */
  attribution: string;
  /** Era label, a style descriptor rather than a claim about a maker. */
  era: string;
  /** How the piece is dated, stated as the judgement it is. */
  dating: string;
  origin: string;
  status: "available" | "reserved" | "sold" | "restoration";
  pricePence: number | null;
  imagePath: string;
  imageAlt: string;
  /** Printed under the plate, in the caption hand. */
  caption: string;
  /** The one-paragraph description. Facts a buyer cares about. */
  body: string;
  /** Set in the accent hand beside the plate: the line a dealer would add. */
  aside: string;
  specs: BrochureSpec[];
  /** Null until measured. Never guessed. */
  dimensions: string | null;
  placeholder: boolean;
}

export const issue = {
  number: "One",
  numeral: "I",
  season: "Summer 2026",
  title: "Selected pieces",
  /** Cover line; asterisks become the house highlight. */
  headline: "Six pieces, ready to *live with*",
  strapline: "Vintage designer furniture, chairs above all",
  place: "North East England",
  email: "sales@houseofchairs.co.uk",
};

export const foreword = {
  eyebrow: "Foreword",
  heading: "What this is",
  /** First paragraph carries the drop cap, so it opens on a hard consonant. */
  paragraphs: [
    "We do not make furniture. The designers of the last century already did. We find good pieces, describe them honestly, and sell them one at a time.",
    "This catalogue is six of them, photographed as they stand, in daylight against white, with nothing flattered and nothing hidden. Where a piece carries a maker's stamp we say so and we photograph it. Where it does not, we say that too, and the piece is described by what it is rather than by whose name would sell it.",
    "Every piece is one of one. When it goes, the page comes out.",
  ],
  signature: "House of Chairs, North East England",
};

export const plates: BrochurePlate[] = [
  {
    number: "01",
    slug: "chrome-pod-chair",
    catalogueNumber: "HOC 011",
    title: "Chrome pod chair",
    attribution: "Maker unconfirmed",
    era: "Space age",
    dating: "Dated by style; no maker's mark found",
    origin: "Origin unconfirmed",
    status: "available",
    pricePence: null,
    imagePath: "/brochure/plate-01-chrome-pod-chair.jpg",
    imageAlt:
      "A moulded tub chair with a chrome finish that shifts from steel to gold, sunk into a drum base, photographed against white.",
    caption: "Plate 01. Chrome pod chair, three-quarter view.",
    body: "A moulded tub shell sunk into a drum base, finished in a chrome that shifts from steel to warm gold as you move around it. There is nothing to work loose: no legs, no swivel, no fixings on show. It holds a corner of a room on its own and reads well from every side, which is the whole point of a shape like this one.",
    aside: "the piece people photograph before they sit in it",
    specs: [
      { term: "Form", detail: "Moulded shell on a drum base, one piece to move" },
      { term: "Finish", detail: "Chrome effect, iridescent, steel through to gold" },
      { term: "Marks", detail: "None found; underside photographed on request" },
      {
        term: "Condition",
        detail:
          "Shell sound, with light surface marking to the finish as photographed",
      },
    ],
    dimensions: null,
    placeholder: true,
  },
  {
    number: "02",
    slug: "moulded-s-chair",
    catalogueNumber: "HOC 012",
    title: "Moulded S chair",
    attribution: "In the manner of the single-form cantilever",
    era: "Space age",
    dating: "Dated by style; the form was in production for decades",
    origin: "Origin unconfirmed",
    status: "available",
    pricePence: null,
    imagePath: "/brochure/plate-02-moulded-s-chair.jpg",
    imageAlt:
      "A single-piece moulded cantilever chair in gloss red, drawn as one continuous line from base to shoulder, photographed against white.",
    caption: "Plate 02. Moulded S chair, gloss red.",
    body: "One piece of moulded plastic drawn as a single line from the floor to the shoulder, in a red that is very hard to ignore. It weighs less than it looks, wipes clean, and works at a dining table or a desk. The gloss is even across the seat and around the curve of the base, which is the first place these are checked.",
    aside: "one chair, one line, no joints",
    specs: [
      { term: "Form", detail: "Single-piece moulded cantilever, no frame" },
      { term: "Finish", detail: "Gloss, even across seat and base curve" },
      {
        term: "Marks",
        detail: "Underside not yet recorded; photographed on request",
      },
      {
        term: "Condition",
        detail:
          "No cracks visible at the base curve or the shoulder; gloss unbroken",
      },
    ],
    dimensions: null,
    placeholder: true,
  },
  {
    number: "03",
    slug: "aluminium-medallion-armchair",
    catalogueNumber: "HOC 013",
    title: "Aluminium armchair",
    attribution: "Maker unconfirmed",
    era: "Modern classics",
    dating: "Dated by construction; no mark found in the photographs",
    origin: "Origin unconfirmed",
    status: "available",
    pricePence: null,
    imagePath: "/brochure/plate-03-aluminium-armchair.jpg",
    imageAlt:
      "A brushed aluminium armchair with an oval medallion back and a dark oxblood leather seat, photographed against white.",
    caption: "Plate 03. Aluminium armchair with medallion back.",
    body: "A brushed aluminium frame with an oval medallion back, arms that fall where your hands do, and a seat cushioned in dark leather. Aluminium chairs of this kind were built for hotels and bars, which is why so many of them survive: it takes daily use without complaint and cleans with a cloth.",
    aside: "built for a bar, and it shows in the best way",
    specs: [
      { term: "Frame", detail: "Brushed aluminium, welded" },
      { term: "Back", detail: "Oval medallion, aluminium, brushed both sides" },
      { term: "Seat", detail: "Leather, dark oxblood, over a shaped pad" },
      {
        term: "Condition",
        detail:
          "Frame carries the light scuffing brushed aluminium picks up in use; leather sound with a settled patina",
      },
    ],
    dimensions: null,
    placeholder: true,
  },
  {
    number: "04",
    slug: "orange-shell-counter-stool",
    catalogueNumber: "HOC 014",
    title: "Orange shell counter stool",
    attribution: "In the manner of the moulded fibreglass shell",
    era: "Space age",
    dating: "Dated by materials and base construction",
    origin: "Origin unconfirmed",
    status: "available",
    pricePence: null,
    imagePath: "/brochure/plate-04-orange-shell-stool.jpg",
    imageAlt:
      "A burnt orange fibreglass shell seat on a chromed counter-height base with a welded footrail, photographed against white.",
    caption: "Plate 04. Orange shell counter stool, chromed base.",
    body: "A fibreglass shell in burnt orange on a chromed counter-height base with a welded footrail. The fibre shows in the surface when the light crosses it, which is how a moulded shell tells itself apart from a plastic copy. Counter height, so it belongs under an island or a bar rather than at a table.",
    aside: "the colour does the work in a plain kitchen",
    specs: [
      { term: "Shell", detail: "Pigmented fibreglass, fibre visible in raking light" },
      {
        term: "Base",
        detail: "Chromed steel, counter height, welded footrail, glides fitted",
      },
      {
        term: "Marks",
        detail: "Shell underside not yet recorded; photographed on request",
      },
      {
        term: "Condition",
        detail: "Colour even, chrome bright, no cracks visible at the shell mounts",
      },
    ],
    dimensions: null,
    placeholder: true,
  },
  {
    number: "05",
    slug: "black-shell-counter-stool",
    catalogueNumber: "HOC 015",
    title: "Black shell counter stool",
    attribution: "In the manner of the moulded fibreglass shell",
    era: "Space age",
    dating: "Dated by materials and base construction",
    origin: "Origin unconfirmed",
    status: "available",
    pricePence: null,
    imagePath: "/brochure/plate-05-black-shell-stool.jpg",
    imageAlt:
      "A black fibreglass shell seat on a chromed counter-height base with a welded footrail, photographed against white.",
    caption: "Plate 05. Black shell counter stool, chromed base.",
    body: "The same shell in black, on the same chromed counter-height base. The surface carries fine crazing across the seat, the sort a shell earns over decades of use. It is cosmetic and we would rather show it than photograph around it. A pair with plate 04 if you want them matched, and a contrast if you would rather they were not.",
    aside: "shown as it is, crazing and all",
    specs: [
      { term: "Shell", detail: "Pigmented fibreglass, black" },
      {
        term: "Base",
        detail: "Chromed steel, counter height, welded footrail, glides fitted",
      },
      {
        term: "Marks",
        detail: "Shell underside not yet recorded; photographed on request",
      },
      {
        term: "Condition",
        detail:
          "Fine surface crazing across the seat, cosmetic; shell sound, chrome bright",
      },
    ],
    dimensions: null,
    placeholder: true,
  },
  {
    number: "06",
    slug: "aluminium-counter-stool",
    catalogueNumber: "HOC 016",
    title: "Aluminium counter stool",
    // The stamp is a fact about the object, photographed and quoted as found.
    // It is not offered as authentication, and the plate body says so.
    attribution: "Stamped emeco by Starck",
    era: "Modern classics",
    dating: "Dated by the stamp and the construction",
    origin: "Origin unconfirmed",
    status: "available",
    pricePence: null,
    imagePath: "/brochure/plate-06-aluminium-stool.jpg",
    imageAlt:
      "A brushed aluminium counter stool with a lightly dished seat and a welded footrail, the seat rail stamped emeco by Starck, photographed against white.",
    caption: "Plate 06. Aluminium counter stool, stamp to the seat rail.",
    body: "A brushed aluminium stool with a lightly dished seat and a footrail welded on all four sides. The seat rail carries a stamp reading emeco by Starck. We quote the mark as we find it and photograph it for you; we do not authenticate a piece in a brochure. Aluminium of this kind is close to indestructible and takes a wet cloth and a wet floor.",
    aside: "we describe the mark, not the maker",
    specs: [
      { term: "Frame", detail: "Brushed aluminium, hand-finished, welded footrail" },
      { term: "Seat", detail: "Aluminium, lightly dished" },
      { term: "Marks", detail: "Stamped emeco by Starck to the seat rail" },
      {
        term: "Condition",
        detail:
          "Even brushed finish with the marking aluminium takes in use; glides present",
      },
    ],
    dimensions: null,
    placeholder: true,
  },
];

/** The four assurances, set as a printed numbered list. */
export const buying = {
  eyebrow: "Buying",
  heading: "How a piece *leaves us*",
  body: "Every piece is one of one, so there is no basket. You send an enquiry, we reply with more photographs and the condition report, and we agree the piece before any money moves.",
  points: [
    {
      number: "01",
      title: "A condition report",
      detail:
        "The piece described plainly, with anything repaired or replaced stated, and the marks photographed rather than lit out.",
    },
    {
      number: "02",
      title: "The provenance file",
      detail:
        "What is known of the history, written down and passed on with the piece. Where a maker is unconfirmed, the file says unconfirmed.",
    },
    {
      number: "03",
      title: "Delivered and placed",
      detail:
        "Nationwide by specialist courier, blanket wrapped, carried in and set down in the room you choose. We deliver the North East ourselves.",
    },
    {
      number: "04",
      title: "Fourteen day returns",
      detail:
        "If the piece does not suit the room, tell us inside fourteen days. We collect and refund what you paid.",
    },
  ],
};

export const closing = {
  eyebrow: "Order form",
  heading: "Tell us which *piece*",
  body: "Name the plate and we will come back the same day where we can, with more photographs, the measurements and the condition report. If nothing here is quite it, tell us what you are after; the collection changes often and the best pieces rarely reach the website.",
  primary: { label: "Enquire about a piece", href: "/enquire" },
  secondary: { label: "See the whole collection", href: "/collection" },
};

export const colophon = {
  lines: [
    {
      term: "Set in",
      detail:
        "Montserrat and Anaktoria, the two faces the House of Chairs mark is built from.",
    },
    {
      term: "Photography",
      detail:
        "Daylight against white, North East England, July 2026. Nothing retouched out of a piece.",
    },
    {
      term: "Attribution",
      detail:
        "A maker is named only where the piece carries a mark, and then as a description of the mark. Everything else is attributed, in the manner of, or unconfirmed.",
    },
    {
      term: "Prices",
      detail:
        "On request, and confirmed in writing before anything is agreed. Delivery is quoted with the piece.",
    },
  ],
  note: "Published to the web and printed to order.",
};
