-- Seed data. Copy verbatim from CONTENT.md and concept-v5. Every fact here is
-- a plausible placeholder awaiting the owner, so categories and pieces are
-- flagged placeholder = true and attribution is only ever a hedge. Idempotent:
-- safe to run repeatedly.

-- ---- Categories: the five gallery rooms ----
insert into modern_categories (slug, name, position, story, hint, facts, placeholder)
values
  (
    'chairs', 'Chairs', 1,
    'The heart of the collection. From the space-age pod to the Bauhaus cantilever, chairs by the schools and workshops that decided what sitting should look like. Every one restored, documented and ready for its next forty years.',
    'The piece turns to face you as you pass',
    '[{"term":"In collection","detail":"Two dozen pieces, changing weekly"},{"term":"Periods","detail":"1925 to 1975"},{"term":"Schools","detail":"Bauhaus, Danish modern, space age"}]'::jsonb,
    true
  ),
  (
    'shelving-and-storage', 'Shelving and storage', 2,
    'Wall units, modular systems and room dividers, the furniture that was built to grow with a household. The collection branches the same way, one arrival deciding the next. Shown here as it grows.',
    'The collection grows as you arrive',
    '[{"term":"In collection","detail":"Wall units, systems, room dividers"},{"term":"Periods","detail":"1950 to 1980"},{"term":"Materials","detail":"Teak, rosewood, ash, blackened steel"}]'::jsonb,
    true
  ),
  (
    'cabinets-and-sideboards', 'Cabinets and sideboards', 3,
    'Credenzas, cocktail cabinets and bureaus, casework built in layers of veneer, lacquer and shellac. Decades settle into a finish the way sediment settles into stone, and the light bends around your hand the same way.',
    'Move across the surface and the layers refract',
    '[{"term":"In collection","detail":"Credenzas, cocktail cabinets, bureaus"},{"term":"Periods","detail":"1930 to 1975"},{"term":"Materials","detail":"Rosewood, teak, lacquer, brass"}]'::jsonb,
    true
  ),
  (
    'tables', 'Tables', 4,
    'Dining, coffee and side tables, the surfaces a household gathers around. Every top keeps its rings, of grain and of ownership, and each piece leaves us with both written down.',
    'Touch the surface to add a ring of your own',
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
    'A hollow fibreglass shell on a turned steel pedestal, the interior reupholstered in a warm wool the colour of the original. It swivels quietly and keeps the room out until you want it back.',
    'Shell refinished, upholstery replaced, foam renewed, stem re-enamelled, base rebalanced.',
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
    'Chromed tubular steel sprung into a single cantilever, the seat and back re-caned by hand. Lighter than it looks, and it gives a little as you sit.',
    'Re-chromed, re-caned, feet replaced.',
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
    'A modular wall system that grew with the household that owned it, shelves and a drop-front desk hung on a pair of uprights. It comes to us in five parts and leaves in five parts.',
    'French polished, brass fittings cleaned, one shelf replaced in matched teak.',
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
    'A long credenza in book-matched rosewood, sliding doors over an oak interior. The lacquer had gone to craze and colour; we took it back to the wood and built the finish up again.',
    'Stripped, re-lacquered, runners re-cut, one foot rebuilt.',
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
    'A low table with a shaped walnut frame and a floating glass top, the sort of piece a room is arranged around. It keeps the rings of every glass ever set down on it, which is rather the point.',
    'Frame re-polished, a split in one leg glued and pinned, new glass cut to the original template.',
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
    'A graduated set of three, each sliding under the last, teak throughout. On the bench now, back on the site when the tops are level and the finish is even.',
    'In progress: tops flattened, joints re-glued, finish to follow.',
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

-- ---- Provenance rings for the ball chair, the dry-humour placeholder ----
delete from modern_provenance
where piece_id = (select id from modern_pieces where slug = 'fibreglass-ball-chair');

insert into modern_provenance (piece_id, position, label, detail)
values
  (
    (select id from modern_pieces where slug = 'fibreglass-ball-chair'),
    1, 'Found', 'A Copenhagen apartment, a Northumberland farmhouse, and a very patient dog'
  ),
  (
    (select id from modern_pieces where slug = 'fibreglass-ball-chair'),
    2, 'Restored', 'On our bench, over five weeks'
  ),
  (
    (select id from modern_pieces where slug = 'fibreglass-ball-chair'),
    3, 'Rehomed', 'Awaiting its next forty years'
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
    ('fibreglass-ball-chair', 7, 'Condition', 'Overall', 'Restored on our bench, fit for daily use'),
    ('cantilever-side-chair', 1, 'Dimensions', 'Width', '47 cm'),
    ('cantilever-side-chair', 2, 'Dimensions', 'Depth', '58 cm'),
    ('cantilever-side-chair', 3, 'Dimensions', 'Height', '82 cm'),
    ('cantilever-side-chair', 4, 'Materials', 'Frame', 'Tubular steel, re-chromed'),
    ('cantilever-side-chair', 5, 'Materials', 'Seat and back', 'Cane, rewoven by hand'),
    ('cantilever-side-chair', 6, 'Condition', 'Overall', 'Restored, the spring in the cantilever intact'),
    ('teak-wall-unit', 1, 'Dimensions', 'Width', '240 cm'),
    ('teak-wall-unit', 2, 'Dimensions', 'Depth', '40 cm'),
    ('teak-wall-unit', 3, 'Dimensions', 'Height', '190 cm'),
    ('teak-wall-unit', 4, 'Materials', 'Carcass', 'Teak, French polished'),
    ('teak-wall-unit', 5, 'Materials', 'Fittings', 'Brass, cleaned and adjusted'),
    ('teak-wall-unit', 6, 'Condition', 'Overall', 'Restored, one shelf replaced in matched teak'),
    ('rosewood-sideboard', 1, 'Dimensions', 'Width', '200 cm'),
    ('rosewood-sideboard', 2, 'Dimensions', 'Depth', '45 cm'),
    ('rosewood-sideboard', 3, 'Dimensions', 'Height', '78 cm'),
    ('rosewood-sideboard', 4, 'Materials', 'Carcass', 'Book-matched rosewood'),
    ('rosewood-sideboard', 5, 'Materials', 'Interior', 'Oak, cleaned and waxed'),
    ('rosewood-sideboard', 6, 'Condition', 'Overall', 'Restored, the finish rebuilt from the wood up'),
    ('sculptural-coffee-table', 1, 'Dimensions', 'Width', '130 cm'),
    ('sculptural-coffee-table', 2, 'Dimensions', 'Depth', '70 cm'),
    ('sculptural-coffee-table', 3, 'Dimensions', 'Height', '38 cm'),
    ('sculptural-coffee-table', 4, 'Materials', 'Frame', 'Walnut, re-polished'),
    ('sculptural-coffee-table', 5, 'Materials', 'Top', 'New glass, cut to the original template'),
    ('sculptural-coffee-table', 6, 'Condition', 'Overall', 'Restored, one repaired split, pinned and stable'),
    ('nesting-tables', 1, 'Dimensions', 'Width', '56 cm, the largest of the three'),
    ('nesting-tables', 2, 'Dimensions', 'Depth', '38 cm'),
    ('nesting-tables', 3, 'Dimensions', 'Height', '52 cm'),
    ('nesting-tables', 4, 'Materials', 'Throughout', 'Teak'),
    ('nesting-tables', 5, 'Condition', 'Overall', 'On the bench, tops being levelled')
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
    (1, 'The provenance file', 'Everything we know about the piece''s life so far, written down and passed on with it.'),
    (2, 'A condition report', 'Photographed and noted before and after restoration, so you know exactly what was done.'),
    (3, 'Care notes', 'How to keep the finish well, one page, written for the piece''s own materials.'),
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
      'fibreglass-ball-chair', 1, 'The shell', 'A room *inside* the room',
      'Turn the opening away from the door and the household drops to a murmur. The shell is a single fibreglass moulding, taken back and refinished by hand to an even satin, and it swivels through a full circle without complaint.',
      'right'
    ),
    (
      'fibreglass-ball-chair', 2, 'The upholstery', 'Wool the colour of the *original*',
      'The interior was reupholstered on our bench in a warm wool matched to what survived of the first cloth. New foam underneath, old colour on top, which is the order we prefer.',
      'left'
    ),
    (
      'fibreglass-ball-chair', 3, 'The stand', 'Balanced to a *stop*',
      'The turned steel stem was re-enamelled and the base rebalanced, so the chair settles where you leave it. There is no drift and no squeak, and we checked for both.',
      'right'
    ),
    (
      'teak-wall-unit', 1, 'The system', 'Five parts, one *wall*',
      'Two uprights carry everything. Shelves and cabinets hang where you decide, which means the unit fits the wall you have rather than the wall it left. It comes to us in five parts and leaves in five parts.',
      'right'
    ),
    (
      'teak-wall-unit', 2, 'The desk', 'A desk that *closes* behind you',
      'The drop front folds flat to write on and shuts flush when the day is done. The brass stays were cleaned and adjusted so the fall is steady in the hand.',
      'left'
    ),
    (
      'teak-wall-unit', 3, 'The timber', 'Matched *teak*, old and new',
      'One shelf had gone beyond saving, so we cut its replacement from teak of the same age and figure. Finding it took longer than fitting it, which is as it should be.',
      'right'
    ),
    (
      'sculptural-coffee-table', 1, 'The frame', 'Walnut shaped by *eye*',
      'The frame curves in ways a machine would not bother with, shaped and re-polished until the grain reads clearly along every edge. A split in one leg was glued and pinned, and it will not move again.',
      'right'
    ),
    (
      'sculptural-coffee-table', 2, 'The top', 'Glass cut to the first *template*',
      'The original top was beyond saving, so new glass was cut to the maker''s template and floats where the old top floated. Set a glass down on it and start a record of your own rings.',
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
      'Usually, and we have moved this one more than once. The shell lifts off its pedestal for the journey and we measure your doorways before we set out.'
    ),
    (
      'teak-wall-unit', 1, 'Can the unit be arranged differently',
      'Yes. The shelves and the desk hang wherever the uprights allow, so the unit can be set out to suit the wall it lands on. We hang it for you on delivery.'
    ),
    (
      'sculptural-coffee-table', 1, 'Is the glass original',
      'The template is; the glass is new, cut to the shape the maker drew. The original top arrived cracked and travelled no further than our workshop.'
    )
) as q (slug, position, question, answer)
  on q.slug = p.slug;

