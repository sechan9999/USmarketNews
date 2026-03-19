import type { ImpactLevel } from '../types';

export function scoreMarketImpact(input: { title: string; summary?: string | null }) {
  const text = `${input.title} ${input.summary ?? ''}`.toLowerCase();

  let score = 0;

  const criticalKeywords = [
    'iran',
    'israel',
    'military strike',
    'oil',
    'fed',
    'inflation',
    'jobs report',
    'treasury yields',
    'export',
    'tariff',
  ];

  const importantKeywords = [
    'apple',
    'nvidia',
    'broadcom',
    'tesla',
    'earnings',
    'guidance',
    'semiconductor',
    'crypto',
    'cftc',
  ];

  criticalKeywords.forEach((k) => {
    if (text.includes(k)) score += 25;
  });

  importantKeywords.forEach((k) => {
    if (text.includes(k)) score += 10;
  });

  let impactLevel: ImpactLevel = 'watch';
  if (score >= 50) impactLevel = 'critical';
  else if (score >= 20) impactLevel = 'important';

  return { score, impactLevel };
}
