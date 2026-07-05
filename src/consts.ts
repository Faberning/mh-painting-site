/**
 * consts.ts — THE ONLY FILE EDITED PER SITE (MH Painting instance).
 *
 * Every business fact, brand token and service lives here; pages read from this
 * object and never hardcode a phone, address, service or colour.
 *
 * Claims discipline (EKO §6): only what is verifiably true is asserted —
 *   - 9 years is MAX'S personal experience, never "years in business" (Co. is new).
 *   - Only Dulux Accredited + fully insured (NOT Master Painters / Resene / coatings).
 *   - Reviews mirror GBP exactly (5.0 / 26) — single source, injected everywhere.
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
  // Six cards: new build + repaint (interiors/exteriors), plastering, roof. Commercial
  // painting is asserted in schema only (schemaServices) — no card per Max.
  services: [
    { title: "New build interiors",  blurb: "Prepped thoroughly and spray-finished fast, with walls cut and rolled to a perfect final coat." },
    { title: "New build exteriors",  blurb: "Tailored to your cladding's specs, prep to final coat — so the warranty stays intact and the finish lasts." },
    { title: "Repaint interiors",    blurb: "The right prep and system for a lasting finish — and we treat your home like our own, tidy every step." },
    { title: "Repaint exteriors",    blurb: "Washed, scraped, sanded and primed, then coated in the right system to stand up to NZ weather." },
    { title: "Plastering",           blurb: "Three-coat plastering on new builds; cracks dug out and re-taped on older homes so they stay gone." },
    { title: "Roof painting",        blurb: "Treated and coated for your roof type — a premium finish built for NZ weather that adds years back." },
  ],

  // Services asserted in schema only — real & offered, but no service card (Max's call).
  schemaServices: [
    { title: "Commercial painting", blurb: "Commercial painting for builders and businesses across Auckland and Northland — interiors and exteriors prepped and finished to the same standard as our residential work." },
  ],

  // --- Trust signals (read by pages; deliberately NOT in schema to avoid self-serving review markup) ---
  experienceYears: 9,                    // MAX's hands-on experience ("9 years on the tools"). NEVER render as business age.
  yearsInBusiness: null,                 // Company newly registered — no business-age claim (EKO §6). Keep null.
  accreditations: ["Dulux Accredited Painter"],
  insured: true,
  reviews: {
    rating: 5.0, count: 26, url: "https://g.page/r/CcHmBz0_i51sEBM/review",
    // From the MH Painting Limited Google Business Profile (5.0 / 26).
    // Single source — feeds the footer line and the contact-page carousel heading.
    // Display-only (no review schema). Update rating + count from GBP only.
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
