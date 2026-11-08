/**
 * faq.ts — single source for the FAQ page copy + FAQPage schema, so they can
 * never drift apart. Qualitative, no-figures copy (EKO §6 claims-clean) from
 * the 2026-07-16 brief. Also the source array for the WF3-MH keyword set
 * (blog/LinkedIn automation) — not built this pass, but the same data.
 */
import { BUSINESS } from "./consts";
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

// Millwater Q&As (2026-11-02 geo lever). Question set from live Google
// People Also Ask for Millwater/Auckland painting queries; answers built on
// Max's real Pioneer Rise, Millwater repaint (street only, never the
// number). One job is one job: nothing here claims Millwater homes as a
// group have failing primer or says anything about any builder's materials.
// Scoped FAQPage schema on /house-painters-millwater only.
export const MILLWATER_FAQS: Faq[] = [
  {
    question: "How often should you repaint the outside of a house?",
    answer:
      "Watch the paint, not the calendar. Chalking (a powdery residue when you run a hand over the cladding), fading on the sunniest walls, hairline cracking, and any flaking or blistering are the signs the coating is giving up. A lot of Millwater homes are now coming up to their first full exterior repaint. Catch it while the paint is just tired and it's a repaint; leave it until it's flaking back to bare timber and there's a lot more prep in the job.",
  },
  {
    question: "Can you just paint over peeling paint?",
    answer:
      "No. New paint is only as good as what it's stuck to, and peeling paint isn't stuck to anything. Every loose and flaking area has to come off first. On our Pioneer Rise repaint in Millwater we lightly sanded the whole house, then sanded the flaked areas hard until there was nothing left but sound, adhered paint and bare weatherboard. Only then did undercoat go on.",
  },
  {
    question: "Why is my weatherboard paint peeling or blistering?",
    answer:
      "The usual causes are moisture getting in behind the paint, or prep and priming that wasn't right in the first place. On the Pioneer Rise house it was the second: the factory primer on the weatherboards had failed when the house was built, so when we sanded back we hit bare wood rather than primer. That's why it was flaking and blistering back to the substrate. If yours is blistering down to bare timber, it needs proper sanding back and priming, not another coat over the top.",
  },
  {
    question: "Why do quotes for similar-looking houses come back so different?",
    answer:
      "Because two houses that look the same from the street can need very different amounts of prep. A house that's just chalky and faded needs a wash, a light sand and two coats. A house where the paint has let go back to bare timber needs hours of sanding, spot priming, undercoats, filling and gapping before the topcoats. Ask every painter what prep is included before you compare prices.",
  },
  {
    question: "Do you paint new builds in Milldale as well?",
    answer:
      "Yes. We do new build interiors and exteriors as well as repaints, so we cover both: first repaints in Millwater and new builds going up next door in Milldale.",
  },
];

// Dulux accreditation Q&As (2026-11-02 geo lever). Every Dulux programme
// fact here was checked against dulux.co.nz/services/find-a-painter-nz/ on
// 2026-11-02. NOT stated by Dulux, so never claim: "invite-only", a signed
// charter, or how often checks happen. Warranty left off on purpose
// (Freddie, 2026-11-02). Scoped FAQPage schema on the Dulux page only.
export const DULUX_FAQS: Faq[] = [
  {
    question: "What does Dulux Accredited Painter mean?",
    answer:
      "It means Dulux has selected the painter for its accredited painter programme. To be part of it, a painter has to hold current company registration as New Zealand law requires, carry public liability insurance with at least $2 million of cover, and meet Dulux's programme standards. Registration and insurance are monitored by an independent compliance service, not by Dulux itself.",
  },
  {
    question: "How do I find a Dulux Accredited painter in north Auckland?",
    answer:
      "There are two ways. You can fill in Dulux's Find a Painter form and Dulux will match you with accredited painters; there isn't a public list to browse. Or you can contact an accredited painter directly. We're mh painting, Dulux Accredited and working across north Auckland, so you can talk to us straight away.",
  },
  {
    question: "Is Dulux responsible for an accredited painter's work?",
    answer:
      "No, and Dulux says so plainly: accredited painters have to meet programme standards, but Dulux isn't responsible for their workmanship. The painter is. That's why it's still worth asking any painter what prep is included, what system they'll use and to see recent local work.",
  },
  {
    question: "What paint do you use?",
    answer:
      "Dulux is our standard. If you'd like Resene or another system, we'll use that instead. Whatever goes on, the result depends on the prep and on matching the product to the surface and the exposure.",
  },
  {
    question: "Dulux or Resene: which is better for an Auckland house?",
    answer:
      "We're Dulux Accredited, so read this knowing which side we're on. Both are premium paint systems made for New Zealand conditions, and we don't think either is the single best choice for every house. On a repaint, the prep and the right product for each surface make far more difference than the brand on the tin. If you've got a preference, tell us and we'll quote on it.",
  },
];

// Rodney Q&As (2026-11-08 geo lever). Question set from Google's AI Overview
// for "what are people asking about house painting in rodney nz" (cost,
// coastal weather, fresh paint hiding moisture, vetting a painter). Colour
// trends left out: no first-hand facts to add. Price and moisture-check
// facts come from consts (Max via Freddie, 2026-11-08). No Master Painters
// or warranty claims. Scoped FAQPage schema on /house-painting-rodney only.
export const RODNEY_FAQS: Faq[] = [
  {
    question: "How much does it cost to paint a house in Rodney?",
    answer:
      `Our average exterior repaint comes out ${BUSINESS.typicalExteriorRepaint}, but it depends a lot on the size of the house and how much prep it needs. Height and scaffolding, flaking paint back to bare timber, repairs, and the paint system all move the number. A chalky, faded single-storey house is a very different job from a two-storey house with sloping sections and paint that has let go. We come and look, explain what the house needs and why, and give you a fixed quote.`,
  },
  {
    question: "How do I protect exterior paint from the coastal weather?",
    answer:
      "Salt, wind-driven rain and strong UV break paint down faster on the coast than inland, especially on walls facing the sea. Protection comes from the prep and the system, not just the topcoat: sound, clean surfaces, the right primer for the substrate, and enough coats of a product suited to the exposure. On our Warkworth board and batten new build, every board and batten got two coats on the backs, bottoms and tops before it went up, then three coats on the outside. After that, watch the paint, not the calendar: chalking, fading and hairline cracks are the early signs it's due.",
  },
  {
    question: "Can fresh paint hide moisture or rot?",
    answer:
      `Yes. A new coat can make damp or rotting timber look fine for a while, and it will fail again from underneath. That's why we check before we paint, using ${BUSINESS.moistureChecks}. If the readings say there's moisture in the cladding, the cause gets sorted and any rotted timber gets cut out and repaired before anything is painted. If you're buying a recently painted house, the paint tells you nothing about what's under it, so get the house properly inspected.`,
  },
  {
    question: "How do I check a painter is reliable before I hire them?",
    answer:
      "Ask for a written quote that shows what's included, especially the prep and the paint system, not just a total. Check they carry public liability insurance: as a Dulux Accredited Painter we have to hold at least $2 million of cover and current company registration, and both are monitored independently. Ask to see recent work near you, and ask what they'll do if they find damage once they start. Be wary of any quote that's vague about prep.",
  },
];
