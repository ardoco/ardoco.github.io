import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Intrinsic dimensions of an SVG under public/, read off disk at build time.
 *
 * Raster images live in src/assets/ and get their dimensions from Astro's
 * image pipeline. The SVG diagrams stay in public/, served byte-for-byte, so
 * nothing else knows how big they are. (Astro's own probe reads only the first
 * kilobyte, which misses the root element of a draw.io export: its embedded
 * diagram is one long attribute.) Without width and height the page reflows
 * as each one loads, and audit-site.mjs fails any <img> that ships without them.
 *
 * Resolved from the working directory, NOT from import.meta.url: during
 * `astro build` this module is bundled into dist/.prerender/chunks/, so a URL
 * relative to import.meta.url points into the output directory and every lookup
 * fails — while `astro dev`, which runs the source in place, works fine.
 */
export function intrinsic(publicPath: string): { width: number; height: number } {
  const file = join(process.cwd(), 'public', publicPath);
  if (!existsSync(file)) throw new Error(`image: ${publicPath} not found under public/`);

  const svg = readFileSync(file, 'utf8').slice(0, 4096);
  const vb = svg.match(/viewBox\s*=\s*["']\s*[\d.-]+[ ,]+[\d.-]+[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
  if (vb) return { width: Math.round(Number(vb[1])), height: Math.round(Number(vb[2])) };
  const w = svg.match(/\bwidth\s*=\s*["']([\d.]+)/i);
  const h = svg.match(/\bheight\s*=\s*["']([\d.]+)/i);
  if (w && h) return { width: Math.round(Number(w[1])), height: Math.round(Number(h[1])) };
  throw new Error(`image: ${publicPath} has neither viewBox nor width/height`);
}
