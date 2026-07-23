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
      "A hollow fibreglass shell on a turned steel pedestal, one of the defining chair shapes of the space age. It swivels through a full circle, seats one in real comfort, and quiets the room the moment you sit back. Refinished and reupholstered; solid and ready for daily use.",
    restorationNotes:
      "Refinished shell, new upholstery over new foam, stand re-enamelled; solid and ready for daily use.",
    placeholder: true,
    provenance: [
      {
        position: 1,
        label: "Acquired",
        detail:
          "From a private house in Northumberland, one careful owner",
      },
      { position: 2, label: "Prepared", detail: "Professionally refinished and reupholstered before sale" },
      { position: 3, label: "Ready", detail: "Available now, delivered nationwide" },
    ],
    features: [
      {
        position: 1,
        eyebrow: "The shell",
        title: "A quiet *room* of its own",
        body: "The shell is a single fibreglass moulding with no cracks and no repairs, refinished to an even satin. Turn the opening away from the door and the noise of the house stays outside.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
      {
        position: 2,
        eyebrow: "The upholstery",
        title: "New wool in the *original* colour",
        body: "The interior has been reupholstered in a warm wool matched to the original colour, over new foam. Clean, firm and made to be sat in every day, not saved for best.",
        imagePath: "",
        imageAlt: "",
        layout: "left",
      },
      {
        position: 3,
        eyebrow: "The stand",
        title: "Steady on its *base*",
        body: "The turned steel stem has been re-enamelled and the base rebalanced. The chair swivels through a full circle, settles where you leave it, and does not drift or squeak.",
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
        detail: "Professionally refinished and reupholstered, ready for daily use",
      },
    ],
    included: [],
    faqs: [
      {
        position: 1,
        question: "Will it fit through a standard door",
        answer:
          "Usually. The shell lifts off its pedestal for the journey, and we confirm your doorway and stair measurements before delivery is booked.",
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
      "Chromed tubular steel sprung into a single cantilever, the seat and back woven in cane. It is lighter than it looks, gives slightly as you sit, and works as well at a desk as at a dining table. Re-chromed and re-caned; ready for daily use.",
    restorationNotes: "Frame re-chromed, seat and back re-caned, floor glides replaced.",
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
        detail: "Re-chromed and re-caned, the spring in the cantilever intact",
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
      "A modular teak wall system, shelves, cabinets and a drop-front desk hung on a pair of uprights. It gives a full wall of storage without standing furniture on the floor, and it hangs to suit your wall rather than the one it came from. French polished, with one shelf replaced in matched teak.",
    restorationNotes:
      "French polished, brass fittings cleaned and adjusted, one shelf replaced in matched teak.",
    placeholder: true,
    provenance: [],
    features: [
      {
        position: 1,
        eyebrow: "The system",
        title: "Five parts, one *wall*",
        body: "Two uprights carry everything. Shelves and cabinets hang where you decide, so the unit fits the wall you have rather than the wall it came from. It packs into five parts for delivery and we hang it for you.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
      {
        position: 2,
        eyebrow: "The desk",
        title: "A desk that *closes* flush",
        body: "The drop front folds flat to write on and shuts flush when you are done. The brass stays have been cleaned and adjusted, so the fall is smooth and steady in the hand.",
        imagePath: "",
        imageAlt: "",
        layout: "left",
      },
      {
        position: 3,
        eyebrow: "The timber",
        title: "Matched *teak* throughout",
        body: "One shelf has been replaced in teak matched for age and figure; you will need to look for it to find it. The rest of the timber is original, French polished to an even sheen.",
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
        detail: "French polished, one shelf replaced in matched teak",
      },
    ],
    included: [],
    faqs: [
      {
        position: 1,
        question: "Can the unit be arranged differently",
        answer:
          "Yes. The shelves, cabinets and desk hang wherever the uprights allow, so the unit can be set out to suit your wall. We hang it for you on delivery.",
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
      "A long credenza in book-matched rosewood, sliding doors over a clean oak interior. Two metres of storage on a shallow footprint, the sort of piece that anchors a dining room. Re-lacquered, with the doors running freely; solid and true.",
    restorationNotes: "Re-lacquered, door runners re-cut, one foot rebuilt; solid and true.",
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
        detail: "Re-lacquered, doors running freely, carcass sound",
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
      "A low table with a shaped walnut frame carrying a floating glass top, the sort of piece a seating area is arranged around. The walnut is shaped rather than machined and reads well from every side. Frame re-polished, one old repair stable; the glass is new, cut to the original template.",
    restorationNotes:
      "Frame re-polished, one split in a leg glued and pinned, new glass cut to the original template.",
    placeholder: true,
    provenance: [],
    features: [
      {
        position: 1,
        eyebrow: "The frame",
        title: "Walnut shaped by *hand*",
        body: "The frame curves in ways a machine would not bother with, and after re-polishing the grain reads clearly along every edge. An old split in one leg has been glued and pinned; it is stable and does not move.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
      {
        position: 2,
        eyebrow: "The top",
        title: "Glass cut to the original *template*",
        body: "The original glass did not survive, so the top is new, cut to the maker's template and sitting exactly where the first one sat. A further replacement could be cut from the same template if ever needed.",
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
        detail: "Re-polished, one old split repaired, pinned and stable",
      },
    ],
    included: [],
    faqs: [
      {
        position: 1,
        question: "Is the glass original",
        answer:
          "No. The glass is new, cut to the shape the maker drew. The frame, which is the point of the piece, is original throughout.",
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
      "A graduated set of three in teak, each sliding under the last, three tables in the footprint of one. Being prepared for sale now; it will be listed with photographs and a full condition report when ready.",
    restorationNotes: "Being prepared for sale: tops levelled, joints re-glued, finish to follow.",
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
        detail: "Being prepared for sale, tops being levelled",
      },
    ],
    included: [],
    faqs: [],
  },
];
