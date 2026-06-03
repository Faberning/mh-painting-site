/**
 * projects.ts — case-study content (single source). Migration-ready copy crawled
 * from the live Squarespace site; metas are NEW (the old pages had none).
 * Accuracy fixes applied: Warkworth (was "Walkworth"); Mt Eden factory body
 * (was "Mount Wellington"). EKO §6 — every claim traces to a real, completed job.
 */
export interface Project {
  slug: string;
  title: string;       // page <h1>
  navTitle: string;    // short, for <title> prop
  tag: string;
  meta: string;        // <=160
  body: string[];      // paragraphs
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "langs-beach-new-build",
    title: "Langs Beach new build",
    navTitle: "Langs Beach new build",
    tag: "New build · coastal",
    meta: "Architectural new build at Langs Beach — black enamel ceilings, sprayed MDF and Hardies weatherboard in dark tones. New build painting by MH Painting.",
    featured: true,
    body: [
      "A new build in a private Langs Beach community, interior and exterior. Black enamel on all external-facing interior window and door frames, with internal frames in enamel matched to the walls.",
      "The client wanted a black ceiling, so we did it in enamel — it cleans without wearing. A smooth black enamel ceiling means every pinhole filled, MDF joins sanded flush and the surface sprayed for a seamless finish.",
      "The exterior is horizontal and vertical Hardies weatherboard, which lets dark colours sit on the wall without the sun-related warping you'd get on timber.",
    ],
  },
  {
    slug: "mangawhai-estuary-new-build",
    title: "Mangawhai Estuary new build",
    navTitle: "Mangawhai Estuary",
    tag: "New build · coastal",
    meta: "Black cedar and bagged-brick exterior at Mangawhai Estuary, finished in Resene CoolColour. New build exterior painting by MH Painting.",
    featured: true,
    body: [
      "A Mangawhai new build, exterior. Vertical cedar and hardwood painted black, with the brickwork bagged and skimmed.",
      "Resene CoolColour was used on request to reduce heat absorption despite the dark tones, and the soffits were painted black for a consistent finish.",
    ],
  },
  {
    slug: "waipu-bach",
    title: "Waipu bach",
    navTitle: "Waipu bach",
    tag: "New build · coastal",
    meta: "Interior painting of a Waipu new-build bach — raking ceilings prepped and topcoated for an even finish. Interior painting by MH Painting.",
    body: [
      "A new build Waipu bach, interior only. The raking ceiling brings in a lot of natural light, so we took extra care on surface prep and topcoating to keep the finish even and high quality.",
      "Completed efficiently as part of a larger batch of work in the area.",
    ],
  },
  {
    slug: "sudima-hotel-mural",
    title: "Sudima Hotel mural",
    navTitle: "Sudima Hotel mural",
    tag: "Commercial",
    meta: "Large-format geometric mural on the Sudima Hotel, applied from a swing stage with precise masked linework. Commercial painting by MH Painting.",
    body: [
      "An abstract geometric mural on the Sudima Hotel, painted from a swing stage.",
      "Careful masking and one colour at a time for clean, precise lines.",
    ],
  },
  {
    slug: "langs-waterfront-new-build",
    title: "Langs waterfront new build",
    navTitle: "Langs waterfront",
    tag: "New build · coastal",
    meta: "Waterfront new build at Langs Beach — Wood-X oiled cedar and Resene two-part epoxy on structural steel. New build painting by MH Painting.",
    body: [
      "A Langs Beach bach overlooking the water, interior and exterior. The cedar weatherboard was finished with high-quality Wood-X oil.",
      "The external structural steel was coated with a Resene two-part epoxy for durability in a tough coastal setting.",
    ],
  },
  {
    slug: "little-manly-cliff-house",
    title: "Little Manly cliff house",
    navTitle: "Little Manly cliff house",
    tag: "Repaint · Hibiscus Coast",
    meta: "Full repaint of a Little Manly cliff house — oil-to-water enamel conversion and sprayed doors. Repaints by MH Painting, Hibiscus Coast.",
    featured: true,
    body: [
      "A Little Manly cliff property repainted inside and out. Just purchased and not yet moved into, with carpets being replaced — so the doors were sprayed for the best possible finish.",
      "The interior was oil-based enamel, converted to water-based enamel with careful sanding and a quality undercoat for adhesion. The exterior was sanded, spot-primed, filled and given two topcoats.",
    ],
  },
  {
    slug: "board-and-batten-warkworth",
    title: "Warkworth board & batten new build",
    navTitle: "Warkworth board & batten",
    tag: "New build · Rodney",
    meta: "Black board-and-batten new build in Warkworth, back-primed and three-coat finished for durability. New build exterior painting by MH Painting, Rodney.",
    featured: true,
    body: [
      "A board-and-batten new build in Warkworth, finished with a three-coat system.",
      "Three coats on all exterior-facing cladding, and two coats on the backs, bottoms and tops of every board and batten before install — the best protection against NZ's wet, windy weather.",
    ],
  },
  {
    slug: "mount-eden-factory",
    title: "Mount Eden factory respray",
    navTitle: "Mount Eden factory",
    tag: "Commercial",
    meta: "Factory respray in Mount Eden — rust treatment, primer and durable roof-grade topcoats, completed in a week. Commercial painting by MH Painting.",
    body: [
      "A sprayed factory in Mount Eden — a heavy-duty wash, spot rust treatment and primer throughout, then two topcoats of a quality exterior roof product.",
      "Completed with scissor and boom lifts in a week.",
    ],
  },
];
