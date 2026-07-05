# ARCHITECTURE.md — Modern Life Furniture

## Routes (App Router)
```
/                                  landing (the five-room gallery, from concept-v5)
/collection                        all categories index
/collection/chairs                 category page
/collection/shelving-and-storage   category page
/collection/cabinets-and-sideboards category page
/collection/tables                 category page
/piece/[slug]                      individual piece (specimen page)
/restoration                       restoration service page
/sell                              "we buy" page
/enquire                           contact (also mailto fallbacks everywhere)
/admin                             owner dashboard (Supabase Auth, magic link)
```
Category slugs are fixed and match the landing CTAs already present in the concept. Do not rename them.

## Component map
```
components/
  canvas/
    useCanvasScene.ts     shared lifecycle: DPR-capped sizing, resize, IO pause,
                          pointer mapping, reduced-motion single-frame render
    Tide.tsx              hero field
    BallChair.tsx         assembled instance, scroll-bound build + swivel
    ExplodedBall.tsx      conservator's drawing, shares lib/drawBall.ts
    Grove.tsx             branching shelving
    Strata.tsx            refracting cabinet
    ProvenanceRings.tsx   tables rings, click-to-ripple
  lib/drawBall.ts         the single ball chair renderer (see DESIGN.md spec)
  gallery/
    Room.tsx              7/5 grid section wrapper, light/dark variants
    SpecimenLabel.tsx     eyebrow, h2, story, hint, dl, CTA
    Plinth.tsx
  chrome/
    Header.tsx            fixed, mix-blend difference
    Footer.tsx
  scroll/
    LenisProvider.tsx     Lenis + GSAP ScrollTrigger sync (lenis/react)
```
Rule: drawBall.ts is pure (ctx in, no React). Both chair components import it. Any improvement to the chair must land in the one renderer.

## Data model (Supabase, `mlf_` prefix, RLS-first)
```sql
mlf_categories   id, slug, name, position, story, hint, facts jsonb
mlf_pieces       id, slug, category_id, title, attribution, period_label,
                 year_from, year_to, origin, materials text[],
                 status (available|reserved|sold|restoration),
                 price_pence int null, price_on_request bool,
                 story, restoration_notes, created_at
mlf_piece_images id, piece_id, path, alt, position, kind (hero|detail|as_found|restored)
mlf_provenance   id, piece_id, position, label, detail        -- the "rings"
mlf_enquiries    id, piece_id null, name, email, message, kind (piece|restoration|sourcing|selling), created_at
```
RLS: public SELECT on categories, pieces (status != draft), images, provenance. INSERT on enquiries for anon with rate limiting via edge function. Everything else owner-only (auth uid check). No open-SELECT on enquiries, ever.

Attribution honesty is schema-level: `attribution` is free text and seed data uses "attributed" or "school of" phrasing. Never seed a named designer as fact.

## Piece page = specimen page
The piece page inherits the gallery language: generative category visual as a backdrop at low intensity, photography as the specimen, provenance rendered as an actual rings diagram (reuse ProvenanceRings with the piece's `mlf_provenance` rows labelling the coloured rings), restoration before/after photography where `as_found` and `restored` images exist. dl card mirrors the landing labels: attribution, period, materials, restoration, status.

## Phase two options (do not start in phase one)
- R3F/WebGL ports of Tide and the ball chair for true depth-of-field and lighting; keep Canvas 2D as the reduced-capability fallback
- The exploded drawing driven by piece data: parts list from restoration_notes
- Search and filtering across the collection

## Ops
- Vercel, preview deployments per PR
- next/image for all photography, AVIF/WebP
- OG images generated from the category visuals (static renders)
- Plausible or Vercel analytics, no cookie banner needed
