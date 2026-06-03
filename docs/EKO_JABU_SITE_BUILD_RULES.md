# Eko / Jabu Auto-Build Platform — Standing Rules & Build Spec

**Date:** June 2026
**Purpose:** The rules and defaults Jabu must apply when auto-building client websites for Eko, so every site ships production-grade, GEO-visible, compliant, and consistent — without a human catching the same mistakes each time.
**Status:** Living spec. Companion to `JABU_AI_CRAWLER_ACCESS_CHECK.md`.

**How to read this:** Each section has **GATES** (must pass before a site is declared live — the platform should refuse to mark a build complete otherwise) and **DEFAULTS** (recommended starting behaviour Jabu applies unless a client overrides). The single most important principle: **GEO/AI-search visibility is the primary goal**, so anything that blocks AI crawlers is a launch-blocker, not a nice-to-have.

---

## 1. PRE-LAUNCH GATES (the hard stops)

The platform should run these automatically and **fail the build** if any fail. Nothing below is optional.

1. **AI-crawler live-fetch test passes.** Fetch the homepage + 1–2 inner pages with AI user-agents (ClaudeBot, GPTBot, PerplexityBot) and require HTTP 200, not a challenge. (Full procedure: `JABU_AI_CRAWLER_ACCESS_CHECK.md`.)
2. **Structured data validates.** Every page type returns valid items in a schema validator (Google Rich Results / Schema.org) with zero *errors* (non-critical warnings allowed but logged).
3. **No broken internal links**, no 404s in the nav/footer, no orphaned pages.
4. **Form round-trip works.** Submit a test lead end-to-end; confirm 2xx, lead stored, notification + autoresponder sent.
5. **Mobile renders correctly** at ~380px — no horizontal scroll, no cropped hero, tappable targets ≥44px.
6. **HTTPS only**, valid cert, no mixed content, no secrets in client-side code.
7. **Canonical + robots sanity:** every page has a self-referencing canonical; robots.txt allows AI agents; sitemap reachable and listed in robots.txt.
8. **Claims accuracy:** every public statistic on the site traces to a single source-of-truth record (see §6). No number appears in two different forms across pages.

---

## 2. HOSTING & DEPLOY (Cloudflare stack)

