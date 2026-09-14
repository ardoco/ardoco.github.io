// Structural and accessibility audit of dist/.
//
// Offline and structural on purpose: it replaces the old lychee link-checking
// workflows, which ran after deploy and only ever caught problems once they
// were live.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = join(process.cwd(), 'dist');
let failed = 0;
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  failed += 1;
};
const ok = (msg) => console.log(`✓ ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const cssFiles = files.filter((f) => f.endsWith('.css'));
const jsFiles = files.filter((f) => f.endsWith('.js'));
const pages = htmlFiles.map((f) => ({
  file: f,
  url: '/' + relative(DIST, f).split('\\').join('/'),
  html: readFileSync(f, 'utf8'),
}));

// Redirect stubs are intentionally minimal: no nav, no canonical description.
const isStub = (p) => /<meta http-equiv="refresh"/i.test(p.html);
const real = pages.filter((p) => !isStub(p));

// ---- 1. every CSS custom property is defined --------------------------------
{
  const defined = new Set();
  const used = new Map();
  const collect = (text, where) => {
    for (const m of text.matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(m[1]);
    for (const m of text.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
      if (!used.has(m[1])) used.set(m[1], where);
    }
  };
  for (const f of cssFiles) collect(readFileSync(f, 'utf8'), relative(DIST, f));
  // Inline styles count too: the venue badges pass their brand colour that way.
  for (const p of pages) {
    for (const m of p.html.matchAll(/style="([^"]*)"/g)) collect(m[1], p.url);
    for (const m of p.html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) collect(m[1], p.url);
  }
  const undef = [...used].filter(([name]) => !defined.has(name));
  if (undef.length) for (const [n, w] of undef) fail(`undefined custom property ${n} (${w})`);
  else ok(`css: ${used.size} custom properties, all defined`);
}

// ---- 2. dark-only: no theme switching crept back in -------------------------
{
  const offenders = [
    ...cssFiles.filter((f) => /\[data-theme/.test(readFileSync(f, 'utf8'))),
    ...pages.filter((p) => /data-theme|light-toggle/.test(p.html)).map((p) => p.file),
  ];
  if (offenders.length) fail(`dark-only violated in ${offenders.length} file(s)`);
  else ok('css: dark-only, no theme toggle');
}

// ---- 3. contrast ------------------------------------------------------------
{
  const tokens = {};
  for (const f of cssFiles) {
    for (const m of readFileSync(f, 'utf8').matchAll(
      /(--[a-z0-9-]+)\s*:\s*(#[0-9a-f]{6})\s*[;}]/gi,
    ))
      tokens[m[1]] = m[2];
  }
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = (hex) => {
    const [r, g, b] = rgb(hex).map((c) =>
      c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const bg = tokens['--bg'];
  const checks = [
    ['--text', 4.5],
    ['--text-muted', 4.5],
    ['--text-faint', 4.5],
    ['--teal', 3],
    ['--azure', 3],
    ['--violet', 3],
    ['--green', 3],
    ['--amber', 3],
  ];
  let worst = Infinity;
  for (const [token, min] of checks) {
    if (!tokens[token]) {
      fail(`contrast: ${token} not found`);
      continue;
    }
    const r = ratio(tokens[token], bg);
    worst = Math.min(worst, r / min);
    if (r < min) fail(`contrast: ${token} is ${r.toFixed(2)}:1 on --bg, needs ${min}:1`);
  }
  if (worst >= 1) ok(`a11y: all text and accent colours clear WCAG on --bg`);
}

// ---- 4. internal links and fragments resolve --------------------------------
{
  const idsOf = new Map();
  for (const p of pages) {
    const ids = new Set();
    for (const m of p.html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
    for (const m of p.html.matchAll(/\sname="([^"]+)"/g)) ids.add(m[1]);
    idsOf.set(p.url, ids);
  }

  // A published URL maps to a file two ways: /a/b -> a/b.html, /a/b/ -> a/b/index.html
  const resolve = (path) => {
    const clean = path.replace(/\/+$/, '');
    for (const candidate of [
      join(DIST, path),
      join(DIST, `${clean}.html`),
      join(DIST, clean, 'index.html'),
      join(DIST, path, 'index.html'),
    ]) {
      if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    }
    return undefined;
  };

  let links = 0;
  let frags = 0;
  for (const p of pages) {
    for (const m of p.html.matchAll(/\bhref="([^"]+)"/g)) {
      const raw = m[1];
      if (/^(https?:|mailto:|#|data:)/.test(raw)) {
        if (raw.startsWith('#')) {
          frags += 1;
          const id = decodeURIComponent(raw.slice(1));
          if (id && !idsOf.get(p.url)?.has(id)) fail(`${p.url}: fragment ${raw} has no target`);
        }
        continue;
      }
      if (!raw.startsWith('/')) continue;
      links += 1;
      const [path, hash] = raw.split('#');
      const target = resolve(decodeURIComponent(path));
      if (!target) {
        fail(`${p.url}: link ${raw} does not resolve`);
        continue;
      }
      if (hash && target.endsWith('.html')) {
        frags += 1;
        const url = '/' + relative(DIST, target).split('\\').join('/');
        const ids = idsOf.get(url);
        if (ids && !ids.has(decodeURIComponent(hash)))
          fail(`${p.url}: link ${raw} — #${hash} not found on ${url}`);
      }
    }
  }
  ok(`links: ${links} internal links and ${frags} fragments resolve`);
}

