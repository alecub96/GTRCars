const { BLOG_ARTICLES } = await import('../src/lib/blog.ts');
const articles = BLOG_ARTICLES;
if (articles.length !== 30) throw new Error(`El blog debe tener exactamente 30 artículos; actualmente tiene ${articles.length}`);

const failures = [];
const fingerprints = new Map();
for (const article of articles) {
  const slug = article.slug;
  const text = article.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets || [])]).join(' ');
  const words = (text.match(/[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9]+(?:[-'][A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9]+)*/g) || []).length;
  const sections = article.sections.length;
  const faqs = article.faqs?.length || 0;
  const internalLinks = (text.match(/vaneando|camper|Canarias/gi) || []).length;
  const uniquePhrases = article.sections.map((section) => `${section.heading}:${section.paragraphs[0]?.slice(0, 80) || ''}`);
  const fingerprint = uniquePhrases.join('|');
  fingerprints.set(slug, fingerprint);
  if (words < 3000 || sections < 8 || faqs < 3 || internalLinks < 3) {
    failures.push({ slug, words, sections, faqs, internalLinks, reason: 'minimums' });
  }
}

const duplicateFingerprints = [...fingerprints.entries()].filter(([, fingerprint]) => fingerprint && [...fingerprints.values()].filter((value) => value === fingerprint).length > 1);
if (duplicateFingerprints.length) {
  failures.push({ reason: 'duplicate article fingerprints', slugs: duplicateFingerprints.map(([slug]) => slug) });
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  throw new Error(`${failures.length} artículos aún no cumplen el estándar SEO mínimo`);
}
console.log('Blog quality audit passed: 30 artículos, todos con 3.000+ palabras y estructura SEO mínima.');
