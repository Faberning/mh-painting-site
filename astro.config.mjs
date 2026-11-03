import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// site MUST match BUSINESS.url in src/consts.ts — drives canonical + sitemap.
export default defineConfig({
  site: "https://mhpainting.co",
  // Every page URL ends in "/": matches the sitemap, Cloudflare's default
  // auto-trailing-slash serving, and the URLs Google has already indexed.
  trailingSlash: "always",
  integrations: [sitemap()],
});
