import fs from 'node:fs';

const source = fs.readFileSync('src/lib/blog.ts', 'utf8');
const articles = [...source.matchAll(/\n  \{\n    slug: '([^']+)'[\s\S]*?(?=\n  \},\n|\n\];)/g)];
if (articles.length !== 30) {
  throw new Error(`El blog debe tener exactamente 30 artículos; actualmente tiene ${articles.length}`);
}

const failures = [];
for (const match of articles) {
  const block = match[0];
  const slug = match[1];
  const words = (block.match(/[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9]+(?:[-'][A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9]+)*/g) || []).length;
  const sections = (block.match(/heading:/g) || []).length;
  const faqs = (block.match(/question:/g) || []).length;
  const internalLinks = (block.match(/vaneando|camper|Canarias/gi) || []).length;
  if (words < 3000 || sections < 8 || faqs < 3 || internalLinks < 8) {
    failures.push({ slug, words, sections, faqs, internalLinks });
  }
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  throw new Error(`${failures.length} artículos aún no cumplen el estándar SEO mínimo`);
}
console.log('Blog quality audit passed: 30 artículos, todos con 3.000+ palabras y estructura SEO mínima.');
