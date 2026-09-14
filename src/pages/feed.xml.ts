import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
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

  return rss({
    title: `${SITE.title} — ${SITE.tagline}`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: conferences.map((c) => ({
      title: c.data.title,
      description: c.data.conferenceName ?? c.data.pubPrefixText,
      link: conferencePath(c.id),
      // Papers carry a year and month, not a publication date. Mid-month keeps
      // the ordering right without implying a precision that is not there.
      pubDate: new Date(Date.UTC(c.data.year ?? 1970, 0, 15)),
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
