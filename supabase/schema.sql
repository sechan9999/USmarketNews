create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamptz default now()
);

create table if not exists news_items (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  source text not null,
  title text not null,
  summary text,
  url text not null,
  image_url text,
  published_at timestamptz not null,
  category text,
  impact_level text check (impact_level in ('watch', 'important', 'critical')) default 'watch',
  market_score numeric default 0,
  tickers text[] default '{}',
  tags text[] default '{}',
  sentiment numeric,
  region text default 'US',
  created_at timestamptz default now()
);

create index if not exists idx_news_items_published_at on news_items(published_at desc);
create index if not exists idx_news_items_impact_level on news_items(impact_level);
create index if not exists idx_news_items_tickers on news_items using gin(tickers);
create index if not exists idx_news_items_tags on news_items using gin(tags);

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  news_id uuid not null references news_items(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, news_id)
);

create table if not exists watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticker text not null,
  created_at timestamptz default now(),
  unique(user_id, ticker)
);

alter table profiles enable row level security;
alter table bookmarks enable row level security;
alter table watchlists enable row level security;

create policy "Users can view own profile"
on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
on profiles for insert with check (auth.uid() = id);

create policy "Users can view own bookmarks"
on bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
on bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
on bookmarks for delete using (auth.uid() = user_id);

create policy "Users can view own watchlist"
on watchlists for select using (auth.uid() = user_id);

create policy "Users can insert own watchlist"
on watchlists for insert with check (auth.uid() = user_id);

create policy "Users can delete own watchlist"
on watchlists for delete using (auth.uid() = user_id);

-- Public read on market news feed
alter table news_items enable row level security;
create policy "Public can read news"
on news_items for select using (true);
