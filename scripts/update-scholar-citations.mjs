/**
 * Refresh src/data/citations.yml from Google Scholar.
 *
 *   npm run data:citations                                   # fetch counts
 *   node scripts/update-scholar-citations.mjs --discover [keys...]  # suggest missing ids
 *
 * A paper is read on its first author's profile; when the first author has no
 * `scholar` id in src/data/authors.yml, on the first co-author's who has one.
 * `google_scholar_id` in papers.bib is the article id on *that* profile, and
 * citations.yml is keyed `USER:ARTICLE`.
 *
 * Fetching reads each profile's publication list once. A profile that fails
 * keeps its previous counts, and `last_updated` only moves when all succeed.
 * --discover matches titles against the profile listing and prints suggested
 * `google_scholar_id` values; it never writes papers.bib. Give it BibTeX keys
 * to look at only those papers.
 *
 * Scholar rate-limits hard and has no API, so a run that cannot finish exits 0
 * and leaves the file alone. Wired to .github/workflows/update-citations.yml.
 */
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { Scalar, parse, stringify } from 'yaml';

const ROOT = process.cwd();
const BIB_FILE = join(ROOT, 'src/data/papers.bib');
const AUTHORS_FILE = join(ROOT, 'src/data/authors.yml');
const PEOPLE_FILE = join(ROOT, 'src/data/people.yml');
const OUT = join(ROOT, 'src/data/citations.yml');
const OUT_REL = 'src/data/citations.yml';

const PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 15_000;
const RETRIES = 3;
// Below the workflow's own `timeout`, so the script, not SIGKILL, ends the run.
const BUDGET_S = Number(process.env.SCHOLAR_TIME_BUDGET) || 270;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

/** Out of time budget (or SIGTERM). Expected, not a failure. */
class ScholarUnavailable extends Error {}
/** One profile could not be read; the others may still work. */
class ProfileFailed extends Error {}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --------------------------------------------------------------------------- //
// BibTeX block parsing
// --------------------------------------------------------------------------- //
/** {name: raw value} for one entry body; handles braced, quoted and bare values. */
function parseFields(body) {
  const fields = {};
  const fieldStart = /([A-Za-z][\w-]*)\s*=\s*/y;
  let position = 0;
  while (position < body.length) {
    fieldStart.lastIndex = position;
    const start = fieldStart.exec(body);
    if (!start) {
      position += 1;
      continue;
    }
    position = fieldStart.lastIndex;
    let value;
    if (body[position] === '{') {
      let depth = 0;
      let cursor = position;
      for (; cursor < body.length; cursor += 1) {
        if (body[cursor] === '{') depth += 1;
        else if (body[cursor] === '}' && --depth === 0) break;
      }
      value = body.slice(position + 1, cursor);
      position = cursor + 1;
    } else if (body[position] === '"') {
      const closing = body.indexOf('"', position + 1);
      value = body.slice(position + 1, closing);
      position = closing + 1;
    } else {
      const bareEnd = body.slice(position).search(/[,\n]/);
      const end = bareEnd === -1 ? body.length : position + bareEnd;
      value = body.slice(position, end).trim();
      position = end;
    }
    fields[start[1].toLowerCase()] = value;
  }
  return fields;
}

/** [{key, fields}] for every entry in a .bib text. */
export function parseEntries(text) {
  const entries = [];
  for (const header of text.matchAll(/@(\w+)\s*\{\s*([^,\s]+)\s*,/g)) {
    const bodyOpen = text.indexOf('{', header.index);
    let depth = 0;
    let position = bodyOpen;
    for (; position < text.length; position += 1) {
      if (text[position] === '{') depth += 1;
      else if (text[position] === '}') {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    entries.push({
      key: header[2],
      fields: parseFields(text.slice(header.index + header[0].length, position)),
    });
  }
  return entries;
}

/** Loose comparison form (LaTeX-vs-Unicode insensitive); same as update_bib.py. */
export function normalize(value) {
  return value
    .replaceAll('\\ss', 'ss')
    .replaceAll('\\&', '&')
    .replaceAll('\\_', '_')
    .replaceAll('\\%', '%')
    .replaceAll('\\#', '#')
    .replaceAll('~', ' ')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\\./g, '')
    .replaceAll('{', '')
    .replaceAll('}', '')
    .replaceAll('ß', 'ss')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^0-9a-zA-Z]/g, '')
    .toLowerCase();
}

function decodeEntities(text) {
  return text
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&');
}

// --------------------------------------------------------------------------- //
// Authors, profiles, papers
// --------------------------------------------------------------------------- //
const loadYaml = (path) => parse(readFileSync(path, 'utf8')) ?? {};

