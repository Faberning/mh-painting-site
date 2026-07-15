/**
 * faq.ts — single source for the FAQ page copy + FAQPage schema, so they can
 * never drift apart. Qualitative, no-figures copy (EKO §6 claims-clean) from
 * the 2026-07-16 brief. Also the source array for the WF3-MH keyword set
 * (blog/LinkedIn automation) — not built this pass, but the same data.
 */
export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "How much does it cost to paint a house in Auckland?",
    answer:
      "Every house is different, so a real number only comes from a proper look. What moves the price most: the size and height of the building, how much prep the surfaces need (flaking paint, bare timber and repairs all add time), whether it's interior, exterior or both, and the paint system the job calls for. We'd rather walk the job, explain what it needs and why, and give you a fixed quote than throw out a per-metre guess that changes on the day.",
  },
  {
    question: "Why do painting quotes vary so much?",
    answer:
      "Two quotes for the \"same\" job often aren't the same job. The big swings come from prep (a quick scuff-and-coat vs proper sanding, filling and priming), whether scaffolding or access gear is needed, how many coats and what quality of paint is included, and whether tricky detail — cladding profiles, high work, enamel finishes — is priced in or skipped. A cheap quote usually means something's been left out; ask what's included before you compare.",
  },
  {
    question: "How often should you repaint on the coast or in salt air?",
    answer:
      "Coastal Auckland is hard on paint. Salt, wind-driven rain and strong UV break coatings down faster than they would inland, especially on elevations facing the sea. Sheltered walls can go many years; a fully exposed seaward face will always need attention sooner. The honest answer is to watch the paint, not the calendar — chalking, fading and hairline cracking are the early signs it's time.",
  },
  {
    question: "Does dark paint fail faster in the sun?",
    answer:
      "Darker colours absorb more heat, which makes cladding expand and contract more and can shorten the life of the finish — a real consideration on sunny, exposed Auckland sites. Some product ranges build in heat-reflective technology specifically so you can use dark colours on exterior cladding without the same heat build-up. Choosing the right product for a dark colour is the difference between it lasting and it failing early.",
  },
  {
    question: "How often do interior walls need repainting?",
    answer:
      "Interiors are about wear as much as time. High-traffic areas — hallways, kids' rooms, kitchens — mark and scuff and want freshening sooner than a formal lounge. Kitchens, bathrooms and laundries take moisture and cooking grime, so they benefit from washable, higher-sheen finishes that hold up and clean up. If the walls still clean up well and the colour still suits you, there's no rush.",
  },
  {
    question: "What should you look for when hiring a painter in Auckland?",
    answer:
      "At a minimum: that they're properly insured, that they'll put a clear written quote in front of you showing what's included, and that they can explain the prep and paint system, not just the price. Accreditation is a good signal too — we're a Dulux Accredited Painter and fully insured. Ask to see recent local work, and be wary of any quote that's vague about prep.",
  },
  {
    question: "Should you DIY or get a professional for weatherboards and older homes?",
    answer:
      "You can DIY, but older homes and weatherboards are where it most often goes wrong. Weatherboard profiles, cladding junctions and older timber need proper prep — and homes built before the 1990s can carry lead-based paint, which needs careful handling. Two-storey and detailed work also brings access and safety into it. If the prep is beyond a weekend, it's usually worth getting it done right once.",
  },
  {
    question: "When's the best time of year to paint in Auckland?",
    answer:
      "Exteriors go best in the drier, warmer stretch — roughly late spring through to early autumn — when surfaces are dry and temperatures sit in the range paint needs to cure properly. Auckland's wet, humid winters aren't ideal for exterior coatings. Interiors can be done year-round. Good painters book out for the good weather, so it pays to line up exterior work early.",
  },
  {
    question: "How do you prep James Hardie / fibre-cement and rotted timber before painting?",
    answer:
      "Prep is the job — the paint is the easy part. Fibre-cement (like James Hardie) needs the surface clean, sound and the right primer for the substrate so the topcoat bonds and lasts. Rotted or damaged timber gets cut out and repaired or replaced before anything's painted — coating over rot just hides it for a season. Skipping prep is the number-one reason paint peels early.",
  },
  {
    question: "What paint holds up best in coastal Auckland?",
    answer:
      "There's no single \"best\" — it's about matching the product to the surface and the exposure. Coastal, sun-hit exteriors want durable, UV- and weather-resistant systems; interiors want the right sheen for the room. We'll talk you through the options for your place and why we'd pick one system over another, rather than defaulting to whatever's on the shelf.",
  },
  {
    question: "Is it worth repainting before selling?",
    answer:
      "Often, yes — but targeted, not wholesale. A tired exterior or scuffed, dated interior can quietly knock buyer confidence, while fresh, neutral paint photographs well and lifts first impressions. Sometimes a full repaint pays off; sometimes the smart move is a sharp exterior clean-up and touch-ups on the areas buyers actually notice. We'll give you a straight read on where the money's best spent for the sale.",
  },
  {
    question: "Do you really include a free house wash?",
    answer:
      "Yes — with every accepted full repaint we include a free house wash through our partner So Clean. A clean surface is also better prep, so it's not just a freebie: it helps the new coating bond and last.",
  },
];

// Roof-specific Q&As (2026-07-16 roof brief) — scoped FAQPage schema on
// /roof-painting-auckland only, not merged into the general FAQS above.
// Free house wash intentionally never mentioned here: So Clean applies to
// full exterior repaints only, not roof jobs.
export const ROOF_FAQS: Faq[] = [
  {
    question: "Is roof painting worth it?",
    answer:
      "If the roof's structurally sound, yes — a quality coat protects it and extends its life for a fraction of a re-roof. If the substrate's failing, no — and a straight painter will tell you that rather than sell you a coat that won't hold.",
  },
  {
    question: "Will roof painting fix a leak?",
    answer:
      "No. It's a protective coat, not a repair — it won't fix failed flashings or an existing structural leak. Those get sorted first; painting over a leak only hides it.",
  },
  {
    question: "How often should a house roof be painted?",
    answer:
      "There's no fixed number — it's about condition. Chalking, fading, moss and the first surface rust are the signs the coat is giving up. Recoat a sound roof at that point and you avoid slipping into repair territory.",
  },
  {
    question: "Does painting the roof help when selling?",
    answer:
      "Often — a clean, freshly coated roof lifts the look of the whole house and reads as well-kept, both in listing photos and from the street.",
  },
];
