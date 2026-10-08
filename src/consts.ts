/**
 * Single values that decide how the site behaves: where it lives, which
 * language it is in, where the code and the mailing list are. No words a reader
 * sees: the site's text is in `src/content/pages/` (the title, the tagline, the
 * nav and footer rows, every page's prose), and the works themselves in
 * `src/content/` and `src/data/`.
 */
export const SITE = {
  url: 'https://ardoco.de',
  lang: 'en',
  /** The home page's GitHub button. */
  repo: 'https://github.com/ardoco',
  email: 'ardoco@lists.kit.edu',
} as const;

/**
 * Drives the accent-colour cascade in tokens.css: whichever value lands on
 * <body data-section> re-points the neutral --sec-* aliases at one accent
 * family, so a single component set recolours itself per area of the site.
 *
 * A list rather than a bare union so the nav rows in
 * src/content/pages/site/nav.md are validated against it.
 */
export const SECTIONS = ['home', 'approaches', 'publications', 'people'] as const;
export type Section = (typeof SECTIONS)[number];
