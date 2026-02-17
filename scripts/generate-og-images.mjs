import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'og');
mkdirSync(OUT_DIR, { recursive: true });

const interRegular = readFileSync(join(__dirname, 'fonts', 'Inter-Regular.ttf'));
const interBold = readFileSync(join(__dirname, 'fonts', 'Inter-Bold.ttf'));

const fonts = [
  { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
  { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
];

const WIDTH = 1200;
const HEIGHT = 630;

// Import peptide data
const dataPath = join(__dirname, '..', 'src', 'data', 'peptides.ts');
const dataContent = readFileSync(dataPath, 'utf-8');

// Simple extraction of peptide data from the module
const peptideRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*fullName:\s*'([^']+)'(?:,\s*alsoKnownAs:\s*\[([^\]]*)\])?,\s*category:\s*'([^']+)'(?:,\s*popular:\s*(true|false))?,\s*description:\s*'([^']*(?:\\.[^']*)*)',[\s\S]*?stats:\s*\{([^}]+)\}[\s\S]*?researchStatus:\s*'([^']+)'/g;

const statLabels = {
  healing: 'Healing',
  muscle: 'Muscle',
  cognition: 'Cognition',
  antiAging: 'Anti-Aging',
  fatLoss: 'Fat Loss',
  immune: 'Immune',
};

function parsePeptides(content) {
  const peptides = [];
  // Use a simpler approach: find each peptide object block
  const blocks = content.split(/\n  \{/).slice(1); // split on top-level objects

  for (const block of blocks) {
    const fullBlock = '{' + block;
    const getId = fullBlock.match(/id:\s*'([^']+)'/);
    const getName = fullBlock.match(/name:\s*'([^']+)'/);
    const getFullName = fullBlock.match(/fullName:\s*'([^']+)'/);
    const getCategory = fullBlock.match(/category:\s*'([^']+)'/);
    const getStatus = fullBlock.match(/researchStatus:\s*'([^']+)'/);
    const getAka = fullBlock.match(/alsoKnownAs:\s*\[([^\]]*)\]/);

    // Parse stats
    const statsMatch = fullBlock.match(/stats:\s*\{([^}]+)\}/);
    const stats = {};
    if (statsMatch) {
      const statPairs = statsMatch[1].matchAll(/(\w+):\s*(\d+)/g);
      for (const [, key, val] of statPairs) {
        stats[key] = parseInt(val);
      }
    }

    if (getId && getName) {
      const aka = getAka ? getAka[1].replace(/'/g, '').split(',').map(s => s.trim()).filter(Boolean) : [];
      peptides.push({
        id: getId[1],
        name: getName[1],
        fullName: getFullName?.[1] || getName[1],
        category: getCategory?.[1] || '',
        researchStatus: getStatus?.[1] || '',
        alsoKnownAs: aka,
        stats,
      });
    }
  }
  return peptides;
}

const peptides = parsePeptides(dataContent);
console.log(`Found ${peptides.length} peptides`);

function getTopStats(stats, count = 3) {
  return Object.entries(stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count);
}

function StatBarSVG(label, value, maxWidth = 340) {
  const barWidth = Math.round((value / 100) * maxWidth);
  const color = value >= 80 ? '#d1d5db' : value >= 50 ? '#6b7280' : '#4b5563';

  return {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
            children: [
              { type: 'span', props: { style: { fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: label } },
              { type: 'span', props: { style: { fontSize: '14px', color: '#d1d5db', fontWeight: 700 }, children: String(value) } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', height: '6px', background: '#1f2937', borderRadius: '3px', width: '100%', overflow: 'hidden' },
            children: [
              { type: 'div', props: { style: { width: `${value}%`, height: '100%', background: color, borderRadius: '3px' } } },
            ],
          },
        },
      ],
    },
  };
}

