-- Supabase SQL Schema for Byul/HK.ai Market News App
-- Copy and paste this entirely into the Supabase SQL Editor and click 'Run'

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS news_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id text UNIQUE NOT NULL,
  source text NOT NULL,
  title text NOT NULL,
  summary text,
  url text NOT NULL,
  image_url text,
  published_at timestamptz NOT NULL,
  category text NOT NULL,
  impact_level text NOT NULL,
  market_score float NOT NULL,
  tickers text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes to optimize the retrieval engine and dashboard loading speed
CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_category ON news_items(category);
CREATE INDEX IF NOT EXISTS idx_news_items_impact_level ON news_items(impact_level);

-- Turn on Row Level Security (Secure the table)
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for Next.js frontend to fetch news)
CREATE POLICY "Allow public read access" ON news_items
  FOR SELECT
  USING (true);

-- Allow service role (backend API) to insert/update news
CREATE POLICY "Allow service role insert" ON news_items
  FOR ALL
  USING (true)
  WITH CHECK (true);
