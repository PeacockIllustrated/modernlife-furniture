import type {
  PieceStatus,
  ImageKind,
  EnquiryKind,
  FeatureLayout,
} from "@/lib/supabase/types";

/**
 * Shared shapes for the owner dashboard: the raw snake_case rows exactly as
 * GET /api/admin/data returns them, the draft row shapes the piece editor
 * holds in state, and the fixed lists the forms render from. Kept in one
 * place so the panels and the editor agree without importing each other.
 */

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
}
export interface AdminPiece {
  id: string;
  slug: string;
  category_id: string;
  title: string;
  attribution: string;
  period_label: string;
  year_from: number | null;
  year_to: number | null;
  origin: string;
  materials: string[];
  status: PieceStatus;
  price_pence: number | null;
  price_on_request: boolean;
  story: string;
  restoration_notes: string;
  placeholder: boolean;
  featured: boolean;
  featured_position: number | null;
  provenance_verified: boolean;
  catalogue_number: string;
  section_toggles: Record<string, boolean>;
}
export interface AdminProvenance {
  id: string;
  piece_id: string;
  position: number;
  label: string;
  detail: string;
}
export interface AdminImage {
  id: string;
  piece_id: string;
  path: string;
  alt: string;
  position: number;
  kind: ImageKind;
}
export interface AdminFeature {
  id: string;
  piece_id: string;
  position: number;
  eyebrow: string;
  title: string;
  body: string;
  image_path: string;
  image_alt: string;
  layout: FeatureLayout;
}
export interface AdminSpec {
  id: string;
  piece_id: string;
  position: number;
  grouping: string;
  term: string;
  detail: string;
}
export interface AdminIncluded {
  id: string;
  piece_id: string;
  position: number;
  label: string;
  note: string;
}
export interface AdminFaq {
  id: string;
  piece_id: string | null;
  position: number;
  question: string;
  answer: string;
  published: boolean;
}
export interface AdminWord {
  id: string;
  piece_id: string | null;
  position: number;
  quote: string;
  name: string;
  context: string;
  published: boolean;
}
export interface AdminSetting {
  key: string;
  value: Record<string, unknown>;
}
export interface AdminSubscriber {
  id: string;
  email: string;
  created_at: string;
}
export interface AdminEnquiry {
  id: string;
  piece_id: string | null;
  name: string;
  email: string;
  message: string;
  kind: EnquiryKind;
  created_at: string;
}
export interface AdminInterest {
  id: string;
  piece_id: string;
  email: string | null;
  created_at: string;
}

/** Everything the dashboard loads once and hands down to its panels. */
export interface AdminData {
  categories: AdminCategory[];
  pieces: AdminPiece[];
  provenance: AdminProvenance[];
  images: AdminImage[];
  features: AdminFeature[];
  specs: AdminSpec[];
  included: AdminIncluded[];
  faqs: AdminFaq[];
  testimonials: AdminWord[];
  settings: AdminSetting[];
  subscribers: AdminSubscriber[];
  enquiries: AdminEnquiry[];
  interest: AdminInterest[];
}

export const emptyAdminData: AdminData = {
  categories: [],
  pieces: [],
  provenance: [],
  images: [],
  features: [],
  specs: [],
  included: [],
  faqs: [],
  testimonials: [],
  settings: [],
  subscribers: [],
  enquiries: [],
  interest: [],
};

export const STATUSES: PieceStatus[] = [
  "draft",
  "available",
  "reserved",
  "sold",
  "restoration",
];
export const IMAGE_KINDS: ImageKind[] = ["hero", "detail", "as_found", "restored"];
export const LAYOUTS: FeatureLayout[] = ["left", "right", "full"];

// The nine piece page sections a piece can switch off. An absent key means
// enabled, so the editor writes explicit booleans for all nine on save.
export const SECTION_TOGGLES: { key: string; label: string }[] = [
  { key: "features", label: "Story bands" },
  { key: "record", label: "Specimen record" },
  { key: "included", label: "What comes with the piece" },
  { key: "condition", label: "Condition and restoration" },
  { key: "provenance", label: "Provenance" },
  { key: "care", label: "Care and delivery" },
  { key: "faq", label: "Questions" },
  { key: "words", label: "Collector words" },
  { key: "related", label: "From the same room" },
];

/** Draft rows the piece editor edits before saving; ids are kept only so
    React keys stay stable, the server replaces children wholesale. */
export interface ImageDraft {
  id?: string;
  path: string;
  alt: string;
  kind: ImageKind;
}
export interface BandDraft {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  image_path: string;
  image_alt: string;
  layout: FeatureLayout;
}

/** Move a row one place without mutating; used by the reorder buttons. */
export function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
