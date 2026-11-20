/**
 * The web admin's Supabase client (admin brief §4.1). Hand-written, not
 * mirrored: the mirrored lib/ files import `supabase` from here in place of the
 * app's Capacitor-aware client.
 *
 * Its own storage key keeps the admin session apart from anything else on the
 * domain. detectSessionInUrl exchanges the `?code=` that Google sign-in
 * returns with, then strips it from the URL.
 *
 * Only the publishable ("anon") key: every admin power is enforced by RLS,
 * security-definer RPCs and the backend's requireAdmin.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const SUPABASE_ENABLED = Boolean(url && key);

export const supabase: SupabaseClient | null =
  SUPABASE_ENABLED && typeof window !== "undefined"
    ? createClient(url!, key!, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          flowType: "pkce",
          storageKey: "narsil-admin-auth",
          detectSessionInUrl: true,
        },
        realtime: { params: { eventsPerSecond: 20 } },
      })
    : null;
