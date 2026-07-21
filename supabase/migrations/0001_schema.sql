-- Modern Life Furniture, schema. All tables carry the modern_ prefix.
-- See ARCHITECTURE.md for the data model. British spelling throughout.

create extension if not exists "pgcrypto";

-- Enumerations
create type modern_piece_status as enum (
  'draft',
  'available',
  'reserved',
  'sold',
  'restoration'
);
create type modern_image_kind as enum ('hero', 'detail', 'as_found', 'restored');
create type modern_enquiry_kind as enum (
  'piece',
  'restoration',
  'sourcing',
  'selling'
);

-- Owners: the single collector, or a small studio team. Membership here, not a
-- blanket "authenticated" check, is what grants management rights (see RLS).
create table modern_owners (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Categories: the five gallery rooms. `facts` mirrors the landing dl.
create table modern_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  position int not null default 0,
  story text not null default '',
  hint text not null default '',
  facts jsonb not null default '[]'::jsonb,
  placeholder boolean not null default false,
  created_at timestamptz not null default now()
);

-- Pieces: individual specimens. Attribution is free text and, per CONTENT.md,
-- only ever a hedge ("attributed to", "school of") until the owner confirms.
create table modern_pieces (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category_id uuid not null references modern_categories (id) on delete restrict,
  title text not null,
  attribution text not null default '',
  period_label text not null default '',
  year_from int,
  year_to int,
  origin text not null default '',
  materials text[] not null default '{}',
  status modern_piece_status not null default 'available',
  price_pence int,
  price_on_request boolean not null default true,
  story text not null default '',
  restoration_notes text not null default '',
  placeholder boolean not null default false,
  created_at timestamptz not null default now()
);
create index modern_pieces_category_idx on modern_pieces (category_id);
create index modern_pieces_status_idx on modern_pieces (status);

-- Images: photography per piece, tagged by role.
create table modern_piece_images (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references modern_pieces (id) on delete cascade,
  path text not null,
  alt text not null default '',
  position int not null default 0,
  kind modern_image_kind not null default 'detail'
);
create index modern_piece_images_piece_idx on modern_piece_images (piece_id);

-- Provenance: the coloured rings on a piece page.
create table modern_provenance (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references modern_pieces (id) on delete cascade,
  position int not null default 0,
  label text not null,
  detail text not null default ''
);
create index modern_provenance_piece_idx on modern_provenance (piece_id);

-- Enquiries: anyone may lodge one; only owners may read them (see RLS).
create table modern_enquiries (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid references modern_pieces (id) on delete set null,
  name text not null,
  email text not null,
  message text not null,
  kind modern_enquiry_kind not null default 'piece',
  created_at timestamptz not null default now()
);
create index modern_enquiries_created_idx on modern_enquiries (created_at desc);

-- Owner check, security definer so a policy can read modern_owners without
-- tripping that table's own RLS.
create or replace function modern_is_owner() returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from modern_owners o where o.user_id = auth.uid()
  );
$$;
