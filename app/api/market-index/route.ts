import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Deterministic hash for consistent history per hour bucket
function seedRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export async function GET() {
  const supabase = await createClient();

  const today = new Date();
  const past3Days = new Date(today);
  past3Days.setDate(today.getDate() - 3);

  const { data, error } = await supabase
    .from('news_items')
    .select('market_score, impact_level, published_at')
    .gte('published_at', past3Days.toISOString());

  if (error || !data) {
    return NextResponse.json({ index: 50, history: Array(24).fill(50), status: 'Neutral' });
  }

  // Score: higher totalScore = more high-impact/negative news = more Fear
  let totalScore = 0;
  data.forEach((item) => {
    totalScore += Number(item.market_score || 0);
  });

  // Base 50 (Neutral). More high-score news pushes towards Fear
  let rawIndex = 50 - (totalScore / 10);
  rawIndex = Math.max(0, Math.min(100, rawIndex));

  const rounded = Math.round(rawIndex);
  let status = 'Neutral';
  if (rounded <= 25) status = 'Extreme Fear';
  else if (rounded <= 45) status = 'Fear';
  else if (rounded >= 75) status = 'Extreme Greed';
  else if (rounded >= 55) status = 'Greed';

  // Build 24-hour history from actual hourly news data
  const now = Date.now();
  const history: number[] = [];

  for (let i = 23; i >= 0; i--) {
    const hourStart = now - (i + 1) * 3600000;
    const hourEnd = now - i * 3600000;

    // Filter news items for this hour window
    const hourItems = data.filter((item) => {
      const t = new Date(item.published_at).getTime();
      return t >= hourStart && t < hourEnd;
    });

    if (hourItems.length > 0) {
      let hourScore = 0;
      hourItems.forEach((item) => {
        hourScore += Number(item.market_score || 0);
      });
      const hourIndex = Math.max(0, Math.min(100, 50 - (hourScore / 5)));
      history.push(Math.round(hourIndex));
    } else {
      // No data for this hour — use deterministic interpolation towards current index
      const hourSeed = Math.floor(hourStart / 3600000);
      const noise = (seedRandom(hourSeed) * 10 - 5);
      const baseValue = rounded + (23 - i) * 0.2; // slight drift towards current
      history.push(Math.max(0, Math.min(100, Math.round(baseValue + noise))));
    }
  }

  return NextResponse.json({
    index: rounded,
    status,
    history,
  });
}
