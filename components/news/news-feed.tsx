'use client';

import { useCallback, useEffect, useState } from 'react';
import { NewsCard } from './news-card';
import type { NewsItem } from '@/lib/types';

export function NewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState('all');
  const [impact, setImpact] = useState('all');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (impact !== 'all') params.set('impact', impact);
    if (debouncedQuery) params.set('q', debouncedQuery);

    try {
      const res = await fetch(`/api/news?${params.toString()}`);
      const json = await res.json();
      setItems(json.data ?? []);
    } catch {
      // Silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, [category, impact, debouncedQuery]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['all', 'live', 'crypto', 'ai', 'energy'].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-sm ${
              category === c ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'watch', 'important', 'critical'].map((l) => (
          <button
            key={l}
            onClick={() => setImpact(l)}
            className={`rounded-full px-4 py-2 text-sm ${
              impact === l ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-300'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search headlines or tickers"
        className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
      />

      {loading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : (
        items.map((item) => <NewsCard key={item.id} item={item} />)
      )}
    </div>
  );
}
