import { getCollection, getEntry } from 'astro:content';
import { personPath } from './urls';

/**
 * Surname -> anchor on /people/, for linking BibTeX authors to their profile.
 *
 * Replaces _data/coauthors.yml, which listed surnames (including Sophie
 * Corallo's maiden name "Schulz") against hand-written /people/#… URLs. Here
 * the anchors come from the people collection's ids, so a renamed person
 * cannot leave a stale link behind.
 */
export async function peopleLinks(): Promise<Map<string, string>> {
  const people = await getCollection('people');
  const map = new Map<string, string>();
  for (const person of people) {
    for (const surname of person.data.surnames) {
      map.set(surname.toLowerCase(), personPath(person.id));
    }
  }
  return map;
}

/** People in display order, with name and ORCID resolved from authors.yml. */
export async function members() {
  const people = await getCollection('people');
  return Promise.all(
    people
      .sort((a, b) => a.data.order - b.data.order)
      .map(async (person) => {
        const author = await getEntry(person.data.author);
        if (!author)
          throw new Error(`people/${person.id}: author ${person.data.author.id} missing`);
        return { id: person.id, ...person.data, name: author.data.name, orcid: author.data.orcid };
      }),
  );
}
