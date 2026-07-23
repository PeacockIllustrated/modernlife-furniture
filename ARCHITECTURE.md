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
    BallChair.tsx         the abstract lathe chair, scroll-bound build + swivel
    Seam.tsx              restoration, a grain figure cleaving along a seam
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
Rule: drawBall.ts is pure (ctx in, no React) and remains the single chair renderer; any improvement to the chair lands there. Since the owner decoupled Restoration from the chair (July 2026), BallChair.tsx is its only consumer and Seam.tsx stands alone.

## Data model (Supabase, `modern_` prefix, RLS-first)
```sql
modern_categories   id, slug, name, position, story, hint, facts jsonb
modern_pieces       id, slug, category_id, title, attribution, period_label,
                 year_from, year_to, origin, materials text[],
                 status (available|reserved|sold|restoration),
                 price_pence int null, price_on_request bool,
                 story, restoration_notes, created_at
modern_piece_images id, piece_id, path, alt, position, kind (hero|detail|as_found|restored)
modern_provenance   id, piece_id, position, label, detail        -- the "rings"
modern_enquiries    id, piece_id null, name, email, message, kind (piece|restoration|sourcing|selling), created_at
```
RLS: public SELECT on categories, pieces (status != draft), images, provenance. INSERT on enquiries for anon with rate limiting via edge function. Everything else owner-only (auth uid check). No open-SELECT on enquiries, ever.

Attribution honesty is schema-level: `attribution` is free text and seed data uses "attributed" or "school of" phrasing. Never seed a named designer as fact.

## Piece page = specimen page
The piece page inherits the gallery language: generative category visual as a backdrop at low intensity, photography as the specimen, provenance rendered as an actual rings diagram (reuse ProvenanceRings with the piece's `modern_provenance` rows labelling the coloured rings), restoration before/after photography where `as_found` and `restored` images exist. dl card mirrors the landing labels: attribution, period, materials, restoration, status.

## Phase two options (do not start in phase one)
- R3F/WebGL ports of Tide and the ball chair for true depth-of-field and lighting; keep Canvas 2D as the reduced-capability fallback
- The exploded drawing driven by piece data: parts list from restoration_notes
- Search and filtering across the collection

## Ops
- Vercel, preview deployments per PR
- next/image for all photography, AVIF/WebP
- OG images generated from the category visuals (static renders)
- Plausible or Vercel analytics, no cookie banner needed

## Store layer, July 2026
The piece page grew into a full specimen record while staying enquiry-led: no checkout, no payments, no public reviews. Migration 0004 adds the supporting tables, all inside the `modern_` namespace:
```sql
modern_piece_features  id, piece_id, position, eyebrow, title, body, image_path, image_alt, layout (left|right|full)
modern_piece_specs     id, piece_id, position, grouping, term, detail   -- the specification record
modern_piece_included  id, piece_id, position, label, note              -- what comes with the piece
modern_faqs            id, piece_id null, position, question, answer, published
modern_testimonials    id, piece_id null, position, quote, name, context, published
modern_settings        key, value jsonb                                 -- the 'store' row carries site prose
modern_subscribers     id, email, created_at                            -- the acquisitions list
```
A null `piece_id` on questions and collector words means site-wide. `modern_pieces` gains `catalogue_number` and `section_toggles` jsonb. The piece page is a fixed, toggleable template, not a block builder: nine named sections (features, record, included, condition, provenance, care, faq, words, related) render in a fixed order, and the owner switches them off per piece from the dashboard; an absent key means enabled, and a section with no content hides itself regardless. RLS follows the established pattern: public read of published rows gated on the parent piece, owner-only writes, and the subscriber list write-only for the public. No open-SELECT on subscribers, ever. Photography uploads land in the public `modern-pieces` storage bucket and render through next/image.
