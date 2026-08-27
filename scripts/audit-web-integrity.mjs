import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', 'tmp'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) files.push(full);
  }
}
walk(path.join(root, 'src'));

const routes = new Set(['/']);
for (const file of files.filter((file) => file.includes(`${path.sep}app${path.sep}`) && file.endsWith('page.tsx'))) {
  const relative = path.relative(path.join(root, 'src/app'), path.dirname(file)).split(path.sep).join('/');
  if (!relative) routes.add('/');
  else if (!relative.includes('[')) routes.add(`/${relative}`);
  else if (relative === 'guias/[slug]' || relative === 'camper/[slug]' || relative === 'alquiler-camper/[island]' || relative === 'propietario/editar/[id]' || relative === 'reserva/[id]') routes.add(`/${relative.replace(/\[.*?\]/g, ':param')}`);
}

const source = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const staticLinks = [...source.matchAll(/(?:href|action)=['"](\/[^'"?#{}]+)(?:\?[^'"{}]*)?['"]/g)].map((match) => match[1]);
const ignored = new Set(['/api', '/_next', '/#']);
const broken = [...new Set(staticLinks)].filter((link) => {
  if (ignored.has(link) || link.startsWith('/api/')) return false;
  if (fs.existsSync(path.join(root, 'public', link.slice(1)))) return false;
  if (routes.has(link)) return false;
  return ![...routes].some((route) => route.includes(':param') && link.startsWith(route.split('/:param')[0] + '/'));
});

const apiRoutes = new Set(files.filter((file) => file.includes(`${path.sep}app${path.sep}api${path.sep}`) && file.endsWith('route.ts')).map((file) => `/${path.relative(path.join(root, 'src/app'), path.dirname(file)).split(path.sep).join('/')}`));
const apiCalls = [...source.matchAll(/fetch\(['"](\/api\/[^'"?`]+)/g)].map((match) => match[1]);
const missingApis = [...new Set(apiCalls)].filter((call) => ![...apiRoutes].some((route) => call === route || (route.includes('[id]') && call.startsWith(route.replace('/[id]', '/').split('/route')[0]))));

if (broken.length || missingApis.length) {
  console.error(JSON.stringify({ broken, missingApis }, null, 2));
  process.exit(1);
}
console.log(`Web integrity audit passed: ${routes.size} public route patterns, ${new Set(staticLinks).size} static links and ${new Set(apiCalls).size} API calls checked.`);