-- Site-wide questions are placeholders too; reruns replace them wholesale,
-- the same bargain as the categories above.
delete from modern_faqs where piece_id is null;

insert into modern_faqs (piece_id, position, question, answer, published)
values
  (
    null, 1, 'How does buying work',
    'Every piece is one of one, so there is no basket. Send an enquiry or register interest and we will reply the same day where we can, usually with more photographs. When you are ready, we take payment by bank transfer and arrange delivery.',
    true
  ),
  (
    null, 2, 'Can you hold a piece',
    'We will hold a piece for forty eight hours while you measure the room. Beyond that we take a small refundable deposit and mark the piece reserved until you decide.',
    true
  ),
  (
    null, 3, 'How is delivery arranged',
    'Nationwide by specialist furniture courier, blanket wrapped and placed in the room you choose. Within North East England we deliver ourselves, usually inside the week.',
    true
  ),
  (
    null, 4, 'Can we see a piece first',
    'Yes, viewings are by appointment at the workshop, most days including weekends. Bring the room''s measurements.',
    true
  ),
  (
    null, 5, 'What does restored mean here',
    'Honest and reversible where possible. We keep original surfaces when they can be kept, replace like with like when they cannot, and write down everything we do. The work is listed on each piece''s page.',
    true
  ),
  (
    null, 6, 'Do you buy furniture',
    'We do. If you have a piece by the furniture artists of the last century, send photographs through the selling page and we will come back with a view and, if it suits the collection, an offer.',
    true
  );

