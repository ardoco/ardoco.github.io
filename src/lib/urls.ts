import { SITE } from '../consts';

/**
 * The public URL for a built page.
 *
 * astro.config.mjs uses `build.format: 'preserve'`, which is what lets this
 * site emit both /approaches/lissa/index.html and c/icsa25.html from one
 * config. The cost is that `Astro.url.pathname` is the *file* path — you get
 * "/c/icsa25.html" and "/approaches/lissa/index.html", neither of which is the
 * address anyone has ever used.
 *
 * Every canonical link, OG url and sitemap entry goes through here instead.
 */
function canonicalPath(pathname: string): string {
  let p = pathname;
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  else if (p.endsWith('.html') && p !== '/404.html') p = p.slice(0, -'.html'.length);
  return p === '' ? '/' : p;
}

export function canonical(pathname: string): string {
  return new URL(canonicalPath(pathname), SITE.url).href;
}

/** Public URL of a conference page, e.g. "/c/icsa25". */
export const conferencePath = (slug: string): string => `/c/${slug}`;

/** Public URL of an approach page, e.g. "/approaches/lissa/". */
export const approachPath = (slug: string): string => `/approaches/${slug}/`;

/** Public URL of a person's anchor on /people/. */
export const personPath = (id: string): string => `/people/#${id}`;
