// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ardoco.de',

  // The URL surface this site inherits is genuinely mixed: the approach and
  // listing pages are directories with trailing slashes (/approaches/lissa/),
  // while every conference page is a flat file without one (/c/icsa25, served
  // from c/icsa25.html). 'preserve' is the only build format that emits both,
  // mirroring src/pages exactly:
  //
  //   src/pages/approaches/[slug]/index.astro -> approaches/<slug>/index.html
  //   src/pages/c/[slug].astro                -> c/<slug>.html
  //
  // Because the surface is mixed, trailingSlash stays 'ignore' — 'always' or
  // 'never' would make half of it unreachable in dev.
  //
  // Caveat that bites: under 'preserve', Astro.url.pathname is the *file* path
  // ("/c/icsa25.html"), but the canonical URL published for years is
  // "/c/icsa25". Never build canonicals or sitemap entries from Astro.url
  // directly — go through canonical() in src/lib/urls.ts.
  trailingSlash: 'ignore',
  build: { format: 'preserve' },

  markdown: {
    shikiConfig: { theme: 'github-dark-default', wrap: true },
  },

  devToolbar: { enabled: false },
});
