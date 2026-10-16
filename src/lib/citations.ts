import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

type Pub = CollectionEntry<'publications'>;

const nameKey = (first: string, last: string) => `${first} ${last}`.trim().toLowerCase();

let users: Promise<Map<string, string>> | undefined;

/** Author name -> Scholar user id, including people.yml surnames (Schulz). */
function scholarUsers() {
  users ??= (async () => {
    const authors = await getCollection('authors');
    const byId = new Map(authors.map((a) => [a.id, a.data]));
    const map = new Map<string, string>();
    for (const { data } of authors) {
      if (data.scholar) map.set(data.name.toLowerCase(), data.scholar);
    }
    for (const { data } of await getCollection('people')) {
      const author = byId.get(data.author.id);
      if (!author?.scholar) continue;
      const first = author.name.split(' ')[0];
      for (const surname of data.surnames) map.set(nameKey(first, surname), author.scholar);
    }
    return map;
  })();
  return users;
}

/**
 * The paper's `USER:ARTICLE` key: its first author's profile, else the first
 * co-author's who has one. The bib's article id must come from that profile.
 */
export async function scholarKey(pub: Pub): Promise<string | undefined> {
  const id = pub.data.googleScholarId;
  if (!id) return undefined;
  const map = await scholarUsers();
  const user = pub.data.authors.map((a) => map.get(nameKey(a.first, a.last))).find(Boolean);
  return user && `${user}:${id}`;
}

async function papers() {
  const entry = await getEntry('citations', 'papers');
  return (entry?.data ?? {}) as Record<string, { citations: number }>;
}

/** 0 without a key or without data, which hides the count. */
export async function citationsFor(key?: string): Promise<number> {
  return key ? ((await papers())[key]?.citations ?? 0) : 0;
}

/** The paper on the profile its count comes from. */
export function scholarPaperUrl(key?: string): string | undefined {
  const user = key?.split(':')[0];
  return user
    ? `https://scholar.google.com/citations?view_op=view_citation&user=${user}&citation_for_view=${key}`
    : undefined;
}

/** The sum over papers.bib, each Scholar record once. */
export async function totalCitations(pubs: Pub[]) {
  const keys = new Set((await Promise.all(pubs.map(scholarKey))).filter(Boolean));
  const counts = await Promise.all([...keys].map(citationsFor));
  const meta = await getEntry('citations', 'metadata');
  return {
    total: counts.reduce((sum, count) => sum + count, 0),
    lastUpdated: (meta?.data as { last_updated?: string } | undefined)?.last_updated,
  };
}

/** Parsed as UTC, so the date does not shift with the build's timezone. */
export const formatUpdated = (iso: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
