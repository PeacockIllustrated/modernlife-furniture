# CLAUDE.md — Modern Life Furniture

## What this is
A full website build for Modern Life Furniture, a collector and restorer of vintage designer furniture (chairs by the furniture artists of the last century, plus casework, tables and shelving, bought, restored and rehomed). This is NOT a maker's site and NOT an e-commerce grid. It is a specimen gallery: each category presented like a museum room, each piece like a labelled exhibit.

The locked design concept lives at `reference/concept-v5.html`. Open it in a browser before writing any code. It is the source of truth for palette, type, layout rhythm, motion feel and the five generative visuals. The production build should exceed it in polish, never drift from it in character.

## Stack (fixed, do not substitute)
- Next.js 15 App Router, TypeScript strict
- Tailwind for layout and spacing only; design tokens via CSS variables (see DESIGN.md)
- GSAP (fully free since v3.13) + ScrollTrigger for scroll choreography
- Lenis for smooth scroll (`lenis` package, `lenis/react`)
- Canvas 2D for the five generative visuals in phase one; React Three Fiber upgrades are phase two options only (see ARCHITECTURE.md)
- Supabase (Postgres + Auth, RLS-first) for collection stock, `modern_` table prefix
- Vercel deployment
- Motion (`motion/react`) only if a specific micro-interaction needs it; GSAP is primary

## Standing conventions (non-negotiable, apply to code comments, copy, commit messages, everything)
- British spelling throughout (colour, metre, organise)
- No em-dashes anywhere. Use commas, semicolons or full stops
- Sentence case headings everywhere, including nav and buttons
- No emoji. No exclamation marks in user-facing copy
- Square corners: `border-radius: 0` globally. No drop shadows, no box-shadow anywhere
- Prose over bullet points in user-facing copy

## How to work
- One concern per session or subagent task. Do not let a visual-port task touch the CMS, or vice versa
- Every subagent invocation must be self-contained: name the file(s), the acceptance criteria, and the relevant section of DESIGN.md or ARCHITECTURE.md. Subagents cannot ask questions mid-run
- Before marking any visual done, compare it side by side with the same section in `reference/concept-v5.html`. Same character, better finish, is the bar
- Respect `prefers-reduced-motion` in every animated component: render a meaningful static frame, never a blank
- Keyboard focus must be visible on all interactive elements
- Mobile: panels stack above labels below 860px; canvases must not hijack vertical touch scroll (use `touch-action: pan-y` where a canvas listens to pointer input)
- Performance budget: every canvas pauses when off-screen (IntersectionObserver), devicePixelRatio capped at 2, no per-pixel loops
- Do not invent facts about real designers or makers. Attribution language for stock is "attributed" or "school of" until the owner confirms provenance. Placeholder stock is clearly marked in the seed data

## What "excellent" means here
The concept proves the idea. Production must add: font loading without FOUT (next/font), canvas visuals extracted into typed, reusable components with a shared lifecycle hook, GSAP-driven entrance choreography replacing the bare IntersectionObserver reveals, Lenis-smooth scroroll with scroll-linked build sequences (the ball chair assembling on scroll progress, not on a timer), a real collection layer backed by Supabase, and Lighthouse 90+ across the board on mobile.
