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
  try {
    const urls = ['business', 'technology'].map(category => {
      const url = new URL('https://newsapi.org/v2/top-headlines');
      url.searchParams.set('country', 'us');
      url.searchParams.set('category', category);
      url.searchParams.set('pageSize', '30');
      url.searchParams.set('apiKey', process.env.NEWS_API_KEY!);
      return url.toString();
    });

    const requests = urls.map(u => fetch(u, { next: { revalidate: 300 } }));
    const responses = await Promise.allSettled(requests);
    
    let articles: any[] = [];
    for (const r of responses) {
      if (r.status === 'fulfilled') {
        if (r.value.ok) {
          const data = await r.value.json();
          articles = articles.concat(data.articles || []);
        } else {
          const errText = await r.value.text();
          console.error(`NewsAPI error status ${r.value.status}: ${errText}`);
        }
      } else {
        console.error('NewsAPI fetch rejected:', r.reason);
      }
    }

    return articles.map((a: any) => ({
      id: a.url,
      source: a.source?.name ?? 'NewsAPI',
      title: a.title,
      description: a.description,
      url: a.url,
      image: a.urlToImage,
      publishedAt: a.publishedAt,
    }));
  } catch (e) {
    console.error('NewsAPI general error', e);
    return [];
  }
}

export async function fetchNewsFromFinnhub(): Promise<RawNews[]> {
  try {
    const categories = ['general', 'crypto', 'forex'];
    const urls = categories.map(cat => {
      const url = new URL('https://finnhub.io/api/v1/news');
      url.searchParams.set('category', cat);
      url.searchParams.set('token', process.env.FINNHUB_API_KEY!);
      return url.toString();
    });

    const requests = urls.map(u => fetch(u, { next: { revalidate: 300 } }));
    const responses = await Promise.allSettled(requests);
    
    let dataList: any[] = [];
    for (const r of responses) {
      if (r.status === 'fulfilled') {
        if (r.value.ok) {
          const data = await r.value.json();
          dataList = dataList.concat(data.slice(0, 30));
        } else {
          const errText = await r.value.text();
          console.error(`Finnhub error status ${r.value.status}: ${errText}`);
        }
      } else {
        console.error('Finnhub fetch rejected:', r.reason);
      }
    }

    return dataList.map((a: any) => ({
      id: String(a.id),
      source: a.source ?? 'Finnhub',
      title: a.headline,
      description: a.summary,
      url: a.url,
      image: a.image,
      publishedAt: new Date(a.datetime * 1000).toISOString(),
    }));
  } catch (e) {
    console.error('Finnhub fetch error', e);
    return [];
  }
}

export async function fetchAllProviders() {
  const results = await Promise.allSettled([
    fetchNewsFromNewsAPI(),
    fetchNewsFromFinnhub(),
  ]);

  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}
