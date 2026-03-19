# HK.ai - Market News Terminal

![HK.ai Logo Placeholder - Insert Logo Here]()

HK.ai is a next-generation US market news and macro-economic terminal built for quantitative and fundamental traders. Unlike traditional feeds, HK.ai groups breaking news, visualizes its real-time impact on the broader markets, provides live economic event schedules, and incorporates an AI Research assistant powered by Vercel AI SDK and OpenAI.

**🚀 Live Demo:** [https://byul-market-news.vercel.app](https://byul-market-news.vercel.app)

---

## 🌟 Key Features

1. **Smart News Feed**
   - Real-time aggregated financial news filtering the noise from actual market-moving material.
   - Distinct tags for categorization: Live News, Crypto, AI names, Energy, and Macro events.
   - Watchlist thesis matching and impact breakdowns.

2. **AI Market Researcher**
   - "Ask Anything" interface to intelligently query recent financial news utilizing RAG structure.
   - Driven under the hood by **OpenAI (GPT-4o)** via the **Vercel AI SDK**.

3. **Live Economic Calendar**
   - Direct integration with **Finnhub's Economic Calendar API**.
   - Auto-displays consensus estimates versus actual releases, keeping traders informed of key macro events.

4. **Dynamic Fear & Greed Index**
   - Computes market condition logic from breaking news sentiment, dynamically mapping scores against a live 0-100 chart gauge.
   
5. **Supabase Powered Backend**
   - Complete PostgreSQL relational data setup ensuring high-performance querying and filtering capabilities on historic news data.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth:** [Supabase](https://supabase.com/) & PostgreSQL
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/docs), OpenAI
- **Market Data APIs:** Finnhub, NewsAPI

---

## 💻 Getting Started

To run the project locally, you will need the following API keys:
* `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY` (For database writes via Cron)
* `OPENAI_API_KEY` (For AI Search)
* `FINNHUB_API_KEY` (For Economic Calendar)
* `NEWS_API_KEY` (For Raw News Ingestion)

### 1. Installation

Clone the repository and install packages:

```bash
git clone https://github.com/sechan9999/USmarketNews.git
cd USmarketNews
npm install
```

### 2. Environment Variables

Create a `.env.local` file at the root of your folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEWS_API_KEY=your_newsapi_key
FINNHUB_API_KEY=your_finnhub_key
OPENAI_API_KEY=your_openai_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Initialization

Navigate to your Supabase Project dashboard, open the SQL Editor, and execute the queries contained in `supabase/schema.sql` to initialize all required profiles, news_items, and impact tracking tables.

### 4. Run Development Server

```bash
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

The easiest way to deploy this application is leveraging Vercel. 
Upload the environment variables in your Vercel Project Settings, then simply connect your GitHub repository to allow automatic commits.

```bash
npx vercel --prod
```

---

HK.ai © 2026. Built for market alpha.
