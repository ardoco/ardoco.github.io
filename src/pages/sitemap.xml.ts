import { getCollection } from 'astro:content';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../consts';
import { approachPath, conferencePath } from '../lib/urls';

/*
 * Hand-rolled rather than @astrojs/sitemap, for two reasons:
 *
 *  1. the integration emits sitemap-index.xml + sitemap-0.xml, but robots.txt
 *     points at /sitemap.xml and that is the URL registered with search
 *     engines;
 *  2. it would not list the slide decks under /assets/pdf/, which are linked
 *     from published papers and are among the highest-value URLs here.
 */
const abs = (p: string) => new URL(p, SITE.url).href;

export async function GET() {
  const approaches = await getCollection('approaches');
  const conferences = await getCollection('conferences');

  const urls = [
    '/',
    '/approaches/',
    '/conferences/',
    '/publications/',
    '/people/',
    '/initial-poster-2019/',
    ...approaches.map((a) => approachPath(a.id)),
    // Redirect stubs are excluded: they exist to keep old links alive, not to
    // be indexed, and they already carry <meta name="robots" content="noindex">.
    ...conferences.filter((c) => !c.data.redirectTo).map((c) => conferencePath(c.id)),
    ...readdirSync(join(process.cwd(), 'public/assets/pdf'))
      .filter((f) => f.endsWith('.pdf'))
      .sort()
      .map((f) => `/assets/pdf/${f}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${abs(u)}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
