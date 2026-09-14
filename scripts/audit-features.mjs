// Feature contracts for ardoco.de.
//
// Every expected count is derived from the source, never hardcoded, so adding a
// paper or an approach is not a false failure. What is asserted is the shape of
// the site: the joins that Jekyll resolved silently, the URLs that must not
// move, and the two HTML comments an external page depends on.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const SRC = join(process.cwd(), 'src');
let failed = 0;
const check = (cond, msg) => {
  if (cond) console.log(`✓ ${msg}`);
  else {
    console.error(`✗ ${msg}`);
    failed += 1;
  }
};
const read = (p) => readFileSync(join(DIST, p), 'utf8');
const has = (p) => existsSync(join(DIST, p));

const frontmatter = (file) => readFileSync(file, 'utf8').split('---')[1] ?? '';
const contentFiles = (dir) =>
  readdirSync(join(SRC, 'content', dir)).filter((f) => f.endsWith('.md'));

const approachFiles = contentFiles('approaches');
const conferenceFiles = contentFiles('conferences');
const stubs = conferenceFiles.filter((f) =>
  /^redirectTo:/m.test(frontmatter(join(SRC, 'content/conferences', f))),
);
const papers = conferenceFiles.filter((f) => !stubs.includes(f));
const PUB_COUNT = (readFileSync(join(SRC, 'data/papers.bib'), 'utf8').match(/^@/gm) ?? []).length;

// ---- the KIT delimiters ------------------------------------------------------
// mcse.kastel.kit.edu scrapes the text between these two comments. They are
// invisible from inside the site, so nothing else would notice them going.
{
  const home = read('index.html');
  const B =
    '<!-- NEVER CHANGE THIS LINE B. It is used as delimiter for the page at mcse.kastel.kit.edu -->';
  const E =
    '<!-- NEVER CHANGE THIS LINE E. It is used as delimiter for the page at mcse.kastel.kit.edu -->';
  check(home.includes(B), 'home: opening KIT delimiter present verbatim');
  check(home.includes(E), 'home: closing KIT delimiter present verbatim');
  const between = home.slice(home.indexOf(B) + B.length, home.indexOf(E));
  const paras = (between.match(/<p[ >]/g) ?? []).length;
  check(paras === 3, `home: ${paras} paragraphs between the KIT delimiters (expected 3)`);
  check(
    between.includes('ARDoCo (Automating Requirements and Documentation Comprehension)'),
    'home: scraped block still opens with the project definition',
  );
}

// ---- conference pages --------------------------------------------------------
{
  const missing = conferenceFiles
    .map((f) => `c/${f.replace(/\.md$/, '')}.html`)
    .filter((p) => !has(p));
  check(missing.length === 0, `conferences: all ${conferenceFiles.length} /c/*.html pages emitted`);

  const badStubs = stubs.filter((f) => {
    const html = read(`c/${f.replace(/\.md$/, '')}.html`);
    return !/<meta http-equiv="refresh" content="0; url=\/c\//.test(html) || !/noindex/.test(html);
  });
  check(
    badStubs.length === 0,
    `conferences: all ${stubs.length} legacy redirect stubs refresh and are noindex`,
  );

  const noScholar = papers.filter((f) => {
    const fm = frontmatter(join(SRC, 'content/conferences', f));
    if (!/^publication:/m.test(fm)) return false;
    const html = read(`c/${f.replace(/\.md$/, '')}.html`);
    return !/name="citation_title"/.test(html) || !/"@type":"ScholarlyArticle"/.test(html);
  });
  check(
    noScholar.length === 0,
    'conferences: every paper page emits Highwire citation tags and ScholarlyArticle JSON-LD',
  );

  const noCite = papers.filter((f) => {
    const fm = frontmatter(join(SRC, 'content/conferences', f));
    if (!/^publication:/m.test(fm)) return false;
    return !/Cite this paper/.test(read(`c/${f.replace(/\.md$/, '')}.html`));
  });
  check(noCite.length === 0, 'conferences: every paper page carries a cite block');
}

