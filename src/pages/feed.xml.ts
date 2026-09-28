import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';
import { SITE } from '../consts';
import { conferencePath } from '../lib/urls';
import { listed } from '../lib/conferences';

/*
 * /feed.xml existed on the old site (jekyll-feed) and is in the sitemap, so it
 * keeps working. ARDoCo has no blog, so rather than publish an empty channel
 * the feed carries the paper pages — which is the thing that actually gets
 * added over time.
 */
export async function GET(context: { site: URL }) {
  const conferences = listed(await getCollection('conferences'));

  const items = await Promise.all(
    conferences.map(async (c) => {
      /*
       * The date comes from the BibTeX entry, not from the page's own `year`.
       * A conference page has a year and nothing finer; the publication it
       * points at has the month too, and every entry in papers.bib carries one.
       *
       * The FIRST of the month, because a paper has a month and not a day:
       * that is the conventional expansion of a month-precision date, and what
       * truncating an ISO timestamp to YYYY-MM already implies. And note that
       * Date.UTC takes a ZERO-BASED month — passing the schema's 1-12 value
       * straight through would date every September paper to October.
       */
      const pub = c.data.publication ? await getEntry(c.data.publication) : undefined;
      const year = pub?.data.year ?? c.data.year;
      const month = pub?.data.month;

      return {
        title: c.data.title,
        description: c.data.conferenceName ?? c.data.pubPrefixText,
        link: conferencePath(c.id),
        // Omitted rather than defaulted when there is no year at all. A
        // fallback to the epoch is not a missing date, it is a wrong one, and
        // a reader will file the entry under 1970 and believe it.
        ...(year === undefined ? {} : { pubDate: new Date(Date.UTC(year, (month ?? 1) - 1, 1)) }),
      };
    }),
  );

  /*
   * Newest first. listed() orders by navOrder, which is the order the nav and
   * the front page want — but a feed is a chronology, and emitting it in any
   * other order leaves a reader whose client preserves document order seeing
   * the list shuffled. Undated entries sort last rather than to 1970.
   */
  items.sort((a, b) => (b.pubDate?.getTime() ?? -Infinity) - (a.pubDate?.getTime() ?? -Infinity));

  return rss({
    title: `${SITE.title} — ${SITE.tagline}`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    /*
     * @astrojs/rss defaults this to `true` and appends a slash to every item
     * link. This site is `build.format: 'preserve'`, so a paper page IS the
     * flat file /c/icse25 — and /c/icse25/ is a 404. Without this, every link
     * in the published feed pointed one level too deep: a subscriber who
     * clicked through got a 404, which is the one failure a feed cannot afford,
     * because nobody reading it is looking at the site to notice.
     *
     * conferencePath() already returns the right address; this stops the
     * integration from editing it. Correct for every item because the feed
     * carries only /c/ pages — if it ever carries a directory route as well,
     * the fix is per-item absolute URLs, not flipping this back.
     */
    trailingSlash: false,
    customData: `<language>${SITE.lang}</language>`,
  });
}
