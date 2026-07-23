/**
 * Landing copy for the store. Quietly confident and commercial: facts a
 * buyer cares about, warmth without theatre. British spelling, sentence
 * case, no em-dashes.
 *
 * The dl facts here are the plausible placeholders awaiting the owner. When
 * Supabase is configured they are replaced by modern_categories rows carrying
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
  "We do not make furniture. The designers of the last century already did. We find good pieces, describe them honestly, and sell them one at a time.";

export const hero = {
  sub: "One-of-one chairs and pieces by the designers of the last century, photographed honestly, described plainly and delivered nationwide.",
  cue: "Scroll to enter the collection",
};

export const closing = {
  heading: "Tell us what you are after",
  body: "The collection changes often. Tell us what you are after and we will let you know when the right piece comes in. And if you have a good piece to sell, we buy.",
  cta: {
    label: "Ask about a piece",
    href: "mailto:studio@modernlifefurniture.co.uk?subject=Find me a piece",
  },
};

export const rooms: Room[] = [
  {
    id: "s01",
    number: "Category 01 of 04",
    slug: "chairs",
    title: "Chairs",
    story:
      "The heart of the collection and the best place to start. Chairs by the schools that decided what sitting should look like, from the Bauhaus cantilever to the space-age pod. Every one is one of one, checked, honestly photographed and ready to sit on.",
    hint: "New chairs are listed most weeks",
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
    number: "Category 02 of 04",
    slug: "shelving-and-storage",
    title: "Shelving and storage",
    story:
      "Wall units, modular systems and room dividers, storage that hangs on the wall instead of standing on the floor. Each system is sold complete, with its measurements listed, and can be arranged to suit the wall it is going to.",
    hint: "Systems are sold complete and hung for you on delivery",
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
    number: "Category 03 of 04",
    slug: "cabinets-and-sideboards",
    title: "Cabinets and sideboards",
    story:
      "Credenzas, cocktail cabinets and bureaus in rosewood, teak and lacquer. Casework carries the most surface of anything we sell, so every piece is photographed close and its condition described plainly.",
    hint: "Interiors are photographed as carefully as the outside",
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
    number: "Category 04 of 04",
    slug: "tables",
    title: "Tables",
    story:
      "Dining, coffee and side tables from Denmark, Italy and Britain. Every table is solid, level and ready for daily use, with dimensions listed so you can check the fit before you enquire.",
    hint: "Heights and clearances are listed on every table",
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
];
