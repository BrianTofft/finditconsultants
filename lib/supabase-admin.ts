import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin-klient med service role key.
 * Bruges KUN i server-side API routes — bypasser RLS.
 * Må ALDRIG eksponeres i browser-side kode.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
