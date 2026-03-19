import type { NewsItem } from '../types';

const tickerMap: Record<string, string[]> = {
  nvidia: ['NVDA'],
  tesla: ['TSLA'],
  apple: ['AAPL'],
  broadcom: ['AVGO'],
  palantir: ['PLTR'],
  oil: ['XLE', 'USO'],
  gold: ['GLD'],
  defense: ['LMT', 'NOC', 'RTX'],
  iran: ['USO', 'GLD', 'LMT'],
  israel: ['USO', 'GLD', 'LMT'],
  fed: ['SPY', 'QQQ', 'TLT'],
  treasury: ['TLT'],
};

export function extractTickers(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const [keyword, tickers] of Object.entries(tickerMap)) {
    if (lower.includes(keyword)) {
      tickers.forEach((t) => found.add(t));
    }
  }

  return [...found];
}

export function inferCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('crypto') || lower.includes('bitcoin')) return 'crypto';
  if (lower.includes('oil') || lower.includes('gas') || lower.includes('energy')) return 'energy';
  if (lower.includes('nvidia') || lower.includes('ai') || lower.includes('chip')) return 'ai';
  return 'live';
}