// ---- the approach <-> publication joins --------------------------------------
{
  // Under Jekyll these were string compares against approach titles; a typo
  // rendered an empty box rather than an error.
  let forward = 0;
  const broken = [];
  for (const f of papers) {
    const slug = f.replace(/\.md$/, '');
    const fm = frontmatter(join(SRC, 'content/conferences', f));
    const block = fm.match(/^approaches:\n((?:\s+-\s+\S+\n)+)/m);
    if (!block) continue;
    const slugs = [...block[1].matchAll(/-\s+(\S+)/g)].map((m) => m[1]);
    const html = read(`c/${slug}.html`);
    for (const a of slugs) {
      forward += 1;
      if (!html.includes(`href="/approaches/${a}/"`)) broken.push(`${slug} -> ${a}`);
    }
  }
  check(broken.length === 0, `joins: ${forward} conference→approach links render`);

  // And the reverse index on each approach page.
  let reverse = 0;
  const missing = [];
  for (const f of approachFiles) {
    const slug = f.replace(/\.md$/, '');
    const expected = papers.filter((c) =>
      new RegExp(`^\\s+-\\s+${slug}$`, 'm').test(frontmatter(join(SRC, 'content/conferences', c))),
    );
    if (expected.length === 0) continue;
    const html = read(`approaches/${slug}/index.html`);
    if (!/Related publication/.test(html)) missing.push(slug);
    for (const c of expected) {
      reverse += 1;
      if (!html.includes(`href="/c/${c.replace(/\.md$/, '')}"`)) missing.push(`${slug} <- ${c}`);
    }
  }
  check(missing.length === 0, `joins: ${reverse} approach→publication back-references render`);
}

