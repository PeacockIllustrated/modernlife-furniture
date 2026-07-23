-- Modern Life Furniture, store layer. The piece page grows into a full
-- specimen record: story bands, a specification record, what comes with the
-- piece, questions, staff-curated collector words, site settings and the
-- acquisitions list. Additive only; every statement stays inside the modern_
-- namespace apart from the one storage bucket. British spelling throughout.

-- ---- Pieces gain a catalogue number and per-page section toggles ----
-- section_toggles holds explicit booleans keyed by section name; an absent
-- key means enabled. The piece page is a fixed, toggleable template, not a
-- block builder, so this object is the whole of its configuration.
alter table modern_pieces
  add column catalogue_number text not null default '',
  add column section_toggles jsonb not null default '{}'::jsonb;

-- ---- Story bands: the "in detail" features on a piece page ----
-- layout is plain text with a check constraint rather than a new enum; the
-- three values are a presentation choice, not a domain concept.
create table modern_piece_features (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references modern_pieces (id) on delete cascade,
  position int not null default 0,
  eyebrow text not null default '',
  title text not null,
  body text not null default '',
  image_path text not null default '',
  image_alt text not null default '',
  layout text not null default 'right' check (layout in ('left', 'right', 'full'))
);
create index modern_piece_features_piece_idx on modern_piece_features (piece_id);

-- ---- Specification rows: the specimen record, grouped by heading ----
create table modern_piece_specs (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references modern_pieces (id) on delete cascade,
  position int not null default 0,
  grouping text not null default '',
  term text not null,
  detail text not null default ''
);
create index modern_piece_specs_piece_idx on modern_piece_specs (piece_id);

-- ---- What comes with the piece ----
create table modern_piece_included (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references modern_pieces (id) on delete cascade,
  position int not null default 0,
  label text not null,
  note text not null default ''
);
create index modern_piece_included_piece_idx on modern_piece_included (piece_id);

-- ---- Questions: piece_id null means a site-wide question on every page ----
create table modern_faqs (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid references modern_pieces (id) on delete cascade,
  position int not null default 0,
  question text not null,
  answer text not null,
  published boolean not null default true
);
create index modern_faqs_piece_idx on modern_faqs (piece_id);

-- ---- Collector words, staff-curated; piece_id null means site-wide ----
create table modern_testimonials (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid references modern_pieces (id) on delete cascade,
  position int not null default 0,
  quote text not null,
  name text not null default '',
  context text not null default '',
  published boolean not null default true
);
create index modern_testimonials_piece_idx on modern_testimonials (piece_id);

-- ---- Settings: small keyed objects, the 'store' row carries site prose ----
create table modern_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

-- ---- Subscribers: the acquisitions list ----
create table modern_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);
create unique index modern_subscribers_email_idx on modern_subscribers (lower(email));

-- ---- Row level security, following 0002 ----
alter table modern_piece_features enable row level security;
alter table modern_piece_specs enable row level security;
alter table modern_piece_included enable row level security;
alter table modern_faqs enable row level security;
alter table modern_testimonials enable row level security;
alter table modern_settings enable row level security;
alter table modern_subscribers enable row level security;

-- ---- Public read of the published catalogue, gated on the parent piece ----
create policy "features of published pieces are publicly readable"
  on modern_piece_features for select
  using (
    exists (
      select 1 from modern_pieces p
      where p.id = piece_id and (p.status <> 'draft' or modern_is_owner())
    )
  );

create policy "specifications of published pieces are publicly readable"
  on modern_piece_specs for select
  using (
    exists (
      select 1 from modern_pieces p
      where p.id = piece_id and (p.status <> 'draft' or modern_is_owner())
    )
  );

create policy "included items of published pieces are publicly readable"
  on modern_piece_included for select
  using (
    exists (
      select 1 from modern_pieces p
      where p.id = piece_id and (p.status <> 'draft' or modern_is_owner())
    )
  );

-- Site-wide rows have no parent piece, so a null piece_id passes on its own.
create policy "published questions are publicly readable"
  on modern_faqs for select
  using (
    published
    and (
      piece_id is null
      or exists (
        select 1 from modern_pieces p
        where p.id = piece_id and (p.status <> 'draft' or modern_is_owner())
      )
    )
  );

create policy "published collector words are publicly readable"
  on modern_testimonials for select
  using (
    published
    and (
      piece_id is null
      or exists (
        select 1 from modern_pieces p
        where p.id = piece_id and (p.status <> 'draft' or modern_is_owner())
      )
    )
  );

create policy "settings are publicly readable"
  on modern_settings for select
  using (true);

-- ---- Owner-only management of the store layer ----
create policy "owners manage features"
  on modern_piece_features for all
  using (modern_is_owner())
  with check (modern_is_owner());

create policy "owners manage specifications"
  on modern_piece_specs for all
  using (modern_is_owner())
  with check (modern_is_owner());

create policy "owners manage included items"
  on modern_piece_included for all
  using (modern_is_owner())
  with check (modern_is_owner());

create policy "owners manage questions"
  on modern_faqs for all
  using (modern_is_owner())
  with check (modern_is_owner());

create policy "owners manage collector words"
  on modern_testimonials for all
  using (modern_is_owner())
  with check (modern_is_owner());

create policy "owners manage settings"
  on modern_settings for all
  using (modern_is_owner())
  with check (modern_is_owner());

-- ---- Subscribers: public may join, only owners may read; the same shape as
-- enquiries, never openly selectable. ----
create policy "anyone may join the list"
  on modern_subscribers for insert
  with check (true);

create policy "owners read the list"
  on modern_subscribers for select
  using (modern_is_owner());

create policy "owners remove subscribers"
  on modern_subscribers for delete
  using (modern_is_owner());

-- ---- Storage: the public bucket for piece photography ----
-- Guarded so the migration reruns cleanly where the bucket already exists.
insert into storage.buckets (id, name, public)
values ('modern-pieces', 'modern-pieces', true)
on conflict (id) do nothing;
