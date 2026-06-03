---
name: schema-geo
description: Jabu standard for structured data (schema.org JSON-LD) and GEO/AEO (AI-search visibility) on Astro sites. Load when building or auditing schema, metadata, or AI-answer-engine readiness for any Jabu site.
---

# Schema + GEO/AEO standard

The thing that makes schema and GEO "take ages" by hand. Encoded once here so it's
a gate, not a craft project, on every site.

## Structured data (schema.org JSON-LD)

- Emit JSON-LD only via `Schema.astro`, driven by `src/consts.ts`. One source of
  truth, consistent across pages, checkable by the gate.
- Use an `@graph` array with linked `@id`s so business + services + pages form one
  entity graph (answer engines reason over the graph, not isolated blobs).
- Business type by sector:
  - coatings / construction / trades → `HomeAndConstructionBusiness`
  - real estate agent → `RealEstateAgent`
  - financial / mortgage adviser → `FinancialService` (+ FAP disclosure in footer)
  - generic service business → `LocalBusiness`
- Required on the business node: `name`, `url`, `telephone`, `address`
  (PostalAddress), `geo` (GeoCoordinates), `areaServed`, `image`. Add `sameAs`
  the moment a profile is verifiably the business (GBP, LinkedIn, Facebook, etc.).
- Per page type, add the matching node: `Service` for service pages, `FAQPage`
  for FAQs (high AEO value), `BreadcrumbList` for nested pages, `Article` for blog.
- Validate non-trivial changes at https://search.google.com/test/rich-results
  before shipping. The gate checks structure; the Rich Results test checks Google's
  acceptance.

## GEO / AEO (getting cited by AI answer engines)

1. **Let the crawlers in.** `robots.txt` must allow GPTBot, ClaudeBot,
   Google-Extended, PerplexityBot. Check the Cloudflare zone bot settings too —
   the dashboard default can block them even when robots.txt allows.
2. **Answer-first structure.** Lead sections with the direct answer in the first
   sentence, then support it. Use real `<h2>/<h3>` questions a person would ask.
3. **FAQ schema** on any page with genuine Q&A — it's one of the highest-leverage
   AEO wins and the gate-friendliest.
4. **Entity consistency.** NAP (name, address, phone) identical across the site,
   schema, and GBP — character for character. Inconsistency dilutes the entity.
5. **Fast, static, semantic HTML.** Astro static output is already most of this;
   keep markup clean and headings hierarchical.
6. **Sitemap** auto-generated (`@astrojs/sitemap`) and referenced in `robots.txt`;
   submit to Google Search Console + Bing Webmaster Tools at launch.

## Definition of done for any page

- title (≤60 chars, distinctive), meta description (~150 chars, specific),
  canonical, OG tags — all present (the gate enforces).
- JSON-LD node for the page type, parsing and validating.
- Headings answer real questions; NAP consistent; internal links sensible.
- `npm run check` passes; Rich Results test clean for new schema types.
