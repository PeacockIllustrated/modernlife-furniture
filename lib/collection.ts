import "server-only";
import { cache } from "react";
import { isSupabaseConfigured } from "./supabase/env";
import type { CategoryFact, PieceStatus, Database } from "./supabase/types";
import { rooms } from "@/content/landing";
import { staticPieces } from "@/content/pieces";

type PieceRow = Database["public"]["Tables"]["modern_pieces"]["Row"];

/**
 * The collection, read from Supabase when it is configured and from the static
 * catalogue in content/ otherwise. Either way the rest of the app sees the same
 * shapes, so pages need not know where their data came from.
 */

export interface Category {
  slug: string;
  name: string;
  position: number;
  story: string;
  hint: string;
  facts: CategoryFact[];
  placeholder: boolean;
}

export interface Provenance {
  position: number;
  label: string;
  detail: string;
}

export interface PieceImage {
  path: string;
  alt: string;
  position: number;
  kind: "hero" | "detail" | "as_found" | "restored";
}

export interface Piece {
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
}

export interface PieceDetail extends Piece {
  provenance: Provenance[];
  images: PieceImage[];
}

// ---- Static fallbacks, derived from the same copy the landing renders ----

function staticCategories(): Category[] {
  return rooms.map((room, i) => ({
    slug: room.slug,
    name: room.title,
    position: i + 1,
    story: room.story,
    hint: room.hint,
    facts: room.facts,
    placeholder: true,
  }));
}

function toPiece(p: (typeof staticPieces)[number]): Piece {
  return {
    slug: p.slug,
    categorySlug: p.categorySlug,
    title: p.title,
    attribution: p.attribution,
    periodLabel: p.periodLabel,
    yearFrom: p.yearFrom,
    yearTo: p.yearTo,
    origin: p.origin,
    materials: p.materials,
    status: p.status,
    priceOnRequest: p.priceOnRequest,
    pricePence: p.pricePence,
    story: p.story,
    restorationNotes: p.restorationNotes,
    placeholder: p.placeholder,
    featured: p.featured,
    featuredPosition: p.featuredPosition,
    provenanceVerified: p.provenanceVerified,
  };
}

// ---- Public API ----

export const getCategories = cache(async (): Promise<Category[]> => {
  // The static catalogue is the fallback for "no database", not for an empty
  // one: when Supabase is configured its result is authoritative, so an empty
  // table returns an empty list rather than the placeholder demo content.
  if (!isSupabaseConfigured) return staticCategories();
  try {
    const { createPublicClient } = await import("./supabase/public");
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("modern_categories")
      .select("slug,name,position,story,hint,facts,placeholder")
      .order("position");
    if (!error && data) return data as Category[];
  } catch {
    // Unreachable database: keep the landing and collection populated.
    return staticCategories();
  }
  return staticCategories();
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    const all = await getCategories();
    return all.find((c) => c.slug === slug) ?? null;
  },
);

export const getPieces = cache(
  async (categorySlug?: string): Promise<Piece[]> => {
    // Without a database, serve the static catalogue. With one, the database is
    // authoritative: a draft or deleted piece must not reappear from static, so
    // there is no static fallback on the configured path.
    if (!isSupabaseConfigured) {
      const all = staticPieces.map(toPiece);
      return categorySlug
        ? all.filter((p) => p.categorySlug === categorySlug)
        : all;
    }
    try {
      const { createPublicClient } = await import("./supabase/public");
      const supabase = createPublicClient();
      let query = supabase
        .from("modern_pieces")
        .select("*, modern_categories!inner(slug)")
        .neq("status", "draft")
        .order("created_at", { ascending: false });
      if (categorySlug) {
        query = query.eq("modern_categories.slug", categorySlug);
      }
      const { data, error } = await query;
      if (!error && data) {
        const rows = data as unknown as Array<
          PieceRow & { modern_categories: { slug: string } }
        >;
        return rows.map(
          (row): Piece => ({
            slug: row.slug,
            categorySlug: row.modern_categories.slug,
            title: row.title,
            attribution: row.attribution,
            periodLabel: row.period_label,
            yearFrom: row.year_from,
            yearTo: row.year_to,
            origin: row.origin,
            materials: row.materials,
            status: row.status,
            priceOnRequest: row.price_on_request,
            pricePence: row.price_pence,
            story: row.story,
            restorationNotes: row.restoration_notes,
            placeholder: row.placeholder,
            featured: row.featured,
            featuredPosition: row.featured_position,
            provenanceVerified: row.provenance_verified,
          }),
        );
      }
    } catch {
      // configured but unreachable
    }
    return [];
  },
);

