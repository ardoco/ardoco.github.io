<p align="center"><img src="public/assets/img/logo.png" alt="" height="110"></p>

<h1 align="center">ardoco.de</h1>

<p align="center">
Website of <strong>ARDoCo</strong> — Automating Requirements and Documentation Comprehension,
a research project on traceability link recovery and documentation consistency at the
<a href="https://mcse.kastel.kit.edu">MCSE group</a>, <a href="https://kastel.kit.edu">KASTEL</a>, KIT.
</p>

---

Built with [Astro](https://astro.build/): eight Zod-validated content collections, a hand-written
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
  consts.ts           SITE (url, lang, repo, email) and SECTIONS, the accent areas
  content.config.ts   the eight collections and their schemas
  loaders/bibtex.ts   papers.bib → a typed `publications` collection
  data/               papers.bib, venues.yml, authors.yml, people.yml
  content/            approaches/ (8), conferences/ (16), pages/: every word the
                      templates print, one Markdown file per page, and standalone/:
                      pages that are nothing but text
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

Six collections of content, plus `pages`, the site's own words, and `standalone`, the pages that
are nothing but text. Every cross-reference is an Astro
`reference()`, so a bad slug, an unknown venue or
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

## Page text — `src/content/pages/`

The `.astro` files hold layout and code. Every word a reader sees that is not computed — a page's
`<title>` and description, its lede, the labels on its chips and buttons, the nav and footer rows,
the home page's introduction — is in `src/content/pages/`, one Markdown file per page:

| File                                                                | Holds                                                                                   |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `site/site.md`                                                      | the site `title`, the `tagline` and the default `description`                           |
| `site/nav.md`                                                       | each section's nav item                                                                 |
| `site/footer.md`                                                    | the copyright holder and link row; the body is the affiliation                          |
| `site/publication.md`                                               | words shared by a publication entry and a conference page, and `linkLabels`             |
| `home.md`, `home/affiliation.md`, `home/poster.md`, `home/links.md` | the home page: buttons and labels; the body is the introduction; one block per fragment |
| `404.md`, `approaches.md`, `people.md`, `publications.md`           | one page each; the body, where there is one, is the lede                                |

**Front matter holds short plain strings, the body holds anything with a link or emphasis in it.**
`labels` are short words, `intros` the sentence under a section heading, `plurals` a
`{ one, other }` pair; `{count}` is filled in by the template. A page with a second rich block puts
it in a fragment file beside it (`home/affiliation.md`), rendered on its own. Link rows — the nav,
the footer's links, the 404 chips — are Markdown links too, `'[label](href)'`, parsed into label and
href because the template draws them as chips and nav items. The schema is strict, and a field a
template needs but cannot find fails the build naming file and field (`need()` in
`src/lib/pages.ts`).

A body brings its own `<p>`, so a template places it in a block, never inside a `<p>`; where it
runs on in a line (the footer, the publications lede) the wrapper sets that `<p>` inline. Scoped
styles do not reach Markdown output, so a rule for it is written `.intro :global(p)`. Astro's
typographer curls straight quotes in a body; write `&#39;` where the straight one matters.

What stays in the templates: headings and the `## kicker` above them, `alt` text, `aria-label`s, the
labels of interactive controls (the copy button, the skip link, the publication filter),
separators and glyphs, and the footer's "built with" credit.

**Pages that are nothing but text** live entirely in `src/content/standalone/`: front matter for the
title, description, kicker, heading and an optional `image: { src, alt }`, the body for the text.
`src/pages/[...slug]/index.astro` renders each at `/<file name>/`; the image is front matter so it
keeps its intrinsic width and height. `initial-poster-2019.md` is the one so far.

## URLs

Two shapes, both inherited from the Jekyll site and both still served:

| URL                                    | Built from                                           |
| -------------------------------------- | ---------------------------------------------------- |
| `/`                                    | `src/pages/index.astro`                              |
| `/approaches/`                         | `src/pages/approaches/index.astro`                   |
| `/approaches/<slug>/`                  | `src/pages/approaches/[slug]/`                       |
| `/conferences/`                        | redirect stub to `/publications/`                    |
| **`/c/<slug>`**                        | `src/pages/c/[slug].astro` → `.html`                 |
| `/publications/`                       | `src/pages/publications/index.astro`                 |
| `/people/`                             | `src/pages/people/index.astro`                       |
| `/initial-poster-2019/`                | `src/content/standalone/` via `src/pages/[...slug]/` |
| `/404.html` `/feed.xml` `/sitemap.xml` | `src/pages/`                                         |

`astro.config.mjs` uses `build.format: 'preserve'`, which is what lets one config emit both
`approaches/<slug>/index.html` and the flat `c/<slug>.html`. The cost is that `Astro.url.pathname`
is the _file_ path, so canonical links and sitemap entries go through `canonical()` in
`src/lib/urls.ts` — never `Astro.url` directly.

## Things that must not break

**`/c/<slug>`** — printed on conference posters and slides, and cited in papers. The five stubs
(`se24`, `se25`, `se26-exarch`, `se26-lissa`, `taas26`) redirect to the page that superseded them and
stay that way.

**`/conferences/`** was published, so it stays as a redirect stub to `/publications/`: that page links every
| `/approaches/tv/`                      | redirect stub to `/approaches/tools/`                |
`/c/<slug>` page, so the list was a duplicate.

**`public/assets/**`** — served byte-for-byte at URLs that have been live for years. Never rename,
move, or run them through an optimiser. Pinned by SHA-256 in `verification/asset-sha256.txt`; if you
genuinely add or replace one, rerun `node scripts/generate-asset-baseline.mjs`.

**The two `NEVER CHANGE THIS LINE B/E` comments on the home page** — an external page at
mcse.kastel.kit.edu scrapes the text between them. The comments stay in `src/pages/index.astro`; the
text is `paragraphs` in `src/content/pages/home.md`. Invisible from inside the site, which is what
makes them easy to lose.

**`public/CNAME`** — the deploy replaces the `gh-pages` branch wholesale, so if this file stops being
emitted, `ardoco.de` stops resolving.

`npm run verify` asserts the redirect stubs (the five `/c/` ones, `/conferences/` and
`/approaches/tv/`), the asset hashes, the two comments and `CNAME`, and the deploy workflow runs it before publishing. It also checks
WCAG contrast, that every internal link and `#fragment` resolves, that images carry intrinsic
dimensions, that no text runs into a link, that no email address appears in the served bytes, and
that `www.youtube.com` (the two screencasts) is still the only third-party origin.

## Content tasks

**`/approaches/tv/`** was the page for ARDoCo-TV alone, which grew into the tools page, so it stays as a
redirect stub to `/approaches/tools/`.

| Task                       | How                                                                               |
| -------------------------- | --------------------------------------------------------------------------------- |
| Add a publication          | append to `src/data/papers.bib`; `html = {/c/<slug>}` links it to its page        |
| Add a venue badge          | add the abbreviation to `src/data/venues.yml` — an unknown `abbr` fails the build |
| Add a paper page           | new `.md` in `src/content/conferences/`; the filename is the `/c/<slug>` URL      |
| Add an approach            | new `.md` in `src/content/approaches/`; `importance` sets its place in the list   |
| Link a paper to approaches | `approaches: [lissa, exarch]` in its front matter — bad slugs fail the build      |
| Add a person               | new entry in `src/data/people.yml`; the key becomes the `/people/#anchor`         |
| Reorder the home list      | `navOrder` on a conference entry; it orders the home-page list and the feed       |
| Add an image               | drop it in `public/assets/img/`, then rerun `scripts/generate-asset-baseline.mjs` |
| Change a page's words      | its file in `src/content/pages/`; the nav and footer rows are in `site/`          |
| Check bib against Crossref | `python3 scripts/update_bib.py` (stdlib only; `--write` applies the safe fields)  |

## Deployment

`.github/workflows/deploy.yml` runs `prettier --check`, `astro check`, `build` and `verify` on every
push and pull request to `main`, then publishes `dist/` to the `gh-pages` branch, which GitHub Pages
serves as `ardoco.de`.
