export type ImpactLevel = 'watch' | 'important' | 'critical';

export type NewsItem = {
  id: string;
  external_id: string | null;
  source: string;
  title: string;
  summary: string | null;
  url: string;
  image_url: string | null;
  published_at: string;
  category: string | null;
  impact_level: ImpactLevel;
  market_score: number;
  tickers: string[];
  tags: string[];
  sentiment: number | null;
  region: string | null;
};
