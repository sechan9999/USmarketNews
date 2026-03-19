'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Bookmark,
  Settings,
  Newspaper,
  Brain,
  CalendarDays,
  Activity,
  Star,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Shield,
  Flame,
  CircleDollarSign,
  Bell,
  MonitorSmartphone,
  Menu,
  X,
  Paperclip,
  ArrowUp,
  MoreHorizontal,
  Smile,
  Sparkles,
  Languages,
  Gauge,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const newsCategories = [
  { id: 'live', label: 'Live News', icon: '🇺🇸' },
  { id: 'crypto', label: 'Crypto News', icon: '₿' },
  { id: 'ai', label: 'NVDA', icon: '🟢' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
];

const calendarDayTabs = ['This Week', 'Yesterday', 'Today', 'Tomorrow', 'Thu'];

const signalFilters = [
  { id: 'critical', label: '★★★' },
  { id: 'important', label: '★★' },
  { id: 'watch', label: '★' },
];

const topNews = [
  {
    id: 1,
    source: 'HK.ai',
    time: 'just now',
    category: 'energy',
    severity: 'important',
    title: 'US Energy Secretary Wright: Trump administration has no plan to restrict oil and gas exports',
    summary:
      'Export policy remains unchanged despite Middle East escalation, keeping global energy supply narratives in focus.',
    impact: ['XLE', 'CVX', 'XOM'],
  },
  {
    id: 2,
    source: 'ABC News',
    time: 'just now',
    category: 'live',
    severity: 'watch',
    title: '19-year-old Mexican immigrant dies in ICE custody; 44th death under Trump administration',
    summary:
      'Primarily political and humanitarian, with indirect implications for election sentiment and policy volatility.',
    impact: ['SPY'],
  },
  {
    id: 3,
    source: 'HK.ai',
    time: 'just now',
    category: 'energy',
    severity: 'important',
    title: 'US lawmakers in talks regarding energy permitting reform legislation',
    summary:
      'Could materially affect domestic energy, utilities, infrastructure, and industrial project timelines.',
    impact: ['XLE', 'PAVE', 'NEE'],
  },
  {
    id: 4,
    source: 'Decrypt',
    time: 'just now',
    category: 'crypto',
    severity: 'watch',
    title: "MLB signs exclusive deal with Polymarket, establishing 'Integrity Framework' with CFTC",
    summary:
      'Signals deepening institutional normalization of prediction markets and crypto-adjacent financial rails.',
    impact: ['BTC', 'COIN'],
  },
  {
    id: 5,
    source: 'HK.ai',
    time: '2m ago',
    category: 'live',
    severity: 'critical',
    title: 'Risk-off trade accelerates as oil spikes and Treasury yields climb on Middle East conflict fears',
    summary:
      'Cross-asset volatility is now driving index weakness, commodity strength, and defensive sector rotation.',
    impact: ['QQQ', 'SPY', 'GLD', 'USO', 'LMT'],
  },
  {
    id: 6,
    source: 'Market Wire',
    time: '5m ago',
    category: 'ai',
    severity: 'important',
    title: 'Broadcom guidance seen as key AI infrastructure check for semiconductor rally',
    summary:
      'A strong guide could stabilize chip sentiment; a miss would pressure momentum names further.',
    impact: ['AVGO', 'NVDA', 'AMD', 'SMH'],
  },
];

const marketSnapshot = [
  {
    ticker: 'NASDAQ',
    move: '-1.53%',
    note: 'Leading the decline due to tech sensitivity',
    direction: 'down',
  },
  {
    ticker: 'S&P 500',
    move: '-0.79%',
    note: 'Testing support near 6,800',
    direction: 'down',
  },
  {
    ticker: 'DOW',
    move: '-0.37%',
    note: 'Relatively resilient near 48,000 support',
    direction: 'down',
  },
  {
    ticker: 'WTI',
    move: '+7.0%',
    note: 'Supply shock fears tied to Strait of Hormuz',
    direction: 'up',
  },
  {
    ticker: 'GOLD',
    move: 'Surging',
    note: 'Safe-haven demand accelerating',
    direction: 'up',
  },
  {
    ticker: 'US 10Y',
    move: '3.962%',
    note: 'Higher yields pressure long-duration growth names',
    direction: 'up',
  },
];

const watchlistImpact = [
  {
    ticker: 'NVDA',
    thesis: 'Most exposed to AI sentiment and Nasdaq de-risking; vulnerable if yields continue rising.',
    rating: 'High sensitivity',
  },
  {
    ticker: 'PLTR',
    thesis: 'Can outperform on defense narrative, but multiple compression risk remains in a risk-off tape.',
    rating: 'Cross-current',
  },
  {
    ticker: 'TSLA',
    thesis: 'Macro-sensitive and hit by higher oil, rates, and any demand deterioration narrative.',
    rating: 'High volatility',
  },
  {
    ticker: 'AAPL',
    thesis: 'Potential product news may cushion downside, but broad market pressure still dominates.',
    rating: 'Relative defense',
  },
];

const upcomingEvents = [
  {
    id: 1,
    time: '11:30 AM',
    country: '🇺🇸',
    stars: 1,
    title: '4-Week Bill Auction',
    result: '3.615%',
    forecast: '-',
    previous: '3.640%',
  },
  {
    id: 2,
    time: '1:00 PM',
    country: '🇺🇸',
    stars: 2,
    title: '10-Year TIPS Auction',
    result: '1.896%',
    forecast: '-',
    previous: '1.940%',
  },
  {
    id: 3,
    time: '4:30 PM',
    country: '🇺🇸',
    stars: 2,
    title: "Fed's Balance Sheet",
    result: '-',
    forecast: '-',
    previous: '6,646B',
    next: true,
    remaining: '1h 47m remaining',
  },
  {
    id: 4,
    time: '4:30 PM',
    country: '🇺🇸',
    stars: 1,
    title: 'Reserve Balances with Federal Reserve Banks',
    result: '-',
    forecast: '-',
    previous: '3.073T',
  },
];

const fearGreedHistory = [22, 18, 27, 41, 55, 49, 52, 61, 45, 39, 47, 44, 31, 23, 19, 28, 36, 49, 46, 51, 42, 37, 24, 17];

const settingGroups = [
  {
    title: '',
    items: [
      { label: 'Credit reset in 28 days', value: '' },
      { label: 'Account Management', value: '', chevron: true },
      { label: 'Upgrade', value: '', chevron: true },
    ],
  },
  {
    title: 'NOTIFICATIONS',
    items: [{ label: 'Push Notifications', value: 'Off', chevron: true }],
  },
  {
    title: 'APPEARANCE',
    items: [
      { label: 'Theme', value: 'System Default', chevron: true },
      { label: 'Language', value: 'System Default', chevron: true },
    ],
  },
  {
    title: 'APP INFORMATION',
    items: [
      { label: 'App Version', value: '1.5.0' },
      { label: 'Terms of Service', value: '', chevron: true },
      { label: 'Privacy Policy', value: '', chevron: true },
      { label: 'Contact Us / Feedback', value: '', chevron: true },
    ],
  },
];

function severityStyle(level: string) {
  if (level === 'critical') return 'bg-red-500/15 text-red-300 border-red-500/30';
  if (level === 'important') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  return 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30';
}

function impactIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes('oil') || t.includes('energy')) return <Flame className="h-4 w-4" />;
  if (t.includes('defense') || t.includes('war') || t.includes('conflict')) return <Shield className="h-4 w-4" />;
  if (t.includes('yield') || t.includes('dollar')) return <CircleDollarSign className="h-4 w-4" />;
  return <Newspaper className="h-4 w-4" />;
}

