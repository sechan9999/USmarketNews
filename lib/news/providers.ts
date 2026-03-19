type RawNews = {
  id?: string;
  source: string;
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt: string;
};

export async function fetchNewsFromNewsAPI(): Promise<RawNews[]> {
  const url = new URL('https://newsapi.org/v2/top-headlines');
  url.searchParams.set('country', 'us');
  url.searchParams.set('category', 'business');
  url.searchParams.set('pageSize', '25');
  url.searchParams.set('apiKey', process.env.NEWS_API_KEY!);

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error('Failed to fetch NewsAPI');

  const data = await res.json();
  return (data.articles ?? []).map((a: any) => ({
    id: a.url,
    source: a.source?.name ?? 'NewsAPI',
    title: a.title,
    description: a.description,
    url: a.url,
    image: a.urlToImage,
    publishedAt: a.publishedAt,
  }));
}

export async function fetchNewsFromFinnhub(): Promise<RawNews[]> {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 2);

  const format = (d: Date) => d.toISOString().slice(0, 10);
  const url = new URL('https://finnhub.io/api/v1/news');
  url.searchParams.set('category', 'general');
  url.searchParams.set('token', process.env.FINNHUB_API_KEY!);

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error('Failed to fetch Finnhub');

  const data = await res.json();
  return (data ?? []).slice(0, 25).map((a: any) => ({
    id: String(a.id),
    source: a.source ?? 'Finnhub',
    title: a.headline,
    description: a.summary,
    url: a.url,
    image: a.image,
    publishedAt: new Date(a.datetime * 1000).toISOString(),
  }));
}

export async function fetchAllProviders() {
  const results = await Promise.allSettled([
    fetchNewsFromNewsAPI(),
    fetchNewsFromFinnhub(),
  ]);

  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}
