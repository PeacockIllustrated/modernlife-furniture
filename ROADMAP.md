# ROADMAP.md — Modern Life Furniture

Six sessions. Each is scoped so a subagent invocation can carry it whole (subagents cannot ask questions mid-run; every dispatch must name files, acceptance criteria and the relevant DESIGN.md or ARCHITECTURE.md section).

## Orchestration guidance (read before dispatching the fleet)
The value of subagents here is context isolation, not token savings; expect multi-agent runs to cost more tokens overall, not fewer. Spend the expensive model where it earns its keep:
- Orchestrator: mid-tier is sufficient. The planning is already done in this pack; the orchestrator's job is dispatch, integration and verification
- Cheap/standard-tier subagents: sessions 1, 4 and 6 (scaffold, data layer, plumbing and QA mechanics)
- Top-tier subagents: sessions 2 and 3 only (the visual ports and motion choreography, where taste is the deliverable) plus a final review pass over everything
- Never dispatch two agents at the same files concurrently. Visual work and data work can run in parallel; two visual agents cannot

## Session 1 — Scaffold (standard tier)
Next.js 15, TypeScript strict, Tailwind, tokens as CSS variables, next/font (Fraunces, Archivo, Spline Sans Mono), LenisProvider with GSAP ScrollTrigger sync, global reset (border-radius 0, no shadows), Header with mix-blend difference, Footer, Room/SpecimenLabel/Plinth, the landing assembled with static placeholder panels. Accept: page structure matches concept-v5 with fonts loading without FOUT, reduced-motion honoured on reveals.

## Session 2 — The renderer and the two chairs (top tier)
Port drawBall to lib/drawBall.ts exactly per DESIGN.md spec. Build useCanvasScene. Implement BallChair (build sequence bound to ScrollTrigger progress, swivel, idle sway) and ExplodedBall (explode factor from cursor distance, idle breathing, measured right-aligned leader notes). Accept: side-by-side with concept-v5 the character is identical and the finish is better; scrubbing scroll scrubs the chair build; no clipped labels at any width; reduced motion shows assembled chair and 0.55-exploded drawing as stills.

## Session 3 — The remaining visuals (top tier)
Tide, Grove, Strata, ProvenanceRings as components on the shared hook, each per its DESIGN.md spec, wired into the five rooms with the light/dark rhythm. Accept: every canvas pauses off-screen, cursor interactions match the concept, 60fps on a mid-range laptop, mobile touch scroll never trapped.

## Session 4 — Data layer (standard tier)
Supabase project, modern_ schema and RLS per ARCHITECTURE.md, seed data (categories from CONTENT.md, six placeholder pieces flagged placeholder), typed client, landing dl facts and category pages reading from the database, enquiry form writing to modern_enquiries with rate limiting.

## Session 5 — Piece and service pages (top tier for the specimen page, standard for the rest)
/piece/[slug] specimen page per ARCHITECTURE.md including provenance rings fed by real rows; /restoration, /sell, /enquire; /admin with magic-link auth and plain-English CRUD for pieces, images, provenance and enquiry triage.

## Session 6 — Polish and ship (standard tier, top-tier review pass)
OG images from category visuals, metadata, sitemap, 404 in the gallery voice, Lighthouse 90+ mobile, keyboard pass, copy proof against CONTENT.md rules (spelling, no em-dashes, sentence case), Vercel production deploy. Final top-tier review: open every page next to concept-v5 and file a punch list; fix; ship.

## Explicitly out of scope for v1
E-commerce checkout, R3F ports, search/filtering, CMS beyond the admin CRUD, blog.
