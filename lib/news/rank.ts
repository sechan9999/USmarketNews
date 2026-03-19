import type { ImpactLevel } from '../types';

export function scoreMarketImpact(input: { title: string; summary?: string | null; source?: string }) {
  const text = `${input.title} ${input.summary ?? ''}`.toLowerCase();
  
  let score = 0;

  // 1. Source Reliability Weighting
  const premiumSources = ['reuters', 'bloomberg', 'wall street journal', 'wsj', 'financial times', 'hk.ai'];
  const reliableSources = ['cnbc', 'marketwatch', 'barrons', 'yahoo finance'];
  
  if (input.source) {
    const s = input.source.toLowerCase();
    if (premiumSources.some((src) => s.includes(src))) score += 15;
    else if (reliableSources.some((src) => s.includes(src))) score += 5;
  }

  // 2. Keyword Dictionaries
  const macroKeywords = ['fed', 'federal reserve', 'inflation', 'cpi', 'pce', 'rate cut', 'rate hike', 'powell', 'jobs report', 'nfp', 'treasury yields', 'recession', 'gdp'];
  const geopoliticalKeywords = ['war', 'military', 'strike', 'escalation', 'sanctions', 'tariff', 'trade war', 'iran', 'israel', 'russia', 'china', 'opec'];
  const techEarningsKeywords = ['nvidia', 'apple', 'microsoft', 'earnings', 'guidance', 'revenue beat', 'revenue miss', 'openai', 'semiconductor', 'ai chip'];
  const noiseKeywords = ['zodiac', 'celebrity', 'gossip', 'horoscope', 'opinion', 'op-ed', 'how to buy'];

  // 3. Scoring application
  macroKeywords.forEach((k) => {
    if (text.includes(k)) score += 20;
  });

  geopoliticalKeywords.forEach((k) => {
    if (text.includes(k)) score += 25;
  });

  techEarningsKeywords.forEach((k) => {
    if (text.match(new RegExp(`\\b${k}\\b`))) score += 15;
  });

  // 4. Noise Reduction (Penalty)
  noiseKeywords.forEach((k) => {
    if (text.includes(k)) score -= 30;
  });

  // 5. Title Capitalization heuristics (BREAKING, URGENT)
  if (input.title.includes('BREAKING') || input.title.includes('URGENT')) {
    score += 20;
  }

  // Cap score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  let impactLevel: ImpactLevel = 'watch';
  if (score >= 60) impactLevel = 'critical';
  else if (score >= 35) impactLevel = 'important';

  return { score, impactLevel };
}
