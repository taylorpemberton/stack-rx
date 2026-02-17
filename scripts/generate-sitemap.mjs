import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const BASE_URL = process.env.VITE_BASE_URL || 'https://stackrx.co';

// Read peptide IDs from source data
const dataContent = readFileSync(join(ROOT, 'src', 'data', 'peptides.ts'), 'utf-8');
const idMatches = [...dataContent.matchAll(/id:\s*'([^']+)'/g)];
const peptideIds = idMatches.map((m) => m[1]);

const today = new Date().toISOString().split('T')[0];

const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/quiz', priority: '0.9', changefreq: 'monthly' },
  { path: '/calculator', priority: '0.9', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  ...peptideIds.map((id) => ({
    path: `/peptide/${id}`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
console.log(`  sitemap.xml (${pages.length} URLs)`);

const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

writeFileSync(join(DIST, 'robots.txt'), robots);
console.log('  robots.txt');
