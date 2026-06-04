// GALLERY RE-SYNC TOOL — re-pulls project photos from the live Squarespace site.
// Crawl live Squarespace project pages, extract gallery images in DOM order,
// download highest-res variant (capped ~2000px) into public/projects/<slug>/NN.ext
// Usage: node scripts/fetch-galleries.mjs [--dry]
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const BASE = "https://www.mhpainting.co";
const CAP = 2000; // max width px
const DRY = process.argv.includes("--dry");

const PROJECTS = [
  ["langs-beach-new-build", "/projects/langs-beach-new-build", 12],
  ["mangawhai-estuary-new-build", "/projects/mangawhai-estuary-new-build", 4],
  ["waipu-bach", "/projects/waipu-bach", 4],
  ["sudima-hotel-mural", "/projects/sudima-hotel-mural", 2],
  ["langs-waterfront-new-build", "/projects/langs-waterfront-new-build", 6],
  ["little-manly-cliff-house", "/projects/little-manly-cliff-house", 8],
  ["board-and-batten-warkworth", "/projects/little-manly-cliff-house-jwyrw", 4],
  ["mount-eden-factory", "/projects/little-manly-cliff-house-jwyrw-fr2ct", 1],
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

async function getHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// Extract gallery image base URLs in DOM order.
// Gallery images = <img> with a data-image-dimensions attribute (logos/icons lack it).
// Prefer data-src (lazy-load real URL), fall back to src. Strip query, dedupe by path.
function extractGallery(html) {
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const out = [];
  const seen = new Set();
  for (const tag of imgs) {
    if (!/data-image-dimensions="/.test(tag)) continue;
    let u = (tag.match(/data-src="([^"]+)"/) || [])[1]
         || (tag.match(/(?<!data-)\bsrc="([^"]+)"/) || [])[1];
    if (!u) continue;
    if (u.startsWith("//")) u = "https:" + u;
    if (!/squarespace-cdn\.com\/content/.test(u)) continue;
    // Exclude the MH Painting brand wordmark logo (header/footer), which also
    // carries data-image-dimensions but is not gallery content.
    if (/MH\+?PAINTING/i.test(u)) continue;
    const base = u.split("?")[0];
    if (seen.has(base)) continue;
    seen.add(base);
    out.push(base);
  }
  return out;
}

function extOf(url) {
  const m = url.match(/\.([a-zA-Z0-9]+)$/);
  return m ? m[1].toLowerCase() : "jpg";
}

let summary = [];
for (const [slug, path, expected] of PROJECTS) {
  const url = BASE + path;
  let bases = [];
  let err = null;
  try {
    const html = await getHtml(url);
    bases = extractGallery(html);
  } catch (e) {
    err = e.message;
  }
  const got = bases.length;
  const mark = err ? "ERR" : got === expected ? "OK " : "!! ";
  console.log(`${mark} ${slug.padEnd(30)} got ${got} / expected ${expected}${err ? "  " + err : ""}`);

  if (!DRY && !err) {
    for (let i = 0; i < bases.length; i++) {
      const src = `${bases[i]}?format=${CAP}w`;
      const name = String(i + 1).padStart(2, "0") + "." + extOf(bases[i]);
      const dest = `public/projects/${slug}/${name}`;
      const res = await fetch(src, { headers: { "User-Agent": UA } });
      if (!res.ok) { console.log(`    download FAIL ${name}: HTTP ${res.status}`); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, buf);
      console.log(`    ${name}  ${(buf.length/1024).toFixed(0)}KB  ${bases[i].split("/").pop()}`);
    }
  }
  summary.push({ slug, got, expected, ok: !err && got === expected });
}

console.log("\n=== SUMMARY ===");
for (const s of summary) console.log(`${s.ok ? "OK " : "!! "} ${s.slug.padEnd(30)} ${s.got}/${s.expected}`);
const bad = summary.filter(s => !s.ok);
console.log(bad.length ? `\n${bad.length} mismatch(es).` : "\nAll counts match.");
