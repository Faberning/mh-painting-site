/**
 * verticals/painting.ts — per-vertical overlay (EKO §13). Core engine is shared;
 * this captures what is specific to residential/new-build painting.
 */
export const PAINTING_VERTICAL = {
  id: "residential-painting",
  schemaType: "HousePainter",
  compliance: {
    regulator: "No occupational licence for painters; Master Painters NZ is voluntary. FTA: claims must be truthful.",
    forbiddenClaimPatterns: [
      'no "best" / "#1" / "leading" without a verifiable source',
      "NO Master Painters / Resene Eco.Decorator / coatings accreditation until the certificate is on file",
      'never state "X years in business" — the company is newly registered; only Max\'s personal experience is claimable',
      "house wash is via partner (So Clean) — credit the partner, do not imply in-house",
    ],
    requiredDisclosures: ["Company registration / NZBN", "Only accreditations actually held"],
    claimsTraceability: "strict",
  },
  leadForm: {
    fields: ["name", "email", "phone", "details", "company_url" /* honeypot */],
    routeTo: "max@mhpainting.co",
    source: "contact",
  },
  contentArchetypes: [
    "service pages: new build painting (wedge), exterior repaints, plastering",
    "area pages (only where real local proof exists): Warkworth/Rodney, Hibiscus Coast",
    "project case studies (one per real job)",
    "education/AEO: coastal salt air + dark weatherboards; when to repaint",
  ],
} as const;