-- ---- Collector words, site-wide, staff-curated placeholders ----
delete from modern_testimonials where piece_id is null;

insert into modern_testimonials (piece_id, position, quote, name, context, published)
values
  (
    null, 1,
    'The chair arrived better than the photographs, and the photographs were the reason I rang. The file that came with it reads like a biography.',
    'A collector', 'Ball chair, rehomed to Edinburgh', true
  ),
  (
    null, 2,
    'They talked me out of the piece I wanted and into the piece the room needed. Right on both counts.',
    'A first time buyer', 'Sideboard, County Durham', true
  ),
  (
    null, 3,
    'You can feel the bench work in it. Nothing wobbles, nothing shines that should not.',
    'A returning collector', 'Nesting tables, York', true
  );

-- ---- Settings: the store prose, mirrored by content/store.ts ----
insert into modern_settings (key, value)
values (
  'store',
  jsonb_build_object(
    'announcement', 'Viewings by appointment in North East England, delivery nationwide',
    'deliveryProse', 'We deliver nationwide with a specialist furniture courier, blanket wrapped and placed in the room you choose. Within North East England we bring pieces ourselves, usually inside the week, and collection from the workshop is always welcome.',
    'returnsProse', 'If a piece arrives and does not sit right in the room, tell us within fourteen days. We will collect it and return what you paid. We would rather have a chair back than a collector unsure.',
    'careProse', 'Old timber likes a steady room. Keep pieces out of direct sun and away from radiators, wipe with a barely damp cloth, and feed the finish once a year with a hard wax. Every piece leaves us with care notes written for its own materials.',
    'viewingProse', 'The collection is kept at our workshop in North East England. Viewings are by appointment, most days including weekends. Bring the room''s measurements and we will put the kettle on.',
    'newsletterLead', 'New pieces are offered to the list before they reach the website. One note a month at most, and only when something worth writing about comes off the bench.'
  )
)
on conflict (key) do update set value = excluded.value;
