import { NewsFeed } from '@/components/news/news-feed';
import { MarketSnapshot } from '@/components/news/market-snapshot';

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 lg:grid-cols-[1fr_340px]">
        <section>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">News</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Market-moving headlines ranked by impact.
            </p>
          </div>
          <NewsFeed />
        </section>
        <aside>
          <MarketSnapshot />
        </aside>
      </div>
    </main>
  );
}