/** Normalised "first last" -> Scholar user id, incl. people.yml surname aliases. */
function scholarUsers() {
  const authors = loadYaml(AUTHORS_FILE);
  const users = new Map();
  for (const author of Object.values(authors)) {
    if (author.scholar) users.set(normalize(author.name), author.scholar);
  }
  for (const person of Object.values(loadYaml(PEOPLE_FILE))) {
    const author = authors[person.author] ?? {};
    if (author.scholar) {
      const first = author.name.split(/\s+/)[0];
      for (const surname of person.surnames) {
        users.set(normalize(`${first} ${surname}`), author.scholar);
      }
    }
  }
  return users;
}

function bibNames(field) {
  return field.split(' and ').map((name) => {
    const comma = name.indexOf(',');
    const last = comma === -1 ? name : name.slice(0, comma);
    const first = comma === -1 ? '' : name.slice(comma + 1);
    return normalize(first ? `${first} ${last}` : last);
  });
}

/** Bib entries as {key, title, user (the profile they are read on), article}. */
function loadPapers() {
  const users = scholarUsers();
  return parseEntries(readFileSync(BIB_FILE, 'utf8')).map(({ key, fields }) => {
    // First author's profile, else the first co-author's who has one.
    const name = bibNames(fields.author ?? '').find((n) => users.has(n));
    return {
      key,
      title: fields.title ?? key,
      user: name === undefined ? null : users.get(name),
      article: fields.google_scholar_id || null,
    };
  });
}

/** Normalised equality, or a long enough prefix (a dropped subtitle). */
export function sameTitle(bibTitle, scholarTitle) {
  const [a, b] = [normalize(bibTitle), normalize(scholarTitle)].sort((x, y) => x.length - y.length);
  return a === b || (a.length >= 20 && b.startsWith(a));
}

// --------------------------------------------------------------------------- //
// Scholar transport
// --------------------------------------------------------------------------- //
/** Parse the `tr.gsc_a_tr` rows of one profile page. */
export function parseRows(html) {
  html = html.replaceAll('\u00a0', ' '); // as scholarly did
  const rows = [];
  for (const [, row] of html.matchAll(
    /<tr[^>]*class="[^"]*\bgsc_a_tr\b[^"]*"[^>]*>([\s\S]*?)<\/tr>/g,
  )) {
    const link = row.match(/<a[^>]*class="[^"]*\bgsc_a_at\b[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    if (!link) continue;
    const href = decodeEntities(link[0].match(/href="([^"]*)"/)?.[1] ?? '');
    const id = href.match(/citation_for_view=([^&"]+)/)?.[1];
    if (!id) continue;
    const text = (re) =>
      row
        .match(re)?.[1]
        .replace(/<[^>]*>/g, '')
        .trim() ?? '';
    const cites = text(/<a[^>]*class="[^"]*\bgsc_a_ac\b[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    rows.push({
      id: decodeURIComponent(id),
      title: decodeEntities(link[1].replace(/<[^>]*>/g, '').trim()),
      year: text(/<span[^>]*class="[^"]*\bgsc_a_h\b[^"]*"[^>]*>([\s\S]*?)<\/span>/),
      citations: /^\d+$/.test(cites) ? Number(cites) : 0,
    });
  }
  return rows;
}

/** One page's HTML, or null for 404. Throws ProfileFailed, or ScholarUnavailable when out of time. */
async function fetchPage(url, signal) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': USER_AGENT, 'accept-language': 'en' },
        signal: AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]),
      });
      if (res.status === 404) return null;
      if (res.status === 429 || res.status === 403) throw new ProfileFailed(`HTTP ${res.status}`);
      if (res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) throw new ProfileFailed(`HTTP ${res.status}`);
      const html = await res.text();
      if (
        /unusual traffic|id="gs_captcha|\/sorry\/|recaptcha/i.test(html) &&
        !html.includes('gsc_a_tr')
      ) {
        throw new ProfileFailed('CAPTCHA / unusual-traffic page');
      }
      return html;
    } catch (err) {
      if (signal.aborted) throw new ScholarUnavailable();
      if (err instanceof ProfileFailed) throw err;
      if (attempt >= RETRIES) throw new ProfileFailed(err.message);
      console.log(`attempt ${attempt}/${RETRIES} failed (${err.message})`);
      await sleep(1000 * attempt);
    }
  }
}

/** Article id -> {title, year, citations} for one profile; null if Scholar fails. */
async function fetchProfile(user, signal) {
  const listing = {};
  try {
    for (let start = 0; ; start += PAGE_SIZE) {
      const url = `https://scholar.google.com/citations?user=${encodeURIComponent(user)}&hl=en&cstart=${start}&pagesize=${PAGE_SIZE}`;
      const html = await fetchPage(url, signal);
      if (html === null) throw new ProfileFailed('no such profile (HTTP 404)');
      const rows = parseRows(html);
      for (const { id, title, year, citations } of rows) {
        // The article id is the part after "USER:" in citation_for_view.
        if (id.includes(':'))
          listing[id.split(':').slice(1).join(':')] = { title, year, citations };
      }
      if (rows.length < PAGE_SIZE) break;
    }
  } catch (err) {
    if (!(err instanceof ProfileFailed)) throw err;
    console.log(`${user}: ${err.message}`);
    return null;
  }
  console.log(`${user}: ${Object.keys(listing).length} publications`);
  return listing;
}

