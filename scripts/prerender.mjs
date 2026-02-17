import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

// Read the built index.html as template
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

// Read peptide IDs from source data
const dataContent = readFileSync(join(ROOT, 'src', 'data', 'peptides.ts'), 'utf-8');
const idMatches = [...dataContent.matchAll(/id:\s*'([^']+)'/g)];
const peptideIds = idMatches.map((m) => m[1]);

// All routes to prerender
const routes = [
  '/',
  '/quiz',
  '/calculator',
  '/blog',
  ...peptideIds.map((id) => `/peptide/${id}`),
];

async function prerender() {
  // Create a Vite server in SSR mode
  const vite = await createServer({
    root: ROOT,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

    for (const route of routes) {
      const { html: appHtml, helmet } = render(route);

      // Build the head tags from helmet
      const headTags = [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].filter(Boolean).join('\n    ');

      // Inject rendered HTML and head tags into the template
      let finalHtml = template
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
        .replace('</head>', `    ${headTags}\n  </head>`);

      // Write the file
      const filePath = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
      const fullPath = join(DIST, filePath);
      mkdirSync(dirname(fullPath), { recursive: true });
      writeFileSync(fullPath, finalHtml);
      console.log(`  ${filePath}`);
    }

    console.log(`\nPre-rendered ${routes.length} routes.`);
  } finally {
    await vite.close();
  }
}

prerender().catch((err) => {
  console.warn('Prerender skipped (SSR not available in this environment):', err.message);
  // Non-fatal — SPA still works via Vercel rewrites
});
