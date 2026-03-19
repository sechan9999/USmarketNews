import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let from = searchParams.get('from');
  let to = searchParams.get('to');

  if (!from || !to) {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    from = today.toISOString().slice(0, 10);
    to = nextWeek.toISOString().slice(0, 10);
  }

  const url = `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${process.env.FINNHUB_API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}