// --------------------------------------------------------------------------- //
// Modes
// --------------------------------------------------------------------------- //
async function discover(papers, signal) {
  const listings = new Map();
  const claimed = new Set();
  for (const paper of papers) {
    const { user } = paper;
    if (!user) {
      console.log(`${paper.key}: no author has a scholar id in authors.yml`);
      continue;
    }
    if (!listings.has(user)) listings.set(user, await fetchProfile(user, signal));
    const listing = listings.get(user);
    if (listing === null) {
      console.log(`${paper.key}: could not read profile ${user}`);
      continue;
    }
    // Article ids are per profile, and the same id can be another paper elsewhere.
    const current = paper.article === null ? undefined : listing[paper.article];
    if (current && sameTitle(paper.title, current.title)) {
      if (claimed.has(`${user}:${paper.article}`)) {
        console.log(`${paper.key}: same Scholar record as another entry; remove its id`);
      }
      claimed.add(`${user}:${paper.article}`);
      continue;
    }
    if (current) {
      console.log(`${paper.key}: ${paper.article} is "${current.title}" on profile ${user}`);
    }
    const matches = Object.keys(listing).filter((a) => sameTitle(paper.title, listing[a].title));
    const match = matches.find((a) => !claimed.has(`${user}:${a}`));
    if (matches.length === 0) {
      console.log(`${paper.key}: no title match on profile ${user}`);
    } else if (match === undefined) {
      // Scholar merged it with another entry, e.g. an SE abstract of a full paper.
      console.log(
        `${paper.key}: same Scholar record as another entry (${matches[0]}); left without an id`,
      );
    } else {
      claimed.add(`${user}:${match}`);
      console.log(
        `${paper.key}: google_scholar_id = {${match}}  # ${user}, ${listing[match].citations} citations`,
      );
    }
  }
}

async function fetchCounts(papers, signal) {
  const today = new Date().toLocaleDateString('sv-SE'); // local YYYY-MM-DD
  const existing = existsSync(OUT) ? loadYaml(OUT) : {};
  const oldPapers = existing.papers ?? {};
  const lastUpdated = existing.metadata?.last_updated;
  if (lastUpdated === today) {
    console.log('citations.yml is already up to date.');
    return;
  }

  const wanted = new Map();
  for (const paper of papers) {
    if (paper.user && paper.article) {
      wanted.set(paper.user, [...(wanted.get(paper.user) ?? []), paper]);
    }
  }

  const newPapers = {};
  let complete = true;
  for (const [user, userPapers] of wanted) {
    const listing = await fetchProfile(user, signal);
    for (const paper of userPapers) {
      const key = `${user}:${paper.article}`;
      if (listing === null) {
        if (key in oldPapers) newPapers[key] = oldPapers[key];
      } else if (sameTitle(paper.title, listing[paper.article]?.title ?? '')) {
        newPapers[key] = listing[paper.article];
      } else {
        console.log(`${paper.key}: ${paper.article} is not this paper on ${user}; run --discover`);
      }
    }
    complete &&= listing !== null;
  }

  if (isDeepStrictEqual(newPapers, oldPapers)) {
    console.log('No changes in citation data.');
    return;
  }

  // Quoted, or YAML would read the date back as a timestamp.
  const date = new Scalar(complete || !lastUpdated ? today : lastUpdated);
  date.type = Scalar.QUOTE_SINGLE;
  const data = {
    metadata: { last_updated: date },
    papers: newPapers,
  };
  const body = stringify(data, { singleQuote: true, lineWidth: 0, sortMapEntries: true });
  const tmp = `${OUT}.tmp`;
  writeFileSync(tmp, body);
  renameSync(tmp, OUT);
  console.log(`Wrote ${Object.keys(newPapers).length} papers to ${OUT_REL}`);
  if (!complete) console.log('Some profiles failed; kept their previous counts and the old date.');
}

async function main() {
  const args = process.argv.slice(2);
  const discovering = args.includes('--discover');
  const keys = args.filter((a) => !a.startsWith('--'));

  let papers = loadPapers();
  if (discovering && keys.length) papers = papers.filter((p) => keys.includes(p.key));

  // The budget and SIGTERM (what `timeout` sends) both abort in-flight requests.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BUDGET_S * 1000);
  process.once('SIGTERM', () => controller.abort());

  try {
    await (discovering ? discover : fetchCounts)(papers, controller.signal);
  } catch (err) {
    if (!(err instanceof ScholarUnavailable)) throw err;
    console.log(`Scholar did not answer within ${BUDGET_S}s; nothing written.`);
  } finally {
    clearTimeout(timer);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main().catch((err) => {
    console.log(`Unexpected error: ${err.message}`);
    process.exit(1);
  });
}
