-- Seed data, mirrored exactly by the content/ files. Every fact here is
-- a plausible placeholder awaiting the owner, so categories and pieces are
-- flagged placeholder = true and attribution is only ever a hedge. Safe to run
-- repeatedly: reruns refresh the seeded pieces and their children, while the
-- site-wide questions, collector words and settings seed on first run only and
-- reruns leave the owner's rows alone.

-- ---- Categories: the four chair eras ----
insert into modern_categories (slug, name, position, story, hint, facts, placeholder)
values
  (
    'bauhaus-and-modernist', 'Bauhaus and modernist', 1,
    'Tubular steel, cantilevers and the machine age, the chairs that decided what modern sitting would look like. Most are lighter than they appear and give slightly as you sit, which is the point of the cantilever. Every one is checked, honestly photographed and ready for daily use.',
    'The earliest chairs we sell, and usually the lightest',
    '[{"term":"Periods","detail":"1925 to 1945"},{"term":"Materials","detail":"Tubular steel, cane, leather, bent plywood"},{"term":"What to expect","detail":"Cantilevers, chrome frames, woven seats"}]'::jsonb,
    true
  ),
  (
    'danish-modern', 'Danish modern', 2,
    'Sculpted teak and rosewood, upholstery in wool, joinery you will not find under later furniture. These chairs are shaped to the body and finished on every side, so they sit as well in the middle of a room as against a wall. The easiest era to live with, and the most collected.',
    'The quickest era to sell; the list hears about new pieces first',
    '[{"term":"Periods","detail":"1945 to 1970"},{"term":"Materials","detail":"Teak, rosewood, oak, cord and wool"},{"term":"What to expect","detail":"Sculpted frames, wool upholstery, fine joinery"}]'::jsonb,
    true
  ),
  (
    'space-age', 'Space age', 3,
    'Fibreglass, plastics and pod forms from the years when the future felt close. These are the boldest shapes we sell; a single piece will change the character of a room. Each one is checked, honestly photographed and ready for daily use.',
    'Most shells lift off their bases for delivery',
    '[{"term":"Periods","detail":"1960 to 1975"},{"term":"Materials","detail":"Fibreglass, moulded plastic, steel, wool"},{"term":"What to expect","detail":"Pods, pedestals and chairs that swivel"}]'::jsonb,
    true
  ),
  (
    'italian-and-sculptural', 'Italian and sculptural', 4,
    'Expressive frames and confident shapes, chairs made by workshops that treated seating as sculpture. Walnut carved rather than machined, upholstery cut close to the frame, silhouettes that hold a room on their own. Made to be looked at, and sat in daily.',
    'Best placed where they can be seen in the round',
    '[{"term":"Periods","detail":"1950 to 1975"},{"term":"Materials","detail":"Walnut, lacquer, brass, velvet and wool"},{"term":"What to expect","detail":"Carved frames, close upholstery, no bad angle"}]'::jsonb,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  position = excluded.position,
  story = excluded.story,
  hint = excluded.hint,
  facts = excluded.facts,
  placeholder = excluded.placeholder;

-- ---- Pieces: four placeholder chairs, one per era. Attribution stays a
-- hedge until confirmed. ----
insert into modern_pieces (
  slug, category_id, title, attribution, period_label, year_from, year_to,
  origin, materials, status, price_on_request, price_pence, story,
  restoration_notes, placeholder,
  featured, featured_position, provenance_verified, catalogue_number
)
values
  (
    'fibreglass-ball-chair',
    (select id from modern_categories where slug = 'space-age'),
    'Fibreglass ball chair',
    'Attributed, space age',
    'Space age', 1966, 1972,
    'Finland',
    array['fibreglass', 'wool', 'steel'],
    'available', true, null,
    'A hollow fibreglass shell on a turned steel pedestal, one of the defining chair shapes of the space age. It swivels through a full circle, seats one in real comfort, and quiets the room the moment you sit back. Refinished and reupholstered; solid and ready for daily use.',
    'Refinished shell, new upholstery over new foam, stand re-enamelled; solid and ready for daily use.',
    true,
    true, 1, true, 'MLF 001'
  ),
  (
    'cantilever-side-chair',
    (select id from modern_categories where slug = 'bauhaus-and-modernist'),
    'Cantilever side chair',
    'School of the Bauhaus',
    'Interwar modern', 1928, 1934,
    'Germany',
    array['tubular steel', 'cane'],
    'reserved', true, null,
    'Chromed tubular steel sprung into a single cantilever, the seat and back woven in cane. It is lighter than it looks, gives slightly as you sit, and works as well at a desk as at a dining table. Re-chromed and re-caned; ready for daily use.',
    'Frame re-chromed, seat and back re-caned, floor glides replaced.',
    true,
    false, null, false, 'MLF 002'
  ),
  (
    'sculpted-teak-armchair',
    (select id from modern_categories where slug = 'danish-modern'),
    'Sculpted teak armchair',
    'Attributed to a Danish workshop',
    'Danish modern', 1955, 1965,
    'Denmark',
    array['teak', 'wool'],
    'available', false, 145000,
    'An armchair in sculpted teak, the frame shaped to the body and finished on every side. The seat and back are upholstered in wool over new foam, and the arms fall exactly where your hands do. Cleaned and re-oiled; solid and ready for daily use.',
    'Frame cleaned and re-oiled, seat and back reupholstered in wool over new foam, joints checked and sound.',
    true,
    true, 2, false, 'MLF 008'
  ),
  (
    'sculptural-walnut-armchair',
    (select id from modern_categories where slug = 'italian-and-sculptural'),
    'Sculptural walnut armchair',
    'Maker unconfirmed',
    'Mid-century', 1958, 1968,
    'Italy',
    array['walnut', 'velvet'],
    'available', true, null,
    'An armchair with a carved walnut frame that reads well from every side, the sort of chair that holds a corner of a room on its own. The walnut is shaped rather than machined, and the seat is upholstered close to the line of the frame. Re-polished and reupholstered; solid and ready for daily use.',
    'Frame re-polished, seat reupholstered in velvet over new foam, joints checked and sound.',
    true,
    true, 3, false, 'MLF 009'
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
  price_on_request = excluded.price_on_request,
  price_pence = excluded.price_pence,
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

-- ---- Store layer: specification rows for all four pieces ----
-- Delete-then-insert scoped to the seeded slugs, so reruns refresh these
-- placeholders without touching pieces the owner adds later. Dimensions are
-- invented and await the tape measure.

delete from modern_piece_specs where piece_id in (
  select id from modern_pieces where slug in (
    'fibreglass-ball-chair', 'cantilever-side-chair',
    'sculpted-teak-armchair', 'sculptural-walnut-armchair'
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
    ('sculpted-teak-armchair', 1, 'Dimensions', 'Width', '68 cm'),
    ('sculpted-teak-armchair', 2, 'Dimensions', 'Depth', '74 cm'),
    ('sculpted-teak-armchair', 3, 'Dimensions', 'Height', '79 cm'),
    ('sculpted-teak-armchair', 4, 'Materials', 'Frame', 'Teak, cleaned and re-oiled'),
    ('sculpted-teak-armchair', 5, 'Materials', 'Upholstery', 'Wool over new foam'),
    ('sculpted-teak-armchair', 6, 'Condition', 'Overall', 'Re-oiled and reupholstered, joints sound, ready for daily use'),
    ('sculptural-walnut-armchair', 1, 'Dimensions', 'Width', '72 cm'),
    ('sculptural-walnut-armchair', 2, 'Dimensions', 'Depth', '70 cm'),
    ('sculptural-walnut-armchair', 3, 'Dimensions', 'Height', '81 cm'),
    ('sculptural-walnut-armchair', 4, 'Materials', 'Frame', 'Walnut, re-polished'),
    ('sculptural-walnut-armchair', 5, 'Materials', 'Upholstery', 'Velvet over new foam'),
    ('sculptural-walnut-armchair', 6, 'Condition', 'Overall', 'Re-polished and reupholstered, joints sound, ready for daily use')
) as s (slug, position, grouping, term, detail)
  on s.slug = p.slug;

-- ---- What comes with the piece: the same four items for every piece ----
delete from modern_piece_included where piece_id in (
  select id from modern_pieces where slug in (
    'fibreglass-ball-chair', 'cantilever-side-chair',
    'sculpted-teak-armchair', 'sculptural-walnut-armchair'
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
  'fibreglass-ball-chair', 'cantilever-side-chair',
  'sculpted-teak-armchair', 'sculptural-walnut-armchair'
);

-- ---- Story bands for the three featured pieces ----
-- image_path stays empty; the page fills the media panel with the category's
-- generative visual until photography arrives.
delete from modern_piece_features where piece_id in (
  select id from modern_pieces where slug in (
    'fibreglass-ball-chair', 'sculpted-teak-armchair', 'sculptural-walnut-armchair'
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
      'sculpted-teak-armchair', 1, 'The frame', 'Teak shaped to the *body*',
      'The frame is cut and shaped rather than bent, with the grain following each curve. Re-oiled to a soft sheen and finished on every side, it sits as well in the middle of a room as against a wall.',
      'right'
    ),
    (
      'sculptural-walnut-armchair', 1, 'The frame', 'Walnut carved to be *seen*',
      'The frame is carved rather than machined, and the re-polished walnut carries the light along every curve. There is no back of the chair; it is finished to be looked at from all sides.',
      'right'
    )
) as f (slug, position, eyebrow, title, body, layout)
  on f.slug = p.slug;

-- ---- Questions: one per featured piece, then the six site-wide ones ----
delete from modern_faqs where piece_id in (
  select id from modern_pieces where slug in (
    'fibreglass-ball-chair', 'sculpted-teak-armchair', 'sculptural-walnut-armchair'
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
      'sculpted-teak-armchair', 1, 'How should the teak be cared for',
      'Lightly. Keep it out of direct sun, wipe with a barely damp cloth and oil once a year. Care notes written for the chair''s own materials come with it.'
    ),
    (
      'sculptural-walnut-armchair', 1, 'Is the upholstery original',
      'No. The seat has been reupholstered in velvet over new foam, cut close to the original line. The frame, which is the point of the chair, is original throughout.'
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
      'A first time buyer', 'Cantilever chair, County Durham'
    ),
    (
      3,
      'Solid, clean and honestly described. The condition report matched the piece down to the small marks it listed.',
      'A returning collector', 'Teak armchair, York'
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
