import type { CollectionEntry } from 'astro:content';

type Conference = CollectionEntry<'conferences'>;

/** Entries that render a real page, i.e. everything that is not a redirect stub. */
const isPage = (c: Conference): boolean => c.data.redirectTo === undefined;

/**
 * Navbar and front-page order.
 *
 * `navOrder` came from the `children:` array in _pages/conferences.md, which
 * was the single list driving both. Entries without one (the redirect stubs)
 * are not listed anywhere.
 */
function byNavOrder(a: Conference, b: Conference): number {
  return (a.data.navOrder ?? Infinity) - (b.data.navOrder ?? Infinity);
}

export const listed = (all: Conference[]): Conference[] =>
  all.filter((c) => isPage(c) && c.data.navOrder !== undefined).sort(byNavOrder);

export const featured = (all: Conference[]): Conference[] =>
  listed(all).filter((c) => c.data.featured);

/** Human labels for the keys used in a conference entry's `links` maps. */
export const LINK_LABELS: Record<string, string> = {
  arxiv: 'arXiv',
  ieee: 'IEEE Xplore',
  acm: 'ACM DL',
  springer: 'Springer',
  kitopen: 'KITopen',
  zenodo: 'Zenodo',
  repo: 'GitHub',
  pptx: 'PPTX',
  pdf: 'PDF',
};

/**
 * Slides keys carry a presentation venue as a prefix: `se26_pdf` is the SE 2026
 * deck, `icsa23_pdf` the ICSA 2023 one. The old Liquid derived the label by
 * string surgery on the key; same rule, in one place.
 */
export function slideLabel(key: string): string {
  const m = key.match(/^(.+)_(pdf|pptx)$/);
  if (m) return `${m[2].toUpperCase()} (${m[1].replace(/[-_]/g, ' ').toUpperCase()})`;
  return LINK_LABELS[key] ?? key.toUpperCase();
}
