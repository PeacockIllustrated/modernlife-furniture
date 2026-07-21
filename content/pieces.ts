/**
 * Static catalogue, the fallback used when Supabase is not configured. It
 * mirrors supabase/seed.sql exactly so the collection reads the same with or
 * without a database. Every piece is a placeholder awaiting the owner, and
 * attribution is only ever a hedge.
 */

import type { PieceStatus } from "@/lib/supabase/types";

export interface StaticProvenance {
  position: number;
  label: string;
  detail: string;
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
  provenance: StaticProvenance[];
}

export const staticPieces: StaticPiece[] = [
  {
    slug: "fibreglass-ball-chair",
    categorySlug: "chairs",
    title: "Fibreglass ball chair",
    featured: true,
    featuredPosition: 1,
    provenanceVerified: true,
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
  },
  {
    slug: "cantilever-side-chair",
    categorySlug: "chairs",
    title: "Cantilever side chair",
    featured: false,
    featuredPosition: null,
    provenanceVerified: false,
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
  },
  {
    slug: "teak-wall-unit",
    categorySlug: "shelving-and-storage",
    title: "Teak wall unit",
    featured: true,
    featuredPosition: 2,
    provenanceVerified: false,
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
  },
  {
    slug: "rosewood-sideboard",
    categorySlug: "cabinets-and-sideboards",
    title: "Rosewood sideboard",
    featured: false,
    featuredPosition: null,
    provenanceVerified: true,
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
  },
  {
    slug: "sculptural-coffee-table",
    categorySlug: "tables",
    title: "Sculptural coffee table",
    featured: true,
    featuredPosition: 3,
    provenanceVerified: false,
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
  },
  {
    slug: "nesting-tables",
    categorySlug: "tables",
    title: "Nesting tables",
    featured: false,
    featuredPosition: null,
    provenanceVerified: false,
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
  },
];
