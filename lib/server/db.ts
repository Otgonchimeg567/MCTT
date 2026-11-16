import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Database layer: Supabase (Postgres). Tables have RLS on with no policies, so only this server-side
 * secret key can read or write — never expose it to the browser.
 */

const globalForDb = globalThis as unknown as { __mcttDb?: SupabaseClient };

export function getDb(): SupabaseClient {
  if (!globalForDb.__mcttDb) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set (see .env.example).");
    globalForDb.__mcttDb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return globalForDb.__mcttDb;
}
