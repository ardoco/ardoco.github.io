import type { CollectionEntry } from 'astro:content';
import { APPROACH_GROUPS } from '../consts';

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
