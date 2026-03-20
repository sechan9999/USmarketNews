import { NextResponse } from 'next/server';

// Try Finnhub economic calendar API first, fall back to generated schedule
async function fetchFinnhubCalendar(from: string, to: string) {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) return null;

  try {
    const url = `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${token}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;

    const data = await res.json();
    const events = data?.economicCalendar ?? [];

    // Filter to US events and normalize shape
    return events
      .filter((e: { country?: string }) => e.country === 'US')
      .map((e: {
        time?: string;
        event?: string;
        impact?: string;
        actual?: number;
        estimate?: number;
        prev?: number;
        unit?: string;
      }) => ({
        time: e.time ?? from + 'T12:00:00Z',
        country: '🇺🇸',
        event: e.event ?? 'Unknown Event',
        importance: e.impact === 'high' ? 3 : e.impact === 'medium' ? 2 : 1,
        actual: e.actual != null ? `${e.actual}${e.unit ?? ''}` : undefined,
        estimate: e.estimate != null ? `${e.estimate}${e.unit ?? ''}` : undefined,
        prev: e.prev != null ? `${e.prev}${e.unit ?? ''}` : undefined,
      }));
  } catch {
    return null;
  }
}

// Fallback: generate a realistic US economic calendar
function buildWeekEvents(anchor: Date) {
  const mon = new Date(anchor);
  const tue = new Date(anchor); tue.setUTCDate(mon.getUTCDate() + 1);
  const wed = new Date(anchor); wed.setUTCDate(mon.getUTCDate() + 2);
  const thu = new Date(anchor); thu.setUTCDate(mon.getUTCDate() + 3);
  const fri = new Date(anchor); fri.setUTCDate(mon.getUTCDate() + 4);

  const ev = (d: Date, h: number, m: number, event: string, importance: number, estimate?: string, prev?: string) => {
    const t = new Date(d); t.setUTCHours(h, m, 0, 0);
    return { time: t.toISOString(), country: '🇺🇸', event, importance, estimate, prev };
  };

  return [
    ev(mon, 14, 0, 'Federal Reserve Speakers', 2),
    ev(mon, 15, 30, 'Chicago Fed National Activity Index', 1),
    ev(tue, 12, 30, 'Building Permits', 2, '1.45M', '1.47M'),
    ev(tue, 12, 30, 'Housing Starts', 2, '1.38M', '1.37M'),
    ev(tue, 14, 0, 'Consumer Confidence (CB)', 3, '97.0', '98.3'),
    ev(wed, 12, 30, 'Durable Goods Orders', 3, '-1.1%', '3.2%'),
    ev(wed, 14, 0, 'New Home Sales', 2, '680K', '657K'),
    ev(wed, 18, 0, 'FOMC Meeting Minutes', 3),
    ev(thu, 12, 30, 'Initial Jobless Claims', 3, '225K', '223K'),
    ev(thu, 12, 30, 'GDP Growth Rate QoQ', 3, '2.3%', '2.3%'),
    ev(thu, 12, 30, 'Continuing Jobless Claims', 2, '1.87M', '1.89M'),
    ev(fri, 12, 30, 'PCE Price Index MoM', 3, '0.3%', '0.3%'),
    ev(fri, 12, 30, 'Core PCE Price Index YoY', 3, '2.7%', '2.6%'),
    ev(fri, 12, 30, 'Personal Income', 2, '0.5%', '0.4%'),
    ev(fri, 14, 0, 'Michigan Consumer Sentiment', 2, '57.0', '57.9'),
  ];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const now = new Date();
  const fromDate = fromParam ?? now.toISOString().slice(0, 10);
  const toDate = toParam ?? new Date(new Date(fromDate + 'T00:00:00Z').getTime() + 6 * 86400000).toISOString().slice(0, 10);

  // Try real Finnhub data first
  const finnhubEvents = await fetchFinnhubCalendar(fromDate, toDate);
  if (finnhubEvents && finnhubEvents.length > 0) {
    return NextResponse.json({ economicCalendar: finnhubEvents });
  }

  // Fallback to generated events
  const anchor = new Date(fromDate + 'T00:00:00Z');
  const dayOfWeek = anchor.getUTCDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(anchor);
  monday.setUTCDate(anchor.getUTCDate() + mondayOffset);

  const allEvents = buildWeekEvents(monday);

  const from = new Date(fromDate + 'T00:00:00Z');
  const to = new Date(toDate + 'T23:59:59Z');

  const filtered = allEvents.filter(e => {
    const t = new Date(e.time);
    return t >= from && t <= to;
  });

  return NextResponse.json({ economicCalendar: filtered });
}
