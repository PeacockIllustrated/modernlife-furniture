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
  ),
  (
    'restoration', 'Restoration', 5,
    'Every piece comes apart before it comes back. We strip a chair to its parts, shell, upholstery, foam and frame, put right what the decades took, and reassemble it with nothing hidden. The drawing below is how we think.',
    'Move to the edge of the panel to take the piece apart',
    '[{"term":"Services","detail":"French polishing, re-caning, reupholstery, re-chroming"},{"term":"Turnaround","detail":"From three weeks"},{"term":"Collection","detail":"North East England, courier nationwide"}]'::jsonb,
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
  featured, featured_position, provenance_verified
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
    true, 1, true
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
    false, null, false
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
    true, 2, false
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
    false, null, true
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
    true, 3, false
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
    false, null, false
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
  provenance_verified = excluded.provenance_verified;

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