// ---- publications ------------------------------------------------------------
{
  const html = read('publications/index.html');
  const entries = (html.match(/class="entry"/g) ?? []).length;
  check(
    entries === PUB_COUNT,
    `publications: ${entries} entries rendered (papers.bib has ${PUB_COUNT})`,
  );

  // Filter contract: every selector the script queries must exist in the markup,
  // and the control must ship hidden so there is no dead input without JS.
  for (const sel of ['#pubsearch', 'no-results', 'class="year"', 'class="row"']) {
    check(
      html.includes(sel.replace(/^#/, 'id="').replace(/^id="pubsearch$/, 'id="pubsearch"')) ||
        html.includes(sel),
      `publications: markup contains ${sel}`,
    );
  }
  check(/id="pubsearch"[^>]*\shidden/.test(html), 'publications: filter input ships hidden');

  check(!/\[object Object\]/.test(html), 'publications: no [object Object] in any BibTeX block');
  const bibBlocks = (html.match(/<pre id="bib-/g) ?? []).length;
  check(bibBlocks === PUB_COUNT, `publications: ${bibBlocks} BibTeX blocks`);
  // [^\n]* rather than [^}]*: several entries open with "Fuch{\\ss}, Dominik",
  // and a brace-terminated class stops inside the LaTeX escape.
  const authorLines = (html.match(/\n  author\s+= \{[^\n]*,/g) ?? []).length;
  check(
    authorLines === PUB_COUNT,
    `publications: every BibTeX block has a "Last, First" author line`,
  );

  // Private al-folio fields must not leak into a citation someone pastes.
  for (const field of ['abbr', 'google_scholar_id', 'html', 'selected']) {
    check(
      !new RegExp(`\\n  ${field}\\s+= \\{`).test(html),
      `publications: private field "${field}" stripped from public BibTeX`,
    );
  }
}

// ---- people anchors ----------------------------------------------------------
{
  const html = read('people/index.html');
  const ids = [
    ...readFileSync(join(SRC, 'data/people.yml'), 'utf8').matchAll(/^([a-z0-9ß-]+):$/gim),
  ].map((m) => m[1]);
  const missing = ids.filter((id) => !html.includes(`id="${id}"`));
  check(
    missing.length === 0 && ids.length > 0,
    `people: all ${ids.length} profile anchors present`,
  );
}

// ---- screencasts ------------------------------------------------------------
{
  // Two paper pages embed a YouTube screencast directly, as the old site did.
  // That makes youtube.com the one third-party origin on those pages; it is a
  // deliberate call, so assert the shape rather than pretend it is not there.
  const withVideo = papers.filter((f) =>
    /<iframe/.test(readFileSync(join(SRC, 'content/conferences', f), 'utf8')),
  );
  const bad = withVideo.filter((f) => {
    const html = read(`c/${f.replace(/\.md$/, '')}.html`);
    return !/<iframe[^>]+youtube\.com\/embed\//.test(html) || !/loading="lazy"/.test(html);
  });
  check(
    withVideo.length > 0 && bad.length === 0,
    `screencasts: ${withVideo.length} embeds present and lazily loaded`,
  );
}

// ---- feed and sitemap are well-formed ------------------------------------------
{
  for (const f of ['feed.xml', 'sitemap.xml']) {
    const xml = read(f);
    const stack = [];
    let wellFormed = true;
    for (const m of xml.matchAll(/<(\/?)([a-z0-9:_-]+)[^>]*?(\/?)>/gi)) {
      if (m[0].startsWith('<?') || m[3] === '/') continue;
      if (m[1]) {
        if (stack.pop() !== m[2]) wellFormed = false;
      } else stack.push(m[2]);
    }
    check(wellFormed && stack.length === 0, `${f}: well-formed XML`);
  }
  const sitemap = read('sitemap.xml');
  const pdfs = readdirSync(join(process.cwd(), 'public/assets/pdf')).filter((f) =>
    f.endsWith('.pdf'),
  );
  const listed = pdfs.filter((f) => sitemap.includes(`/assets/pdf/${f}`));
  check(listed.length === pdfs.length, `sitemap: all ${pdfs.length} slide PDFs listed`);
  const stubUrls = stubs.filter((f) => sitemap.includes(`/c/${f.replace(/\.md$/, '')}<`));
  check(stubUrls.length === 0, 'sitemap: redirect stubs not advertised');
}

// ---- addresses do not leak ----------------------------------------------------
{
  /*
   * The al-folio site emitted HTML numeric character references, which stop a
   * naive regex and nothing else. Assert the real thing: no address appears in
   * any served file, raw OR entity-decoded, while a readable "(at)" form is
   * still on the page for anyone without JS.
   */
  const decode = (t) =>
    t
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
      .replace(/&commat;|&#64;/gi, '@');

  const addresses = [
    'ardoco@lists.kit.edu',
    ...[
      ...readFileSync(join(SRC, 'data/people.yml'), 'utf8').matchAll(/^\s+email:\s*(\S+)$/gm),
    ].map((m) => m[1]),
  ];

  const served = [];
  const walkAll = (dir) => {
    for (const n of readdirSync(dir)) {
      const p = join(dir, n);
      if (statSync(p).isDirectory()) walkAll(p);
      else if (/\.(html|xml|txt|json|css|js)$/.test(p)) served.push(p);
    }
  };
  walkAll(DIST);

  const leaks = [];
  for (const file of served) {
    const text = readFileSync(file, 'utf8');
    const decoded = decode(text);
    for (const a of addresses) {
      if (text.includes(a) || decoded.includes(a)) leaks.push(`${relative(DIST, file)}: ${a}`);
    }
  }
  check(
    addresses.length > 1 && leaks.length === 0,
    `privacy: none of the ${addresses.length} addresses appear in any served file` +
      (leaks.length ? ` (${leaks.slice(0, 3).join(', ')})` : ''),
  );

  const people = read('people/index.html');
  check(/\(at\)/.test(people), 'privacy: /people/ still shows a readable address without JS');
}

// ---- no leftovers from the theme ------------------------------------------------
{
  const pages = [];
  const walk = (dir) => {
    for (const n of readdirSync(dir)) {
      const p = join(dir, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith('.html')) pages.push(p);
    }
  };
  walk(DIST);
  const offenders = pages.filter((p) => {
    const html = readFileSync(p, 'utf8');
    return /fa-solid|fa-brands|z-depth-|navbar-nav|\bliquid\b/.test(html);
  });
  check(
    offenders.length === 0,
    `cleanup: no al-folio markup left in ${pages.length} pages` +
      (offenders.length ? ` (${offenders.map((p) => relative(DIST, p)).join(', ')})` : ''),
  );
}

process.exit(failed > 0 ? 1 : 0);
