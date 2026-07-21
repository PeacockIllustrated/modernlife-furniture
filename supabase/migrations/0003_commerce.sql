-- Modern Life Furniture, commerce and curation layer.
-- Adds owner-curated featuring, a verified-provenance seal, and lightweight
-- interest capture ("I want this"). British spelling throughout.

-- ---- Curation and the seal on pieces ----
alter table modern_pieces
  add column featured boolean not null default false,
  add column featured_position int,
  -- The seal is a verified-provenance marker, distinct from the sale status.
  -- It is only ever set by the owner once provenance is genuinely confirmed,
  -- in keeping with the standing rule against stating attribution as fact.
  add column provenance_verified boolean not null default false;

create index modern_pieces_featured_idx
  on modern_pieces (featured, featured_position);

-- ---- Interest: a visitor's "I want this", rolled up per piece ----
-- Anyone may register interest (optionally leaving an email); only owners may
-- read it, the same shape as enquiries. Useful for demand and for re-engaging
-- someone when a similar piece arrives.
create table modern_interest (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references modern_pieces (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
create index modern_interest_piece_idx on modern_interest (piece_id);

alter table modern_interest enable row level security;

create policy "anyone may register interest"
  on modern_interest for insert
  with check (true);

create policy "owners read interest"
  on modern_interest for select
  using (modern_is_owner());

create policy "owners delete interest"
  on modern_interest for delete
  using (modern_is_owner());
