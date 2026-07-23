// Database types for the modern_ schema. Hand-written to match
// supabase/migrations; regenerate with `supabase gen types typescript` once a
// project is provisioned. Row/Insert are named so Update can be a plain
// Partial without a circular reference through the Database index.

export type PieceStatus =
  | "draft"
  | "available"
  | "reserved"
  | "sold"
  | "restoration";
export type ImageKind = "hero" | "detail" | "as_found" | "restored";
export type EnquiryKind = "piece" | "restoration" | "sourcing" | "selling";
// Story band layout; a check constraint in SQL rather than an enum, since the
// three values are a presentation choice, not a domain concept.
export type FeatureLayout = "left" | "right" | "full";

export interface CategoryFact {
  term: string;
  detail: string;
}

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  position: number;
  story: string;
  hint: string;
  facts: CategoryFact[];
  placeholder: boolean;
  created_at: string;
}
interface CategoryInsert {
  slug: string;
  name: string;
  position?: number;
  story?: string;
  hint?: string;
  facts?: CategoryFact[];
  placeholder?: boolean;
}

interface PieceRow {
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
  created_at: string;
}
interface PieceInsert {
  slug: string;
  category_id: string;
  title: string;
  attribution?: string;
  period_label?: string;
  year_from?: number | null;
  year_to?: number | null;
  origin?: string;
  materials?: string[];
  status?: PieceStatus;
  price_pence?: number | null;
  price_on_request?: boolean;
  story?: string;
  restoration_notes?: string;
  placeholder?: boolean;
  featured?: boolean;
  featured_position?: number | null;
  provenance_verified?: boolean;
  catalogue_number?: string;
  section_toggles?: Record<string, boolean>;
}

interface PieceImageRow {
  id: string;
  piece_id: string;
  path: string;
  alt: string;
  position: number;
  kind: ImageKind;
}
interface PieceImageInsert {
  piece_id: string;
  path: string;
  alt?: string;
  position?: number;
  kind?: ImageKind;
}

interface ProvenanceRow {
  id: string;
  piece_id: string;
  position: number;
  label: string;
  detail: string;
}
interface ProvenanceInsert {
  piece_id: string;
  position?: number;
  label: string;
  detail?: string;
}

interface EnquiryRow {
  id: string;
  piece_id: string | null;
  name: string;
  email: string;
  message: string;
  kind: EnquiryKind;
  created_at: string;
}
interface EnquiryInsert {
  piece_id?: string | null;
  name: string;
  email: string;
  message: string;
  kind?: EnquiryKind;
}

interface InterestRow {
  id: string;
  piece_id: string;
  email: string | null;
  created_at: string;
}
interface InterestInsert {
  piece_id: string;
  email?: string | null;
}

interface PieceFeatureRow {
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
interface PieceFeatureInsert {
  piece_id: string;
  position?: number;
  eyebrow?: string;
  title: string;
  body?: string;
  image_path?: string;
  image_alt?: string;
  layout?: FeatureLayout;
}

interface PieceSpecRow {
  id: string;
  piece_id: string;
  position: number;
  grouping: string;
  term: string;
  detail: string;
}
interface PieceSpecInsert {
  piece_id: string;
  position?: number;
  grouping?: string;
  term: string;
  detail?: string;
}

interface PieceIncludedRow {
  id: string;
  piece_id: string;
  position: number;
  label: string;
  note: string;
}
interface PieceIncludedInsert {
  piece_id: string;
  position?: number;
  label: string;
  note?: string;
}

// A null piece_id marks a site-wide question shown on every piece page.
interface FaqRow {
  id: string;
  piece_id: string | null;
  position: number;
  question: string;
  answer: string;
  published: boolean;
}
interface FaqInsert {
  piece_id?: string | null;
  position?: number;
  question: string;
  answer: string;
  published?: boolean;
}

// A null piece_id marks site-wide collector words.
interface TestimonialRow {
  id: string;
  piece_id: string | null;
  position: number;
  quote: string;
  name: string;
  context: string;
  published: boolean;
}
interface TestimonialInsert {
  piece_id?: string | null;
  position?: number;
  quote: string;
  name?: string;
  context?: string;
  published?: boolean;
}

interface SettingRow {
  key: string;
  value: Record<string, unknown>;
}
interface SettingInsert {
  key: string;
  value?: Record<string, unknown>;
}

interface SubscriberRow {
  id: string;
  email: string;
  created_at: string;
}
interface SubscriberInsert {
  email: string;
}

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      modern_categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: Partial<CategoryInsert>;
        Relationships: [];
      };
      modern_pieces: {
        Row: PieceRow;
        Insert: PieceInsert;
        Update: Partial<PieceInsert>;
        Relationships: [];
      };
      modern_piece_images: {
        Row: PieceImageRow;
        Insert: PieceImageInsert;
        Update: Partial<PieceImageInsert>;
        Relationships: [];
      };
      modern_provenance: {
        Row: ProvenanceRow;
        Insert: ProvenanceInsert;
        Update: Partial<ProvenanceInsert>;
        Relationships: [];
      };
      modern_enquiries: {
        Row: EnquiryRow;
        Insert: EnquiryInsert;
        Update: Partial<EnquiryInsert>;
        Relationships: [];
      };
      modern_interest: {
        Row: InterestRow;
        Insert: InterestInsert;
        Update: Partial<InterestInsert>;
        Relationships: [];
      };
      modern_piece_features: {
        Row: PieceFeatureRow;
        Insert: PieceFeatureInsert;
        Update: Partial<PieceFeatureInsert>;
        Relationships: [];
      };
      modern_piece_specs: {
        Row: PieceSpecRow;
        Insert: PieceSpecInsert;
        Update: Partial<PieceSpecInsert>;
        Relationships: [];
      };
      modern_piece_included: {
        Row: PieceIncludedRow;
        Insert: PieceIncludedInsert;
        Update: Partial<PieceIncludedInsert>;
        Relationships: [];
      };
      modern_faqs: {
        Row: FaqRow;
        Insert: FaqInsert;
        Update: Partial<FaqInsert>;
        Relationships: [];
      };
      modern_testimonials: {
        Row: TestimonialRow;
        Insert: TestimonialInsert;
        Update: Partial<TestimonialInsert>;
        Relationships: [];
      };
      modern_settings: {
        Row: SettingRow;
        Insert: SettingInsert;
        Update: Partial<SettingInsert>;
        Relationships: [];
      };
      modern_subscribers: {
        Row: SubscriberRow;
        Insert: SubscriberInsert;
        Update: Partial<SubscriberInsert>;
        Relationships: [];
      };
    };
    // Empty groups use an empty mapped type, not Record<string, never>, which
    // would intersect with Tables and collapse every table to never.
    Views: { [_ in never]: never };
    Functions: {
      modern_is_owner: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      modern_piece_status: PieceStatus;
      modern_image_kind: ImageKind;
      modern_enquiry_kind: EnquiryKind;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
