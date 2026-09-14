export const SITE = {
  url: 'https://ardoco.de',
  title: 'ARDoCo',
  tagline: 'Automating Requirements and Documentation Comprehension',
  description:
    'ARDoCo is a research project on traceability link recovery and consistency analysis between software artifacts — connecting architecture documentation, models and code, and finding what is missing or has drifted.',
  lang: 'en',
  repo: 'https://github.com/ardoco',
  email: 'ardoco@lists.kit.edu',
} as const;

/**
 * Drives the accent-colour cascade in tokens.css: whichever value lands on
 * <body data-section> re-points the neutral --sec-* aliases at one accent
 * family, so a single component set recolours itself per area of the site.
 */
export type Section = 'home' | 'approaches' | 'conferences' | 'publications' | 'people';

export const NAV: { label: string; href: string; section: Section }[] = [
  { label: 'about', href: '/', section: 'home' },
  { label: 'approaches', href: '/approaches/', section: 'approaches' },
  { label: 'conferences', href: '/conferences/', section: 'conferences' },
  { label: 'publications', href: '/publications/', section: 'publications' },
  { label: 'people', href: '/people/', section: 'people' },
];
