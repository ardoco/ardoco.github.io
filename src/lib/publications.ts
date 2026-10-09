import type { CollectionEntry } from 'astro:content';
import { conferencePath } from './urls';

type Pub = CollectionEntry<'publications'>;

/** A reference to a venues.yml entry, as `abbr` on a publication. */
export type VenueRef = NonNullable<Pub['data']['abbr']>;

/**
 * Newest first, fully deterministic.
 *
 * Year and month alone leave same-month papers in whatever order the BibTeX
 * parser happened to emit, which reshuffles the list between builds and makes
 * diffs of the rendered output useless. Venue and title break the remaining
 * ties.
 */
export function byNewest(a: Pub, b: Pub): number {
  const d = b.data.year - a.data.year;
  if (d !== 0) return d;
  const m = (b.data.month ?? 0) - (a.data.month ?? 0);
  if (m !== 0) return m;
  const v = (a.data.abbr?.id ?? '').localeCompare(b.data.abbr?.id ?? '');
  if (v !== 0) return v;
  return a.data.title.localeCompare(b.data.title);
}

/** Group into descending year buckets for the year headings on /publications/. */
export function byYear(pubs: Pub[]): { year: number; pubs: Pub[] }[] {
  const groups = new Map<number, Pub[]>();
  for (const p of pubs) {
    const list = groups.get(p.data.year);
    if (list) list.push(p);
    else groups.set(p.data.year, [p]);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, pubs: list.sort(byNewest) }));
}

/** The paper's DOI as a link, else its `url`; undefined when it has neither. */
export function doiOrUrl(pub: Pub): string | undefined {
  return pub.data.doi ? `https://doi.org/${pub.data.doi}` : pub.data.url;
}

/**
 * Where a link "to the paper" goes: its own page under /c/ when it has one —
 * that page carries the abstract, slides and every other link — otherwise
 * straight to the DOI, otherwise to its `url`. Undefined when there is none.
 */
export function paperHref(pub: Pub): string | undefined {
  if (pub.data.infoSlug) return conferencePath(pub.data.infoSlug);
  return doiOrUrl(pub);
}