**DEFAULTS**
- Cloudflare Worker + static assets via the **`env.ASSETS` binding**. Asset-only Workers need the **wrangler CLI** for code — the dashboard can't add it.
- Secrets (API keys, mail keys, tokens) live in **Worker env / secrets**, never in the repo or client code.
- Versioned deploys: numbered builds, a changelog entry per deploy, one handover doc per session (replace, don't accumulate).

**GATES**
- **Never let the Worker fetch its own custom domain** — that's a 522 loop. Serve assets through `env.ASSETS`.
- **Day-0 AI-crawler config** on every new zone (Cloudflare blocks AI bots by default on new zones — see §3).
- MailChannels/`_mailchannels` TXT uses **`auth=<account-id>`**, not the deprecated `cfid=`.

---

## 3. AI-CRAWLER ACCESS & GEO (primary-goal gate)

This is where the most damaging silent failures live. Cloudflare blocks AI bots by default on new zones, and the block is at the edge — *before* robots.txt or the Worker run, so a perfect robots.txt won't save it.

**GATES (per zone, day 0 + post-publish)**
- **Block AI bots / training bots** → set to **allow**.
- **Bot Fight Mode** → **Off** (it can't be allowlisted around; it catches AI fetchers as generic automation).
- **AI Crawl Control → Crawlers** → AI *search/retrieval* bots (Claude-SearchBot, OAI-SearchBot, ChatGPT-User, PerplexityBot) set to **Allow** — the overview toggle only covers *training* bots.
- **WAF custom rules** → none blocking by user-agent or bot score.
- **Live-fetch test passes** (§1.1). The dashboard can lie/lag; the fetch is the proof.

**DEFAULTS**
- `Managed robots.txt` **off** unless a client explicitly wants to block AI training — for marketing sites, full visibility is the goal.
- robots.txt: `Allow: /` for all agents; disallow only non-content paths (`/api/`, template placeholders); list all sitemaps.

---

## 4. STRUCTURED DATA / SCHEMA

**DEFAULTS** — every site gets JSON-LD appropriate to its vertical:
- **Organization / LocalBusiness** sitewide (name, logo, address, geo, phone, sameAs links to socials + review profiles).
- **FAQPage** on pages with Q&A content.
- **AggregateRating + Review** where there are verifiable reviews.
- **BreadcrumbList** on deep pages.
- Vertical-specific primary type (see §13) — e.g. `RealEstateAgent` + per-listing `RealEstateListing` for real estate.

**GATES**
- Schema **figures must match on-page copy** and the source-of-truth record (§6) — no drift.
- Listing/detail pages served `index, follow`; placeholder/404/"not found" pages served `noindex`.
- Validate every page type before launch; resolve all *errors*, log *warnings*.

---

## 5. SEO FOUNDATIONS

**GATES**
- One `<h1>` per page; logical H2/H3 hierarchy.
- `<title>` ≤ ~60 chars, meta description ≤ ~155 chars, both unique per page.
- Self-referencing canonical on every page.
- `sitemap.xml` (+ section sitemaps where useful, e.g. listings) generated and submitted; referenced in robots.txt.
- Descriptive `alt` text on every meaningful image.

**DEFAULTS**
- Clean, human-readable URL slugs (kebab-case, content-derived).
- Internal linking between related pages; no dead-end pages.
- Open Graph + Twitter card meta on every page for share previews.

---

## 6. CONTENT, VOICE & CLAIMS ACCURACY (compliance)

**GATES**
- **Single source of truth for every statistic** (years, sales volume, review count, percentages). The build pulls numbers from one record and injects them everywhere — copy, schema, meta. This prevents the "8yr vs 7yr / 99 vs 102" drift.
- **No unsubstantiated superlatives or claims.** Real estate is bound by the REAA Code of Conduct (no "best", "#1", unverifiable claims); apply the equivalent regulator's rules per vertical (e.g. FMA/CCCFA for mortgages/financial). Every claim must trace to a verifiable source.
- Required legal disclosures present per vertical (licence numbers, registration, "not advice" disclaimers where relevant).
- Privacy policy + cookie/consent handling present.

**DEFAULTS**
- One **voice/style reference per client**, applied across all generated copy. Restrained, plain-English, no clichés. If a canonical reference doc exists (e.g. a client's guide PDF), use 2–3 passages as in-context style examples.
- Round public figures conservatively in display copy (e.g. "100+ reviews"), keep the precise number in the source record and schema.

---

## 7. FORMS & LEAD CAPTURE

**GATES**
- Return a **2xx fast** (frontend waits for it); do the email send **async** after acknowledging.
- Validate: required fields present, email shape, disposable-domain soft-block.
- Store the lead (sheet/DB) with `submitted_at`, fields, **`source`** (which page/form), and a sent-timestamp.
- Notification email to the client + autoresponder to the lead.
- Spam protection (honeypot or token); consent/privacy line on the form.

**DEFAULTS**
- Distinct `source` value per form so lead origin is traceable.
- Friendly failure message with a fallback contact (phone) on non-2xx.
- **Never** use `localStorage`/`sessionStorage` for anything sensitive.

---

## 8. DATA INGESTION (CRM / external feeds)

For sites pulling from a CRM/API (listings, products, inventory):

**GATES**
- **Normalise line endings** (`\r\n?` → `\n`) before any paragraph/text processing — mixed CRLF silently breaks splits and can collapse whole fields.
- **Filter to published/live records only** (`published === true`) — never leak drafts.
- **Never surface internal fields** (internal remarks, fees, vendor-paid-advertising, commission). Whitelist the fields you render; don't blanket-pass the payload.
- Gate sensitive fields on their visibility flags (e.g. show price only when `showPrice`/equivalent is true).
- Cache feeds (KV + scheduled refresh) so the site doesn't hard-depend on live upstream availability; show a graceful state if a feed is empty, not a flash of broken UI.

**DEFAULTS**
- Read field values from their canonical path (verify the actual API shape; don't assume field names).
- A diagnostic endpoint (raw-sample) for inspecting upstream payloads during setup.

---

## 9. IMAGES & RENDERING

**GATES**
- **Hero and content images must never crop important content.** Use `contain` (with letterboxing) or a fixed `aspect-ratio` — **not `cover`** — so floor plans, portrait shots, and odd-ratio images display whole. Fix side-bars on landscape images with `max-width`/`aspect-ratio`, never by reverting to `cover`.
- Responsive images; correct dimensions; no layout shift (reserve space).

**DEFAULTS**
- Lazy-load below-the-fold images; modern formats (WebP/AVIF) with fallback.
- Preconnect/preload fonts; limit font weights.

---

## 10. PERFORMANCE

**DEFAULTS / soft gates (set a budget the platform checks)**
- Lighthouse/PageSpeed: aim mobile performance ≥ 85, no CLS regressions.
- Minify/bundle CSS/JS; defer non-critical JS.
- Sensible cache headers on assets and Worker responses.
- Keep third-party scripts to a minimum (each one is a speed + privacy cost).

---

## 11. ACCESSIBILITY

**GATES**
- Semantic landmarks (`header`/`nav`/`main`/`footer`); `alt` on images; labelled form fields.
- Colour contrast meets WCAG AA; visible focus states; full keyboard navigation.
- `lang` attribute set; sensible heading order (ties to §5).

---

## 12. SECURITY & PRIVACY

**GATES**
- HTTPS only; HSTS; no mixed content.
- Secrets only in Worker env; nothing sensitive in the repo or client bundle.
- Privacy Act / GDPR-appropriate consent on data capture; clear privacy policy.
- Sanitise/escape any user or feed content rendered into the page (XSS).

---

## 13. MULTI-VERTICAL TEMPLATING

Eko spans coatings inspections, mortgages, residential build, painting, real estate, etc. Build a **generic engine + per-vertical overlay**, not bespoke each time.

Each vertical overlay defines:
- **Primary schema type** + which detail-page schema applies.
- **Compliance ruleset** (regulator, required disclosures, forbidden claim patterns).
- **Lead-form fields** + routing for that industry.
- **Voice reference** + sample copy.
- **Content archetypes** (e.g. listings, service pages, project galleries, FAQ topics that match what that industry's customers actually search).

The core engine (hosting, AI-crawler config, SEO, forms, perf, a11y, QA gate) stays identical across verticals.

---

## 14. PRE-LAUNCH QA GATE (automated checklist)

Before the platform marks a site "live", run and record pass/fail for: §1.1 AI-crawler fetch · schema validation · broken-link crawl · mobile render · form round-trip · HTTPS/mixed-content · canonical/robots/sitemap · claims/stat-consistency scan · Lighthouse budget · accessibility scan. **Any GATE failure blocks launch** and surfaces a report to Eko.

---

## 15. POST-LAUNCH MONITORING

**DEFAULTS** (scheduled, with alerting to Eko):
- **AI-crawler access** re-check (weekly/monthly) — catches Cloudflare default changes or new WAF rules locking bots out.
- Uptime + error-rate on the Worker.
- Search Console + analytics connected; watch for crawl errors, indexing drops, rich-result loss.
- Feed-health check for CRM-driven sites (last successful refresh, empty-feed alarm).

---

## 16. VERSIONING & HANDOVER DISCIPLINE

- Numbered, versioned deploys; one changelog entry per deploy.
- One handover doc per build session, replacing the prior — don't accumulate stale docs.
- Remove superseded snapshots/partials before bundling.
- Keep canonical design + brand refs and the source-of-truth stat record per client in a known location the platform reads from.

---

### Quick map of lessons already learned (baked into the rules above)
- CF blocks AI bots by default on new zones → §1.1, §3
- `env.ASSETS` (no self-domain fetch loop) → §2
- Mixed `\r\n` breaks text processing → §8
- Hero `contain`, never `cover` → §9
- Stats drift across pages/schema → §6 single source of truth
- Unsubstantiated superlatives breach industry codes → §6
- `_mailchannels` TXT uses `auth=` not `cfid=` → §2
