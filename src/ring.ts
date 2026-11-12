/**
 * ring.ts — live posts and videos that belong to each geo-lever page
 * (the "corroboration ring"). Each page links out to its own posts and
 * embeds its own video, so the page, the posts and the video all point at
 * each other.
 *
 * Add an entry ONLY once the post/video is live and public. Never link a
 * private or unlisted video, and never a draft post.
 */
export interface RingVideo {
  id: string; // public video on @mhpainting-ltd only
  uploadDate: string; // ISO date from the YouTube API (snippet.publishedAt)
  title: string; // must match the YouTube title
  description: string; // first line of the YouTube description
}

export interface RingLinks {
  gbpPost?: string; // public Google post URL (searchUrl from the GBP API)
  linkedinPost?: string; // Max's personal-profile post URL
  facebookPost?: string;
  instagramPost?: string;
  video?: RingVideo;
}

// The geo-lever pages, in the order they cross-link each other.
export const RING_PAGES: { path: string; label: string }[] = [
  { path: "/dulux-accredited-painter-auckland/", label: "What Dulux Accredited actually checks" },
  { path: "/house-painters-millwater/", label: "House painting in Millwater" },
  { path: "/house-painting-rodney/", label: "House painting in Rodney" },
  { path: "/roof-painting-auckland/", label: "Roof painting in north Auckland" },
];

export const RING: Record<string, RingLinks> = {
  "/dulux-accredited-painter-auckland/": {
    // localPosts/4838353422543723350, live since 2026-11-03.
    gbpPost: "https://local.google.com/place?id=7826564831162918593&use=posts&lpsid=CAIQACoeChxtc3BfaDpvNklYbTZXNnhVY1lUbUlyU3FxLVdB",
    // Video t4Gn-KyiZmQ is uploaded but PRIVATE (2026-11-10). Add it here
    // only once it is public:
    // video: { id: "t4Gn-KyiZmQ", uploadDate: "2026-11-10T03:44:53Z",
    //   title: "What Does Dulux Accredited Actually Check? | North Auckland Painter",
    //   description: "What a Dulux Accredited Painter has to have, what the accreditation doesn't cover, and how to find one in north Auckland without waiting to be matched." },
  },
  "/house-painters-millwater/": {
    // localPosts/4378894379906002447, posted 2026-11-12.
    gbpPost: "https://local.google.com/place?id=7826564831162918593&use=posts&lpsid=CAIQACoeChxtc3BfaDprdVpDcmd3OENDX2pmZHFSOURaMWZB",
  },
  "/house-painting-rodney/": {
    // localPosts/3973761207060502823, posted 2026-11-12.
    gbpPost: "https://local.google.com/place?id=7826564831162918593&use=posts&lpsid=CAIQACoeChxtc3BfaDpxTDlSS3BOdW9RdG5kTHRUM1hqeFhB",
  },
};
