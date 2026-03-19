'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function addToWatchlist(ticker: string) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('watchlists').insert({
    user_id: user.id,
    ticker: ticker.toUpperCase(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/watchlist');
}

export async function removeFromWatchlist(ticker: string) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('watchlists')
    .delete()
    .eq('user_id', user.id)
    .eq('ticker', ticker.toUpperCase());

  if (error) throw new Error(error.message);
  revalidatePath('/watchlist');
}
