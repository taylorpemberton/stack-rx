// Vercel Serverless Function — quiz email capture + server-side scoring
// Scoring runs here so results never reach the client until after signup

// Inline the peptide data and scoring logic so the client can't access results
// without submitting. In production, wire up Vercel KV / Resend / Supabase below.

import { peptides, statLabels } from '../src/data/peptides.ts';

const goalToCategory = {
  fatLoss: 'Fat Loss & Metabolism',
  muscle: 'Growth Hormone',
  healing: 'Recovery & Healing',
  cognition: 'Cognitive & Mood',
  antiAging: 'Anti-Aging & Skin',
  sleep: 'Sleep',
  immune: 'Immune Support',
};

function scorePeptides(answers) {
  const { goal, approval, administration, focus } = answers;

  return peptides
    .map((peptide) => {
      let score = 0;

      if (goal) {
        const goalStat = peptide.stats[goal];
        if (goalStat) score += (goalStat / 100) * 40;
        if (peptide.category === goalToCategory[goal]) score += 10;
      }

      if (approval === 'required') {
        if (peptide.researchStatus === 'FDA Approved') score += 15;
        else score -= 20;
      } else if (approval === 'preferred') {
        if (peptide.researchStatus === 'FDA Approved') score += 10;
        else if (peptide.researchStatus.startsWith('Clinical')) score += 5;
      }

      if (administration && administration !== 'any') {
        const admin = peptide.administration.toLowerCase();
        if (administration === 'injection' && admin.includes('subcutaneous')) score += 10;
        else if (administration === 'oral' && admin.includes('oral')) score += 10;
        else if (administration === 'oral' && !admin.includes('oral')) score -= 15;
        else if (administration === 'nasal' && admin.includes('intranasal')) score += 10;
        else if (administration === 'nasal' && !admin.includes('intranasal')) score -= 10;
      }

      if (focus && focus.length > 0) {
        for (const stat of focus) {
          const val = peptide.stats[stat];
          if (val) score += (val / 100) * 25;
        }
      }

      if (peptide.popular) score += 3;

      return { peptide, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, answers } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name required' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    // Score peptides server-side
    const results = scorePeptides(answers || {});

    const recommendations = results.map((r) => r.peptide.id);

    // TODO: Wire up storage — pick one:
    // Vercel KV (cheapest, free tier):
    //   import { kv } from '@vercel/kv';
    //   await kv.set(`quiz:${Date.now()}`, { name, email, answers, recommendations, ts: Date.now() });
    //
    // Supabase (free tier Postgres):
    //   import { createClient } from '@supabase/supabase-js';
    //   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    //   await supabase.from('quiz_leads').insert({ name, email, answers, recommendations });
    //
    // Resend (email delivery):
    //   import { Resend } from 'resend';
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   await resend.emails.send({ from: '...', to: email, subject: '...', html: '...' });

    console.log('Quiz submission:', { name, email, answers, recommendations, ts: new Date().toISOString() });

    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
