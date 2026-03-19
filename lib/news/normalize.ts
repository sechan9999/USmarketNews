const tickerMap: Record<string, string[]> = {
  // Mega-cap tech
  nvidia: ['NVDA'],
  tesla: ['TSLA'],
  apple: ['AAPL'],
  microsoft: ['MSFT'],
  google: ['GOOGL'],
  alphabet: ['GOOGL'],
  amazon: ['AMZN'],
  meta: ['META'],
  netflix: ['NFLX'],
  // Semiconductors
  broadcom: ['AVGO'],
  amd: ['AMD'],
  intel: ['INTC'],
  qualcomm: ['QCOM'],
  tsmc: ['TSM'],
  asml: ['ASML'],
  micron: ['MU'],
  // AI & software
  palantir: ['PLTR'],
  openai: ['MSFT'],
  snowflake: ['SNOW'],
  salesforce: ['CRM'],
  oracle: ['ORCL'],
  adobe: ['ADBE'],
  // Finance
  jpmorgan: ['JPM'],
  'goldman sachs': ['GS'],
  'morgan stanley': ['MS'],
  'bank of america': ['BAC'],
  visa: ['V'],
  mastercard: ['MA'],
  // Healthcare
  'eli lilly': ['LLY'],
  'novo nordisk': ['NVO'],
  unitedhealth: ['UNH'],
  pfizer: ['PFE'],
  // Energy & commodities
  oil: ['XLE', 'USO'],
  crude: ['USO', 'XLE'],
  opec: ['USO', 'XLE'],
  'natural gas': ['UNG'],
  gold: ['GLD', 'GDX'],
  silver: ['SLV'],
  copper: ['COPX'],
  exxon: ['XOM'],
  chevron: ['CVX'],
  // Defense
  defense: ['LMT', 'NOC', 'RTX'],
  lockheed: ['LMT'],
  raytheon: ['RTX'],
  boeing: ['BA'],
  // Geopolitical
  iran: ['USO', 'GLD', 'LMT'],
  israel: ['USO', 'GLD', 'LMT'],
  russia: ['USO', 'GLD'],
  ukraine: ['USO', 'GLD'],
  china: ['FXI', 'KWEB'],
  taiwan: ['TSM'],
  // Macro
  fed: ['SPY', 'QQQ', 'TLT'],
  'federal reserve': ['SPY', 'QQQ', 'TLT'],
  powell: ['SPY', 'TLT'],
  treasury: ['TLT'],
  inflation: ['TIP', 'TLT'],
  // Crypto
  bitcoin: ['BTC', 'MSTR'],
  ethereum: ['ETH'],
  crypto: ['BTC', 'COIN'],
  coinbase: ['COIN'],
  // Indices
  'sp 500': ['SPY'],
  's&p': ['SPY'],
  nasdaq: ['QQQ'],
  dow: ['DIA'],
  russell: ['IWM'],
  // EV & Auto
  rivian: ['RIVN'],
  ford: ['F'],
  'general motors': ['GM'],
  // Retail
  walmart: ['WMT'],
  costco: ['COST'],
  'home depot': ['HD'],
};

// Also detect raw ticker symbols like $AAPL or AAPL in uppercase
const KNOWN_TICKERS = new Set([
  'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'META', 'NVDA', 'TSLA', 'AVGO',
  'AMD', 'INTC', 'QCOM', 'TSM', 'MU', 'PLTR', 'CRM', 'ORCL', 'ADBE',
  'JPM', 'GS', 'MS', 'BAC', 'V', 'MA', 'LLY', 'NVO', 'UNH', 'PFE',
  'XOM', 'CVX', 'LMT', 'NOC', 'RTX', 'BA', 'SPY', 'QQQ', 'DIA', 'TLT',
  'GLD', 'USO', 'BTC', 'ETH', 'COIN', 'MSTR', 'NFLX', 'SNOW',
  'WMT', 'COST', 'HD', 'F', 'GM', 'RIVN', 'IWM', 'FXI',
]);

export function extractTickers(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  // Keyword-based matching
  for (const [keyword, tickers] of Object.entries(tickerMap)) {
    if (lower.includes(keyword)) {
      tickers.forEach((t) => found.add(t));
    }
  }

  // Direct ticker symbol detection (e.g. "$AAPL" or standalone "AAPL")
  const tickerRegex = /\$?([A-Z]{2,5})\b/g;
  let match;
  while ((match = tickerRegex.exec(text)) !== null) {
    if (KNOWN_TICKERS.has(match[1])) {
      found.add(match[1]);
    }
  }

  return [...found];
}

export function inferCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('ethereum') || lower.includes('blockchain')) return 'crypto';
  if (lower.includes('oil') || lower.includes('gas') || lower.includes('energy') || lower.includes('opec') || lower.includes('crude')) return 'energy';
  if (lower.includes('nvidia') || lower.includes('ai') || lower.includes('chip') || lower.includes('semiconductor') || lower.includes('artificial intelligence')) return 'ai';
  return 'live';
}
