import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createClient } from '@/lib/supabase/server';

// Simple stopword set for better token filtering
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in',
  'with', 'to', 'for', 'of', 'not', 'no', 'can', 'had', 'has', 'was',
  'were', 'been', 'have', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'are', 'this', 'that', 'these',
  'those', 'what', 'why', 'how', 'when', 'where', 'who', 'whom',
  'about', 'from', 'into', 'than', 'then', 'some', 'such', 'just',
  'also', 'been', 'more', 'most', 'very', 'too',
]);

export async function POST(req: Request) {
  const { messages } = await req.json();
  const supabase = await createClient();

  const latestMessage = messages[messages.length - 1]?.content || '';

  // 1. Fetch recent news (up to 80 for better coverage)
  const { data: recentNews } = await supabase
    .from('news_items')
    .select('title, summary, source, category, impact_level, market_score, tickers, published_at')
    .order('published_at', { ascending: false })
    .limit(80);

  // 2. Better tokenization - remove stop words and short tokens
  const userTokens = latestMessage
    .toLowerCase()
    .split(/\W+/)
    .filter((t: string) => t.length > 2 && !STOP_WORDS.has(t));

  // 3. TF-IDF-lite scoring: weight terms by how rare they are across documents
  const docCount = recentNews?.length ?? 1;
  const termDocFreq: Record<string, number> = {};
  for (const token of userTokens) {
    termDocFreq[token] = (recentNews ?? []).filter((n) => {
      const searchText = `${n.title} ${n.summary ?? ''} ${n.category} ${(n.tickers ?? []).join(' ')}`.toLowerCase();
      return searchText.includes(token);
    }).length;
  }

  const scoredNews = (recentNews ?? []).map((news) => {
    let relevance = 0;
    const searchText = `${news.title} ${news.summary ?? ''} ${news.category} ${(news.tickers ?? []).join(' ')}`.toLowerCase();

    // TF-IDF-lite: rarer terms in the corpus get higher weight
    userTokens.forEach((token: string) => {
      if (searchText.includes(token)) {
        const df = termDocFreq[token] || 1;
        const idf = Math.log(docCount / df) + 1;
        // Title matches are worth more than summary matches
        const titleBoost = news.title.toLowerCase().includes(token) ? 2 : 1;
        relevance += 5 * idf * titleBoost;
      }
    });

    // Boost by impact level
    if (news.impact_level === 'critical') relevance += 3;
    if (news.impact_level === 'important') relevance += 1.5;

    // Recency boost: newer items get slight preference
    const hoursAgo = (Date.now() - new Date(news.published_at).getTime()) / 3600000;
    if (hoursAgo < 6) relevance += 2;
    else if (hoursAgo < 24) relevance += 1;

    return { ...news, relevance };
  });

  // Sort by relevance, take top 12
  scoredNews.sort((a, b) => b.relevance - a.relevance);
  const topContext = scoredNews.slice(0, 12);

  const contextData = topContext.map(
    (n) => `[${n.source} | ${n.impact_level} | ${n.published_at}] ${n.title} - ${n.summary ?? 'No summary'}${n.tickers?.length ? ` (Tickers: ${n.tickers.join(', ')})` : ''}`
  ).join('\n') || 'No recent news available.';

  const systemPrompt = `You are an elite Wall Street macro analyst and quant researcher.
The user is asking a question about the current market, economy, or specific tickers.
Use the following realtime news feed context to answer:

<latest_market_news>
${contextData}
</latest_market_news>

Guidelines:
1. Be exceptionally concise, analytical, and objective. Use bullet points in markdown.
2. If the user asks about something not in the news feed, give a general macro perspective but clarify that breaking news on it isn't currently buffered.
3. Provide "Why it matters" and "Potential Impact / Tickers" if applicable.
4. Reference specific news sources when citing information.
5. Don't hallucinate current prices or events unless in the context.`;

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
