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
  "We do not make furniture. The designers of the last century already did. We find good pieces, describe them *honestly*, and sell them one at a time.";

export const hero = {
  sub: "One-of-one chairs and pieces by the designers of the last century, photographed honestly, described plainly and delivered nationwide.",
  cue: "Scroll to enter the collection",
};

export const closing = {
  heading: "Tell us what you are after",
  body: "The collection changes often. Tell us what you are after and we will let you know when the right piece comes in. And if you have a good piece to sell, we buy.",
  cta: {
    label: "Ask about a piece",
    href: "/enquire",
  },
};

export const rooms: Room[] = [
  {
    id: "s01",
    number: "Era 01 of 04",
    slug: "bauhaus-and-modernist",
    title: "Bauhaus and modernist",
    story:
      "Tubular steel, cantilevers and the machine age, the chairs that decided what modern sitting would look like. Most are lighter than they appear and give slightly as you sit, which is the point of the cantilever. Every one is checked, honestly photographed and ready for daily use.",
    hint: "The earliest chairs we sell, and usually the lightest",
    facts: [
      { term: "Periods", detail: "1925 to 1945" },
      { term: "Materials", detail: "Tubular steel, cane, leather, bent plywood" },
      { term: "What to expect", detail: "Cantilevers, chrome frames, woven seats" },
    ],
    cta: {
      label: "View Bauhaus and modernist",
      href: "/collection/bauhaus-and-modernist",
    },
    variant: "light",
    visual: "strata",
    canvasLabel:
      "Bauhaus and modernist, parallel bands drawn with machine precision",
  },
  {
    id: "s02",
    number: "Era 02 of 04",
    slug: "danish-modern",
    title: "Danish modern",
    story:
      "Sculpted teak and rosewood, upholstery in wool, joinery you will not find under later furniture. These chairs are shaped to the body and finished on every side, so they sit as well in the middle of a room as against a wall. The easiest era to live with, and the most collected.",
    hint: "The quickest era to sell; the list hears about new pieces first",
    facts: [
      { term: "Periods", detail: "1945 to 1970" },
      { term: "Materials", detail: "Teak, rosewood, oak, cord and wool" },
      { term: "What to expect", detail: "Sculpted frames, wool upholstery, fine joinery" },
    ],
    cta: { label: "View Danish modern", href: "/collection/danish-modern" },
    variant: "dark",
    visual: "rings",
    canvasLabel: "Danish modern, rings of timber grain breathing slowly",
  },
  {
    id: "s03",
    number: "Era 03 of 04",
    slug: "space-age",
    title: "Space age",
    story:
      "Fibreglass, plastics and pod forms from the years when the future felt close. These are the boldest shapes we sell; a single piece will change the character of a room. Each one is checked, honestly photographed and ready for daily use.",
    hint: "Most shells lift off their bases for delivery",
    facts: [
      { term: "Periods", detail: "1960 to 1975" },
      { term: "Materials", detail: "Fibreglass, moulded plastic, steel, wool" },
      { term: "What to expect", detail: "Pods, pedestals and chairs that swivel" },
    ],
    cta: { label: "View Space age", href: "/collection/space-age" },
    variant: "light",
    visual: "chair",
    canvasLabel: "Space age, a ball chair that turns to face you",
  },
  {
    id: "s04",
    number: "Era 04 of 04",
    slug: "italian-and-sculptural",
    title: "Italian and sculptural",
    story:
      "Expressive frames and confident shapes, chairs made by workshops that treated seating as sculpture. Walnut carved rather than machined, upholstery cut close to the frame, silhouettes that hold a room on their own. Made to be looked at, and sat in daily.",
    hint: "Best placed where they can be seen in the round",
    facts: [
      { term: "Periods", detail: "1950 to 1975" },
      { term: "Materials", detail: "Walnut, lacquer, brass, velvet and wool" },
      { term: "What to expect", detail: "Carved frames, close upholstery, no bad angle" },
    ],
    cta: {
      label: "View Italian and sculptural",
      href: "/collection/italian-and-sculptural",
    },
    variant: "dark",
    visual: "grove",
    canvasLabel: "Italian and sculptural, lines branching like a carved frame",
  },
];
