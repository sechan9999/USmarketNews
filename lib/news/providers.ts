import Parser from 'rss-parser';

type RawNews = {
  id?: string;
  source: string;
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt: string;
};

const rssParser = new Parser();

export async function fetchNewsFromRSS(): Promise<RawNews[]> {
  try {
    const feed = await rssParser.parseURL('https://finance.yahoo.com/rss/topstories');
    return feed.items.map((item: any) => ({
      id: item.guid ?? item.link,
      source: 'Yahoo Finance',
      title: item.title ?? 'No title',
      description: item.contentSnippet ?? item.content ?? '',
      url: item.link ?? '',
      publishedAt: item.isoDate ?? new Date().toISOString(),
    }));
  } catch (e) {
    console.error('RSS fetch error', e);
    return [];
  }
}

export async function fetchNewsFromNewsAPI(): Promise<RawNews[]> {
  try {
    const urls = ['business', 'technology'].map(category => {
      const url = new URL('https://newsapi.org/v2/top-headlines');
      url.searchParams.set('country', 'us');
      url.searchParams.set('category', category);
      url.searchParams.set('pageSize', '30');
      url.searchParams.set('apiKey', process.env.NEWS_API_KEY!);
      url.searchParams.set('_v', Date.now().toString()); // Cache buster
      return url.toString();
    });

    const requests = urls.map(u => fetch(u, { cache: 'no-store' }));
    const responses = await Promise.allSettled(requests);
    
    let articles: any[] = [];
    for (const r of responses) {
      if (r.status === 'fulfilled') {
        if (r.value.ok) {
          const data = await r.value.json();
          articles = articles.concat(data.articles || []);
        } else {
          const errText = await r.value.text().catch(() => 'no body');
          console.error(`NewsAPI error status ${r.value.status}: ${errText}`);
        }
      } else {
        console.error('NewsAPI fetch rejected');
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
      url.searchParams.set('_v', Date.now().toString()); // Cache buster
      return url.toString();
    });

    const requests = urls.map(u => fetch(u, { cache: 'no-store' }));
    const responses = await Promise.allSettled(requests);
    
    let dataList: any[] = [];
    for (const r of responses) {
      if (r.status === 'fulfilled') {
        if (r.value.ok) {
          const data = await r.value.json();
          dataList = dataList.concat(data.slice(0, 30));
        } else {
          const errText = await r.value.text().catch(() => 'no body');
          console.error(`Finnhub error status ${r.value.status}: ${errText}`);
        }
      } else {
        console.error('Finnhub fetch rejected');
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
    console.error('Finnhub general error', e);
    return [];
  }
}

export async function fetchAllProviders() {
  const results = await Promise.allSettled([
    fetchNewsFromNewsAPI(),
    fetchNewsFromFinnhub(),
    fetchNewsFromRSS(),
  ]);

  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}
