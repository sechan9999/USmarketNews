'use client';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const signInWithGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <button
        onClick={signInWithGoogle}
        className="rounded-2xl bg-white px-6 py-3 text-black"
      >
        Continue with Google
      </button>
    </main>
  );
}
