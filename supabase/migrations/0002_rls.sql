-- Row level security, RLS-first per ARCHITECTURE.md.
-- Public may read the catalogue; only owners may write; enquiries are
-- write-only for the public and never openly selectable.

alter table modern_owners enable row level security;
alter table modern_categories enable row level security;
alter table modern_pieces enable row level security;
alter table modern_piece_images enable row level security;
alter table modern_provenance enable row level security;
alter table modern_enquiries enable row level security;

-- ---- Public read of the published catalogue ----
create policy "categories are publicly readable"
  on modern_categories for select
  using (true);

create policy "published pieces are publicly readable"
  on modern_pieces for select
  using (status <> 'draft' or modern_is_owner());

create policy "images of published pieces are publicly readable"
  on modern_piece_images for select
  using (
    exists (
      select 1 from modern_pieces p
      where p.id = piece_id and (p.status <> 'draft' or modern_is_owner())
    )
  );

create policy "provenance of published pieces is publicly readable"
  on modern_provenance for select
  using (
    exists (
      select 1 from modern_pieces p
      where p.id = piece_id and (p.status <> 'draft' or modern_is_owner())
    )
  );

-- ---- Enquiries: public may insert, only owners may read ----
create policy "anyone may lodge an enquiry"
  on modern_enquiries for insert
  with check (true);

create policy "owners read enquiries"
  on modern_enquiries for select
  using (modern_is_owner());

create policy "owners manage enquiries"
  on modern_enquiries for update
  using (modern_is_owner())
  with check (modern_is_owner());

create policy "owners delete enquiries"
  on modern_enquiries for delete
  using (modern_is_owner());

-- ---- Owner-only management of the catalogue ----
create policy "owners manage categories"
  on modern_categories for all
  using (modern_is_owner())
  with check (modern_is_owner());

create policy "owners manage pieces"
  on modern_pieces for all
  using (modern_is_owner())
  with check (modern_is_owner());

create policy "owners manage images"
  on modern_piece_images for all
  using (modern_is_owner())
  with check (modern_is_owner());

create policy "owners manage provenance"
  on modern_provenance for all
  using (modern_is_owner())
  with check (modern_is_owner());

-- ---- Owners table: owners may see the roster; bootstrapping the first owner
-- is done with the service role (which bypasses RLS) or straight SQL. ----
create policy "owners see the roster"
  on modern_owners for select
  using (modern_is_owner());

create policy "owners manage the roster"
  on modern_owners for all
  using (modern_is_owner())
  with check (modern_is_owner());
