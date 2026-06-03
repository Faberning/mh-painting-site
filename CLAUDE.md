# CLAUDE.md — Jabu build agent (quick contract)

You build/maintain a Jabu site on the standard stack: **Astro (static) → GitHub →
Cloudflare Worker (static assets via `env.ASSETS`) → wrangler / Workers Builds.**
Bok decides; you build, test and push. You never deploy by hand.

## The governing spec

**`docs/EKO_JABU_SITE_BUILD_RULES.md` is authoritative.** Read it before building.
Its GATES are hard stops; its DEFAULTS are your starting behaviour. This file is
just the fast contract — if anything here and the rules doc disagree, the rules win.

## 0. COST GUARDRAIL — every session

Recognise and flag costs BEFORE proceeding. Nothing paid happens silently; no
free-tier ceiling is crossed without Bok's explicit OK.
- `npm run costs` before any multi-step / multi-push run.
- Meters: Cloudflare builds (500/mo/account, each push = 1) and the Agent SDK
  credit (Bok = Max 5x = US$100/mo, per user, no rollover). Flag at 80%.
- Before any paid upgrade or ceiling crossing: STOP, state "does X, costs ~Y, proceed?"

## 1. The loop

prompt → edit source → `npm run check` (must pass) → push `preview` → Cloudflare
auto-builds a preview URL → give Bok the URL + what changed + suggestions → on
"ship", merge `main` → deploys. Then run `scripts/postdeploy-check.sh <url>`.

## 2. Gates

- `npm run check` — local hard-stops (build, single h1, title/desc length, canonical,
  OG, JSON-LD, alt text, internal links, robots/sitemap, AI-crawler allow).
- `scripts/postdeploy-check.sh <url>` — live hard-stops (AI-crawler 200 fetch, no
  challenge, form round-trip). EKO §1.1/§1.4/§3. A site is not "live" until these pass.

## 3. Decisions live in `src/consts.ts`

All business facts, the single-source-of-truth stats, brand tokens, and the active
vertical. Never hardcode a fact, number or colour into a page. **Every stat, cert,
listing and project must trace to a record before it appears — claims traceability
is strict (EKO §6). If it isn't verified, it does not go on the page.**

## 4. Deploy model (EKO §2)

- Worker serves assets through `env.ASSETS` — NEVER fetch the site's own custom
  domain (522 self-loop).
- Secrets via `wrangler secret put` / Worker env — never in the repo.
- `_mailchannels` TXT uses `auth=<account-id>`, not `cfid=`.

## 5. SEO + GEO (primary goal)

Every page wraps `Base.astro` (complete head). Schema via `Schema.astro` from consts.
AI crawlers stay allowed (robots + Cloudflare zone — the Karin failure). Load
`skills/schema-geo`. Validate new schema at the Google Rich Results Test.

## 6. Migration mode

Rebuilding an existing site: SEO + GBP stay; only the host changes. Crawl public
pages → preserve URLs or 301 in `public/_redirects` → match/improve schema → same
domain → DNS cutover off-peak, old site live until it resolves. Closed platforms =
public crawl only; anything behind a login is hand-work.

## 7. Vertical overlay (EKO §13)

`src/verticals/<vertical>.ts` defines schema type, compliance ruleset, lead-form
fields, content archetypes. Core engine identical across verticals; only the
overlay changes. Coatings overlay = passive-fire compliant, claim-strict.

## 8. Safety

Work on `preview`, never force-push `main`, never commit secrets. If a build/check
surprises you, verify the mechanism before a multi-step fix (confirm once beats
backtracking three).
