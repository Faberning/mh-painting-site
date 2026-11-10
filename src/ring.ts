/**
 * ring.ts — live posts and videos that belong to each geo-lever page
 * (the "corroboration ring"). Each page links out to its own posts so the
 * page, the GBP post and the YouTube video all point at each other.
 *
 * Add an entry ONLY once the post/video is live and public. Never link a
 * private or unlisted video, and never a draft post.
 */
export interface RingLinks {
  gbpPost?: string; // public Google post URL (searchUrl from the GBP API)
  youtubeId?: string; // public video on @mhpainting-ltd only
  youtubeUploadDate?: string; // ISO date from the YouTube API, for VideoObject
}

export const RING: Record<string, RingLinks> = {
  "/dulux-accredited-painter-auckland/": {
    // localPosts/4838353422543723350, live since 2026-11-03.
    gbpPost: "https://local.google.com/place?id=7826564831162918593&use=posts&lpsid=CAIQACoeChxtc3BfaDpvNklYbTZXNnhVY1lUbUlyU3FxLVdB",
  },
  "/house-painters-millwater/": {},
  "/house-painting-rodney/": {},
};
