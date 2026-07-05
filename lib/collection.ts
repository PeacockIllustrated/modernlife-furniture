import "server-only";
import { cache } from "react";
import { isSupabaseConfigured } from "./supabase/env";
import type { CategoryFact, PieceStatus, Database } from "./supabase/types";
import { rooms } from "@/content/landing";
import { staticPieces } from "@/content/pieces";

type PieceRow = Database["public"]["Tables"]["mlf_pieces"]["Row"];

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
  };
}

// ---- Public API ----

export const getCategories = cache(async (): Promise<Category[]> => {
  if (isSupabaseConfigured) {
    try {
      const { createClient } = await import("./supabase/server");
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("mlf_categories")
        .select("slug,name,position,story,hint,facts,placeholder")
        .order("position");
      if (!error && data && data.length) {
        return data as Category[];
      }
    } catch {
      // fall through to static
    }
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
    if (isSupabaseConfigured) {
      try {
        const { createClient } = await import("./supabase/server");
        const supabase = await createClient();
        let query = supabase
          .from("mlf_pieces")
          .select("*, mlf_categories!inner(slug)")
          .neq("status", "draft")
          .order("created_at", { ascending: false });
        if (categorySlug) {
          query = query.eq("mlf_categories.slug", categorySlug);
        }
        const { data, error } = await query;
        if (!error && data) {
          const rows = data as unknown as Array<
            PieceRow & { mlf_categories: { slug: string } }
          >;
          return rows.map(
            (row): Piece => ({
              slug: row.slug,
              categorySlug: row.mlf_categories.slug,
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
            }),
          );
        }
      } catch {
        // fall through to static
      }
    }
    const all = staticPieces.map(toPiece);
    return categorySlug
      ? all.filter((p) => p.categorySlug === categorySlug)
      : all;
  },
);

export const getPieceBySlug = cache(
  async (slug: string): Promise<PieceDetail | null> => {
    if (isSupabaseConfigured) {
      try {
        const { createClient } = await import("./supabase/server");
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("mlf_pieces")
          .select(
            "*, mlf_categories!inner(slug), mlf_provenance(position,label,detail), mlf_piece_images(path,alt,position,kind)",
          )
          .eq("slug", slug)
          .neq("status", "draft")
          .maybeSingle();
        if (!error && data) {
          const row = data as unknown as {
            slug: string;
            mlf_categories: { slug: string };
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
            mlf_provenance: Provenance[];
            mlf_piece_images: PieceImage[];
          };
          return {
            slug: row.slug,
            categorySlug: row.mlf_categories.slug,
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
            provenance: [...row.mlf_provenance].sort(
              (a, b) => a.position - b.position,
            ),
            images: [...row.mlf_piece_images].sort(
              (a, b) => a.position - b.position,
            ),
          };
        }
      } catch {
        // fall through to static
      }
    }
    const found = staticPieces.find((p) => p.slug === slug);
    if (!found) return null;
    return {
      ...toPiece(found),
      provenance: found.provenance,
      images: [],
    };
  },
);
