import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const supabase = await createClient();

  const latestMessage = messages[messages.length - 1]?.content || '';

  // 1. Fetch a broader set of recent news (up to 60)
  const { data: recentNews } = await supabase
    .from('news_items')
    .select('title, summary, source, category, impact_level, published_at')
    .order('published_at', { ascending: false })
    .limit(60);

  // 2. Retrieval Engine: Mini keyword matcher (BM25-lite)
  const userTokens = latestMessage.toLowerCase().split(/\W+/).filter((t: string) => t.length > 2);
  
  let scoredNews = (recentNews ?? []).map((news) => {
    let relevance = 0;
    const textToSearch = `${news.title} ${news.summary ?? ''} ${news.category}`.toLowerCase();
    
    // Default recency bias
    relevance += 1; 
    
    // Keyword match
    userTokens.forEach((token: string) => {
      if (textToSearch.includes(token)) {
        relevance += 5;
      }
    });

    // High impact gets a slight boost in retrieval
    if (news.impact_level === 'critical') relevance += 2;
    if (news.impact_level === 'important') relevance += 1;

    return { ...news, relevance };
  });

  // Sort by relevance, then slice top 10 most relevant chunks
  scoredNews.sort((a, b) => b.relevance - a.relevance);
  const topContext = scoredNews.slice(0, 10);

  const contextData = topContext.map(
    (n) => `[${n.source} | ${n.impact_level}] ${n.title} - ${n.summary ?? 'No summary'}`
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
4. Don't hallucinate current prices or events unless in the context.`;

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
