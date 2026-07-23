/**
 * Static catalogue, the fallback used when Supabase is not configured. It
 * mirrors supabase/seed.sql exactly so the collection reads the same with or
 * without a database. Every piece is a placeholder awaiting the owner, and
 * attribution is only ever a hedge.
 */

import type { FeatureLayout, PieceStatus } from "@/lib/supabase/types";

export interface StaticProvenance {
  position: number;
  label: string;
  detail: string;
}

export interface StaticFeature {
  position: number;
  eyebrow: string;
  title: string;
  body: string;
  imagePath: string;
  imageAlt: string;
  layout: FeatureLayout;
}

export interface StaticSpec {
  position: number;
  grouping: string;
  term: string;
  detail: string;
}

export interface StaticIncluded {
  position: number;
  label: string;
  note: string;
}

export interface StaticPieceFaq {
  position: number;
  question: string;
  answer: string;
}

export interface StaticPiece {
  slug: string;
  categorySlug: string;
  title: string;
  attribution: string;
  periodLabel: string;
  yearFrom: number | null;
  yearTo: number | null;
  origin: string;
  materials: string[];
  status: PieceStatus;
  priceOnRequest: boolean;
  pricePence: number | null;
  story: string;
  restorationNotes: string;
  placeholder: boolean;
  featured: boolean;
  featuredPosition: number | null;
  provenanceVerified: boolean;
  catalogueNumber: string;
  // Explicit booleans per named section; an absent key means enabled.
  sectionToggles: Record<string, boolean>;
  provenance: StaticProvenance[];
  features: StaticFeature[];
  specs: StaticSpec[];
  // Empty means the piece falls back to defaultIncluded from content/store.
  included: StaticIncluded[];
  faqs: StaticPieceFaq[];
}

