import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const searchParams = req.nextUrl.searchParams;

  const category = searchParams.get('category');
  const impact = searchParams.get('impact');
  const q = searchParams.get('q');

  let query = supabase
    .from('news_items')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(50);

  if (category && category !== 'all') query = query.eq('category', category);
  if (impact && impact !== 'all') query = query.eq('impact_level', impact);
  if (q) query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
