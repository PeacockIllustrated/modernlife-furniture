// Database types for the mlf_ schema. Hand-written to match
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

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      mlf_categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: Partial<CategoryInsert>;
        Relationships: [];
      };
      mlf_pieces: {
        Row: PieceRow;
        Insert: PieceInsert;
        Update: Partial<PieceInsert>;
        Relationships: [];
      };
      mlf_piece_images: {
        Row: PieceImageRow;
        Insert: PieceImageInsert;
        Update: Partial<PieceImageInsert>;
        Relationships: [];
      };
      mlf_provenance: {
        Row: ProvenanceRow;
        Insert: ProvenanceInsert;
        Update: Partial<ProvenanceInsert>;
        Relationships: [];
      };
      mlf_enquiries: {
        Row: EnquiryRow;
        Insert: EnquiryInsert;
        Update: Partial<EnquiryInsert>;
        Relationships: [];
      };
      mlf_interest: {
        Row: InterestRow;
        Insert: InterestInsert;
        Update: Partial<InterestInsert>;
        Relationships: [];
      };
    };
    // Empty groups use an empty mapped type, not Record<string, never>, which
    // would intersect with Tables and collapse every table to never.
    Views: { [_ in never]: never };
    Functions: {
      mlf_is_owner: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      mlf_piece_status: PieceStatus;
      mlf_image_kind: ImageKind;
      mlf_enquiry_kind: EnquiryKind;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
