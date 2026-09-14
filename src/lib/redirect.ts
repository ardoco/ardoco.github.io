import { SITE } from '../consts';

const escapeHtml = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

/**
 * A bare meta-refresh page.
 *
 * Used for the five /c/ URLs that outlived the papers they pointed at
 * (se24, se25, se26-exarch, se26-lissa, taas26). Returned as a Response from
 * the route rather than rendered as markup, because rendering it through the
 * page component would make Astro inject that page's stylesheet into the
 * stub's <head> — several KB of CSS on a page whose whole job is to be left
 * immediately.
 *
 * Lives in a .ts module rather than inline in the .astro frontmatter: raw
 * closing tags inside a template literal confuse the frontmatter parser
 * `astro check` uses, which then reports the values used here as unread.
 */
export function redirectResponse(to: string, title: string): Response {
  const body = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <meta http-equiv="refresh" content="0; url=${to}" />
    <link rel="canonical" href="${new URL(to, SITE.url).href}" />
    <meta name="robots" content="noindex" />
  </head>
  <body>
    <p>This page has moved to <a href="${to}">${to}</a>.</p>
  </body>
</html>
`;
  return new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
