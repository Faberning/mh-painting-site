# Jabu Build Kit

The canonical, versioned engine for every Jabu site. Clone it per site, fill
`src/consts.ts`, build. One source of truth — update the kit centrally, pull into
a site when you choose.

**Stack:** Astro (static) → GitHub → Cloudflare Worker (static assets via
`env.ASSETS`) → wrangler / Workers Builds.
**Governing spec:** `docs/EKO_JABU_SITE_BUILD_RULES.md` (authoritative — the GATES
are hard stops). `CLAUDE.md` is the agent's quick contract and points at it.

## Use it for a new site

1. Clone the kit into a new repo. Set `name` in `wrangler.toml` (e.g. `forge-coatings`).
2. Fill `src/consts.ts` (the only per-site file of decisions) + pick the vertical.
3. `npm install && npm run check` until the gate passes.
4. Connect the repo to a Cloudflare **Worker** (Workers Builds) for git auto-deploy,
   or `npx wrangler deploy`. Build command `npm run build`, assets dir `dist`.
5. Confirm AI crawlers aren't blocked at the Cloudflare zone (the Karin lesson).
6. After deploy: `scripts/postdeploy-check.sh https://your-site` — must pass before
   you call it live.

## Daily

```bash
npm run dev     # local preview
npm run check   # local gate (must pass before push)
npm run costs   # cost guardrail (before multi-step / multi-push runs)
npm run build   # static output -> dist/ (served by the Worker via env.ASSETS)
```

## What's in the kit

```
docs/EKO_JABU_SITE_BUILD_RULES.md  the authoritative spec (GATES + DEFAULTS)
CLAUDE.md                          agent quick contract (cost guardrail §0)
src/consts.ts                      per-site decisions + single-source stats
src/verticals/coatings.ts          vertical overlay (schema/compliance/forms) §13
src/layouts/Base.astro             complete SEO head
src/components/Schema.astro        JSON-LD from consts
src/pages/index.astro              home (consts-driven)
src/worker.js                      static via env.ASSETS + /api/lead (§2, §7)
wrangler.toml                      Worker + assets binding (deploy config)
scripts/check.mjs                  local gate (EKO §1 hard-stops)
scripts/postdeploy-check.sh        live gate (AI-crawler fetch + form round-trip)
scripts/costs.mjs                  cost guardrail
skills/schema-geo/SKILL.md         schema + GEO/AEO standard
public/robots.txt                  AI crawlers allowed
public/_redirects                  301 map (migration)
VERSION / CHANGELOG.md             versioning (§16)
```

## Cost ceilings the agent watches

Cloudflare: 500 builds/mo per account (every push = 1; Workers Paid ~US$5/mo for
5,000), soft cap 100 projects/account. Agent SDK credit: Max 5x = US$100/mo, per
user, no rollover. Sustained multi-client load → consider a direct API key and/or
per-client accounts. The agent flags before crossing any of these.
