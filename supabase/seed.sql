-- Seed data, mirrored exactly by the content/ files. Every fact here is
-- a plausible placeholder awaiting the owner, so categories and pieces are
-- flagged placeholder = true and attribution is only ever a hedge. Safe to run
-- repeatedly: reruns refresh the seeded pieces and their children, while the
-- site-wide questions, collector words and settings seed on first run only and
-- reruns leave the owner's rows alone.

-- ---- Categories: the four collection categories ----
insert into modern_categories (slug, name, position, story, hint, facts, placeholder)
values
  (
    'chairs', 'Chairs', 1,
    'The heart of the collection and the best place to start. Chairs by the schools that decided what sitting should look like, from the Bauhaus cantilever to the space-age pod. Every one is one of one, checked, honestly photographed and ready to sit on.',
    'New chairs are listed most weeks',
    '[{"term":"In collection","detail":"Two dozen pieces, changing weekly"},{"term":"Periods","detail":"1925 to 1975"},{"term":"Schools","detail":"Bauhaus, Danish modern, space age"}]'::jsonb,
    true
  ),
  (
    'shelving-and-storage', 'Shelving and storage', 2,
    'Wall units, modular systems and room dividers, storage that hangs on the wall instead of standing on the floor. Each system is sold complete, with its measurements listed, and can be arranged to suit the wall it is going to.',
    'Systems are sold complete and hung for you on delivery',
    '[{"term":"In collection","detail":"Wall units, systems, room dividers"},{"term":"Periods","detail":"1950 to 1980"},{"term":"Materials","detail":"Teak, rosewood, ash, blackened steel"}]'::jsonb,
    true
  ),
  (
    'cabinets-and-sideboards', 'Cabinets and sideboards', 3,
    'Credenzas, cocktail cabinets and bureaus in rosewood, teak and lacquer. Casework carries the most surface of anything we sell, so every piece is photographed close and its condition described plainly.',
    'Interiors are photographed as carefully as the outside',
    '[{"term":"In collection","detail":"Credenzas, cocktail cabinets, bureaus"},{"term":"Periods","detail":"1930 to 1975"},{"term":"Materials","detail":"Rosewood, teak, lacquer, brass"}]'::jsonb,
    true
  ),
  (
    'tables', 'Tables', 4,
    'Dining, coffee and side tables from Denmark, Italy and Britain. Every table is solid, level and ready for daily use, with dimensions listed so you can check the fit before you enquire.',
    'Heights and clearances are listed on every table',
    '[{"term":"In collection","detail":"Dining, coffee, side and nesting"},{"term":"Periods","detail":"1930 to 1975"},{"term":"Origins","detail":"Denmark, Italy, Britain"}]'::jsonb,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  position = excluded.position,
  story = excluded.story,
  hint = excluded.hint,
  facts = excluded.facts,
  placeholder = excluded.placeholder;

-- ---- Pieces: six placeholders. Attribution stays a hedge until confirmed. ----
insert into modern_pieces (
  slug, category_id, title, attribution, period_label, year_from, year_to,
  origin, materials, status, price_on_request, story, restoration_notes, placeholder,
  featured, featured_position, provenance_verified, catalogue_number
)
values
  (
    'fibreglass-ball-chair',
    (select id from modern_categories where slug = 'chairs'),
    'Fibreglass ball chair',
    'Attributed, space age',
    'Space age', 1966, 1972,
    'Finland',
    array['fibreglass', 'wool', 'steel'],
    'available', true,
    'A hollow fibreglass shell on a turned steel pedestal, one of the defining chair shapes of the space age. It swivels through a full circle, seats one in real comfort, and quiets the room the moment you sit back. Refinished and reupholstered; solid and ready for daily use.',
    'Refinished shell, new upholstery over new foam, stand re-enamelled; solid and ready for daily use.',
    true,
    true, 1, true, 'MLF 001'
  ),
  (
    'cantilever-side-chair',
    (select id from modern_categories where slug = 'chairs'),
    'Cantilever side chair',
    'School of the Bauhaus',
    'Interwar modern', 1928, 1934,
    'Germany',
    array['tubular steel', 'cane'],
    'reserved', true,
    'Chromed tubular steel sprung into a single cantilever, the seat and back woven in cane. It is lighter than it looks, gives slightly as you sit, and works as well at a desk as at a dining table. Re-chromed and re-caned; ready for daily use.',
    'Frame re-chromed, seat and back re-caned, floor glides replaced.',
    true,
    false, null, false, 'MLF 002'
  ),
  (
    'teak-wall-unit',
    (select id from modern_categories where slug = 'shelving-and-storage'),
    'Teak wall unit',
    'School of Danish modern',
    'Danish modern', 1958, 1968,
    'Denmark',
    array['teak', 'brass'],
    'available', true,
    'A modular teak wall system, shelves, cabinets and a drop-front desk hung on a pair of uprights. It gives a full wall of storage without standing furniture on the floor, and it hangs to suit your wall rather than the one it came from. French polished, with one shelf replaced in matched teak.',
    'French polished, brass fittings cleaned and adjusted, one shelf replaced in matched teak.',
    true,
    true, 2, false, 'MLF 003'
  ),
  (
    'rosewood-sideboard',
    (select id from modern_categories where slug = 'cabinets-and-sideboards'),
    'Rosewood sideboard',
    'In the manner of Danish modern',
    'Danish modern', 1960, 1970,
    'Denmark',
    array['rosewood', 'oak', 'lacquer'],
    'sold', true,
    'A long credenza in book-matched rosewood, sliding doors over a clean oak interior. Two metres of storage on a shallow footprint, the sort of piece that anchors a dining room. Re-lacquered, with the doors running freely; solid and true.',
    'Re-lacquered, door runners re-cut, one foot rebuilt; solid and true.',
    true,
    false, null, true, 'MLF 004'
  ),
  (
    'sculptural-coffee-table',
    (select id from modern_categories where slug = 'tables'),
    'Sculptural coffee table',
    'Maker unconfirmed',
    'Mid-century', 1955, 1965,
    'Italy',
    array['walnut', 'glass'],
    'available', true,
    'A low table with a shaped walnut frame carrying a floating glass top, the sort of piece a seating area is arranged around. The walnut is shaped rather than machined and reads well from every side. Frame re-polished, one old repair stable; the glass is new, cut to the original template.',
    'Frame re-polished, one split in a leg glued and pinned, new glass cut to the original template.',
    true,
    true, 3, false, 'MLF 005'
  ),
  (
    'nesting-tables',
    (select id from modern_categories where slug = 'tables'),
    'Nesting tables',
    'School of Danish modern',
    'Danish modern', 1962, 1972,
    'Denmark',
    array['teak'],
    'restoration', true,
    'A graduated set of three in teak, each sliding under the last, three tables in the footprint of one. Being prepared for sale now; it will be listed with photographs and a full condition report when ready.',
    'Being prepared for sale: tops levelled, joints re-glued, finish to follow.',
    true,
    false, null, false, 'MLF 006'
  )
on conflict (slug) do update set
  category_id = excluded.category_id,
  title = excluded.title,
  attribution = excluded.attribution,
  period_label = excluded.period_label,
  year_from = excluded.year_from,
  year_to = excluded.year_to,
  origin = excluded.origin,
  materials = excluded.materials,
  status = excluded.status,
  story = excluded.story,
  restoration_notes = excluded.restoration_notes,
  placeholder = excluded.placeholder,
  featured = excluded.featured,
  featured_position = excluded.featured_position,
  provenance_verified = excluded.provenance_verified,
  catalogue_number = excluded.catalogue_number;

-- ---- Provenance rings for the ball chair, plain placeholder facts ----
delete from modern_provenance
where piece_id = (select id from modern_pieces where slug = 'fibreglass-ball-chair');

insert into modern_provenance (piece_id, position, label, detail)
values
  (
    (select id from modern_pieces where slug = 'fibreglass-ball-chair'),
    1, 'Acquired', 'From a private house in Northumberland, one careful owner'
  ),
  (
    (select id from modern_pieces where slug = 'fibreglass-ball-chair'),
    2, 'Prepared', 'Professionally refinished and reupholstered before sale'
  ),
  (
    (select id from modern_pieces where slug = 'fibreglass-ball-chair'),
    3, 'Ready', 'Available now, delivered nationwide'
  );

-- ---- Store layer: specification rows for all six pieces ----
-- Delete-then-insert scoped to the seeded slugs, so reruns refresh these
-- placeholders without touching pieces the owner adds later. Dimensions are
-- invented and await the tape measure.

delete from modern_piece_specs where piece_id in (
  select id from modern_pieces where slug in (
    'fibreglass-ball-chair', 'cantilever-side-chair', 'teak-wall-unit',
    'rosewood-sideboard', 'sculptural-coffee-table', 'nesting-tables'
  )
);

insert into modern_piece_specs (piece_id, position, grouping, term, detail)
select p.id, s.position, s.grouping, s.term, s.detail
from modern_pieces p
join (
  values
    ('fibreglass-ball-chair', 1, 'Dimensions', 'Width', '102 cm'),
    ('fibreglass-ball-chair', 2, 'Dimensions', 'Depth', '97 cm'),
    ('fibreglass-ball-chair', 3, 'Dimensions', 'Height', '121 cm'),
    ('fibreglass-ball-chair', 4, 'Materials', 'Shell', 'Fibreglass, refinished to an even satin'),
    ('fibreglass-ball-chair', 5, 'Materials', 'Stand', 'Turned steel, re-enamelled'),
    ('fibreglass-ball-chair', 6, 'Materials', 'Upholstery', 'Wool over new foam'),
    ('fibreglass-ball-chair', 7, 'Condition', 'Overall', 'Professionally refinished and reupholstered, ready for daily use'),
    ('cantilever-side-chair', 1, 'Dimensions', 'Width', '47 cm'),
    ('cantilever-side-chair', 2, 'Dimensions', 'Depth', '58 cm'),
    ('cantilever-side-chair', 3, 'Dimensions', 'Height', '82 cm'),
    ('cantilever-side-chair', 4, 'Materials', 'Frame', 'Tubular steel, re-chromed'),
    ('cantilever-side-chair', 5, 'Materials', 'Seat and back', 'Cane, rewoven by hand'),
    ('cantilever-side-chair', 6, 'Condition', 'Overall', 'Re-chromed and re-caned, the spring in the cantilever intact'),
    ('teak-wall-unit', 1, 'Dimensions', 'Width', '240 cm'),
    ('teak-wall-unit', 2, 'Dimensions', 'Depth', '40 cm'),
    ('teak-wall-unit', 3, 'Dimensions', 'Height', '190 cm'),
    ('teak-wall-unit', 4, 'Materials', 'Carcass', 'Teak, French polished'),
    ('teak-wall-unit', 5, 'Materials', 'Fittings', 'Brass, cleaned and adjusted'),
    ('teak-wall-unit', 6, 'Condition', 'Overall', 'French polished, one shelf replaced in matched teak'),
    ('rosewood-sideboard', 1, 'Dimensions', 'Width', '200 cm'),
    ('rosewood-sideboard', 2, 'Dimensions', 'Depth', '45 cm'),
    ('rosewood-sideboard', 3, 'Dimensions', 'Height', '78 cm'),
    ('rosewood-sideboard', 4, 'Materials', 'Carcass', 'Book-matched rosewood'),
    ('rosewood-sideboard', 5, 'Materials', 'Interior', 'Oak, cleaned and waxed'),
    ('rosewood-sideboard', 6, 'Condition', 'Overall', 'Re-lacquered, doors running freely, carcass sound'),
    ('sculptural-coffee-table', 1, 'Dimensions', 'Width', '130 cm'),
    ('sculptural-coffee-table', 2, 'Dimensions', 'Depth', '70 cm'),
    ('sculptural-coffee-table', 3, 'Dimensions', 'Height', '38 cm'),
    ('sculptural-coffee-table', 4, 'Materials', 'Frame', 'Walnut, re-polished'),
    ('sculptural-coffee-table', 5, 'Materials', 'Top', 'New glass, cut to the original template'),
    ('sculptural-coffee-table', 6, 'Condition', 'Overall', 'Re-polished, one old split repaired, pinned and stable'),
    ('nesting-tables', 1, 'Dimensions', 'Width', '56 cm, the largest of the three'),
    ('nesting-tables', 2, 'Dimensions', 'Depth', '38 cm'),
    ('nesting-tables', 3, 'Dimensions', 'Height', '52 cm'),
    ('nesting-tables', 4, 'Materials', 'Throughout', 'Teak'),
    ('nesting-tables', 5, 'Condition', 'Overall', 'Being prepared for sale, tops being levelled')
) as s (slug, position, grouping, term, detail)
  on s.slug = p.slug;

-- ---- What comes with the piece: the same four items for every piece ----
delete from modern_piece_included where piece_id in (
  select id from modern_pieces where slug in (
    'fibreglass-ball-chair', 'cantilever-side-chair', 'teak-wall-unit',
    'rosewood-sideboard', 'sculptural-coffee-table', 'nesting-tables'
  )
);

insert into modern_piece_included (piece_id, position, label, note)
select p.id, i.position, i.label, i.note
from modern_pieces p
cross join (
  values
    (1, 'The provenance file', 'What is known of the piece''s history, written down and passed on with it.'),
    (2, 'A condition report', 'The piece photographed and described plainly, including anything repaired or replaced.'),
    (3, 'Care notes', 'One page on keeping the piece well, written for its own materials.'),
    (4, 'Delivery', 'Blanket wrapped, carried in and placed in the room you choose.')
) as i (position, label, note)
where p.slug in (
  'fibreglass-ball-chair', 'cantilever-side-chair', 'teak-wall-unit',
  'rosewood-sideboard', 'sculptural-coffee-table', 'nesting-tables'
);

-- ---- Story bands for the three featured pieces ----
-- image_path stays empty; the page fills the media panel with the category's
-- generative visual until photography arrives.
delete from modern_piece_features where piece_id in (
  select id from modern_pieces where slug in (
    'fibreglass-ball-chair', 'teak-wall-unit', 'sculptural-coffee-table'
  )
);

insert into modern_piece_features (piece_id, position, eyebrow, title, body, image_path, image_alt, layout)
select p.id, f.position, f.eyebrow, f.title, f.body, '', '', f.layout
from modern_pieces p
join (
  values
    (
      'fibreglass-ball-chair', 1, 'The shell', 'A quiet *room* of its own',
      'The shell is a single fibreglass moulding with no cracks and no repairs, refinished to an even satin. Turn the opening away from the door and the noise of the house stays outside.',
      'right'
    ),
    (
      'fibreglass-ball-chair', 2, 'The upholstery', 'New wool in the *original* colour',
      'The interior has been reupholstered in a warm wool matched to the original colour, over new foam. Clean, firm and made to be sat in every day, not saved for best.',
      'left'
    ),
    (
      'fibreglass-ball-chair', 3, 'The stand', 'Steady on its *base*',
      'The turned steel stem has been re-enamelled and the base rebalanced. The chair swivels through a full circle, settles where you leave it, and does not drift or squeak.',
      'right'
    ),
    (
      'teak-wall-unit', 1, 'The system', 'Five parts, one *wall*',
      'Two uprights carry everything. Shelves and cabinets hang where you decide, so the unit fits the wall you have rather than the wall it came from. It packs into five parts for delivery and we hang it for you.',
      'right'
    ),
    (
      'teak-wall-unit', 2, 'The desk', 'A desk that *closes* flush',
      'The drop front folds flat to write on and shuts flush when you are done. The brass stays have been cleaned and adjusted, so the fall is smooth and steady in the hand.',
      'left'
    ),
    (
      'teak-wall-unit', 3, 'The timber', 'Matched *teak* throughout',
      'One shelf has been replaced in teak matched for age and figure; you will need to look for it to find it. The rest of the timber is original, French polished to an even sheen.',
      'right'
    ),
    (
      'sculptural-coffee-table', 1, 'The frame', 'Walnut shaped by *hand*',
      'The frame curves in ways a machine would not bother with, and after re-polishing the grain reads clearly along every edge. An old split in one leg has been glued and pinned; it is stable and does not move.',
      'right'
    ),
    (
      'sculptural-coffee-table', 2, 'The top', 'Glass cut to the original *template*',
      'The original glass did not survive, so the top is new, cut to the maker''s template and sitting exactly where the first one sat. A further replacement could be cut from the same template if ever needed.',
      'left'
    )
) as f (slug, position, eyebrow, title, body, layout)
  on f.slug = p.slug;

-- ---- Questions: one per featured piece, then the six site-wide ones ----
delete from modern_faqs where piece_id in (
  select id from modern_pieces where slug in (
    'fibreglass-ball-chair', 'teak-wall-unit', 'sculptural-coffee-table'
  )
);

insert into modern_faqs (piece_id, position, question, answer, published)
select p.id, q.position, q.question, q.answer, true
from modern_pieces p
join (
  values
    (
      'fibreglass-ball-chair', 1, 'Will it fit through a standard door',
      'Usually. The shell lifts off its pedestal for the journey, and we confirm your doorway and stair measurements before delivery is booked.'
    ),
    (
      'teak-wall-unit', 1, 'Can the unit be arranged differently',
      'Yes. The shelves, cabinets and desk hang wherever the uprights allow, so the unit can be set out to suit your wall. We hang it for you on delivery.'
    ),
    (
      'sculptural-coffee-table', 1, 'Is the glass original',
      'No. The glass is new, cut to the shape the maker drew. The frame, which is the point of the piece, is original throughout.'
    )
) as q (slug, position, question, answer)
  on q.slug = p.slug;

-- Site-wide questions seed only on first run: once any site-wide row exists,
-- the owner's set is theirs and reruns leave it alone.
insert into modern_faqs (piece_id, position, question, answer, published)
select null, q.position, q.question, q.answer, true
from (
  values
    (
      1, 'How does buying work',
      'Every piece is one of one, so there is no basket. Send an enquiry and we will reply the same day where we can, usually with more photographs and the condition report. When you are ready, payment is by bank transfer and we arrange delivery.'
    ),
    (
      2, 'Can you hold a piece',
      'Yes, for forty eight hours while you measure the room. Beyond that we take a small refundable deposit and mark the piece reserved until you decide.'
    ),
    (
      3, 'How is delivery arranged',
      'Nationwide by specialist furniture courier, blanket wrapped, carried in and placed in the room you choose. Within North East England we deliver ourselves, usually inside the week.'
    ),
    (
      4, 'Can we see a piece first',
      'Yes. Viewings are by appointment in North East England, most days including weekends. Bring the room''s measurements.'
    ),
    (
      5, 'What condition are the pieces in',
      'Ready for daily use unless the listing says otherwise. Every piece is checked before it is listed, photographed honestly with any wear shown, and sold with a written condition report. Anything repaired or replaced is stated plainly on the piece''s page.'
    ),
    (
      6, 'Do you buy furniture',
      'We do. If you have a piece by one of the designers of the last century, or think you might, send photographs through the selling page and we will come back with a view and, where it suits the collection, an offer.'
    )
) as q (position, question, answer)
where not exists (select 1 from modern_faqs where piece_id is null);

-- ---- Collector words, site-wide, staff-curated placeholders ----
-- Seeded only on first run, the same bargain as the questions above: reruns
-- leave the owner's rows alone.
insert into modern_testimonials (piece_id, position, quote, name, context, published)
select null, w.position, w.quote, w.name, w.context, true
from (
  values
    (
      1,
      'The chair arrived exactly as described, and better than the photographs, which were the reason I rang. The paperwork that came with it answered every question I had.',
      'A collector', 'Ball chair, delivered to Edinburgh'
    ),
    (
      2,
      'They talked me out of the piece I wanted and into the piece the room needed. Right on both counts.',
      'A first time buyer', 'Sideboard, County Durham'
    ),
    (
      3,
      'Solid, clean and honestly described. The condition report matched the piece down to the small marks it listed.',
      'A returning collector', 'Nesting tables, York'
    )
) as w (position, quote, name, context)
where not exists (select 1 from modern_testimonials where piece_id is null);

-- ---- Settings: the store prose, mirrored by content/store.ts ----
-- First run writes the row; once it exists it is the owner's copy, so
-- reruns never overwrite it.
insert into modern_settings (key, value)
values (
  'store',
  jsonb_build_object(
    'announcement', 'Viewings by appointment in North East England, delivery nationwide',
    'deliveryProse', 'We deliver nationwide with a specialist furniture courier, blanket wrapped, carried in and placed in the room you choose. Within North East England we deliver ourselves, usually inside the week, and collection is welcome by arrangement.',
    'returnsProse', 'If a piece arrives and does not suit the room, tell us within fourteen days. We will arrange collection and refund what you paid. All we ask is that the piece comes back in the condition it arrived.',
    'careProse', 'Vintage furniture is straightforward to live with. Keep pieces out of direct sun and away from radiators, wipe with a barely damp cloth, and wax timber once a year. Every piece comes with care notes written for its own materials.',
    'viewingProse', 'The collection is kept in North East England and viewings are by appointment, most days including weekends. Bring the room''s measurements and take your time with the piece.',
    'newsletterLead', 'New pieces are offered to the list before they reach the website. One note a month at most, and only when there is something worth showing you.'
  )
)
on conflict (key) do nothing;
