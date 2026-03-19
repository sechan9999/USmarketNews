import type { ImpactLevel } from '../types';

export function scoreMarketImpact(input: { title: string; summary?: string | null; source?: string }) {
  const text = `${input.title} ${input.summary ?? ''}`.toLowerCase();

  let score = 0;

  // 1. Source Reliability Weighting
  const premiumSources = ['reuters', 'bloomberg', 'wall street journal', 'wsj', 'financial times'];
  const reliableSources = ['cnbc', 'marketwatch', 'barrons', 'yahoo finance', 'associated press', 'ap news'];

  if (input.source) {
    const s = input.source.toLowerCase();
    if (premiumSources.some((src) => s.includes(src))) score += 15;
    else if (reliableSources.some((src) => s.includes(src))) score += 8;
  }

  // 2. Critical Macro (highest market impact)
  const criticalMacro = ['rate cut', 'rate hike', 'emergency meeting', 'bank failure', 'debt ceiling', 'default'];
  const macroKeywords = ['fed', 'federal reserve', 'inflation', 'cpi', 'pce', 'powell', 'jobs report', 'nfp', 'treasury yields', 'recession', 'gdp', 'fomc', 'unemployment', 'retail sales'];

  criticalMacro.forEach((k) => {
    if (text.includes(k)) score += 30;
  });
  macroKeywords.forEach((k) => {
    if (text.includes(k)) score += 18;
  });

  // 3. Geopolitical
  const geopoliticalKeywords = ['war', 'military', 'strike', 'escalation', 'sanctions', 'tariff', 'trade war', 'iran', 'israel', 'russia', 'china', 'opec', 'invasion', 'missile', 'nuclear', 'blockade'];
  geopoliticalKeywords.forEach((k) => {
    if (text.includes(k)) score += 22;
  });

  // 4. Mega-cap & Earnings
  const megaCap = ['nvidia', 'apple', 'microsoft', 'amazon', 'google', 'meta', 'tesla'];
  const earnings = ['earnings', 'guidance', 'revenue beat', 'revenue miss', 'profit warning', 'quarterly results'];
  const sector = ['semiconductor', 'ai chip', 'artificial intelligence', 'data center'];

  megaCap.forEach((k) => { if (text.includes(k)) score += 10; });
  earnings.forEach((k) => { if (text.includes(k)) score += 15; });
  sector.forEach((k) => { if (text.includes(k)) score += 12; });

  // 5. Sentiment amplifiers
  const bearish = ['crash', 'plunge', 'tumble', 'selloff', 'sell-off', 'collapse', 'crisis', 'panic', 'meltdown'];
  const bullish = ['surge', 'soar', 'rally', 'breakout', 'all-time high', 'record high'];

  bearish.forEach((k) => { if (text.includes(k)) score += 15; });
  bullish.forEach((k) => { if (text.includes(k)) score += 10; });

  // 6. Title urgency
  if (input.title.includes('BREAKING') || input.title.includes('URGENT') || input.title.includes('ALERT')) score += 20;
  if (input.title.includes('JUST IN') || input.title.includes('FLASH')) score += 15;

  // 7. Noise Reduction
  const noise = ['zodiac', 'celebrity', 'gossip', 'horoscope', 'opinion', 'op-ed', 'how to buy', 'sponsored'];
  noise.forEach((k) => { if (text.includes(k)) score -= 30; });

  score = Math.max(0, Math.min(100, score));

  let impactLevel: ImpactLevel = 'watch';
  if (score >= 55) impactLevel = 'critical';
  else if (score >= 30) impactLevel = 'important';

  return { score, impactLevel };
}