// ---- 5. per-page document basics -------------------------------------------
{
  let bad = 0;
  for (const p of real) {
    const h1 = (p.html.match(/<h1[\s>]/g) ?? []).length;
    if (h1 !== 1) {
      fail(`${p.url}: ${h1} <h1> elements, expected exactly 1`);
      bad += 1;
    }
    if (!/<title>[^<]+<\/title>/.test(p.html)) {
      fail(`${p.url}: no <title>`);
      bad += 1;
    }
    if (!/<meta name="description" content="[^"]+"/.test(p.html)) {
      fail(`${p.url}: no meta description`);
      bad += 1;
    }
    if (!/<link rel="canonical"/.test(p.html)) {
      fail(`${p.url}: no canonical link`);
      bad += 1;
    }
  }
  if (!bad)
    ok(`html: ${real.length} pages each have one h1, a title, a description and a canonical`);
}

// ---- 6. images carry intrinsic dimensions -----------------------------------
{
  let imgs = 0;
  let bad = 0;
  for (const p of pages) {
    for (const m of p.html.matchAll(/<img\b[^>]*>/g)) {
      imgs += 1;
      if (!/\bwidth="/.test(m[0]) || !/\bheight="/.test(m[0])) {
        fail(`${p.url}: <img> without width/height — ${m[0].slice(0, 90)}`);
        bad += 1;
      }
    }
  }
  if (!bad) ok(`html: all ${imgs} images have intrinsic dimensions`);
}

// ---- 6b. text does not run into a link ---------------------------------------
{
  /*
   * Astro strips the newline between a trailing word and a following <a>, so
   *
   *     developed at the
   *     <a href="...">MCSE group</a>, <a href="...">KASTEL</a>,
   *     <a href="...">KIT</a>
   *
   * renders as "developed at theMCSE group, KASTEL,KIT". It reads fine in the
   * source and is easy to miss in review, so check the rendered bytes: a word
   * character or a comma immediately against a link boundary, with no space.
   */
  // Chips and badges are spaced by CSS margin or flex gap, not by a text node,
  // so a word sitting flush against their markup is correct. Only prose links
  // are checked.
  const STYLED = /class="[^"]*\b(?:chip|orcid|venue)\b/;
  const OPEN = /([A-Za-z0-9,.;:])(<a\s[^>]*>)/g;
  const CLOSE = /<\/a>([A-Za-z0-9])/g;

  let joins = 0;
  for (const p of real) {
    const body = p.html.replace(/<(pre|code|script|style)[\s\S]*?<\/\1>/g, '');

    OPEN.lastIndex = 0;
    let m;
    while ((m = OPEN.exec(body)) !== null) {
      if (STYLED.test(m[2])) continue;
      const near = body.slice(Math.max(0, m.index - 45), m.index + 45).replace(/\s+/g, ' ');
      fail(`${p.url}: text runs into the start of a link — …${near}…`);
      joins += 1;
    }

    CLOSE.lastIndex = 0;
    while ((m = CLOSE.exec(body)) !== null) {
      // Find the opening tag of the link that just closed.
      const open = body.lastIndexOf('<a ', m.index);
      if (open !== -1 && STYLED.test(body.slice(open, body.indexOf('>', open) + 1))) continue;
      const near = body.slice(Math.max(0, m.index - 45), m.index + 45).replace(/\s+/g, ' ');
      fail(`${p.url}: text runs on from the end of a link — …${near}…`);
      joins += 1;
    }
  }
  if (!joins) ok(`html: no text runs into a link on ${real.length} pages`);
}

// ---- 7. third-party subresources are only the ones we chose ----------------
{
  /*
   * Hyperlinks to other sites are the point of a research page, so only
   * *subresources* count here — things the browser fetches without being asked.
   *
   * youtube.com is on the list deliberately: the two ASE 2026 pages embed a
   * screencast the same way the al-folio site did. That is the only third-party
   * origin on the site, and naming it here means a second one cannot appear
   * unnoticed.
   */
  const ALLOWED = new Set(['www.youtube.com']);
  const SUBRESOURCE =
    /<(?:img|script|iframe|source|link|video|audio)\b[^>]*\b(?:src|href)="https?:\/\/([^"/]+)/g;

  const found = new Map();
  for (const p of pages) {
    const stripped = p.html.replace(/<script[\s\S]*?<\/script>/g, '');
    for (const m of stripped.matchAll(SUBRESOURCE)) {
      const host = m[1];
      if (host === 'ardoco.de' || ALLOWED.has(host)) continue;
      if (!found.has(host)) found.set(host, p.url);
    }
  }
  if (found.size) for (const [h, u] of found) fail(`third-party subresource origin ${h} on ${u}`);
  else ok(`privacy: no third-party subresources beyond ${[...ALLOWED].join(', ')}`);
}

// ---- 8. weight ---------------------------------------------------------------
{
  const sum = (list) => list.reduce((n, f) => n + statSync(f).size, 0);
  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

  // Astro inlines scripts this small, so counting .js files alone reports zero
  // while the pages do ship behaviour. Measure the inline bytes instead, and
  // report the heaviest page rather than a total nobody downloads.
  let heaviest = { url: '-', bytes: 0 };
  for (const p of pages) {
    let bytes = 0;
    for (const m of p.html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      if (/application\/ld\+json/.test(m[0])) continue;
      bytes += Buffer.byteLength(m[1]);
    }
    if (bytes > heaviest.bytes) heaviest = { url: p.url, bytes };
  }

  console.log(
    `  bundle: ${kb(sum(cssFiles))} CSS across ${cssFiles.length} file(s), ` +
      `${kb(sum(jsFiles))} external JS; most inline JS on one page: ` +
      `${kb(heaviest.bytes)} (${heaviest.url})`,
  );
}

process.exit(failed > 0 ? 1 : 0);
