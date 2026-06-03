# Changelog — MH Painting site

## mh-0.1.0 — June 2026 (first build, off Squarespace)
- Cloned from jabu-build-kit 1.0.0; engine (Base, Schema, worker, gate, robots) untouched.
- consts.ts configured for MH Painting. Decisions locked: areaServed-only (no address/geo
  in schema — service-area business); "Structural steel coatings" dropped as a listed
  service (still appears as real job detail on the Langs Waterfront case study); mobile
  number only; Max's 7 years kept (personal experience — never rendered as company age).
- Brand re-skinned to MH palette (charcoal / terracotta / cream; Fraunces + Inter).
- Migration build: homepage, /projects + 8 case studies, /blog + the repaint post,
  /contact (lead form -> /api/lead), /thank-you (noindex). URLs preserved; junk Squarespace
  slugs 301'd in _redirects.
- Claims accuracy (EKO §6): only Dulux Accredited + fully insured asserted; house wash
  credited to partner So Clean; reviews 5.0/15 single-sourced in consts (NOT in schema —
  deliberate, see KNOWN ITEMS); contact copy reframed corridor-first.
- Local gate (npm run check) PASSES: 14 pages, SEO + schema + internal links + AI-crawler
  allow + sitemap all green.

### KNOWN ITEMS (decisions / his steps)
- §4 AggregateRating/Review schema deliberately OMITTED (self-serving review-markup risk).
  Reviews shown as on-page copy + Google link instead. Flip if you want the schema — needs
  a small Schema.astro extension.
- Project pages are text-only — export photos from Squarespace into public/projects/<slug>/
  (use object-fit: contain per EKO §9, never cover).
- TODOs in source: blog pubDate; FB/IG URLs for sameAs; confirm exact live blog slug for
  the _redirects line; Max's exact start year (kept as "over 7 years").
- Post-deploy (his account): MailChannels + Worker secrets for /api/lead; Day-0 Cloudflare
  AI-bot unblock; run scripts/postdeploy-check.sh (AI-crawler 200 + form round-trip);
  pa11y contrast pass (terracotta button text).

---

## engine lineage — jabu-build-kit 1.0.0
- Astro -> GitHub -> Cloudflare Worker (assets via env.ASSETS) -> wrangler / Workers Builds.
- Lead Worker route /api/lead (EKO §7); check-gate (EKO §1); vertical overlay (EKO §13).
