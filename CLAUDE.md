# CLAUDE.md — Modern Life Furniture

## What this is
An online store selling vintage designer furniture, chairs above all. Every piece is one of one, photographed, priced or offered on request, and sold through a fast enquiry flow rather than a checkout. The site's first job is commercial: it is the destination we send people to from social posts, so a piece page must load fast on a phone, make the piece and its price obvious in the first screen, and put the enquiry one tap away at all times. Its second job is to earn outside traffic through clean structure, honest content and strong technical SEO.

This spec supersedes the earlier museum-gallery concept. `reference/concept-v5.html` is retired as a source of truth and kept only as history. The restoration-workshop narrative is retired with it: we do not sell restoration, we do not romanticise the bench. Condition is stated plainly as buyer information.

## Stack (fixed, do not substitute)
- Next.js 15 App Router, TypeScript strict
- Tailwind for layout and spacing only; design tokens via CSS variables in `app/globals.css`
- GSAP + ScrollTrigger and Lenis, light touch only: motion must never cost conversion or Lighthouse
- Supabase (Postgres + Auth + Storage, RLS-first), `modern_` table prefix, shared database: never touch other prefixes
- The staff dashboard at `/admin` is the CMS; the piece page is a fixed, toggleable section template edited there
- Vercel deployment

## Design system v2 (clean commercial, our own voice)
- Palette: page ground `--paper #F5F3EF`, panel `--panel #EAE7E1`, text `--ink #1E211E`, dark bands and footer `--basalt #151C18` with `--bone #DDD9CC` text, single brand accent `--amber #C97B3D`. Status colours are data, not decoration: `--sea #5E7A6B` available, `--rose #B4685E` reserved and sold, amber for pieces being prepared.
- Type: Fraunces for display with italic emphasis words (the "Love is *personal*" pattern), Archivo for body and UI. Mono is demoted to small metadata only. Sentence case everywhere, including nav and buttons.
- Shape: soft rounding, `--radius-s 6px` on inputs and small elements, `--radius-m 12px` on cards and figures, pill buttons. One soft shadow token for floating elements only (sticky bars, the mobile enquiry bar); flat surfaces otherwise.
- Photography leads. Every card, hero and band is designed around an image slot managed from the dashboard; the generative line drawings survive only as quiet placeholders until photography exists and as small brand accents. Never design a section that only works with the drawing.
- Whitespace is generous, sections breathe, one idea per band. Alternate paper and panel grounds with an occasional basalt band for rhythm; hairline borders `1px solid rgba(30,33,30,.16)` for structure inside a ground.

## Copy voice
Quietly confident and commercial. Short sentences that state facts a buyer cares about: what it is, who it is attributed to, what condition it is in, what it costs, how it arrives. Warmth without theatre. British spelling throughout. No em-dashes anywhere; use commas, semicolons or full stops. No exclamation marks, no emoji, no urgency theatre ("only one left" is true of everything we sell and goes without saying). Sentence case headings.

Attribution honesty is non-negotiable and legally load-bearing: never state a real designer or maker as fact without the owner's confirmation. Approved hedges: "attributed to", "school of", "in the manner of", "maker unconfirmed". Era and style descriptors are fine. Placeholder content is flagged `placeholder: true` and cleared with the owner before launch.

## Conversion rules (the point of the site)
- The piece page is the landing unit for social traffic. First viewport on mobile: photograph, title, attribution line, price or "price on request", availability, and the enquiry call to action. The sticky enquiry bar is always present on mobile once the buy area scrolls away.
- Every page ends in a next action. Home routes to chairs and to featured pieces; category pages route to pieces; a sold piece routes to registering interest and to similar pieces.
- Chairs lead. The home hero and the featured row favour chairs; the nav's first link is Chairs; the collection orders chairs first.
- Trust is factual: the condition report, the provenance file, delivery and returns terms, and staff-curated collector words. No invented ratings, no badges we did not earn.
- Enquiry and interest capture are the whole funnel: keep both forms short, fast and reassuring, confirm receipt plainly, and store everything for the dashboard.

## Performance and SEO (measured, not aspirational)
- Lighthouse 90+ on mobile for home, a category and a piece page; check before shipping structural change.
- next/image for all photography with real `sizes`; no canvas work on the piece page's mobile critical path; canvases pause off-screen, devicePixelRatio capped at 2.
- JSON-LD on every piece page (`Product` with price, availability, condition) and `Organization` sitewide. Per-piece Open Graph cards stay, they are the social share surface.
- Semantic headings, one h1 per page, descriptive metadata per route, sitemap and robots kept current.
- `prefers-reduced-motion` renders everything at rest with nothing missing. Keyboard focus visible on all interactive elements. Tap targets 44px minimum.

## How to work
- One concern per session or subagent task; a visual task does not touch the CMS and vice versa.
- Subagent tasks must be self-contained: files, acceptance criteria, and the relevant section of this file.
- The database is shared: migrations are additive, strictly `modern_` prefixed, and RLS mirrors the existing pattern. Enquiries and subscribers are never publicly readable.
- Before shipping visual change, look at the rendered result on desktop and a 390px viewport, against the bar: clean, professional, would you send a paying customer here from an ad.
