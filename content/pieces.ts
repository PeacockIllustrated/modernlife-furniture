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
    categorySlug: "space-age",
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
    categorySlug: "bauhaus-and-modernist",
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
    slug: "sculpted-teak-armchair",
    categorySlug: "danish-modern",
    title: "Sculpted teak armchair",
    featured: true,
    featuredPosition: 2,
    provenanceVerified: false,
    catalogueNumber: "MLF 008",
    sectionToggles: {},
    attribution: "Attributed to a Danish workshop",
    periodLabel: "Danish modern",
    yearFrom: 1955,
    yearTo: 1965,
    origin: "Denmark",
    materials: ["teak", "wool"],
    status: "available",
    priceOnRequest: false,
    pricePence: 145000,
    story:
      "An armchair in sculpted teak, the frame shaped to the body and finished on every side. The seat and back are upholstered in wool over new foam, and the arms fall exactly where your hands do. Cleaned and re-oiled; solid and ready for daily use.",
    restorationNotes:
      "Frame cleaned and re-oiled, seat and back reupholstered in wool over new foam, joints checked and sound.",
    placeholder: true,
    provenance: [],
    features: [
      {
        position: 1,
        eyebrow: "The frame",
        title: "Teak shaped to the *body*",
        body: "The frame is cut and shaped rather than bent, with the grain following each curve. Re-oiled to a soft sheen and finished on every side, it sits as well in the middle of a room as against a wall.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
    ],
    specs: [
      { position: 1, grouping: "Dimensions", term: "Width", detail: "68 cm" },
      { position: 2, grouping: "Dimensions", term: "Depth", detail: "74 cm" },
      { position: 3, grouping: "Dimensions", term: "Height", detail: "79 cm" },
      {
        position: 4,
        grouping: "Materials",
        term: "Frame",
        detail: "Teak, cleaned and re-oiled",
      },
      {
        position: 5,
        grouping: "Materials",
        term: "Upholstery",
        detail: "Wool over new foam",
      },
      {
        position: 6,
        grouping: "Condition",
        term: "Overall",
        detail: "Re-oiled and reupholstered, joints sound, ready for daily use",
      },
    ],
    included: [],
    faqs: [
      {
        position: 1,
        question: "How should the teak be cared for",
        answer:
          "Lightly. Keep it out of direct sun, wipe with a barely damp cloth and oil once a year. Care notes written for the chair's own materials come with it.",
      },
    ],
  },
  {
    slug: "sculptural-walnut-armchair",
    categorySlug: "italian-and-sculptural",
    title: "Sculptural walnut armchair",
    featured: true,
    featuredPosition: 3,
    provenanceVerified: false,
    catalogueNumber: "MLF 009",
    sectionToggles: {},
    attribution: "Maker unconfirmed",
    periodLabel: "Mid-century",
    yearFrom: 1958,
    yearTo: 1968,
    origin: "Italy",
    materials: ["walnut", "velvet"],
    status: "available",
    priceOnRequest: true,
    pricePence: null,
    story:
      "An armchair with a carved walnut frame that reads well from every side, the sort of chair that holds a corner of a room on its own. The walnut is shaped rather than machined, and the seat is upholstered close to the line of the frame. Re-polished and reupholstered; solid and ready for daily use.",
    restorationNotes:
      "Frame re-polished, seat reupholstered in velvet over new foam, joints checked and sound.",
    placeholder: true,
    provenance: [],
    features: [
      {
        position: 1,
        eyebrow: "The frame",
        title: "Walnut carved to be *seen*",
        body: "The frame is carved rather than machined, and the re-polished walnut carries the light along every curve. There is no back of the chair; it is finished to be looked at from all sides.",
        imagePath: "",
        imageAlt: "",
        layout: "right",
      },
    ],
    specs: [
      { position: 1, grouping: "Dimensions", term: "Width", detail: "72 cm" },
      { position: 2, grouping: "Dimensions", term: "Depth", detail: "70 cm" },
      { position: 3, grouping: "Dimensions", term: "Height", detail: "81 cm" },
      {
        position: 4,
        grouping: "Materials",
        term: "Frame",
        detail: "Walnut, re-polished",
      },
      {
        position: 5,
        grouping: "Materials",
        term: "Upholstery",
        detail: "Velvet over new foam",
      },
      {
        position: 6,
        grouping: "Condition",
        term: "Overall",
        detail: "Re-polished and reupholstered, joints sound, ready for daily use",
      },
    ],
    included: [],
    faqs: [
      {
        position: 1,
        question: "Is the upholstery original",
        answer:
          "No. The seat has been reupholstered in velvet over new foam, cut close to the original line. The frame, which is the point of the chair, is original throughout.",
      },
    ],
  },
];
