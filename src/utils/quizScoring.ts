import { peptides } from '../data/peptides';

const categoryToStat = {
  'Recovery & Healing': 'healing',
  'Growth Hormone': 'muscle',
  'Cognitive & Mood': 'cognition',
  'Anti-Aging & Skin': 'antiAging',
  'Fat Loss & Metabolism': 'fatLoss',
  'Immune Support': 'immune',
  'Sexual Health': null,
  'Sleep': null,
};

const goalToCategory = {
  fatLoss: 'Fat Loss & Metabolism',
  muscle: 'Growth Hormone',
  healing: 'Recovery & Healing',
  cognition: 'Cognitive & Mood',
  antiAging: 'Anti-Aging & Skin',
  sleep: 'Sleep',
  immune: 'Immune Support',
};

export function scorePeptides(answers) {
  const { goal, approval, administration, focus } = answers;

  return peptides
    .map((peptide) => {
      let score = 0;

      // Primary goal match (weight: 40)
      if (goal) {
        const goalStat = peptide.stats[goal];
        if (goalStat) score += (goalStat / 100) * 40;

        // Category alignment bonus
        const targetCategory = goalToCategory[goal];
        if (peptide.category === targetCategory) score += 10;
      }

      // FDA approval filter (weight: 15)
      if (approval === 'required') {
        if (peptide.researchStatus === 'FDA Approved') score += 15;
        else score -= 20; // Strong penalty
      } else if (approval === 'preferred') {
        if (peptide.researchStatus === 'FDA Approved') score += 10;
        else if (peptide.researchStatus.startsWith('Clinical')) score += 5;
      }

      // Administration preference (weight: 10)
      if (administration && administration !== 'any') {
        const admin = peptide.administration.toLowerCase();
        if (administration === 'injection' && admin.includes('subcutaneous')) score += 10;
        else if (administration === 'oral' && admin.includes('oral')) score += 10;
        else if (administration === 'oral' && !admin.includes('oral')) score -= 15;
        else if (administration === 'nasal' && admin.includes('intranasal')) score += 10;
        else if (administration === 'nasal' && !admin.includes('intranasal')) score -= 10;
      }

      // Focus areas (weight: 25 each, up to 2)
      if (focus && focus.length > 0) {
        for (const stat of focus) {
          const val = peptide.stats[stat];
          if (val) score += (val / 100) * 25;
        }
      }

      // Popularity bonus (small tiebreaker)
      if (peptide.popular) score += 3;

      return { peptide, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