async function renderImage(jsx) {
  const svg = await satori(jsx, { width: WIDTH, height: HEIGHT, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}

// Generate peptide OG images
for (const peptide of peptides) {
  const topStats = getTopStats(peptide.stats);
  const akaText = peptide.alsoKnownAs.length > 0 ? peptide.alsoKnownAs.join(' / ') : peptide.fullName;

  const jsx = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        background: '#111827',
        padding: '60px',
        fontFamily: 'Inter',
        color: '#f9fafb',
      },
      children: [
        // Top row: category + status
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '16px',
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  },
                  children: peptide.category,
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '14px',
                    color: peptide.researchStatus === 'FDA Approved' ? '#34d399' : '#9ca3af',
                    border: `1px solid ${peptide.researchStatus === 'FDA Approved' ? '#34d399' : '#374151'}`,
                    borderRadius: '100px',
                    padding: '4px 14px',
                  },
                  children: peptide.researchStatus,
                },
              },
            ],
          },
        },
        // Name block
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' },
            children: [
              { type: 'div', props: { style: { fontSize: '52px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }, children: peptide.name } },
              { type: 'div', props: { style: { fontSize: '20px', color: '#6b7280' }, children: akaText } },
            ],
          },
        },
        // Stats
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '32px', width: '60%' },
            children: topStats.map(([key, val]) => StatBarSVG(statLabels[key] || key, val)),
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderTop: '1px solid #374151',
              paddingTop: '20px',
              marginTop: 'auto',
            },
            children: [
              { type: 'span', props: { style: { fontSize: '18px' }, children: '\u25C6' } },
              { type: 'span', props: { style: { fontSize: '16px', fontWeight: 600 }, children: 'StackRx' } },
              { type: 'span', props: { style: { fontSize: '16px', color: '#6b7280' }, children: '\u2022' } },
              { type: 'span', props: { style: { fontSize: '16px', color: '#6b7280' }, children: 'peptide research' } },
            ],
          },
        },
      ],
    },
  };

  const png = await renderImage(jsx);
  const outPath = join(OUT_DIR, `${peptide.id}.png`);
  writeFileSync(outPath, png);
  console.log(`  ${peptide.id}.png`);
}

// Default homepage OG image
const defaultJsx = {
  type: 'div',
  props: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: '#111827',
      fontFamily: 'Inter',
      color: '#f9fafb',
      gap: '20px',
    },
    children: [
      { type: 'div', props: { style: { fontSize: '28px' }, children: '\u25C6' } },
      { type: 'div', props: { style: { fontSize: '56px', fontWeight: 700, letterSpacing: '-0.03em' }, children: 'StackRx' } },
      { type: 'div', props: { style: { fontSize: '24px', color: '#6b7280' }, children: 'Peptide Research Directory' } },
      { type: 'div', props: { style: { fontSize: '18px', color: '#4b5563', marginTop: '16px' }, children: `${peptides.length} peptides \u2022 Performance stats \u2022 Research status` } },
    ],
  },
};

let png = await renderImage(defaultJsx);
writeFileSync(join(OUT_DIR, 'default.png'), png);
console.log('  default.png');

// Quiz OG image
const quizJsx = {
  type: 'div',
  props: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: '#111827',
      fontFamily: 'Inter',
      color: '#f9fafb',
      gap: '20px',
    },
    children: [
      { type: 'div', props: { style: { fontSize: '20px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }, children: 'PEPTIDE QUIZ' } },
      { type: 'div', props: { style: { fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em', textAlign: 'center' }, children: 'Find Your Peptide in 60 Seconds' } },
      { type: 'div', props: { style: { fontSize: '20px', color: '#6b7280', marginTop: '8px' }, children: 'Personalized recommendation based on your goals' } },
      {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px', borderTop: '1px solid #374151', paddingTop: '20px' },
          children: [
            { type: 'span', props: { style: { fontSize: '18px' }, children: '\u25C6' } },
            { type: 'span', props: { style: { fontSize: '16px', fontWeight: 600 }, children: 'StackRx' } },
          ],
        },
      },
    ],
  },
};

png = await renderImage(quizJsx);
writeFileSync(join(OUT_DIR, 'quiz.png'), png);
console.log('  quiz.png');

// Calculator OG image
const calcJsx = {
  type: 'div',
  props: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: '#111827',
      fontFamily: 'Inter',
      color: '#f9fafb',
      gap: '20px',
    },
    children: [
      { type: 'div', props: { style: { fontSize: '20px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }, children: 'DOSING CALCULATOR' } },
      { type: 'div', props: { style: { fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em', textAlign: 'center' }, children: 'Peptide Dosing Calculator' } },
      { type: 'div', props: { style: { fontSize: '20px', color: '#6b7280', marginTop: '8px' }, children: 'Reconstitution \u2022 Titration \u2022 Syringe volume' } },
      {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px', borderTop: '1px solid #374151', paddingTop: '20px' },
          children: [
            { type: 'span', props: { style: { fontSize: '18px' }, children: '\u25C6' } },
            { type: 'span', props: { style: { fontSize: '16px', fontWeight: 600 }, children: 'StackRx' } },
          ],
        },
      },
    ],
  },
};

png = await renderImage(calcJsx);
writeFileSync(join(OUT_DIR, 'calculator.png'), png);
console.log('  calculator.png');

console.log(`\nDone! Generated ${peptides.length + 3} OG images.`);
