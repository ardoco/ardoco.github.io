<p align="center"><img src="public/assets/img/logo.png" alt="" height="110"></p>

<h1 align="center">ardoco.de</h1>

<p align="center">
Website of <strong>ARDoCo</strong> — Automating Requirements and Documentation Comprehension,
a research project on traceability link recovery and documentation consistency at the
<a href="https://mcse.kastel.kit.edu">MCSE group</a>, <a href="https://kastel.kit.edu">KASTEL</a>, KIT.
</p>

---

Built with [Astro](https://astro.build/): six Zod-validated content collections, a hand-written
design, no UI framework, no CSS framework, no theme, dark only. Previously ran on al-folio (Jekyll).

## Develop

```bash
npm install
npm run dev      # http://localhost:4321, hot reload
npm run build    # → dist/
npm run preview  # serves dist/ the way GitHub Pages does
npm run check    # astro check + prettier --check
npm run verify   # asset byte-identity + structural and feature audits
npm run format   # prettier --write
```

Node 22 or newer (`.nvmrc`).

## Layout

```
src/
  consts.ts           site metadata and the nav
  content.config.ts   the six collections and their schemas
  loaders/bibtex.ts   papers.bib → a typed `publications` collection
  data/               papers.bib, venues.yml, authors.yml, people.yml
  content/            approaches/ (8), conferences/ (16)
  pages/              routes; see the URL table below
  components/ layouts/ lib/ styles/
public/               copied verbatim — everything here is a permanent URL
  assets/pdf/         10 slide decks + 4 PPTX
  assets/img/         approach diagrams, logo, people photos
  CNAME .nojekyll robots.txt
scripts/              audits, the asset baseline, the Crossref bib check
verification/         committed SHA-256 baseline for the published assets
```

## Content model

Six collections. Every cross-reference is an Astro `reference()`, so a bad slug, an unknown venue or
a BibTeX key pointing at a page that does not exist **stops the build**. Under Jekyll each of those
was a silent Liquid lookup that rendered blank.

| Collection     | Source                     | Notes                                           |
| -------------- | -------------------------- | ----------------------------------------------- |
| `publications` | `src/data/papers.bib`      | parsed at build time; 16 entries                |
| `conferences`  | `src/content/conferences/` | one page per paper, plus 5 redirect stubs       |
| `approaches`   | `src/content/approaches/`  | the 8 approaches, ordered by `importance`       |
| `people`       | `src/data/people.yml`      | the entry key **is** the `/people/#anchor`      |
| `authors`      | `src/data/authors.yml`     | every author who appears anywhere; name + ORCID |
| `venues`       | `src/data/venues.yml`      | badge colours, keyed by the BibTeX `abbr`       |

The BibTeX loader also reads ARDoCo's own `html = {/c/<slug>}` field, which links a paper to its
page, and fails the build if that page is missing.

## URLs

Two shapes, both inherited from the Jekyll site and both still served:

| URL                                    | Built from                           |
| -------------------------------------- | ------------------------------------ |
| `/`                                    | `src/pages/index.astro`              |
| `/approaches/`                         | `src/pages/approaches/index.astro`   |
| `/approaches/<slug>/`                  | `src/pages/approaches/[slug]/`       |
| `/conferences/`                        | `src/pages/conferences/index.astro`  |
| **`/c/<slug>`**                        | `src/pages/c/[slug].astro` → `.html` |
| `/publications/`                       | `src/pages/publications/index.astro` |
| `/people/`                             | `src/pages/people/index.astro`       |
| `/initial-poster-2019/`                | `src/pages/initial-poster-2019/`     |
| `/404.html` `/feed.xml` `/sitemap.xml` | `src/pages/`                         |

`astro.config.mjs` uses `build.format: 'preserve'`, which is what lets one config emit both
`approaches/<slug>/index.html` and the flat `c/<slug>.html`. The cost is that `Astro.url.pathname`
is the _file_ path, so canonical links and sitemap entries go through `canonical()` in
`src/lib/urls.ts` — never `Astro.url` directly.

## Things that must not break

**`/c/<slug>`** — printed on conference posters and slides, and cited in papers. The five stubs
(`se24`, `se25`, `se26-exarch`, `se26-lissa`, `taas26`) redirect to the page that superseded them and
stay that way.

**`public/assets/**`** — served byte-for-byte at URLs that have been live for years. Never rename,
move, or run them through an optimiser. Pinned by SHA-256 in `verification/asset-sha256.txt`; if you
genuinely add or replace one, rerun `node scripts/generate-asset-baseline.mjs`.

**The two `NEVER CHANGE THIS LINE B/E` comments on the home page** — an external page at
mcse.kastel.kit.edu scrapes the text between them. Invisible from inside the site, which is what
makes them easy to lose.

**`public/CNAME`** — the deploy replaces the `gh-pages` branch wholesale, so if this file stops being
emitted, `ardoco.de` stops resolving.

`npm run verify` asserts all four, and the deploy workflow runs it before publishing. It also checks
WCAG contrast, that every internal link and `#fragment` resolves, that images carry intrinsic
dimensions, that no text runs into a link, that no email address appears in the served bytes, and
that `www.youtube.com` (the two screencasts) is still the only third-party origin.

## Content tasks

| Task                       | How                                                                               |
| -------------------------- | --------------------------------------------------------------------------------- |
| Add a publication          | append to `src/data/papers.bib`; `html = {/c/<slug>}` links it to its page        |
| Add a venue badge          | add the abbreviation to `src/data/venues.yml` — an unknown `abbr` fails the build |
| Add a paper page           | new `.md` in `src/content/conferences/`; the filename is the `/c/<slug>` URL      |
| Add an approach            | new `.md` in `src/content/approaches/`; `importance` sets its place in the list   |
| Link a paper to approaches | `approaches: [lissa, exarch]` in its front matter — bad slugs fail the build      |
| Add a person               | new entry in `src/data/people.yml`; the key becomes the `/people/#anchor`         |
| Reorder the nav            | `navOrder` on a conference entry; it drives the nav and the front-page list alike |
| Add an image               | drop it in `public/assets/img/`, then rerun `scripts/generate-asset-baseline.mjs` |
| Check bib against Crossref | `python3 scripts/update_bib.py` (stdlib only; `--write` applies the safe fields)  |

## Deployment

`.github/workflows/deploy.yml` runs `prettier --check`, `astro check`, `build` and `verify` on every
push and pull request to `main`, then publishes `dist/` to the `gh-pages` branch, which GitHub Pages
serves as `ardoco.de`.