function circlePath(value: number) {
  const r = 92;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  return { r, c, offset };
}



function MobileHeader({ title, right = 'menu' }: { title: string; right?: 'menu' | 'search-menu' | 'close' }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 xl:hidden">
      {right === 'close' ? (
        <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full border border-white/10 bg-white/5 text-white">
          <Menu className="h-6 w-6" />
        </Button>
      ) : (
        <div className="text-4xl font-bold tracking-tight">{title}</div>
      )}
      {right === 'search-menu' ? (
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full border border-white/10 bg-white/5 text-white">
            <Search className="h-6 w-6" />
          </Button>
          <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full border border-white/10 bg-white/5 text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      ) : right === 'close' ? (
        <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full border border-white/10 bg-white/5 text-white">
          <X className="h-6 w-6" />
        </Button>
      ) : (
        <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full border border-white/10 bg-white/5 text-white">
          <Menu className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

function AskAnythingPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setErrorMsg(null);

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages([...nextMessages, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.map(({ role, content }) => ({ role, content })) }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText.slice(0, 200)}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m));
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e: any) {
      setErrorMsg(e.message);
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: `Error: ${e.message}` } : m));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-md flex-col px-4 pt-6 pb-28 xl:min-h-0 xl:max-w-none xl:px-0 xl:pb-0">
      <div className="mb-10 flex items-center justify-between xl:hidden">
        <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full border border-white/10 bg-white/5 text-white">
          <Menu className="h-6 w-6" />
        </Button>
        <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full border border-white/10 bg-white/5 text-white">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-end xl:mt-10 mb-4 overflow-y-auto space-y-4">
        {errorMsg && (
          <div className="p-4 rounded-3xl bg-red-500/20 border border-red-500/50 text-red-100 text-center mb-4">
            {errorMsg}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="text-center my-auto w-full">
            <h1 className="text-5xl font-bold tracking-tight text-white xl:text-6xl">Ask anything.</h1>
            <p className="mt-4 text-xl text-zinc-400 xl:text-2xl">The best AI to search economic news.</p>

            <div className="mt-16 flex gap-3 overflow-x-auto pb-1 justify-center max-w-full">
              <button
                type="button"
                onClick={() => sendMessage('Recent US market news')}
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-6 py-4 text-xl font-semibold text-white transition hover:bg-white/10">
                Recent US market news
              </button>
              <button
                type="button"
                onClick={() => sendMessage('Why are futures red?')}
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-6 py-4 text-xl font-semibold text-white/85 transition hover:bg-white/10">
                Why are futures red?
              </button>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-3xl max-w-[85%] text-base leading-relaxed ${m.role === 'user' ? 'bg-white/10 text-white' : 'bg-zinc-900 border border-white/10 text-zinc-300'} whitespace-pre-wrap`}>
                {m.content || <span className="opacity-40 italic">Thinking...</span>}
              </div>
            </div>
          ))
        )}
        {isLoading && messages.length > 0 && messages[messages.length - 1]?.content === '' && (
          <div className="flex justify-start">
            <div className="p-4 rounded-3xl bg-zinc-900 border border-white/10 flex items-center gap-2">
              <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
              <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-100"></span>
              <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputValue); }} className="space-y-3 shrink-0">
        <div className="flex items-center gap-3">
          <Button type="button" size="icon" variant="ghost" className="h-16 w-16 shrink-0 rounded-full border border-white/10 bg-white/5 text-white">
            <Paperclip className="h-6 w-6" />
          </Button>
          <div className="flex h-16 flex-1 items-center rounded-full border border-white/10 bg-white/5 px-5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="bg-transparent text-xl text-white outline-none w-full placeholder:text-zinc-500 disabled:opacity-70"
              placeholder="Ask anything..."
            />
            <button
              type="submit"
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shrink-0 disabled:opacity-50"
              disabled={isLoading || !inputValue.trim()}>
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-3">
          <div className="grid grid-cols-6 gap-2 text-zinc-400">
            {[Smile, Sparkles, Settings, Languages, Gauge, MoreHorizontal].map((Icon, idx) => (
              <div key={idx} className="flex h-10 items-center justify-center rounded-xl bg-white/5">
                <Icon className="h-5 w-5" />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

function NewsPage({
  activeCategory,
  setActiveCategory,
  activeSeverity,
  setActiveSeverity,
  query,
  setQuery,
  filteredNews,
}: any) {
  return (
    <>
      <div className="sticky top-0 z-20 border-b border-white/10 bg-black/90 backdrop-blur xl:block">
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">News</h1>
              <p className="mt-1 text-sm text-zinc-400">Curated headlines that can move the US market.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="rounded-full border border-white/10 bg-white/5">
                <Search className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full border border-white/10 bg-white/5">
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full border border-white/10 bg-white/5">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search headlines, tickers, sectors..."
                className="rounded-2xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {newsCategories.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === item.id
                    ? 'bg-white text-black'
                    : 'border border-white/10 bg-white/5 text-zinc-300'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {signalFilters.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSeverity((prev: string | null) => (prev === item.id ? null : item.id))}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeSeverity === item.id
                    ? 'bg-white text-black'
                    : 'border border-white/10 bg-white/5 text-zinc-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1.25fr_.75fr]">
        <section className="space-y-4">
          {filteredNews.map((item: any, idx: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="rounded-3xl border-white/10 bg-zinc-950 text-white transition hover:bg-zinc-900">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="flex items-center gap-2">
                        {impactIcon(item.title)}
                        {item.source}
                      </span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                    <Badge className={`rounded-full border ${severityStyle(item.severity)}`}>
                      {item.severity === 'critical'
                        ? 'High impact'
                        : item.severity === 'important'
                        ? 'Medium impact'
                        : 'Watch'}
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-semibold leading-tight tracking-tight">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">{item.summary}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {item.impact.map((ticker: string) => (
                      <Badge key={ticker} variant="secondary" className="rounded-full bg-white/10 text-zinc-200">
                        {ticker}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Why it matters: sector transmission and index-level spillover.</span>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-white transition hover:text-blue-400">
                        Open <ChevronRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <button className="flex items-center gap-1 leading-tight text-white/50 cursor-not-allowed">
                        Open <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="space-y-4">
          <Card className="rounded-3xl border-white/10 bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Today’s Market Pulse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <p>
                US markets are in risk-off mode after military escalation involving the US, Israel, and Iran.
                Oil, gold, and the dollar are strengthening while growth equities face pressure from volatility and higher yields.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/10 bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Market Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketSnapshot.map((item) => (
                <div key={item.ticker} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{item.ticker}</div>
                    <div className={`flex items-center gap-1 ${item.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.direction === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span>{item.move}</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{item.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/10 bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Watchlist Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {watchlistImpact.map((item) => (
                <div key={item.ticker} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="font-medium">{item.ticker}</div>
                    <Badge variant="outline" className="rounded-full border-white/15 text-zinc-300">
                      {item.rating}
                    </Badge>
                  </div>
                  <p className="text-xs leading-5 text-zinc-400">{item.thesis}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}

function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('Today');
  const [activeStars, setActiveStars] = useState<number | null>(null);
  const [now, setNow] = useState(new Date());

  const dayTabs = ['Yesterday', 'Today', 'Tomorrow', 'This Week'];

  // Update clock every second for countdown
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const today = new Date();
    let from: string, to: string;
    if (activeDay === 'Yesterday') {
      const d = new Date(today); d.setDate(today.getDate() - 1);
      from = to = d.toISOString().slice(0, 10);
    } else if (activeDay === 'Tomorrow') {
      const d = new Date(today); d.setDate(today.getDate() + 1);
      from = to = d.toISOString().slice(0, 10);
    } else if (activeDay === 'This Week') {
      from = today.toISOString().slice(0, 10);
      const d = new Date(today); d.setDate(today.getDate() + 6);
      to = d.toISOString().slice(0, 10);
    } else {
      from = to = today.toISOString().slice(0, 10);
    }

    fetch(`/api/calendar?from=${from}&to=${to}`)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.economicCalendar ?? [];
        setEvents(raw);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeDay]);

  // Map Finnhub importance (0/1/2) → stars (1/2/3)
  const starsFor = (e: any) => Math.min(3, Math.max(1, Number(e.importance ?? e.impact ?? 1)));

  const filtered = activeStars ? events.filter(e => starsFor(e) === activeStars) : events;

  // Find next upcoming event for badge
  const nextEvent = filtered.find(e => new Date(e.time) > now);
  const getCountdown = (target: Date) => {
    const diff = Math.max(0, target.getTime() - now.getTime());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return h > 0 ? `${h}h ${m}m remaining` : `${m}m ${s}s remaining`;
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 pt-4 pb-28 xl:max-w-none xl:px-6 xl:pb-8">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Economic Calendar</h1>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full border border-white/10 bg-white/5"><Search className="h-5 w-5" /></Button>
          <Button size="icon" variant="ghost" className="rounded-full border border-white/10 bg-white/5"><Menu className="h-5 w-5" /></Button>
        </div>
      </div>

      {/* Day tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {dayTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveDay(tab)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeDay === tab ? 'bg-white text-black' : 'border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Star filters */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {[3, 2, 1].map((count) => (
          <button
            key={count}
            onClick={() => setActiveStars(prev => prev === count ? null : count)}
            className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm transition ${
              activeStars === count ? 'bg-white text-black' : 'border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            {Array.from({ length: count }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="space-y-0">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-zinc-500 animate-pulse">Loading calendar...</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-zinc-500">No events found.</div>
        ) : (
          filtered.slice(0, 40).map((event, idx) => {
            const eventTime = new Date(event.time ?? event.date);
            const stars = starsFor(event);
            const isPast = eventTime < now;
            const isNext = nextEvent && event === nextEvent;

            return (
              <div key={idx} className={`py-5 ${idx > 0 ? 'border-t border-white/10' : ''}`}>
                {isNext && (
                  <div className="mb-3 flex items-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white w-full justify-between">
                    <span>Next Event</span>
                    <span className="font-normal opacity-90">{getCountdown(eventTime)}</span>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-2xl shrink-0">{event.country ?? '🇺🇸'}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium mb-1 ${isPast ? 'text-zinc-500' : 'text-zinc-300'}`}>
                      {eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3].map((i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i <= stars ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                    <div className={`text-lg font-bold leading-tight mb-2 ${isPast ? 'text-zinc-400' : 'text-white'}`}>
                      {event.event}
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                      <span>
                        <span className="text-zinc-500 mr-1">Result:</span>
                        <span className={event.actual ? 'text-blue-400 font-semibold' : 'text-zinc-500'}>
                          {event.actual ?? '-'}
                        </span>
                      </span>
                      <span>
                        <span className="text-zinc-500 mr-1">Forecast:</span>
                        <span className="text-zinc-300">{event.estimate ?? '-'}</span>
                      </span>
                      <span>
                        <span className="text-zinc-500 mr-1">Previous:</span>
                        <span className="text-zinc-300">{event.prev ?? event.previous ?? '-'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <p className="mt-6 text-center text-xs text-zinc-600">Calendar data powered by Finnhub. All data is for informational purposes only.</p>
    </div>
  );
}


function ChartLine({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;
  const width = 1000;
  const height = 260;
  const padding = 14;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = padding + ((max - v) / Math.max(1, max - min)) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
      <defs>
        <linearGradient id="fgArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(244 63 94 / 0.35)" />
          <stop offset="100%" stopColor="rgb(244 63 94 / 0)" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="rgb(244 63 94)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <polygon fill="url(#fgArea)" points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`} />
    </svg>
  );
}

function IndexPage() {
  const [indexData, setIndexData] = useState<{ index: number; status: string; history: number[] } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = () => {
    fetch('/api/market-index')
      .then(res => res.json())
      .then(data => { setIndexData(data); setLastUpdated(new Date()); })
      .catch(console.error);
  };

  React.useEffect(() => { load(); }, []);

  const value = indexData?.index ?? 50;
  const status = indexData?.status ?? 'Neutral';
  const history = indexData?.history ?? Array(24).fill(50);

  const { r, c, offset } = circlePath(value);

  const accentColor = value <= 25 ? 'rgb(244 63 94)' : value <= 45 ? 'rgb(251 146 60)' : value >= 75 ? 'rgb(34 197 94)' : value >= 55 ? 'rgb(74 222 128)' : 'rgb(234 179 8)';
  const accentClass = value <= 25 ? 'text-rose-500' : value <= 45 ? 'text-orange-400' : value >= 75 ? 'text-green-400' : value >= 55 ? 'text-green-400' : 'text-yellow-500';
  const barClass = value <= 25 ? 'bg-rose-500' : value <= 45 ? 'bg-orange-400' : value >= 75 ? 'bg-green-400' : value >= 55 ? 'bg-green-400' : 'bg-yellow-400';

  // Breakdown indicators (derived from index value with slight variation)
  const indicators = [
    { label: 'Market Momentum', score: Math.max(0, Math.min(100, value + Math.round(Math.random() * 10 - 5))), },
    { label: 'Stock Price Strength', score: Math.max(0, Math.min(100, value + Math.round(Math.random() * 10 - 5))), },
    { label: 'Safe Haven Demand', score: Math.max(0, Math.min(100, 100 - value + Math.round(Math.random() * 10 - 5))), },
    { label: 'VIX Volatility', score: Math.max(0, Math.min(100, 100 - value + Math.round(Math.random() * 10 - 5))), },
    { label: 'Market Breadth', score: Math.max(0, Math.min(100, value + Math.round(Math.random() * 10 - 5))), },
  ];

  const indicatorLabel = (s: number) => s <= 25 ? 'Extreme Fear' : s <= 45 ? 'Fear' : s >= 75 ? 'Extreme Greed' : s >= 55 ? 'Greed' : 'Neutral';
  const indicatorClass = (s: number) => s <= 45 ? 'text-rose-400' : s >= 55 ? 'text-green-400' : 'text-yellow-400';

  // Date label for chart
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const chartFromLabel = yesterday.toLocaleDateString([], { month: 'numeric', day: 'numeric' });
  const chartToLabel = new Date().toLocaleDateString([], { month: 'numeric', day: 'numeric' });

  return (
    <div className="mx-auto w-full max-w-md px-4 pt-4 pb-28 xl:max-w-3xl xl:px-6 xl:pb-8">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fear & Greed Index</h1>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full border border-white/10 bg-white/5"
          onClick={load}
          title="Refresh"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {indexData === null ? (
        <div className="flex justify-center items-center h-64 text-zinc-500 animate-pulse text-xl">Loading Index...</div>
      ) : (
        <>
          {/* Gauge */}
          <div className="flex justify-center pt-2">
            <div className="relative h-64 w-64 xl:h-72 xl:w-72 transition-all duration-1000 ease-out">
              <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
                <circle cx="110" cy="110" r={r} stroke="rgb(39 39 42)" strokeWidth="18" fill="none" />
                <circle
                  cx="110" cy="110" r={r}
                  stroke={accentColor}
                  strokeWidth="18" fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={c} strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-7xl font-bold text-white">{value}</div>
                <div className={`mt-2 text-2xl font-semibold ${accentClass}`}>{status}</div>
              </div>
            </div>
          </div>

          {/* Bar */}
          <Card className="mt-4 rounded-[2rem] border-white/10 bg-white/5 text-white">
            <CardContent className="p-5">
              <div className="relative h-4 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, rgb(244 63 94), rgb(251 146 60), rgb(234 179 8), rgb(74 222 128), rgb(34 197 94))' }}>
                <div
                  className="absolute top-0 bottom-0 bg-black/50 rounded-full"
                  style={{ left: `${value}%`, right: 0 }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow-lg border-2 border-white/50"
                  style={{ left: `calc(${value}% - 10px)` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs text-zinc-500">
                <span>Extreme Fear</span>
                <span>Fear</span>
                <span>Neutral</span>
                <span>Greed</span>
                <span>Extreme Greed</span>
              </div>
            </CardContent>
          </Card>

          {/* History chart */}
          <Card className="mt-4 rounded-[2rem] border-white/10 bg-white/5 text-white">
            <CardContent className="p-4">
              <div className="rounded-[1.5rem] bg-gradient-to-b from-rose-500/5 to-transparent">
                <ChartLine data={history} />
                <div className="flex justify-between px-4 pb-3 text-sm text-zinc-500">
                  <span>{chartFromLabel}</span>
                  <span>{chartToLabel}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown */}
          <Card className="mt-4 rounded-[2rem] border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Indicator Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {indicators.map((ind) => (
                <div key={ind.label} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">{ind.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full ${barClass}`} style={{ width: `${ind.score}%` }} />
                    </div>
                    <span className={`text-xs font-semibold w-20 text-right ${indicatorClass(ind.score)}`}>
                      {indicatorLabel(ind.score)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {lastUpdated && (
            <p className="mt-4 text-center text-xs text-zinc-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}


function SettingsPage() {
  const [syncing, setSyncing] = useState(false);
  const [theme, setTheme] = useState('Dark');

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/ingest-news');
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response (not JSON). Did you add API keys to Vercel?');
      }
      
      if (res.ok && data?.ok) {
        if (data.inserted > 0) {
          alert(`Success! Handled ${data.inserted} news items.`);
        } else {
          alert(`Finished. 0 new items. (Sources: NewsAPI ${data.newsAPI || 0}, Finnhub ${data.finnhub || 0})`);
        }
      } else {
        alert(`Error: ${data?.error || 'Unknown error. Check Vercel logs/keys.'}`);
      }
    } catch (e: any) {
      alert(`Failed to trigger sync: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 pt-4 pb-28 xl:max-w-3xl xl:px-6 xl:pb-8">
      <div className="space-y-6 pt-2">
        <div className="mb-8">
          <div className="mb-3 text-xl font-bold tracking-wide text-zinc-500">DATA MANAGEMENT</div>
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
            <button 
              onClick={triggerSync}
              disabled={syncing}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/5 transition"
            >
              <div className="text-2xl text-white">{syncing ? 'Syncing...' : 'Force Live API Sync'}</div>
              <div className="flex items-center gap-3 text-2xl text-zinc-500">
                <ChevronRightIcon className="h-5 w-5" />
              </div>
            </button>
            <div className="w-full border-t border-white/10 flex items-center justify-between px-6 py-5 cursor-not-allowed opacity-50">
              <div className="text-2xl text-white">Reset Application Data</div>
              <div className="flex items-center gap-3 text-2xl text-zinc-500">
                <ChevronRightIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 text-xl font-bold tracking-wide text-zinc-500">APPEARANCE & NOTIFICATIONS</div>
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
            <button 
              onClick={() => setTheme(theme === 'Dark' ? 'Light' : 'Dark')}
              className="w-full border-b border-white/10 flex items-center justify-between px-6 py-5 hover:bg-white/5 transition"
            >
              <div className="text-2xl text-white">Theme</div>
              <div className="flex items-center gap-3 text-2xl text-blue-400 font-medium">
                {theme} Mode
              </div>
            </button>
            <div className="w-full flex items-center justify-between px-6 py-5">
              <div className="text-2xl text-white">Push Notifications</div>
              <div className="flex items-center gap-3 text-2xl text-zinc-500">
                Disabled
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 text-xl font-bold tracking-wide text-zinc-500">APP INFORMATION</div>
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
             <div className="w-full border-b border-white/10 flex items-center justify-between px-6 py-5">
              <div className="text-2xl text-white">App Version</div>
              <div className="flex items-center gap-3 text-2xl text-zinc-500">2.0.0 (API Integrated)</div>
            </div>
             <a href="https://github.com/sechan9999/USmarketNews" target="_blank" rel="noreferrer" className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/5 transition">
              <div className="text-2xl text-white">Source Code</div>
              <div className="flex items-center gap-3 text-2xl text-zinc-500"><ChevronRightIcon className="h-5 w-5" /></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopSidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const items = [
    { label: 'News', value: 'news', icon: Newspaper },
    { label: 'AI Research', value: 'research', icon: Brain },
    { label: 'Calendar', value: 'calendar', icon: CalendarDays },
    { label: 'Index', value: 'index', icon: Activity },
    { label: 'Settings', value: 'settings', icon: Settings },
  ];

  return (
    <aside className="hidden border-r border-white/10 xl:block">
      <div className="sticky top-0 p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-2">
            <MonitorSmartphone className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-semibold">HK.ai</div>
            <div className="text-sm text-zinc-400">Market-moving news terminal</div>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.value;
            return (
              <Button
                key={item.value}
                variant={active ? 'default' : 'ghost'}
                onClick={() => setActiveTab(item.value)}
                className={`w-full justify-start rounded-2xl ${
                  active ? 'bg-white text-black hover:bg-zinc-200' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <Card className="mt-8 rounded-3xl border-white/10 bg-zinc-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Alert logic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <p>Prioritize news that moves index futures, oil, yields, USD, and mega-cap tech.</p>
            <p>Escalate stories with cross-asset impact or policy consequences.</p>
            <p>De-emphasize noise with weak transmission into sector pricing.</p>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}

function DesktopRightRail() {
  const done = [
    'News ingestion: NewsAPI + Finnhub live fetch',
    'Market impact ranking engine (score 0–100)',
    'AI Research: RAG streaming via GPT-4o-mini',
    'Supabase DB connected (news_items table live)',
    'Force Sync: manual ingest trigger in Settings',
    'Fear & Greed Index: live API endpoint',
  ];

  const pending = [
    'Calendar: connect FRED / Finnhub economic events',
    'AI Research: citation trails & saved prompts',
    'Settings: persist theme + push notification prefs',
    'Cron job: auto-ingest every 15 min (Vercel)',
    'Auth: user login + watchlist persistence',
    'Vercel: set env vars for full production deploy',
  ];

  return (
    <aside className="hidden border-l border-white/10 xl:block">
      <div className="sticky top-0 p-6 space-y-4">
        <Card className="rounded-3xl border-white/10 bg-zinc-900 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse inline-block" />
              Live — Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {done.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="mt-0.5 text-green-400 shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-white/10 bg-zinc-900 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400 inline-block" />
              Roadmap — Pending
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pending.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="mt-0.5 text-yellow-400 shrink-0">○</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}


function BottomNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const items = [
    { label: 'News', value: 'news', icon: Newspaper },
    { label: 'AI Research', value: 'research', icon: Brain },
    { label: 'Calendar', value: 'calendar', icon: CalendarDays },
    { label: 'Index', value: 'index', icon: Activity },
    { label: 'Settings', value: 'settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-zinc-950/95 backdrop-blur xl:hidden">
      <div className="mx-auto grid max-w-2xl grid-cols-5 px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.value;
          return (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.value)}
              className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] ${
                active ? 'text-white' : 'text-zinc-500'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function HkMarketNewsApp() {
  const [activeTab, setActiveTab] = useState('news');
  const [activeCategory, setActiveCategory] = useState<string>('live');
  const [activeSeverity, setActiveSeverity] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  
  const [newsCache, setNewsCache] = useState<any[]>(topNews);
  
  // Actually fetch from backend using selected filters
  React.useEffect(() => {
    let url = `/api/news?category=${activeCategory === 'live' ? 'all' : activeCategory}`;
    if (activeSeverity) url += `&impact=${activeSeverity}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          // Normalize API shape to topNews shape
          const incomingNews = data.data.map((item: {
            id: string;
            source: string;
            published_at: string;
            category: string;
            impact_level: string;
            title: string;
            summary: string;
            tickers: string[];
            url: string;
          }) => ({
             id: item.id,
             source: item.source,
             time: new Date(item.published_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
             category: item.category,
             severity: item.impact_level,
             title: item.title,
             summary: item.summary,
             impact: Array.isArray(item.tickers) ? item.tickers : [],
             url: item.url
          }));
          setNewsCache(incomingNews);
        } else {
          setNewsCache([]); // Show empty state when no items matching DB exist
        }
      })
      .catch((e) => console.error(e));
  }, [activeCategory, activeSeverity, query]);

  const filteredNews = newsCache;

  const renderMain = () => {
    switch (activeTab) {
      case 'research':
        return <AskAnythingPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'index':
        return <IndexPage />;
      case 'settings':
        return <SettingsPage />;
      case 'news':
      default:
        return (
          <NewsPage
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeSeverity={activeSeverity}
            setActiveSeverity={setActiveSeverity}
            query={query}
            setQuery={setQuery}
            filteredNews={filteredNews}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="pb-24 xl:pb-8">{renderMain()}</main>

        <DesktopRightRail />
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
