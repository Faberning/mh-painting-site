import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// site MUST match BUSINESS.url in src/consts.ts — drives canonical + sitemap.
export default defineConfig({
  site: "https://mhpainting.co",
  integrations: [sitemap()],
});
