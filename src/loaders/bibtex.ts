import type { Loader } from 'astro/loaders';
import type { VerbatimEntry } from '@retorquere/bibtex-parser';
import { initSync, parse, parseVerbatim } from '@retorquere/bibtex-parser';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// The parser is a WASM build that must be initialized before the first parse.
initSync({
  module: readFileSync(
    createRequire(import.meta.url).resolve('@retorquere/bibtex-parser/bibtex_parser_bg.wasm'),
  ),
});

/**
 * Fields stripped from the copyable BibTeX: al-folio bookkeeping, not
 * bibliography. `html` is ArDoCo's own repurposing of an al-folio field — it
 * holds an internal path like "/c/icsa25" that the old theme rendered as an
 * INFO button, so it has no business in a citation someone pastes elsewhere.
 */
const PRIVATE_FIELDS = new Set(['abbr', 'google_scholar_id', 'html', 'selected']);

const str = (v: unknown): string | undefined => {
  if (v == null) return undefined;
  const s = Array.isArray(v) ? v.join(', ') : String(v);
  const t = s.trim();
  return t === '' ? undefined : t;
};

/**
 * Strip the LaTeX escapes the cooked parse leaves behind.
 *
 * The decoder only rewrites escapes that stand for a Unicode character, so an
 * escaped ASCII punctuation mark survives verbatim: the five Springer and GI
 * DOIs keep their `\_`, and `https://doi.org/10.1007/978-3-031-88531-0\_27`
 * resolves to nothing. Only for the values we turn into links or plain text —
 * the copyable BibTeX is built from the raw parse and keeps its escapes.
 */
const unLatex = (v: string | undefined): string | undefined => v?.replace(/\\([_&%$#{}])/g, '$1');

const num = (v: unknown): number | undefined => {
  const s = str(v);
  if (s === undefined) return undefined;
  const n = Number.parseInt(s, 10);
  return Number.isNaN(n) ? undefined : n;
};

/**
 * Re-serialize one entry as public BibTeX, dropping the private fields.
 *
 * Built from the VERBATIM parse so LaTeX escapes and brace protection survive
 * verbatim — a reader pasting this into their own .bib gets what the source
 * file says, not a Unicode-normalized approximation.
 *
 * The parser returns fields in hash order, so they are sorted back into the
 * order of the source entry (`input`). It also returns fields verbatim, so
 * empty ones (`number = {}`) are dropped and alignment whitespace is collapsed.
 */
function serialize(entry: VerbatimEntry): string {
  const position = (field: string) => entry.input.search(new RegExp(`[,{]\\s*${field}\\s*=`, 'i'));
  const rows = Object.entries(entry.fields)
    .map(([k, v]) => [k, str(v)?.replace(/\s+/g, ' ')] as const)
    .filter(([k, v]) => v !== undefined && !PRIVATE_FIELDS.has(k.toLowerCase()))
    .sort(([a], [b]) => position(a) - position(b))
    .map(([k, v]) => `  ${k.padEnd(12)} = {${v}}`);
  return `@${entry.type}{${entry.key},\n${rows.join(',\n')}\n}`;
}

export function bibtexLoader(opts: { file: string; conferenceRoot: string }): Loader {
  return {
    name: 'bibtex',
    load: async ({ store, parseData, generateDigest, logger, watcher }) => {
      const bibPath = fileURLToPath(new URL(`../../${opts.file}`, import.meta.url));
      watcher?.add(bibPath);
      // Watch this loader too. Entries are cached in `.astro/`, keyed off the
      // source file, so editing the parsing logic alone left the dev server
      // serving the previous parse indefinitely — a fix could look like it had
      // done nothing at all.
      watcher?.add(fileURLToPath(import.meta.url));

      const source = await readFile(bibPath, 'utf8');

      // Two passes: `cooked` gives LaTeX decoded to Unicode for display;
      // `raw` keeps the original escapes for the copyable BibTeX block.
      // The parser sentence-cases titles of English entries; with no language
      // counted as English, titles keep their casing ({LiSSA}, {ExArch}).
      const cooked = parse(source, { english: [] });
      const raw = parseVerbatim(source);

      if (cooked.errors.length > 0) {
        for (const e of cooked.errors) logger.error(`${opts.file}: ${JSON.stringify(e)}`);
        throw new Error(`${cooked.errors.length} BibTeX parse error(s) in ${opts.file}`);
      }

      const rawByKey = new Map(raw.entries.map((e) => [e.key, e]));
      store.clear();

      for (const entry of cooked.entries) {
        const f = entry.fields;

        const authors = f.author ?? [];
        if (authors.length === 0) throw new Error(`${entry.key}: no authors parsed`);

        // ArDoCo has no `pdf` field; `html` is the equivalent load-bearing
        // link, pointing at this paper's own page under /c/. Verify the target
        // exists at build time — under Jekyll a stale slug rendered an INFO
        // button that silently 404'd.
        const html = str(f.html);
        let infoSlug: string | undefined;
        if (html) {
          const m = html.match(/^\/c\/([A-Za-z0-9._-]+)\/?$/);
          if (!m) throw new Error(`${entry.key}: html = {${html}} is not a /c/<slug> path`);
          infoSlug = m[1];
          const onDisk = fileURLToPath(
            new URL(`../../${opts.conferenceRoot}/${infoSlug}.md`, import.meta.url),
          );
          if (!existsSync(onDisk)) {
            throw new Error(
              `${entry.key}: html points at /c/${infoSlug}, but ${opts.conferenceRoot}/${infoSlug}.md does not exist`,
            );
          }
        }

        const rawEntry = rawByKey.get(entry.key);
        if (!rawEntry) throw new Error(`${entry.key}: missing from the verbatim parse`);
        const bibtex = serialize(rawEntry);

        // The normalizing parse splits a nobiliary particle off into `prefix`
        // and a "Jr."-style tail into `suffix` (only "von Geisau, Johannes" is
        // affected today). Reading `lastName` alone printed "Johannes Geisau".
        // A name the parser cannot split arrives whole in `name`.
        const people = authors.map((a) => ({
          first: str(a.firstName) ?? '',
          last: [str(a.prefix), str(a.lastName ?? a.name), str(a.suffix)].filter(Boolean).join(' '),
        }));

        const data = {
          key: entry.key,
          type: entry.type,
          title: str(f.title) ?? entry.key,
          authors: people,
          year: num(f.year) ?? 0,
          month: num(f.month),
          abbr: str(f.abbr),
          booktitle: str(f.booktitle),
          journal: str(f.journal),
          school: str(f.school),
          institution: str(f.institution),
          publisher: str(f.publisher),
          series: str(f.series),
          volume: str(f.volume),
          number: str(f.number),
          pages: str(f.pages),
          // Four biblatex entries carry `venue` where the rest use `location`
          // or `address`; fall back so those stop rendering without a place.
          location: str(f.location) ?? str(f.venue) ?? str(f.address),
          doi: unLatex(str(f.doi)),
          url: unLatex(str(f.url)),
          keywords: f.keywords ?? [],
          googleScholarId: str(f.google_scholar_id),
          infoSlug,
          bibtex,
          searchText: [
            str(f.title),
            people.map((p) => `${p.first} ${p.last}`).join(' '),
            str(f.booktitle),
            str(f.journal),
            str(f.abbr),
            str(f.year),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase(),
        };

        const parsed = await parseData({ id: entry.key, data });
        store.set({ id: entry.key, data: parsed, digest: generateDigest(parsed) });
      }

      logger.info(`parsed ${cooked.entries.length} publications`);
    },
  };
}
