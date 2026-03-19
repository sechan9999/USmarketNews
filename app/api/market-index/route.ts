import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // 계산 로직: 
  // 1. 'critical' 또는 'important' 뉴스의 market_score 합산 및 비율.
  // 2. VIX 등 외부 인덱스는 Finnhub에서 바로 못 가져올 수 있으므로,
  //    DB의 최근 3일치 뉴스의 부정/긍정(score) 비율로 Fear & Greed 흉내를 냅니다.
  const today = new Date();
  const past3Days = new Date(today);
  past3Days.setDate(today.getDate() - 3);

  const { data, error } = await supabase
    .from('news_items')
    .select('market_score, impact_level')
    .gte('published_at', past3Days.toISOString());

  if (error || !data) {
    return NextResponse.json({ index: 50, history: Array(20).fill(50), status: 'Neutral' });
  }

  // 간단한 스코어링 (점수가 높을수록 요동/Risk-off/Fear 증가라고 귀결)
  let totalScore = 0;
  data.forEach((item) => {
    totalScore += Number(item.market_score || 0);
  });

  // Base 50 (Neutral). totalScore가 100 이상이면 Fear (점수 17처럼 낮아짐)
  let rawIndex = 50 - (totalScore / 10); 
  rawIndex = Math.max(0, Math.min(100, rawIndex)); // Limit 0 ~ 100

  // Fear & Greed는 낮을수록 Extreme Fear, 높을수록 Greed
  const rounded = Math.round(rawIndex);
  let status = 'Neutral';
  if (rounded <= 25) status = 'Extreme Fear';
  else if (rounded <= 45) status = 'Fear';
  else if (rounded >= 75) status = 'Extreme Greed';
  else if (rounded >= 55) status = 'Greed';

  const history = Array.from({ length: 24 }).map((_, i) => {
    // 가짜 히스토리(트렌드에 맞춘 노이즈)
    return Math.max(0, Math.min(100, rounded + Math.floor(Math.random() * 20 - 10)));
  });

  return NextResponse.json({
    index: rounded,
    status,
    history,
  });
}
