import type { CollectionEntry } from 'astro:content';

type Pub = CollectionEntry<'publications'>;

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