export const getPieceBySlug = cache(
  async (slug: string): Promise<PieceDetail | null> => {
    // Configured database is authoritative: a draft piece resolves to null (a
    // 404) rather than leaking through the static fallback.
    if (!isSupabaseConfigured) {
      const found = staticPieces.find((p) => p.slug === slug);
      if (!found) return null;
      return { ...toPiece(found), provenance: found.provenance, images: [] };
    }
    try {
      {
        const { createPublicClient } = await import("./supabase/public");
        const supabase = createPublicClient();
        const { data, error } = await supabase
          .from("modern_pieces")
          .select(
            "*, modern_categories!inner(slug), modern_provenance(position,label,detail), modern_piece_images(path,alt,position,kind)",
          )
          .eq("slug", slug)
          .neq("status", "draft")
          .maybeSingle();
        if (!error && data) {
          const row = data as unknown as {
            slug: string;
            modern_categories: { slug: string };
            title: string;
            attribution: string;
            period_label: string;
            year_from: number | null;
            year_to: number | null;
            origin: string;
            materials: string[];
            status: PieceStatus;
            price_on_request: boolean;
            price_pence: number | null;
            story: string;
            restoration_notes: string;
            placeholder: boolean;
            featured: boolean;
            featured_position: number | null;
            provenance_verified: boolean;
            modern_provenance: Provenance[];
            modern_piece_images: PieceImage[];
          };
          return {
            slug: row.slug,
            categorySlug: row.modern_categories.slug,
            title: row.title,
            attribution: row.attribution,
            periodLabel: row.period_label,
            yearFrom: row.year_from,
            yearTo: row.year_to,
            origin: row.origin,
            materials: row.materials,
            status: row.status,
            priceOnRequest: row.price_on_request,
            pricePence: row.price_pence,
            story: row.story,
            restorationNotes: row.restoration_notes,
            placeholder: row.placeholder,
            featured: row.featured,
            featuredPosition: row.featured_position,
            provenanceVerified: row.provenance_verified,
            provenance: [...row.modern_provenance].sort(
              (a, b) => a.position - b.position,
            ),
            images: [...row.modern_piece_images].sort(
              (a, b) => a.position - b.position,
            ),
          };
        }
      }
    } catch {
      // configured but unreachable
    }
    return null;
  },
);

/**
 * The owner's featured selection for the homepage, ordered by the position the
 * owner set, then most recent. Falls back to the flagged static pieces without
 * a database.
 */
export const getFeaturedPieces = cache(async (): Promise<Piece[]> => {
  const order = (a: Piece, b: Piece) => {
    const pa = a.featuredPosition ?? 9999;
    const pb = b.featuredPosition ?? 9999;
    return pa - pb;
  };

  if (!isSupabaseConfigured) {
    return staticPieces
      .map(toPiece)
      .filter((p) => p.featured)
      .sort(order);
  }
  try {
    const { createPublicClient } = await import("./supabase/public");
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("modern_pieces")
      .select("*, modern_categories!inner(slug)")
      .eq("featured", true)
      .neq("status", "draft")
      .order("featured_position", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (!error && data) {
      const rows = data as unknown as Array<
        PieceRow & { modern_categories: { slug: string } }
      >;
      return rows.map(
        (row): Piece => ({
          slug: row.slug,
          categorySlug: row.modern_categories.slug,
          title: row.title,
          attribution: row.attribution,
          periodLabel: row.period_label,
          yearFrom: row.year_from,
          yearTo: row.year_to,
          origin: row.origin,
          materials: row.materials,
          status: row.status,
          priceOnRequest: row.price_on_request,
          pricePence: row.price_pence,
          story: row.story,
          restorationNotes: row.restoration_notes,
          placeholder: row.placeholder,
          featured: row.featured,
          featuredPosition: row.featured_position,
          provenanceVerified: row.provenance_verified,
        }),
      );
    }
  } catch {
    // configured but unreachable
  }
  return [];
});
