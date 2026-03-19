import { NextResponse } from 'next/server';

// Helper: get next weekday occurrence of a given weekday (0=Sun,1=Mon...)
function nextWeekday(baseDate: Date, weekday: number, hour: number, minute: number): Date {
  const d = new Date(baseDate);
  d.setUTCHours(hour, minute, 0, 0);
  const diff = (weekday - d.getUTCDay() + 7) % 7;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

function buildWeekEvents(anchor: Date) {
  // Returns a realistic US economic calendar week starting from anchor (Mon)
  const mon = new Date(anchor);
  const tue = new Date(anchor); tue.setUTCDate(mon.getUTCDate() + 1);
  const wed = new Date(anchor); wed.setUTCDate(mon.getUTCDate() + 2);
  const thu = new Date(anchor); thu.setUTCDate(mon.getUTCDate() + 3);
  const fri = new Date(anchor); fri.setUTCDate(mon.getUTCDate() + 4);

  const ev = (d: Date, h: number, m: number, event: string, importance: number, actual?: string, estimate?: string, prev?: string) => {
    const t = new Date(d); t.setUTCHours(h, m, 0, 0);
    return { time: t.toISOString(), country: '🇺🇸', event, importance, actual, estimate, prev };
  };

  return [
    ev(mon, 14, 0, 'Federal Reserve Speakers', 2),
    ev(mon, 15, 30, 'Chicago Fed National Activity Index', 1),
    ev(tue, 12, 30, 'Building Permits', 2, undefined, '1.45M', '1.47M'),
    ev(tue, 12, 30, 'Housing Starts', 2, undefined, '1.38M', '1.37M'),
    ev(tue, 14, 0, 'Consumer Confidence (CB)', 3, undefined, '97.0', '98.3'),
    ev(wed, 12, 30, 'Durable Goods Orders', 3, undefined, '-1.1%', '3.2%'),
    ev(wed, 14, 0, 'New Home Sales', 2, undefined, '680K', '657K'),
    ev(wed, 18, 0, 'FOMC Meeting Minutes', 3),
    ev(thu, 12, 30, 'Initial Jobless Claims', 3, undefined, '225K', '223K'),
    ev(thu, 12, 30, 'GDP Growth Rate QoQ (Final)', 3, undefined, '2.3%', '2.3%'),
    ev(thu, 12, 30, 'Continuing Jobless Claims', 2, undefined, '1.87M', '1.89M'),
    ev(fri, 12, 30, 'PCE Price Index MoM', 3, undefined, '0.3%', '0.3%'),
    ev(fri, 12, 30, 'Core PCE Price Index YoY', 3, undefined, '2.7%', '2.6%'),
    ev(fri, 12, 30, 'Personal Income', 2, undefined, '0.5%', '0.4%'),
    ev(fri, 14, 0, 'Michigan Consumer Sentiment (Final)', 2, undefined, '57.0', '57.9'),
  ];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get('from');
  
  const now = new Date();
  // Find Monday of the week containing fromParam (or current week)
  const anchor = fromParam ? new Date(fromParam + 'T00:00:00Z') : new Date(now.toISOString().slice(0, 10) + 'T00:00:00Z');
  const dayOfWeek = anchor.getUTCDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(anchor);
  monday.setUTCDate(anchor.getUTCDate() + mondayOffset);

  const allEvents = buildWeekEvents(monday);
  
  // Filter to the requested date range
  const from = fromParam ? new Date(fromParam + 'T00:00:00Z') : monday;
  const toParam = searchParams.get('to');
  const to = toParam ? new Date(toParam + 'T23:59:59Z') : new Date(from.getTime() + 6 * 86400000);

  const filtered = allEvents.filter(e => {
    const t = new Date(e.time);
    return t >= from && t <= to;
  });

  return NextResponse.json({ economicCalendar: filtered });
}
