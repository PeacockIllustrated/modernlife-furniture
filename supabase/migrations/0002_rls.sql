-- Row level security, RLS-first per ARCHITECTURE.md.
-- Public may read the catalogue; only owners may write; enquiries are
-- write-only for the public and never openly selectable.

alter table mlf_owners enable row level security;
alter table mlf_categories enable row level security;
alter table mlf_pieces enable row level security;
alter table mlf_piece_images enable row level security;
alter table mlf_provenance enable row level security;
alter table mlf_enquiries enable row level security;

-- ---- Public read of the published catalogue ----
create policy "categories are publicly readable"
  on mlf_categories for select
  using (true);

create policy "published pieces are publicly readable"
  on mlf_pieces for select
  using (status <> 'draft' or mlf_is_owner());

create policy "images of published pieces are publicly readable"
  on mlf_piece_images for select
  using (
    exists (
      select 1 from mlf_pieces p
      where p.id = piece_id and (p.status <> 'draft' or mlf_is_owner())
    )
  );

create policy "provenance of published pieces is publicly readable"
  on mlf_provenance for select
  using (
    exists (
      select 1 from mlf_pieces p
      where p.id = piece_id and (p.status <> 'draft' or mlf_is_owner())
    )
  );

-- ---- Enquiries: public may insert, only owners may read ----
create policy "anyone may lodge an enquiry"
  on mlf_enquiries for insert
  with check (true);

create policy "owners read enquiries"
  on mlf_enquiries for select
  using (mlf_is_owner());

create policy "owners manage enquiries"
  on mlf_enquiries for update
  using (mlf_is_owner())
  with check (mlf_is_owner());

create policy "owners delete enquiries"
  on mlf_enquiries for delete
  using (mlf_is_owner());

-- ---- Owner-only management of the catalogue ----
create policy "owners manage categories"
  on mlf_categories for all
  using (mlf_is_owner())
  with check (mlf_is_owner());

create policy "owners manage pieces"
  on mlf_pieces for all
  using (mlf_is_owner())
  with check (mlf_is_owner());

create policy "owners manage images"
  on mlf_piece_images for all
  using (mlf_is_owner())
  with check (mlf_is_owner());

create policy "owners manage provenance"
  on mlf_provenance for all
  using (mlf_is_owner())
  with check (mlf_is_owner());

-- ---- Owners table: owners may see the roster; bootstrapping the first owner
-- is done with the service role (which bypasses RLS) or straight SQL. ----
create policy "owners see the roster"
  on mlf_owners for select
  using (mlf_is_owner());

create policy "owners manage the roster"
  on mlf_owners for all
  using (mlf_is_owner())
  with check (mlf_is_owner());
