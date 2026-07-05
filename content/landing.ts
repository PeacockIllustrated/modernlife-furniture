/**
 * Landing copy, verbatim from CONTENT.md and reference/concept-v5.html
 * (sections s01 to s05). British spelling, sentence case, no em-dashes.
 *
 * The dl facts here are the plausible placeholders flagged in CONTENT.md.
 * In session 4 they are replaced by mlf_categories rows carrying
 * `placeholder: true`; until then they render statically so the page reads
 * complete.
 */

export type RoomVisual =
  | "tide"
  | "chair"
  | "grove"
  | "strata"
  | "rings"
  | "bench";

export interface Fact {
  term: string;
  detail: string;
}

export interface Room {
  id: string;
  number: string;
  slug: string;
  title: string;
  story: string;
  hint: string;
  facts: Fact[];
  cta: { label: string; href: string };
  variant: "light" | "dark";
  visual: RoomVisual;
  canvasLabel: string;
}

export const manifesto =
  "We do not make furniture. The artists of the last century already did. We find their work, undo the years, and rehome it.";

export const hero = {
  sub: "Collected works by the furniture artists of the last century. Found in attics and auction rooms, restored on our bench, and passed on with the story intact.",
  cue: "Scroll to enter the collection",
};

export const closing = {
  heading: "Live with a piece of history",
  body: "The collection changes weekly and the best pieces rarely reach the website. Tell us what you are after and we will find it. And if you have a piece the artists made, we buy.",
  cta: {
    label: "Ask about a piece",
    href: "mailto:studio@modernlifefurniture.co.uk?subject=Find me a piece",
  },
};

export const rooms: Room[] = [
  {
    id: "s01",
    number: "Category 01 of 05",
    slug: "chairs",
    title: "Chairs",
    story:
      "The heart of the collection. From the space-age pod to the Bauhaus cantilever, chairs by the schools and workshops that decided what sitting should look like. Every one restored, documented and ready for its next forty years.",
    hint: "The piece turns to face you as you pass",
    facts: [
      { term: "In collection", detail: "Two dozen pieces, changing weekly" },
      { term: "Periods", detail: "1925 to 1975" },
      { term: "Schools", detail: "Bauhaus, Danish modern, space age" },
    ],
    cta: { label: "View the chairs", href: "/collection/chairs" },
    variant: "light",
    visual: "chair",
    canvasLabel: "Chairs, a space-age ball chair that turns to face you",
  },
  {
    id: "s02",
    number: "Category 02 of 05",
    slug: "shelving-and-storage",
    title: "Shelving and storage",
    story:
      "Wall units, modular systems and room dividers, the furniture that was built to grow with a household. The collection branches the same way, one arrival deciding the next. Shown here as it grows.",
    hint: "The collection grows as you arrive",
    facts: [
      { term: "In collection", detail: "Wall units, systems, room dividers" },
      { term: "Periods", detail: "1950 to 1980" },
      { term: "Materials", detail: "Teak, rosewood, ash, blackened steel" },
    ],
    cta: {
      label: "View shelving and storage",
      href: "/collection/shelving-and-storage",
    },
    variant: "dark",
    visual: "grove",
    canvasLabel: "Shelving and storage, a collection growing like branches",
  },
  {
    id: "s03",
    number: "Category 03 of 05",
    slug: "cabinets-and-sideboards",
    title: "Cabinets and sideboards",
    story:
      "Credenzas, cocktail cabinets and bureaus, casework built in layers of veneer, lacquer and shellac. Decades settle into a finish the way sediment settles into stone, and the light bends around your hand the same way.",
    hint: "Move across the surface and the layers refract",
    facts: [
      { term: "In collection", detail: "Credenzas, cocktail cabinets, bureaus" },
      { term: "Periods", detail: "1930 to 1975" },
      { term: "Materials", detail: "Rosewood, teak, lacquer, brass" },
    ],
    cta: {
      label: "View cabinets and sideboards",
      href: "/collection/cabinets-and-sideboards",
    },
    variant: "light",
    visual: "strata",
    canvasLabel:
      "Cabinets and sideboards, layers of veneer and lacquer refracting light",
  },
  {
    id: "s04",
    number: "Category 04 of 05",
    slug: "tables",
    title: "Tables",
    story:
      "Dining, coffee and side tables, the surfaces a household gathers around. Every top keeps its rings, of grain and of ownership, and each piece leaves us with both written down.",
    hint: "Touch the surface to add a ring of your own",
    facts: [
      { term: "In collection", detail: "Dining, coffee, side and nesting" },
      { term: "Periods", detail: "1930 to 1975" },
      { term: "Origins", detail: "Denmark, Italy, Britain" },
    ],
    cta: { label: "View the tables", href: "/collection/tables" },
    variant: "dark",
    visual: "rings",
    canvasLabel: "Tables, rings of grain and ownership, touch to add one",
  },
  {
    id: "s05",
    number: "Category 05 of 05",
    slug: "restoration",
    title: "Restoration",
    story:
      "Every piece comes apart before it comes back. We strip a chair to its parts, shell, upholstery, foam and frame, put right what the decades took, and reassemble it with nothing hidden. The drawing below is how we think.",
    hint: "Move to the edge of the panel to take the piece apart",
    facts: [
      {
        term: "Services",
        detail: "French polishing, re-caning, reupholstery, re-chroming",
      },
      { term: "Turnaround", detail: "From three weeks" },
      { term: "Collection", detail: "North East England, courier nationwide" },
    ],
    cta: { label: "Bring us a piece", href: "/restoration" },
    variant: "light",
    visual: "bench",
    canvasLabel:
      "Restoration, an exploded drawing of a ball chair, move outward to take it apart",
  },
];
