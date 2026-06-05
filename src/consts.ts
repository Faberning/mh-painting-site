/**
 * consts.ts — THE ONLY FILE EDITED PER SITE (MH Painting instance).
 *
 * Every business fact, brand token and service lives here; pages read from this
 * object and never hardcode a phone, address, service or colour.
 *
 * Claims discipline (EKO §6): only what is verifiably true is asserted —
 *   - 7 years is MAX'S personal experience, never "years in business" (Co. is new).
 *   - Only Dulux Accredited + fully insured (NOT Master Painters / Resene / coatings).
 *   - Reviews mirror GBP exactly (5.0 / 15) — single source, injected everywhere.
 *   - Free house wash is delivered via partner So Clean — credited, not implied in-house.
 * Service-area business: address + geo are intentionally omitted from schema;
 *   areaServed carries the location signal instead (per Bok: "area service").
 */

export const BUSINESS = {
  // --- Identity ---
  name: "mh painting",
  legalName: "MH Painting Limited",
  nzbn: "9429048898102",
  owner: "Max Hindley",
  tagline: "New builds, repaints and plastering — north Auckland",
  seoTitle: "House & New Build Painters, North Auckland | MH Painting", // home <title> (<=65)
  url: "https://mhpainting.co",
  logo: "/logo.png",

  // --- Contact / NAP (mobile only; address hidden — service-area business) ---
  phone: "020 4076 7979",
  email: "max@mhpainting.co",
  // address + geo intentionally omitted: areaServed-only (Bok decision).
  // Bounded by Takapuna→Warkworth (S–N) and Long Bay→Helensville (E–W):
  // the North Shore, Hibiscus Coast, Rodney and the north-west.
  areaServed: [
    "Takapuna", "Long Bay", "Albany", "Browns Bay", "Silverdale", "Millwater",
    "Orewa", "Whangaparāoa", "Warkworth", "Kumeu", "Riverhead", "Helensville",
    "North Shore", "Hibiscus Coast", "Rodney", "Auckland",
  ],

  // --- Schema type ---
  schemaType: "HousePainter",
  priceRange: "$$",

  // --- Services (drive the services grid + Service schema). No steel coatings (Bok). ---
  // Order gives equal billing to new builds AND repaints/renovations (top row mixes both).
  services: [
    { title: "New build painting",          blurb: "Painting new homes inside and out, undercoat to topcoat. Interiors sprayed and rolled for an even, hard-wearing finish, and we work in with the build programme so painting doesn't hold the job up." },
    { title: "Exterior painting & repaints", blurb: "Repainting and protecting weatherboard, fibre-cement and plaster homes. Prep first — wash, scrape, fill and prime — then coats chosen to stand up to north Auckland sun and salt air. Tired exteriors brought back and sealed up properly." },
    { title: "Interior painting",            blurb: "Repainting and refreshing interiors — walls, ceilings, doors and trim — in the right system for each surface: hard-wearing enamels where they earn their keep, water-based elsewhere. Most of the finish is in the prep, so that's where the time goes." },
    { title: "New build plastering",         blurb: "Interior plastering and stopping on new builds: walls and ceilings flattened, stopped and sanded back so they're genuinely ready for paint, not just covered over." },
    { title: "Plastering",                   blurb: "Solid plastering, bagging and skim coats to even out tired or patchy walls — a smooth, sound base, whether it's a fresh surface or repairs before a repaint." },
    { title: "Roof painting",                blurb: "Washing, treating and recoating tired roofs in roof-grade systems, bringing the colour back and adding years before it needs doing again." },
  ],

  // --- Trust signals (read by pages; deliberately NOT in schema to avoid self-serving review markup) ---
  experienceYears: 9,                    // MAX's hands-on experience ("9 years on the tools"). NEVER render as business age.
  yearsInBusiness: null,                 // Company newly registered — no business-age claim (EKO §6). Keep null.
  accreditations: ["Dulux Accredited Painter"],
  insured: true,
  reviews: {
    rating: 5.0, count: 15, url: "https://g.page/r/CcHmBz0_i51sEBM/review",
    // Verbatim from the MH Painting Limited Google Business Profile (5.0 / 15).
    // Display-only (no review schema — see note above). Update from GBP only.
    featured: [
      { name: "Susan Bradburn", stars: 5,
        text: "We couldn't be happier with the exterior painting of our house recently. From start to finish they were professional…" },
      { name: "Danielle Bedford", stars: 5,
        text: "Max and his team are very reliable and have great attention to detail. Highly recommend." },
      { name: "Shyeanne Wynhard", stars: 5,
        text: "Max and his team were great to work with, super easy to communicate with, they worked fast and all at a reasonable price!" },
      { name: "Nick Watson", stars: 5,
        text: "I am a repeat customer, and value Max's professionalism, trustworthiness, and for consistently doing a great job at a good price." },
    ],
  },
  offer: "Free house wash with every full exterior repaint — through our partner So Clean.",

  // --- Entity graph (sameAs) — socials TODO; review write-link is a CTA, not a profile ---
  sameAs: [
    // "https://www.facebook.com/...",  // TODO
    // "https://www.instagram.com/...", // TODO
  ],

  // --- Brand tokens (MH palette: charcoal / terracotta / cream) ---
  brand: {
    bg: "#F4EFE6",          // warm cream
    ink: "#221F1C",         // charcoal
    inkSoft: "#6b6053",     // muted warm grey
    accent: "#BD6A4A",      // terracotta
    line: "#e2d9c9",        // soft warm divider
    fontDisplay: "'Fraunces', Georgia, serif",
    fontBody: "'Inter', -apple-system, sans-serif",
  },
} as const;
