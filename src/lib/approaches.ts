import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { APPROACH_GROUPS } from '../consts';
import { conferencePath } from './urls';
import { doiOrUrl, type VenueRef } from './publications';

type Approach = CollectionEntry<'approaches'>;

/**
 * Page order: by group in APPROACH_GROUPS order, then by `importance` within
 * the group. `importance` used to be one global sequence; since the groups
 * came in it only means something inside a group, so a bare sort on it would
 * interleave them. The title breaks a tie, so two equal numbers do not
 * reshuffle between builds.
 */
export function ordered(all: Approach[]): Approach[] {
  return [...all].sort(
    (a, b) =>
      APPROACH_GROUPS.indexOf(a.data.group) - APPROACH_GROUPS.indexOf(b.data.group) ||
      a.data.importance - b.data.importance ||
      a.data.title.localeCompare(b.data.title),
  );
}

/** What both approach pages render for one related paper. */
export interface RelatedPublication {
  title: string;
  /** Site path for a conference page, absolute URL for a paper elsewhere. */
  href: string;
  /** The short label line under the title. */
  venue: string | undefined;
  /** For the venue badge; absent when the BibTeX entry has no `abbr`. */
  abbr: VenueRef | undefined;
  year: number;
  month: number;
}

/**
 * Every paper that belongs to this approach, newest first: the conference
 * pages that name it, plus the papers the approach lists itself in
 * `publications`.
 *
 * The Jekyll version compared `conf.approaches` against `page.title` as
 * strings, so a renamed approach quietly emptied this list. The collection
 * stores references, so the join is by id and the build fails instead.
 *
 * Redirect stubs are left out of the conference side: they stand in for a
 * page that superseded them, which is listed in its own right. That is also
 * why direct publications exist — a paper whose only page is such a stub
 * (the TAAS journal extension) cannot be reached through `approaches:` on a
 * conference page without showing the paper it redirects to.
 *
 * A paper reachable both ways is listed once, as its conference page: that
 * page carries the abstract and links, which a bare DOI does not.
 */
export async function relatedPublications(approach: Approach): Promise<RelatedPublication[]> {
  const conferences = (await getCollection('conferences'))
    .filter((c) => c.data.redirectTo === undefined)
    .filter((c) => c.data.approaches.some((ref) => ref.id === approach.id));

  const found = new Map<string, RelatedPublication>();
  const withoutPub: RelatedPublication[] = [];

  for (const c of conferences) {
    const pub = c.data.publication ? await getEntry(c.data.publication) : undefined;
    const item: RelatedPublication = {
      title: c.data.title,
      href: conferencePath(c.id),
      venue: c.data.pubShortName ?? c.data.conferenceName,
      abbr: pub?.data.abbr,
      year: pub?.data.year ?? c.data.year ?? 0,
      month: pub?.data.month ?? 0,
    };
    if (pub) found.set(pub.id, item);
    else withoutPub.push(item);
  }

  for (const ref of approach.data.publications) {
    if (found.has(ref.id)) continue;
    const pub = await getEntry(ref);
    // The entry's `html` slug is no use here: for these papers it names a
    // redirect stub, which would bounce to a different paper.
    const href = doiOrUrl(pub);
    if (!href)
      throw new Error(`approaches/${approach.id}: publication ${pub.id} has no DOI or url`);
    const where = pub.data.abbr?.id ?? pub.data.journal ?? pub.data.booktitle;
    found.set(pub.id, {
      title: pub.data.title,
      href,
      venue: where ? `${where} ${pub.data.year}` : String(pub.data.year),
      abbr: pub.data.abbr,
      year: pub.data.year,
      month: pub.data.month ?? 0,
    });
  }

  return [...found.values(), ...withoutPub].sort(
    (a, b) => b.year - a.year || b.month - a.month || a.title.localeCompare(b.title),
  );
}

/**
 * One badge per venue, newest paper first: two papers at the same conference
 * would otherwise print its badge twice on the approach's card.
 */
export async function relatedVenues(approach: Approach): Promise<VenueRef[]> {
  const venues = new Map<string, VenueRef>();
  for (const { abbr } of await relatedPublications(approach)) {
    if (abbr && !venues.has(abbr.id)) venues.set(abbr.id, abbr);
  }
  return [...venues.values()];
}
