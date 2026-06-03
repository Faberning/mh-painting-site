#!/usr/bin/env node
/**
 * costs.mjs — the COST GUARDRAIL. Run before any multi-step / multi-push run.
 * Bok's rule: recognise and flag costs BEFORE proceeding. Nothing paid happens
 * silently, and no free-tier ceiling is crossed without an explicit OK.
 *
 * Two meters that actually matter (verified June 2026):
 *   1. CLOUDFLARE BUILDS — Free plan: 500 builds/month PER ACCOUNT. Every push
 *      to any branch = 1 build. This is the wall you hit first at multi-site
 *      scale. Past it: Workers Paid ~US$5/mo = 5,000 builds.
 *   2. AGENT SDK CREDIT — Max 5x = US$100/month, per user, no rollover. When it
 *      runs out you're billed at API rates (if extra usage on) or hard-capped.
 *
 * Live metering (optional): set CLOUDFLARE_API_TOKEN + CF_ACCOUNT_ID to read the
 * real build count from the Pages deployments API. Agent SDK burn has no clean
 * per-account API yet — watch https://claude.ai/settings/usage. Without a token
 * this script uses the local ledger in .jabu/ledger.json and reminds you.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const BUILD_LIMIT = 500;          // Cloudflare free, per account, per month
const BUILD_WARN = 0.8;           // flag at 80%
const SDK_CREDIT_USD = 100;       // Max 5x monthly Agent SDK credit
const LEDGER = ".jabu/ledger.json";

const now = new Date();
const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

let ledger = { period, builds: 0, sdkSpendUsd: 0 };
if (existsSync(LEDGER)) {
  const saved = JSON.parse(readFileSync(LEDGER, "utf8"));
  if (saved.period === period) ledger = saved;          // same month → keep
}

const arg = process.argv[2];
if (arg === "log-build") { ledger.builds += 1; writeFileSync(LEDGER, JSON.stringify(ledger, null, 2)); }
if (arg === "log-spend") { ledger.sdkSpendUsd += parseFloat(process.argv[3] || "0"); writeFileSync(LEDGER, JSON.stringify(ledger, null, 2)); }

console.log(`\nCOST GUARDRAIL — period ${period}\n`);

// --- Cloudflare builds ---
const buildsUsed = ledger.builds;
const buildPct = buildsUsed / BUILD_LIMIT;
console.log(`Cloudflare builds : ${buildsUsed}/${BUILD_LIMIT} (${Math.round(buildPct * 100)}%)`);
let block = false;
if (buildPct >= 1) { console.log("  ✗ AT LIMIT — next push needs Workers Paid (~US$5/mo). STOP, confirm with Bok."); block = true; }
else if (buildPct >= BUILD_WARN) console.log("  ! Approaching limit — batch commits, or split clients across accounts.");
else console.log("  ✓ within free tier");

// --- Agent SDK credit ---
const spend = ledger.sdkSpendUsd;
const spendPct = spend / SDK_CREDIT_USD;
console.log(`\nAgent SDK credit  : ~US$${spend.toFixed(2)}/US$${SDK_CREDIT_USD} (${Math.round(spendPct * 100)}%) [Max 5x]`);
if (spendPct >= 1) { console.log("  ✗ CREDIT EXHAUSTED — further runs bill at API rates or hard-cap. STOP, confirm."); block = true; }
else if (spendPct >= BUILD_WARN) console.log("  ! Most of the monthly credit used — confirm before large runs.");
else console.log("  ✓ within monthly credit (verify at /settings/usage)");

console.log(`\nStructural ceilings to remember:`);
console.log(`  - 100 Pages projects per Cloudflare account (soft cap)`);
console.log(`  - Agent SDK credit is PER USER, no rollover, resets monthly`);
console.log(`  - Sustained multi-client load → a direct API key with a spend cap`);
console.log(`    is more predictable than burning subscription credit\n`);

if (block) { console.error("GUARDRAIL: a ceiling is hit. Get explicit OK before proceeding.\n"); process.exit(1); }
console.log("GUARDRAIL: clear to proceed.\n");
