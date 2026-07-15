/**
 * consts.ts — THE ONLY FILE EDITED PER SITE (MH Painting instance).
 *
 * Every business fact, brand token and service lives here; pages read from this
 * object and never hardcode a phone, address, service or colour.
 *
 * Claims discipline (EKO §6): only what is verifiably true is asserted —
 *   - 9 years is MAX'S personal experience, never "years in business" (Co. is new).
 *   - Only Dulux Accredited + fully insured (NOT Master Painters / Resene / coatings).
 *   - Reviews mirror GBP exactly (5.0 / 30) — single source, injected everywhere.
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
  // Each `icon` names a file in public/icons/ (real commissioned clay-render
  // icons — see docs brief "Fresh Coat" v1 §1). One per service, kept here so
  // the icon a service shows is a single-sourced fact like the copy.
  services: [
    { title: "New build interiors",  icon: "icon-house.png",    blurb: "New build interiors require speed and flexibility without sacrificing quality. We prep thoroughly, then spray-finish everything except the final coat on the walls, which we cut and roll to perfection." },
    { title: "New build exteriors",  icon: "icon-roller.png",   blurb: "With ever-changing manufacturer specs, it's important to stay up to date so you never run the risk of voiding the cladding warranty. We carry out the tailored process from prep to final coat with speed and precision." },
    { title: "Repaint interiors",    icon: "icon-interior.png", blurb: "When repainting the interior of a home, we assess the condition and select the correct preparation and system for excellent adhesion and finish. Once we start, we treat your home like it's our own — tidy and respectful, every step of the way." },
    { title: "Repaint exteriors",    icon: "icon-brush.png",    blurb: "Repainting exteriors starts with proper prep — washed, scraped, sanded, filled and primed, depending on what the surface needs. The right system is then applied for excellent adhesion and a finish that stands up to New Zealand's harsh weather." },
    { title: "Plastering",           icon: "icon-trowel.png",   blurb: "A quality paint job starts with quality plastering. New builds get three coats to all joins and screws, sanded back and light-checked. Older homes get cracks dug out, re-taped and plastered properly so they stay gone — kept tidy every step of the way." },
    { title: "Roof painting",        icon: "icon-roof.png",     href: "/roof-painting-auckland", id: "roof-painting", blurb: "The right paint for your roof type makes all the difference. Properly treated, properly coated and built to handle New Zealand's harsh weather — a premium finish that adds years back onto your roof." },
  ],

  // Services asserted in schema only — real & offered, but no service card (Max's call).
  schemaServices: [
    { title: "Commercial painting", blurb: "Commercial painting for builders and businesses across Auckland and Northland — interiors and exteriors prepped and finished to the same standard as our residential work." },
  ],

  // Roof substrates Max paints — confirmed by Freddie 2026-07-16, feeds the
  // /roof-painting-auckland page. Free house wash (So Clean) does NOT apply
  // to roof jobs — full exterior repaints only; never state it on that page.
  roofSubstrates: ["long-run steel", "corrugated iron", "concrete tile", "Decramastic"],
  roofVideo: {
    youtubeId: "5VdfSKiGCJk",
    title: "Roof Repainting Before & After — Auckland Painters | mh painting", // real YouTube title, verified
    description: "Roof repainting in north Auckland — before and after. A metal roof cleaned, prepped and recoated by MH Painting to bring it back to a clean, protected finish.",
    uploadDate: "2026-06-04T23:54:44-07:00", // real upload date, verified from the YouTube watch page — never guess this
  },

  // NOTE (2026-07-16 roof brief): this is a DELIBERATELY NARROWER list than
  // `areaServed` above — it adds Huapai/Waimauku/Milldale and drops Takapuna/
  // Long Bay/Albany/Browns Bay/Whangaparāoa/North Shore/Hibiscus Coast/Rodney/
  // Auckland. Scoped to the roof page only pending confirmation of whether
  // this should also replace `areaServed` sitewide — see audit in chat.
  // Single source for the roof page's Service schema + "Where we paint
  // roofs" copy; do not retype this list anywhere.
  serviceAreas: {
    primaryCorridor: [
      "Kumeu", "Huapai", "Riverhead", "Waimauku", "Helensville",
      "Silverdale", "Millwater", "Milldale", "Orewa", "Warkworth",
    ],
  },

  // --- Trust signals (read by pages; deliberately NOT in schema to avoid self-serving review markup) ---
  experienceYears: 9,                    // MAX's hands-on experience ("9 years on the tools"). NEVER render as business age. Confirmed accurate by Max at go-live (2026-07-16).
  yearsInBusiness: null,                 // Company newly registered — no business-age claim (EKO §6). Keep null.
  accreditations: ["Dulux Accredited Painter"],
  insured: true,
  reviews: {
    rating: 5.0, count: 30, url: "https://g.page/r/CcHmBz0_i51sEBM/review",
    // From the MH Painting Limited Google Business Profile (5.0 / 30).
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

  // --- Entity graph (sameAs) — review write-link is a CTA, not a profile.
  // Facebook/Instagram intentionally absent — no placeholder links (2026-07-16 brief). ---
  sameAs: [
    "https://www.linkedin.com/in/max-hindley-982b633a8/",
    "https://www.youtube.com/channel/UCMg_AeF09TxhXhpOokr91bA",
  ],

  // --- Brand tokens (MH palette: charcoal / terracotta / cream) ---
  // "Fresh Coat" adds the tonal range (soft/deep variants) the redesign's
  // depth (nav blur, marquee, scoper panel, final CTA scrim) needs — same
  // three-colour family as the original Wet Edge tokens above, just more of it.
  brand: {
    bg: "#F4EFE6",          // warm cream
    bgDeep: "#EAE3D5",      // cream, one shade down (area band, cards-on-cream)
    ink: "#221F1C",         // charcoal
    inkSoft: "#6b6053",     // muted warm grey — secondary body text on cream (unchanged, sitewide)
    charcoalSoft: "#33302C",  // charcoal, one shade up — dark PANEL fills (scoper, marquee-adjacent)
    inkDeep: "#191714",     // charcoal, darkest (final CTA backdrop)
    accent: "#BD6A4A",      // terracotta
    accentDeep: "#9E5237",  // terracotta, darkest (hovers/solid-btn depth)
    accentSoft: "#D08A6E",  // terracotta, lightest (on-dark accents/labels)
    line: "#e2d9c9",        // soft warm divider
    fontDisplay: "'Fraunces', Georgia, serif",
    fontBody: "'Inter', -apple-system, sans-serif",
  },
} as const;
