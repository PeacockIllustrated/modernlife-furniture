import "server-only";
import { cache } from "react";
import { isSupabaseConfigured } from "./supabase/env";
import type {
  CategoryFact,
  Database,
  FeatureLayout,
  PieceStatus,
} from "./supabase/types";
import { rooms } from "@/content/landing";
import { staticPieces } from "@/content/pieces";
import {
  defaultIncluded,
  globalFaqs,
  globalWords,
  storeSettings,
  type StoreSettings,
} from "@/content/store";

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

export interface PieceFeature {
  position: number;
  eyebrow: string;
  title: string;
  body: string;
  imagePath: string;
  imageAlt: string;
  layout: FeatureLayout;
}

export interface SpecRow {
  position: number;
  grouping: string;
  term: string;
  detail: string;
}

export interface IncludedItem {
  position: number;
  label: string;
  note: string;
}

export interface Faq {
  position: number;
  question: string;
  answer: string;
}

export interface Word {
  position: number;
  quote: string;
  name: string;
  context: string;
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
  catalogueNumber: string;
}

export interface PieceDetail extends Piece {
  provenance: Provenance[];
  images: PieceImage[];
  // Explicit booleans per named section; an absent key means enabled. The
  // piece page is a fixed template, so this object is its whole configuration.
  sectionToggles: Record<string, boolean>;
  features: PieceFeature[];
  specs: SpecRow[];
  included: IncludedItem[];
  faqs: Faq[];
  words: Word[];
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
    catalogueNumber: p.catalogueNumber,
  };
}

// Children come back from PostgREST in table order; the page reads them in
// the order the owner arranged.
function byPosition<T extends { position: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.position - b.position);
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
            catalogueNumber: row.catalogue_number,
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
      return {
        ...toPiece(found),
        provenance: found.provenance,
        images: [],
        sectionToggles: found.sectionToggles,
        features: found.features,
        specs: found.specs,
        // A piece with no items of its own comes with the house four.
        included:
          found.included.length > 0
            ? found.included
            : defaultIncluded.map((item, i) => ({ position: i + 1, ...item })),
        faqs: found.faqs,
        // Site-wide words are fetched separately; the page tops itself up
        // from getGlobalWords.
        words: [],
      };
    }
    try {
      {
        const { createPublicClient } = await import("./supabase/public");
        const supabase = createPublicClient();
        const { data, error } = await supabase
          .from("modern_pieces")
          .select(
            "*, modern_categories!inner(slug), modern_provenance(position,label,detail), modern_piece_images(path,alt,position,kind), modern_piece_features(position,eyebrow,title,body,image_path,image_alt,layout), modern_piece_specs(position,grouping,term,detail), modern_piece_included(position,label,note), modern_faqs(position,question,answer,published), modern_testimonials(position,quote,name,context,published)",
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
            catalogue_number: string;
            section_toggles: Record<string, boolean>;
            modern_provenance: Provenance[];
            modern_piece_images: PieceImage[];
            modern_piece_features: Array<{
              position: number;
              eyebrow: string;
              title: string;
              body: string;
              image_path: string;
              image_alt: string;
              layout: FeatureLayout;
            }>;
            modern_piece_specs: SpecRow[];
            modern_piece_included: IncludedItem[];
            modern_faqs: Array<Faq & { published: boolean }>;
            modern_testimonials: Array<Word & { published: boolean }>;
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
            catalogueNumber: row.catalogue_number,
            sectionToggles: row.section_toggles ?? {},
            provenance: byPosition(row.modern_provenance),
            images: byPosition(row.modern_piece_images),
            features: byPosition(row.modern_piece_features).map((f) => ({
              position: f.position,
              eyebrow: f.eyebrow,
              title: f.title,
              body: f.body,
              imagePath: f.image_path,
              imageAlt: f.image_alt,
              layout: f.layout,
            })),
            specs: byPosition(row.modern_piece_specs),
            included: byPosition(row.modern_piece_included),
            // The published filter is applied here rather than in the join;
            // the embedded rows are small and the query stays one select.
            faqs: byPosition(row.modern_faqs.filter((f) => f.published)).map(
              ({ position, question, answer }) => ({
                position,
                question,
                answer,
              }),
            ),
            words: byPosition(
              row.modern_testimonials.filter((w) => w.published),
            ).map(({ position, quote, name, context }) => ({
              position,
              quote,
              name,
              context,
            })),
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
          catalogueNumber: row.catalogue_number,
        }),
      );
    }
  } catch {
    // configured but unreachable
  }
  return [];
});

/**
 * Site-wide questions, shown on every piece page after any piece-specific
 * ones. Static fallback only when no database is configured; a configured
 * database is authoritative, so an empty table stays empty.
 */
export const getGlobalFaqs = cache(async (): Promise<Faq[]> => {
  if (!isSupabaseConfigured) {
    return globalFaqs.map((f, i) => ({ position: i + 1, ...f }));
  }
  try {
    const { createPublicClient } = await import("./supabase/public");
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("modern_faqs")
      .select("position,question,answer")
      .is("piece_id", null)
      .eq("published", true)
      .order("position");
    if (!error && data) return data as Faq[];
  } catch {
    // configured but unreachable
  }
  return [];
});

/**
 * Site-wide collector words, staff-curated, for the home page and to top up a
 * piece page that has fewer than three of its own. Same fallback bargain as
 * the questions above.
 */
export const getGlobalWords = cache(async (limit = 3): Promise<Word[]> => {
  if (!isSupabaseConfigured) {
    return globalWords
      .slice(0, limit)
      .map((w, i) => ({ position: i + 1, ...w }));
  }
  try {
    const { createPublicClient } = await import("./supabase/public");
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("modern_testimonials")
      .select("position,quote,name,context")
      .is("piece_id", null)
      .eq("published", true)
      .order("position")
      .limit(limit);
    if (!error && data) return data as Word[];
  } catch {
    // configured but unreachable
  }
  return [];
});

/**
 * The store prose from the modern_settings 'store' row, shallow-merged over
 * the static defaults so a key the owner has not written yet still reads.
 * Unlike the lists above this never returns empty; the chrome must not blank.
 */
export const getStoreSettings = cache(async (): Promise<StoreSettings> => {
  if (!isSupabaseConfigured) return storeSettings;
  try {
    const { createPublicClient } = await import("./supabase/public");
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("modern_settings")
      .select("value")
      .eq("key", "store")
      .maybeSingle();
    if (!error && data) {
      // Cast through unknown, as elsewhere: the hand-written Database type
      // does not satisfy the postgrest builder generics for this select.
      const row = data as unknown as { value: Partial<StoreSettings> };
      return { ...storeSettings, ...row.value };
    }
  } catch {
    // configured but unreachable
  }
  return storeSettings;
});

// The browse order for "from the same room": pieces still for sale lead,
// sold pieces bring up the rear. Draft never reaches this code path.
const relatedOrder: Record<PieceStatus, number> = {
  available: 0,
  reserved: 1,
  restoration: 2,
  sold: 3,
  draft: 4,
};

/**
 * Companions from the same category for the foot of a piece page. Reuses the
 * cached category read, so a piece page costs no extra query for these.
 */
export const getRelatedPieces = cache(
  async (
    categorySlug: string,
    excludeSlug: string,
    limit = 3,
  ): Promise<Piece[]> => {
    const all = await getPieces(categorySlug);
    return all
      .filter((p) => p.slug !== excludeSlug)
      .sort((a, b) => relatedOrder[a.status] - relatedOrder[b.status])
      .slice(0, limit);
  },
);
