#!/usr/bin/env node
/**
 * check.mjs — the build gate. Implements the locally-runnable EKO §1 hard-stops.
 * Pushes only happen after this passes. Live gates that need a deployed URL
 * (AI-crawler live-fetch, form round-trip, HTTPS, real-device mobile) run
 * post-deploy — see scripts/postdeploy-check.sh.
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

let fails = 0;
const fail = (m) => { console.error(`  x ${m}`); fails++; };
const pass = (m) => console.log(`  ok ${m}`);

console.log("\n[1] Build...");
try { execSync("npm run build", { stdio: "inherit" }); pass("astro build"); }
catch { fail("astro build FAILED"); process.exit(1); }

console.log("\n[2] Per-page SEO + schema + structure (EKO 4, 5)...");
const pages = [];
(function walk(d){ for (const e of readdirSync(d)) { const p = join(d,e);
  statSync(p).isDirectory() ? walk(p) : e.endsWith(".html") && pages.push(p); } })("dist");

const titles = new Map();
for (const f of pages) {
  const html = readFileSync(f, "utf8");
  const label = f.replace("dist", "") || "/";

  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(`${label}: must have exactly one <h1> (found ${h1s})`);

  const t = html.match(/<title>([^<]*)<\/title>/);
  if (!t || t[1].trim().length < 3) fail(`${label}: missing <title>`);
  else { if (t[1].length > 65) fail(`${label}: <title> too long (${t[1].length} > ~60)`);
         if (titles.has(t[1])) fail(`${label}: duplicate <title>`); titles.set(t[1], label); }

  const d = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  if (!d || d[1].length < 20) fail(`${label}: missing/short meta description`);
  else if (d[1].length > 160) fail(`${label}: meta description too long (${d[1].length} > ~155)`);

  if (!/<link\s+rel="canonical"\s+href="https?:\/\//.test(html)) fail(`${label}: missing canonical`);
  if (!/property="og:title"/.test(html)) fail(`${label}: missing Open Graph tags`);

  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) fail(`${label}: no JSON-LD`);
  else { try { const o = JSON.parse(ld[1]); if (!o["@context"] || !(o["@type"]||o["@graph"])) fail(`${label}: JSON-LD missing @context/@type`); else pass(`${label}: SEO + schema OK`); }
         catch { fail(`${label}: JSON-LD does not parse`); } }

  const imgsNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (imgsNoAlt) fail(`${label}: ${imgsNoAlt} <img> without alt`);
}

console.log("\n[3] Internal links resolve (EKO 1.3 - no 404s/orphans)...");
const have = new Set(pages.map((p) => p.replace("dist", "").replace(/index\.html$/, "").replace(/\.html$/, "") || "/"));
for (const f of pages) {
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    let href = m[1].replace(/\/$/, "") || "/";
    if (href.startsWith("/api") || /\.(xml|svg|png|jpg|jpeg|webp|ico|pdf|css|js)$/.test(href)) continue;
    const norm = href.endsWith("/") ? href : href + "/";
    if (!have.has(href) && !have.has(norm) && !existsSync(join("dist", m[1]))) fail(`${f.replace("dist","")}: dead internal link to ${m[1]}`);
  }
}
pass("internal link scan complete");

console.log("\n[4] robots + sitemap + AI crawlers (EKO 1.7, 3)...");
const robots = existsSync("public/robots.txt") ? readFileSync("public/robots.txt","utf8") : "";
if (!robots) fail("public/robots.txt missing");
const blocked = ["GPTBot","ClaudeBot","Google-Extended","PerplexityBot"]
  .filter((b)=> new RegExp(`User-agent:\\s*${b}[\\s\\S]*?Disallow:\\s*/`,"i").test(robots));
if (blocked.length) fail(`robots.txt blocks AI crawlers: ${blocked.join(", ")}`); else pass("AI crawlers allowed in robots.txt");
if (!/Sitemap:/i.test(robots)) fail("robots.txt does not list a Sitemap");
if (!existsSync("dist/sitemap-index.xml")) fail("sitemap not generated"); else pass("sitemap present");

console.log("");
if (fails) { console.error(`GATE FAILED - ${fails} issue(s). Do not push.\n(AI-crawler live-fetch + form round-trip are post-deploy: scripts/postdeploy-check.sh)\n`); process.exit(1); }
console.log("GATE PASSED - safe to commit + push. Run scripts/postdeploy-check.sh after deploy.\n");
