import { getEntry, render } from 'astro:content';
import type { Section } from '../consts';

/*
 * The words the site prints, read from src/content/pages/. Templates hold the
 * layout; every sentence, label and link list a reader sees comes through
 * here.
 */

/**
 * Load src/content/pages/<id>.md: its validated front matter, the rendered
 * Markdown body, and whether that body says anything at all. A missing file
 * fails the build naming the path, rather than rendering "undefined".
 */
export async function getPage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing page content: src/content/pages/${id}.md`);
  const { Content } = await render(entry);
  const { data } = entry;
  /** One string out of a keyed group (`labels`, `intros`, …), required. */
  const text = (group: TextGroup, key: string) => need(data[group]?.[key], `${id}.${group}.${key}`);
  return {
    data,
    Content,
    hasBody: Boolean(entry.body?.trim()),
    text,
    /** The page's `title` and `description`, both required: spread it onto
        <Base {...page.meta()}>. */
    meta: () => ({
      title: need(data.title, `${id}.title`),
      description: need(data.description, `${id}.description`),
    }),
    /** `labels.<key>`: the short words a page places around its lists. */
    label: (key: string) => text('labels', key),
    /** `plurals.<key>`, picked for `count`, with `{count}` filled in. */
    plural: (key: string, count: number) =>
      pluralize(need(data.plurals?.[key], `${id}.plurals.${key}`), count),
    /** `links`: the page's link row, each a Markdown link, as label and href. */
    links: () =>
      (data.links ?? []).map((link, index) => markdownLink(link, `${id}.links[${index}]`)),
  };
}

/** The front-matter groups that map a key to one string. */
type TextGroup = 'labels' | 'intros' | 'linkLabels';

/** Fill `{key}` placeholders with computed values; an unknown key stays as typed. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    key in vars ? String(vars[key]) : placeholder,
  );
}

/** Pick the singular or plural form for `count`, and fill in `{count}`. */
export function pluralize(forms: { one: string; other: string }, count: number) {
  return fill(count === 1 ? forms.one : forms.other, { count });
}

/**
 * A field the page needs. The schema keeps every field optional because one
 * collection holds every page's shape, so a missing one is caught here, at
 * build time, naming the file and the field.
 */
export function need<T>(value: T | undefined, name: string): T {
  if (value === undefined) {
    throw new Error(`Missing page content field: ${name} (src/content/pages/)`);
  }
  return value;
}

/**
 * One Markdown link, `[label](href)`, as its two halves. Link rows are written
 * as Markdown like every other link in src/content/pages/, but the template
 * draws them itself (a chip, a nav item), so they are parsed rather than
 * rendered. Anything else fails the build naming the field.
 */
export function markdownLink(link: string, name: string) {
  const match = /^\[([^\]]+)\]\((\S+)\)$/.exec(link.trim());
  if (!match) throw new Error(`${name}: "${link}" is not a Markdown link [label](href)`);
  return { label: match[1], href: match[2] };
}

/** The site-wide words in src/content/pages/site/site.md. Every page renders
    the nav and the head, so this is read on all of them. */
export async function siteText() {
  const { data } = await getPage('site/site');
  return {
    title: need(data.title, 'site/site.title'),
    tagline: need(data.tagline, 'site/site.tagline'),
    description: need(data.description, 'site/site.description'),
  };
}

/** The navigation rows in site/nav.md, in file order: each section's link. */
export async function navLinks(): Promise<{ label: string; href: string; section: Section }[]> {
  const { data } = await getPage('site/nav');
  const sections = need(data.sections, 'site/nav.sections');
  // The schema keys `sections` by SECTIONS, so every key is a Section.
  return (Object.entries(sections) as [Section, string][]).map(([section, link]) => ({
    ...markdownLink(link, `site/nav.sections.${section}`),
    section,
  }));
}
