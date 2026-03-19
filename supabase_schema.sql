-- HK.ai Market News — Supabase Schema
-- Safe to re-run. No data is dropped. Only creates what doesn't exist.

-- news_items table
CREATE TABLE IF NOT EXISTS news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE NOT NULL,
  source TEXT,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  category TEXT,
  tickers TEXT[],
  impact_level TEXT DEFAULT 'watch',
  market_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for retrieval engine performance
CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_category ON news_items(category);
CREATE INDEX IF NOT EXISTS idx_news_items_impact_level ON news_items(impact_level);

-- Row Level Security
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't already exist (no DROP, no warnings)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'news_items' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON news_items FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'news_items' AND policyname = 'Allow service role insert'
  ) THEN
    CREATE POLICY "Allow service role insert" ON news_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;
