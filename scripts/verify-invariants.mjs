// Byte-identity invariants, checked against dist/ before anything is published.
//
// Reads the filesystem rather than making HTTP requests: `astro preview` is a
// dev server with its own quirks, and what matters is what lands on gh-pages.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
let failed = 0;

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  failed += 1;
};

// ---- 1. assets are served byte-for-byte -------------------------------------
const baseline = readFileSync(join(process.cwd(), 'verification/asset-sha256.txt'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => {
    const [hash, rel] = l.split(/\s+/);
    return { hash, rel };
  });

let drifted = 0;
for (const { hash, rel } of baseline) {
  const p = join(DIST, rel);
  if (!existsSync(p)) {
    fail(`asset missing from dist: ${rel}`);
    drifted += 1;
    continue;
  }
  const actual = createHash('sha256').update(readFileSync(p)).digest('hex');
  if (actual !== hash) {
    fail(`asset bytes changed: ${rel}`);
    drifted += 1;
  }
}
if (drifted === 0) console.log(`✓ invariants: ${baseline.length} assets byte-identical`);

// ---- 2. deployment files ----------------------------------------------------
// The site is served by GitHub Pages from the gh-pages branch. The custom
// domain lives in CNAME, and the deploy replaces the branch wholesale — so if
// CNAME stops being emitted, ardoco.de stops resolving. Under Jekyll it only
// survived because `keep_files` preserved it on the branch.
const cname = join(DIST, 'CNAME');
if (!existsSync(cname)) fail('dist/CNAME missing — the custom domain would be dropped');
else if (readFileSync(cname, 'utf8').trim() !== 'ardoco.de')
  fail(`dist/CNAME is "${readFileSync(cname, 'utf8').trim()}", expected "ardoco.de"`);
else console.log('✓ invariants: CNAME present (ardoco.de)');

if (!existsSync(join(DIST, '.nojekyll')))
  fail('dist/.nojekyll missing — GitHub Pages would run the output through Jekyll');
else console.log('✓ invariants: .nojekyll present');

process.exit(failed > 0 ? 1 : 0);
