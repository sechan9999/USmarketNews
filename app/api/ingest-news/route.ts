import { NextResponse } from 'next/server';
import { fetchNewsFromNewsAPI, fetchNewsFromFinnhub } from '@/lib/news/providers';
import { dedupeByUrlAndTitle } from '@/lib/news/dedupe';
import { extractTickers, inferCategory } from '@/lib/news/normalize';
import { scoreMarketImpact } from '@/lib/news/rank';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const newsAPIArticles = await fetchNewsFromNewsAPI();
  const finnhubArticles = await fetchNewsFromFinnhub();
  
  const raw = [...newsAPIArticles, ...finnhubArticles];
  const unique = dedupeByUrlAndTitle(raw);

  const rows = unique.map((item) => {
    const tickers = extractTickers(`${item.title} ${item.description ?? ''}`);
    const { score, impactLevel } = scoreMarketImpact({
      title: item.title,
      summary: item.description,
      source: item.source,
    });

    return {
      external_id: item.id ?? item.url,
      source: item.source,
      title: item.title,
      summary: item.description ?? null,
      url: item.url,
      image_url: item.image ?? null,
      published_at: item.publishedAt,
      category: inferCategory(`${item.title} ${item.description ?? ''}`),
      impact_level: impactLevel,
      market_score: score,
      tickers,
      tags: tickers,
    };
  });

  const { error } = await supabase.from('news_items').upsert(rows, {
    onConflict: 'external_id',
    ignoreDuplicates: false,
  });


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    ok: true, 
    newsAPI: newsAPIArticles.length,
    finnhub: finnhubArticles.length,
    totalUnique: unique.length,
    inserted: rows.length 
  });
}

