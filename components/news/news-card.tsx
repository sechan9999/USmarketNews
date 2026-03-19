import type { NewsItem } from '@/lib/types';

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm text-zinc-400">
        <span>{item.source}</span>
        <span>{new Date(item.published_at).toLocaleString()}</span>
      </div>

      <h2 className="text-2xl font-semibold leading-tight">{item.title}</h2>
      {item.summary && <p className="mt-3 text-sm leading-6 text-zinc-300">{item.summary}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{item.impact_level}</span>
        {item.tickers.map((ticker) => (
          <span key={ticker} className="rounded-full bg-white/10 px-3 py-1 text-xs">
            {ticker}
          </span>
        ))}
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-block text-sm text-white underline underline-offset-4"
      >
        Read source
      </a>
    </article>
  );
}
