// Regenerates verification/asset-sha256.txt from public/.
//
// Run this deliberately, when an asset is genuinely added or replaced — never
// to "fix" a failing verify, which is the situation the baseline exists to
// report.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['assets/pdf', 'assets/img'];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const rows = [];
for (const root of ROOTS) {
  const base = join(process.cwd(), 'public', root);
  for (const file of walk(base).sort()) {
    const rel = relative(join(process.cwd(), 'public'), file).split('\\').join('/');
    rows.push(`${createHash('sha256').update(readFileSync(file)).digest('hex')}  ${rel}`);
  }
}
rows.sort((a, b) => a.slice(66).localeCompare(b.slice(66)));

writeFileSync(
  'verification/asset-sha256.txt',
  [
    '# Byte identity of the published assets, asserted by scripts/verify-invariants.mjs.',
    '#',
    '# assets/pdf/** are the slide decks linked from conference pages and from',
    '# published papers; assets/img/** are the approach diagrams, the logo and the',
    '# people photos. All of them are served from public/ verbatim, at URLs that',
    '# have been live for years. Nothing should ever rewrite, recompress or rename',
    '# them as a side effect of a build.',
    '#',
    '# Regenerate with: node scripts/generate-asset-baseline.mjs',
    '',
    ...rows,
    '',
  ].join('\n'),
);
console.log(`wrote verification/asset-sha256.txt — ${rows.length} files`);