export const staticPieces: StaticPiece[] = [
  {
    slug: "fibreglass-ball-chair",
    categorySlug: "chairs",
    title: "Fibreglass ball chair",
    featured: true,
    featuredPosition: 1,
    provenanceVerified: true,
    catalogueNumber: "MLF 001",
    sectionToggles: {},
    attribution: "Attributed, space age",
    periodLabel: "Space age",
    yearFrom: 1966,
    yearTo: 1972,
    origin: "Finland",
    materials: ["fibreglass", "wool", "steel"],
    status: "available",
    priceOnRequest: true,
    pricePence: null,
    story:
      "A hollow fibreglass shell on a turned steel pedestal, the interior reupholstered in a warm wool the colour of the original. It swivels quietly and keeps the room out until you want it back.",
    restorationNotes:
      "Shell refinished, upholstery replaced, foam renewed, stem re-enamelled, base rebalanced.",
    placeholder: true,
    provenance: [
      {
        position: 1,
        label: "Found",
        detail:
          "A Copenhagen apartment, a Northumberland farmhouse, and a very patient dog",
      },
      { position: 2, label: "Restored", detail: "On our bench, over five weeks" },
      { position: 3, label: "Rehomed", detail: "Awaiting its next forty years" },
    ],
    features: [
      {
        position: 1,
        eyebrow: "The shell",
        title: "A room *inside* the room",
        body: "Turn the opening away from the door and the household drops to a murmur. The shell is a single fibreglass moulding, taken back and refinished by hand to an even satin, and it swivels through a full circle without complaint.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
      {
        position: 2,
        eyebrow: "The upholstery",
        title: "Wool the colour of the *original*",
        body: "The interior was reupholstered on our bench in a warm wool matched to what survived of the first cloth. New foam underneath, old colour on top, which is the order we prefer.",
        imagePath: "",
        imageAlt: "",
        layout: "left",
      },
      {
        position: 3,
        eyebrow: "The stand",
        title: "Balanced to a *stop*",
        body: "The turned steel stem was re-enamelled and the base rebalanced, so the chair settles where you leave it. There is no drift and no squeak, and we checked for both.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
    ],
    specs: [
      { position: 1, grouping: "Dimensions", term: "Width", detail: "102 cm" },
      { position: 2, grouping: "Dimensions", term: "Depth", detail: "97 cm" },
      { position: 3, grouping: "Dimensions", term: "Height", detail: "121 cm" },
      {
        position: 4,
        grouping: "Materials",
        term: "Shell",
        detail: "Fibreglass, refinished to an even satin",
      },
      {
        position: 5,
        grouping: "Materials",
        term: "Stand",
        detail: "Turned steel, re-enamelled",
      },
      {
        position: 6,
        grouping: "Materials",
        term: "Upholstery",
        detail: "Wool over new foam",
      },
      {
        position: 7,
        grouping: "Condition",
        term: "Overall",
        detail: "Restored on our bench, fit for daily use",
      },
    ],
    included: [],
    faqs: [
      {
        position: 1,
        question: "Will it fit through a standard door",
        answer:
          "Usually, and we have moved this one more than once. The shell lifts off its pedestal for the journey and we measure your doorways before we set out.",
      },
    ],
  },
  {
    slug: "cantilever-side-chair",
    categorySlug: "chairs",
    title: "Cantilever side chair",
    featured: false,
    featuredPosition: null,
    provenanceVerified: false,
    catalogueNumber: "MLF 002",
    sectionToggles: {},
    attribution: "School of the Bauhaus",
    periodLabel: "Interwar modern",
    yearFrom: 1928,
    yearTo: 1934,
    origin: "Germany",
    materials: ["tubular steel", "cane"],
    status: "reserved",
    priceOnRequest: true,
    pricePence: null,
    story:
      "Chromed tubular steel sprung into a single cantilever, the seat and back re-caned by hand. Lighter than it looks, and it gives a little as you sit.",
    restorationNotes: "Re-chromed, re-caned, feet replaced.",
    placeholder: true,
    provenance: [],
    features: [],
    specs: [
      { position: 1, grouping: "Dimensions", term: "Width", detail: "47 cm" },
      { position: 2, grouping: "Dimensions", term: "Depth", detail: "58 cm" },
      { position: 3, grouping: "Dimensions", term: "Height", detail: "82 cm" },
      {
        position: 4,
        grouping: "Materials",
        term: "Frame",
        detail: "Tubular steel, re-chromed",
      },
      {
        position: 5,
        grouping: "Materials",
        term: "Seat and back",
        detail: "Cane, rewoven by hand",
      },
      {
        position: 6,
        grouping: "Condition",
        term: "Overall",
        detail: "Restored, the spring in the cantilever intact",
      },
    ],
    included: [],
    faqs: [],
  },
  {
    slug: "teak-wall-unit",
    categorySlug: "shelving-and-storage",
    title: "Teak wall unit",
    featured: true,
    featuredPosition: 2,
    provenanceVerified: false,
    catalogueNumber: "MLF 003",
    sectionToggles: {},
    attribution: "School of Danish modern",
    periodLabel: "Danish modern",
    yearFrom: 1958,
    yearTo: 1968,
    origin: "Denmark",
    materials: ["teak", "brass"],
    status: "available",
    priceOnRequest: true,
    pricePence: null,
    story:
      "A modular wall system that grew with the household that owned it, shelves and a drop-front desk hung on a pair of uprights. It comes to us in five parts and leaves in five parts.",
    restorationNotes:
      "French polished, brass fittings cleaned, one shelf replaced in matched teak.",
    placeholder: true,
    provenance: [],
    features: [
      {
        position: 1,
        eyebrow: "The system",
        title: "Five parts, one *wall*",
        body: "Two uprights carry everything. Shelves and cabinets hang where you decide, which means the unit fits the wall you have rather than the wall it left. It comes to us in five parts and leaves in five parts.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
      {
        position: 2,
        eyebrow: "The desk",
        title: "A desk that *closes* behind you",
        body: "The drop front folds flat to write on and shuts flush when the day is done. The brass stays were cleaned and adjusted so the fall is steady in the hand.",
        imagePath: "",
        imageAlt: "",
        layout: "left",
      },
      {
        position: 3,
        eyebrow: "The timber",
        title: "Matched *teak*, old and new",
        body: "One shelf had gone beyond saving, so we cut its replacement from teak of the same age and figure. Finding it took longer than fitting it, which is as it should be.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
    ],
    specs: [
      { position: 1, grouping: "Dimensions", term: "Width", detail: "240 cm" },
      { position: 2, grouping: "Dimensions", term: "Depth", detail: "40 cm" },
      { position: 3, grouping: "Dimensions", term: "Height", detail: "190 cm" },
      {
        position: 4,
        grouping: "Materials",
        term: "Carcass",
        detail: "Teak, French polished",
      },
      {
        position: 5,
        grouping: "Materials",
        term: "Fittings",
        detail: "Brass, cleaned and adjusted",
      },
      {
        position: 6,
        grouping: "Condition",
        term: "Overall",
        detail: "Restored, one shelf replaced in matched teak",
      },
    ],
    included: [],
    faqs: [
      {
        position: 1,
        question: "Can the unit be arranged differently",
        answer:
          "Yes. The shelves and the desk hang wherever the uprights allow, so the unit can be set out to suit the wall it lands on. We hang it for you on delivery.",
      },
    ],
  },
  {
    slug: "rosewood-sideboard",
    categorySlug: "cabinets-and-sideboards",
    title: "Rosewood sideboard",
    featured: false,
    featuredPosition: null,
    provenanceVerified: true,
    catalogueNumber: "MLF 004",
    sectionToggles: {},
    attribution: "In the manner of Danish modern",
    periodLabel: "Danish modern",
    yearFrom: 1960,
    yearTo: 1970,
    origin: "Denmark",
    materials: ["rosewood", "oak", "lacquer"],
    status: "sold",
    priceOnRequest: true,
    pricePence: null,
    story:
      "A long credenza in book-matched rosewood, sliding doors over an oak interior. The lacquer had gone to craze and colour; we took it back to the wood and built the finish up again.",
    restorationNotes: "Stripped, re-lacquered, runners re-cut, one foot rebuilt.",
    placeholder: true,
    provenance: [],
    features: [],
    specs: [
      { position: 1, grouping: "Dimensions", term: "Width", detail: "200 cm" },
      { position: 2, grouping: "Dimensions", term: "Depth", detail: "45 cm" },
      { position: 3, grouping: "Dimensions", term: "Height", detail: "78 cm" },
      {
        position: 4,
        grouping: "Materials",
        term: "Carcass",
        detail: "Book-matched rosewood",
      },
      {
        position: 5,
        grouping: "Materials",
        term: "Interior",
        detail: "Oak, cleaned and waxed",
      },
      {
        position: 6,
        grouping: "Condition",
        term: "Overall",
        detail: "Restored, the finish rebuilt from the wood up",
      },
    ],
    included: [],
    faqs: [],
  },
  {
    slug: "sculptural-coffee-table",
    categorySlug: "tables",
    title: "Sculptural coffee table",
    featured: true,
    featuredPosition: 3,
    provenanceVerified: false,
    catalogueNumber: "MLF 005",
    sectionToggles: {},
    attribution: "Maker unconfirmed",
    periodLabel: "Mid-century",
    yearFrom: 1955,
    yearTo: 1965,
    origin: "Italy",
    materials: ["walnut", "glass"],
    status: "available",
    priceOnRequest: true,
    pricePence: null,
    story:
      "A low table with a shaped walnut frame and a floating glass top, the sort of piece a room is arranged around. It keeps the rings of every glass ever set down on it, which is rather the point.",
    restorationNotes:
      "Frame re-polished, a split in one leg glued and pinned, new glass cut to the original template.",
    placeholder: true,
    provenance: [],
    features: [
      {
        position: 1,
        eyebrow: "The frame",
        title: "Walnut shaped by *eye*",
        body: "The frame curves in ways a machine would not bother with, shaped and re-polished until the grain reads clearly along every edge. A split in one leg was glued and pinned, and it will not move again.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
      {
        position: 2,
        eyebrow: "The top",
        title: "Glass cut to the first *template*",
        body: "The original top was beyond saving, so new glass was cut to the maker's template and floats where the old top floated. Set a glass down on it and start a record of your own rings.",
        imagePath: "",
        imageAlt: "",
        layout: "left",
      },
    ],
    specs: [
      { position: 1, grouping: "Dimensions", term: "Width", detail: "130 cm" },
      { position: 2, grouping: "Dimensions", term: "Depth", detail: "70 cm" },
      { position: 3, grouping: "Dimensions", term: "Height", detail: "38 cm" },
      {
        position: 4,
        grouping: "Materials",
        term: "Frame",
        detail: "Walnut, re-polished",
      },
      {
        position: 5,
        grouping: "Materials",
        term: "Top",
        detail: "New glass, cut to the original template",
      },
      {
        position: 6,
        grouping: "Condition",
        term: "Overall",
        detail: "Restored, one repaired split, pinned and stable",
      },
    ],
    included: [],
    faqs: [
      {
        position: 1,
        question: "Is the glass original",
        answer:
          "The template is; the glass is new, cut to the shape the maker drew. The original top arrived cracked and travelled no further than our workshop.",
      },
    ],
  },
  {
    slug: "nesting-tables",
    categorySlug: "tables",
    title: "Nesting tables",
    featured: false,
    featuredPosition: null,
    provenanceVerified: false,
    catalogueNumber: "MLF 006",
    sectionToggles: {},
    attribution: "School of Danish modern",
    periodLabel: "Danish modern",
    yearFrom: 1962,
    yearTo: 1972,
    origin: "Denmark",
    materials: ["teak"],
    status: "restoration",
    priceOnRequest: true,
    pricePence: null,
    story:
      "A graduated set of three, each sliding under the last, teak throughout. On the bench now, back on the site when the tops are level and the finish is even.",
    restorationNotes: "In progress: tops flattened, joints re-glued, finish to follow.",
    placeholder: true,
    provenance: [],
    features: [],
    specs: [
      {
        position: 1,
        grouping: "Dimensions",
        term: "Width",
        detail: "56 cm, the largest of the three",
      },
      { position: 2, grouping: "Dimensions", term: "Depth", detail: "38 cm" },
      { position: 3, grouping: "Dimensions", term: "Height", detail: "52 cm" },
      { position: 4, grouping: "Materials", term: "Throughout", detail: "Teak" },
      {
        position: 5,
        grouping: "Condition",
        term: "Overall",
        detail: "On the bench, tops being levelled",
      },
    ],
    included: [],
    faqs: [],
  },
];
