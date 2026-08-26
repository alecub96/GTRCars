import assert from 'node:assert/strict';
import fs from 'node:fs';

const search = fs.readFileSync('src/app/buscar/page.tsx', 'utf8');
const sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');
const camper = fs.readFileSync('src/app/camper/[slug]/page.tsx', 'utf8');
const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

assert.equal(search.includes('REALISTIC_CANARIAN_CAMPERS'), false, 'demo inventory must not be public search inventory');
assert.equal(sitemap.includes('REALISTIC_CANARIAN_CAMPERS'), false, 'demo inventory must not be in sitemap');
assert.match(search, /status:\s*'ACTIVE'/, 'search must query active vehicles');
assert.match(camper, /status:\s*'ACTIVE'/, 'vehicle detail must query active vehicles');
assert.match(search, /canonical:\s*'https:\/\/vaneando\.com\/buscar'/, 'search canonical must be clean');
assert.match(search, /index:\s*false/, 'faceted search must be noindex');
assert.equal(layout.includes('La plataforma #1'), false, 'unsupported leadership claim must not be in root metadata');
assert.equal(fs.existsSync('docs/audit/VANEANDO_BASELINE_2026-08-26.md'), true);
console.log('Integrity audit passed');
