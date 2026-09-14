import { defineCollection, reference } from 'astro:content';
import { z } from 'zod';
import { file, glob } from 'astro/loaders';
import { bibtexLoader } from './loaders/bibtex';

/** Conference brand colours for the publication badges, keyed by BibTeX `abbr`. */
const venues = defineCollection({
  loader: file('src/data/venues.yml'),
  schema: z.object({
    name: z.string(),
    url: z.url().optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'venue colour must be a 6-digit hex value'),
  }),
});

/** Everyone who appears as an author anywhere; 18 entries, 6 of them ARDoCo members. */
const authors = defineCollection({
  loader: file('src/data/authors.yml'),
  schema: z.object({
    name: z.string(),
    orcid: z.string().nullable().default(null),
  }),
});

/**
 * ARDoCo members shown at /people/. The collection id is the page anchor, and
 * inbound publication author links depend on it — see src/data/people.yml.
 */
const people = defineCollection({
  loader: file('src/data/people.yml'),
  schema: z.object({
    author: reference('authors'),
    order: z.number().int(),
    image: z.string(),
    kitUrl: z.url().optional(),
    email: z.string().optional(),
    surnames: z.array(z.string()).min(1),
  }),
});

const publications = defineCollection({
  loader: bibtexLoader({
    file: 'src/data/papers.bib',
    conferenceRoot: 'src/content/conferences',
  }),
  schema: z.object({
    key: z.string(),
    type: z.string(),
    title: z.string(),
    authors: z.array(z.object({ first: z.string(), last: z.string() })).min(1),
    year: z.number().int(),
    month: z.number().int().min(1).max(12).optional(),
    // An abbr with no venues.yml entry fails the build. Five entries carry no
    // abbr at all, which is fine — they render without a badge.
    abbr: reference('venues').optional(),
    booktitle: z.string().optional(),
    journal: z.string().optional(),
    school: z.string().optional(),
    institution: z.string().optional(),
    publisher: z.string().optional(),
    series: z.string().optional(),
    volume: z.string().optional(),
    number: z.string().optional(),
    pages: z.string().optional(),
    location: z.string().optional(),
    doi: z.string().optional(),
    url: z.url().optional(),
    keywords: z.array(z.string()).default([]),
    googleScholarId: z.string().optional(),
    /** Slug of this paper's own page under /c/, from the BibTeX `html` field. */
    infoSlug: z.string().optional(),
    bibtex: z.string(),
    searchText: z.string(),
  }),
});

const figure = z.object({
  src: z.string(),
  alt: z.string(),
  /**
   * The approach diagrams are dark-on-transparent SVGs drawn for a white page.
   * On a near-black background they need a light plate behind them — except
   * the two that were authored without one.
   */
  plate: z.boolean().default(true),
});

const approaches = defineCollection({
  loader: glob({ base: 'src/content/approaches', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Sort key for /approaches/, roughly the order the work was published. */
    importance: z.number().int(),
    repositories: z.array(z.object({ name: z.string(), url: z.url() })).default([]),
    figure: figure.optional(),
  }),
});

/**
 * A map of label -> target, e.g. links.paper.ieee. Labels are resolved in
 * LINK_LABELS. Targets are absolute URLs for papers and replication packages,
 * but site-relative paths for slides, which are served from /assets/pdf/.
 */
const linkTarget = z.union([
  z.url(),
  z.string().regex(/^\/[^\s]*$/, 'link must be an absolute URL or a site-relative path'),
]);
const linkMap = z.record(z.string(), linkTarget).optional();

const conferences = defineCollection({
  loader: glob({ base: 'src/content/conferences', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),

    /**
     * Five entries are pure redirects kept alive because their URLs were
     * published: /c/se24 and friends point at the paper page that superseded
     * them. They carry nothing but a title and this field.
     */
    redirectTo: z.string().optional(),

    publication: reference('publications').optional(),
    authors: z.array(reference('authors')).default([]),
    approaches: z.array(reference('approaches')).default([]),

    year: z.number().int().optional(),
    featured: z.boolean().default(false),
    inPress: z.boolean().default(false),

    /**
     * Navbar label and ordering, previously the `children:` array in
     * _pages/conferences.md. That one list drove both the dropdown and the
     * front-page publication order, so it had to be edited in lockstep with
     * this directory; now each entry carries its own position.
     */
    navLabel: z.string().optional(),
    navOrder: z.number().int().optional(),

    pubShortName: z.string().optional(),
    conferenceName: z.string().optional(),
    conferenceUrl: z.url().optional(),

    /** Overrides for the one German-language entry (fg-arch24). */
    pubEmoji: z.string().default(''),
    pubPrefixText: z.string().default('Paper at'),
    pubBylineConnector: z.string().default('by'),

    links: z.object({ paper: linkMap, replication: linkMap, slides: linkMap }).default({}),

    additionalPresentations: z
      .array(z.object({ name: z.string(), shortName: z.string().optional(), url: z.url() }))
      .default([]),

    figure: figure.optional(),
  }),
});

export const collections = { venues, authors, people, publications, approaches, conferences };
